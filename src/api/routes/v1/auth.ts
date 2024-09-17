import { Elysia, t } from "elysia";
import jwt from "@elysiajs/jwt";

import { env } from "@sdit/env";
import { getStudent, insertStudent } from "../../database";

import { auth } from "../../external/icit";
import validateMajor from "@sdit/utils/validateMajor";

export default new Elysia({ prefix: '/auth' })
    .use(jwt({ secret: env.JWT_SECRET }))
    .post("", async ({ body: { username, password }, jwt, set }) => {
        try {
            const fetchAuth = await auth(username, password);
            
            if ('error' in fetchAuth) return { error: fetchAuth.error }
            
            const token = await jwt.sign({ username, type: fetchAuth.account_type });
            if (username.startsWith("s")) {
                const student = await getStudent(username);

                if (!student) {
                    const major = validateMajor(username);
                    if (!major) return { error: "Invalid student ID" }
                    if (isNaN(parseInt(major.majorId))) return { error: "Invalid student ID" }

                    await insertStudent({
                        id: username,
                        first_name: fetchAuth.first_name,
                        last_name: fetchAuth.last_name,
                        majorId: parseInt(major.majorId),
                        display_name: fetchAuth.display_name,
                    });
                }
            }

            set.cookie = {
                token: {
                    value: token,
                    httpOnly: true,
                    secure: env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 60 * 60 * 24 * 7,
                }
            }

            return {
                error: null,
                data: {
                    token,
                    id: username,
                    display_name: fetchAuth.display_name,
                    first_name: fetchAuth.first_name,
                    last_name: fetchAuth.last_name,
                    account_type: fetchAuth.account_type,
                }
            }
        } catch (error) {
            console.error(error);
            return { error: "Error connecting to the authentication service" }
        }
    }, {
        body: t.Object({
            username: t.String(),
            password: t.String(),
        })
    })
    .delete("", async ({ jwt, set, cookie: { token } }) => {
        const isToken = await jwt.verify(token.value);
        if (!isToken) return { error: "Invalid token" }

        set.cookie = {
            token: {
                value: "",
                httpOnly: true,
                secure: env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 0,
            }
        }
    }, {
        cookie: t.Object({
            token: t.String(),
        }),
    })
    .get("", async ({ jwt, cookie: { token } }) => {
        const isToken = await jwt.verify(token.value);
        if (!isToken) return { error: "Invalid token" }

        return { error: null, data: isToken }
    }, {
        cookie: t.Object({
            token: t.String(),
        }),
    })