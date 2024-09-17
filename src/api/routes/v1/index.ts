import { Elysia } from "elysia";
import auth from "./auth";
import events from "./events";

export default new Elysia({ prefix: '/v1' })
    .use(auth)
    .use(events)