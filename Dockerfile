FROM oven/bun:slim

WORKDIR /sdit

COPY package.json .
COPY bun.lockb .

RUN bun install

COPY . .

RUN bun run build

CMD ["bunx", "next", "start"]

EXPOSE 3000