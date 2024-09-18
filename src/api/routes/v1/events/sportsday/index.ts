import { PrismaClient, SportDaySports } from "@prisma/client";

import { Elysia, t } from "elysia";
import jwt from "@elysiajs/jwt";

import { env } from "@sdit/env";
import { sportsDayGetStudent, sportsDayInsertStudent } from "@sdit/api/database";
import validateMajor from "@sdit/utils/validateMajor";
import getStudentYear from "@sdit/utils/getStudentYear";

type JwtPayload = {
    username: string;
    type: "students" | "alumni" | "personel";
};

export default new Elysia({ prefix: '/sportsday' })
    .use(jwt({ secret: env.JWT_SECRET }))
    .decorate('prisma', new PrismaClient())
    .post("/join", async ({ jwt, cookie: { token }, prisma, set }) => {
        const isToken = await jwt.verify(token.value) as JwtPayload;
        if (!isToken || typeof isToken === 'boolean' || !isToken.username || !isToken.type) return { error: "Invalid token" }

        if (isToken.type !== "students") {
            set.status = 403;
            return { error: "Only student allowed" }
        }
        
        const alreadyJoined = await sportsDayGetStudent(isToken.username);
        if (alreadyJoined) {
            set.status = 400;
            return { error: "You already joined" }
        }

        const major = validateMajor(isToken.username);
        if (major === null) {
            set.status = 400;
            return { error: "Invalid student ID" }
        }

        if (major.major != "IT") {
            switch (major.major) {
                case "ITI":
                    try {
                        const data = await sportsDayInsertStudent(isToken.username, 3);

                        set.status = 201;
                        return { data, error: null }
                    } catch (err) {
                        console.error(err);
                        return { error: "Error joining sports day" }
                    }
                default:
                    try {
                        const data = await sportsDayInsertStudent(isToken.username, 4);

                        set.status = 201;
                        return { data, error: null }
                    } catch (err) {
                        console.error(err);
                        return { error: "Error joining sports day" }
                    }
            }
        } else {
            // get last it student in year
            const lastItStudent = await prisma.sportDayStudent.findFirst({
                where: {
                    year: getStudentYear(isToken.username),
                    student: {
                        majorId: 16
                    }
                },
                orderBy: {
                    id: 'desc'
                }
            });

            if (!lastItStudent) {
                try {
                    const data = await sportsDayInsertStudent(isToken.username, 1);

                    set.status = 201;
                    return { data, error: null }
                } catch (err) {
                    console.error(err);
                    set.status = 500;
                    return { error: "Error joining sports day" }
                }
            } else {
                try {
                    const data = await sportsDayInsertStudent(isToken.username, lastItStudent.colorId === 1 ? 2 : 1);

                    set.status = 201;
                    return { data, error: null }
                } catch (err) {
                    console.error(err);
                    set.status = 500;
                    return { error: "Error joining sports day" }
                }
            }
        }
    }, {
        cookie: t.Object({
            token: t.String()
        })
    })
    .get("/me", async ({ jwt, cookie: { token }, set }) => {
        const isToken = await jwt.verify(token.value) as JwtPayload;
        if (!isToken || typeof isToken === 'boolean' || !isToken.username || !isToken.type) return { error: "Invalid token" }

        if (isToken.type !== "students") return { error: "Only student allowed" }
        try {
            const student = await sportsDayGetStudent(isToken.username);
            if (!student) return { error: "You haven't joined yet" }

            set.status = 200;
            return { data: student, error: null };
        } catch (err) {
            console.error(err);
            set.status = 500;
            return { error: "Error fetching student" }
        }
    }, {
        cookie: t.Object({
            token: t.String()
        })
    })
    .get("/students", async ({ prisma }) => {
        return await prisma.sportDayStudent.findMany({
            include: {
                student: {
                    include: {
                        major: true
                    }
                },
                color: true
            }
        });
    })
    .group("/sports", (app) => app
        .get("", async ({ prisma, set }) => {
            const data = await prisma.sportDaySports.findMany();
            set.status = 200;
            return data;
        })
        .get("/:name", async ({ prisma, params: { name }, set }) => {
            try {
                const data = await prisma.sportDaySports.findFirst({
                    where: {
                        name
                    }
                });
                if (!data) return { error: "Not found" }
                
                set.status = 200;
                return { data, error: null }
            } catch (err) {
                console.error(err);
                set.status = 500;
                return { error: "Error fetching sport" }
            }
        })
        .post("/:name", async ({ prisma, jwt, cookie, params: { name }, set }) => {
            const isToken = await jwt.verify(cookie.token.value) as JwtPayload;
            if (!isToken || typeof isToken === 'boolean' || !isToken.username || !isToken.type) return { error: "Invalid token" }

            const studentSport = await prisma.sportDayStudent.findFirst({
                where: {
                    studentId: isToken.username
                },
                include: {
                    color: true,
                    student: true,
                },
            });

            if (!studentSport) {
                set.status = 400;
                return { error: "You haven't joined yet" }
            }

            const sport = await prisma.sportDaySports.findFirst({
                where: {
                    name
                }
            });

            if (!sport) {
                set.status = 404;
                return { error: "Sport not found" }
            }

            const target = await prisma.sportDayStudentSports.count({
                where: {
                    sport: {
                        name
                    },
                }
            })

            if (target >= sport.limit) {
                set.status = 400;
                return { error: "Sport is full" }
            }

            const registered = await prisma.sportDayStudentSports.findMany({
                where: {
                    studentId: isToken.username
                },
                include: {
                    sport: true,
                    color: true,
                }
            });

            if (registered.find(r => r.sport.name == sport.name)) {
                set.status = 400;
                return { error: "You already registered this sport" }
            }

            if (registered.length > 0) {
                const checkConflict = (match: Date, r: SportDaySports) => {
                    // Check if match time is in between
                    if (match.getTime() > r.match_1.getTime() && match.getTime() < r.match_1.getTime() + r.match_time * 60 * 1000) return true;
                    if (r.match_2 && match.getTime() > r.match_2.getTime() && match.getTime() < r.match_2.getTime() + r.match_time * 60 * 1000) return true;
                    if (r.final_match && match.getTime() > r.final_match.getTime() && match.getTime() < r.final_match.getTime() + r.match_time * 60 * 1000) return true;
                    if (r.lower_match && match.getTime() > r.lower_match.getTime() && match.getTime() < r.lower_match.getTime() + r.match_time * 60 * 1000) return true;

                    return false;
                }

                const conflict = registered
                    .filter(r => 
                        checkConflict(sport.match_1, r.sport) || 
                        sport.match_2 && checkConflict(sport.match_2, r.sport) || 
                        sport.final_match && checkConflict(sport.final_match, r.sport) || 
                        sport.lower_match && checkConflict(sport.lower_match, r.sport)
                    );
                
                if (conflict.length > 0) {
                    set.status = 400;
                    return { error: "Sport time conflict" }
                }
            }

            try {
                await prisma.sportDayStudentSports.create({
                    data: {
                        studentId: isToken.username,
                        sportId: sport.id,
                        colorId: studentSport.colorId
                    }
                });

                set.status = 201;
                return { success: true, error: null }
            } catch (err) {
                console.error(err);
                set.status = 500;
                return { error: "Error registering sport" }
            }
        }, {
            cookie: t.Object({
                token: t.String()
            }),
        })
        .post("/staff", async ({ prisma, jwt, cookie, set }) => {
            const isToken = await jwt.verify(cookie.token.value) as JwtPayload;
            if (!isToken || typeof isToken === 'boolean' || !isToken.username || !isToken.type) return { error: "Invalid token" }

            if (isToken.type !== "personel") {
                set.status = 403;
                return { error: "Only staff allowed" }
            }

            const student = await prisma.sportDayStudent.findFirst({
                where: {
                    studentId: isToken.username
                }
            });

            if (!student) {
                set.status = 400;
                return { error: "You haven't joined yet" }
            }

            // Check if already staff
            const alreadyStaff = await prisma.sportDayStaff.findFirst({
                where: {
                    studentId: isToken.username
                }
            });

            if (alreadyStaff) {
                set.status = 400;
                return { error: "You already staff" }
            }

            try {
                await prisma.sportDayStaff.create({
                    data: {
                        studentId: isToken.username,
                        colorId: student.colorId
                    }
                });

                set.status = 201;
                return { success: true, error: null }
            } catch (err) {
                console.error(err);
                set.status = 500;
                return { error: "Error registering staff" }
            }
        })
    )