import { Elysia } from "elysia";
import { edenTreaty } from "@elysiajs/eden";
import swagger from "@elysiajs/swagger";

import { env } from "@sdit/env";

import routes from "./routes";

export const app = new Elysia({ prefix: '/api' })
    .use(routes)

if (env.NODE_ENV === 'development') app.use(swagger());

export type Api = typeof app;

export const { api } = edenTreaty<Api>('http://localhost:3000/');