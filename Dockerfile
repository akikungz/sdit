FROM oven/bun:slim

WORKDIR /sdit

COPY package.json .
COPY bun.lockb .

RUN bun install

COPY . .

RUN bun prisma:migrate production --name init
RUN bun prisma:generate

RUN bun seed
RUN bunx next build

CMD ["bunx", "next", "start"]

EXPOSE 3000