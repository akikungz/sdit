-- CreateEnum
CREATE TYPE "MajorShort" AS ENUM ('IT', 'ITI', 'INE', 'INET');

-- CreateTable
CREATE TABLE "Major" (
    "id" INTEGER NOT NULL,
    "name" "MajorShort" NOT NULL,

    CONSTRAINT "Major_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "majorId" INTEGER NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SportDayColor" (
    "id" SERIAL NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "SportDayColor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SportDayStudent" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "colorId" INTEGER,
    "year" INTEGER NOT NULL,

    CONSTRAINT "SportDayStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SportDaySports" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "th_name" TEXT NOT NULL,
    "limit" INTEGER NOT NULL,
    "match_1" TIMESTAMP(3) NOT NULL,
    "match_2" TIMESTAMP(3),
    "final_match" TIMESTAMP(3),
    "lower_match" TIMESTAMP(3),
    "match_time" INTEGER NOT NULL,

    CONSTRAINT "SportDaySports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SportDayStudentSports" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "sportId" INTEGER NOT NULL,
    "colorId" INTEGER NOT NULL,

    CONSTRAINT "SportDayStudentSports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SportDayShirtOrder" (
    "id" SERIAL NOT NULL,
    "studentId" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "SportDayShirtOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SportDaySports_name_key" ON "SportDaySports"("name");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportDayStudent" ADD CONSTRAINT "SportDayStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportDayStudent" ADD CONSTRAINT "SportDayStudent_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "SportDayColor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportDayStudentSports" ADD CONSTRAINT "SportDayStudentSports_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "SportDayStudent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportDayStudentSports" ADD CONSTRAINT "SportDayStudentSports_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "SportDaySports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportDayStudentSports" ADD CONSTRAINT "SportDayStudentSports_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "SportDayColor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
