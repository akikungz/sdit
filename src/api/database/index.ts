import { PrismaClient, Student } from "@prisma/client";
import getStudentYear from "@sdit/utils/getStudentYear";

const prisma = new PrismaClient();

export async function getStudent(studentId: string) {
    return await prisma.student.findFirst({
        where: {
            id: studentId
        }
    });
}

export async function insertStudent(student: Student) {
    return await prisma.student.create({
        data: student
    });
}

export async function sportsDayGetStudents() {
    return await prisma.sportDayStudent.findMany({
        include: {
            student: true
        }
    });
}

export async function sportsDayGetStudent(studentId: string) {
    return await prisma.sportDayStudent.findFirst({
        where: {
            studentId
        },
        include: {
            student: {
                include: {
                    major: true
                }
            },
            color: true
        }
    });
}

export async function sportsDayInsertStudent(studentId: string, colorId: number) {
    return await prisma.sportDayStudent.create({
        data: {
            studentId,
            colorId,
            year: getStudentYear(studentId),
        }
    });
}