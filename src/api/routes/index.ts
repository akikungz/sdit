import { Elysia } from "elysia";
import v1 from "./v1";

export default new Elysia()
    .use(v1)