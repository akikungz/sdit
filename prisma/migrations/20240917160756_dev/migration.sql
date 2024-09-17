/*
  Warnings:

  - A unique constraint covering the columns `[studentId]` on the table `SportDayStudent` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "SportDayStudentSports" DROP CONSTRAINT "SportDayStudentSports_studentId_fkey";

-- AlterTable
ALTER TABLE "SportDayStudentSports" ALTER COLUMN "studentId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SportDayStudent_studentId_key" ON "SportDayStudent"("studentId");

-- AddForeignKey
ALTER TABLE "SportDayStudentSports" ADD CONSTRAINT "SportDayStudentSports_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "SportDayStudent"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;
