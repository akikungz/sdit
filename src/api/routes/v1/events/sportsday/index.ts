import { PrismaClient, SportDaySports } from "@prisma/client";

import { Elysia, t } from "elysia";
import jwt from "@elysiajs/jwt";

import { env } from "@sdit/env";
import { sportsDayGetStudent, sportsDayInsertStudent } from "@sdit/api/database";
import validateMajor from "@sdit/utils/validateMajor";
import getStudentYear from "@sdit/utils/getStudentYear";
import { getUser } from "@sdit/api/external/icit";

type JwtPayload = {
    username: string;
    type: "students" | "alumni" | "personel";
};

export default new Elysia({ prefix: '/sportsday' })
    .use(jwt({ secret: env.JWT_SECRET }))
    .decorate('prisma', new PrismaClient())
    .post("/join", async ({ jwt, cookie: { token }, prisma }) => {
        const isToken = await jwt.verify(token.value) as JwtPayload;
        if (!isToken || typeof isToken === 'boolean' || !isToken.username || !isToken.type) return { error: "Invalid token" }

        if (isToken.type !== "students") return { error: "Only student allowed" }
        const alreadyJoined = await sportsDayGetStudent(isToken.username);
        if (alreadyJoined) return { error: "You already joined" }

        const major = validateMajor(isToken.username);
        if (major === null) return { error: "Invalid student ID" }

        if (major.major != "IT") {
            switch (major.major) {
                case "ITI":
                    return await sportsDayInsertStudent(isToken.username, 3);
                default:
                    return await sportsDayInsertStudent(isToken.username, 4);
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
                return await sportsDayInsertStudent(isToken.username, 1);
            } else {
                return await sportsDayInsertStudent(isToken.username, lastItStudent.colorId === 1 ? 2 : 1);
            }
        }
    }, {
        cookie: t.Object({
            token: t.String()
        })
    })
    .get("/me", async ({ jwt, cookie: { token } }) => {
        const isToken = await jwt.verify(token.value) as JwtPayload;
        if (!isToken || typeof isToken === 'boolean' || !isToken.username || !isToken.type) return { error: "Invalid token" }

        if (isToken.type !== "students") return { error: "Only student allowed" }
        const student = await sportsDayGetStudent(isToken.username);
        if (!student) return { error: "You haven't joined yet" }

        return student;
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
    .post("/shirt", async ({ body, prisma, jwt, cookie }) => {
        const isToken = await jwt.verify(cookie.token.value) as JwtPayload;
        if (!isToken || typeof isToken === 'boolean' || !isToken.username || !isToken.type) return { error: "Invalid token" }

        const user = await getUser(isToken.username);
        if (!user) return { error: "Error fetching user data from ICIT" }
        if (user.error) return user;

        return await prisma.sportDayShirtOrder.create({
            data: {
                studentId: isToken.username,
                size: body.size,
                first_name: user.first_name!,
                last_name: user.last_name!,
                display_name: user.display_name!,
                count: body.count
            }
        });
    }, {
        cookie: t.Object({
            token: t.String()
        }),
        body: t.Object({
            size: t.Enum({
                "S": "S",
                "M": "M",
                "L": "L",
                "XL": "XL",
                "2XL": "2XL",
                "3XL": "3XL",
                "4XL": "4XL",
            }),
            count: t.Number()
        }),
    })
    .group("/sports", (app) => app
        .get("", async ({ prisma }) => {
            const data = await prisma.sportDaySports.findMany();
            return data;
        })
        .get("/:name", async ({ prisma, params: { name } }) => {
            const data = await prisma.sportDaySports.findFirst({
                where: {
                    name
                }
            });
            if (!data) return { error: "Not found" }
            return data;
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
    )