import { Elysia } from "elysia";

import sportsday from "./sportsday";

export default new Elysia({ prefix: '/events' })
    .use(sportsday)