import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
    await prisma.$connect();

    await prisma.major.createMany({
        data: [
            { id: 16, name: "IT" },
            { id: 14, name: "ITI" },
            { id: 26, name: "INE" },
            { id: 24, name: "INET" },
        ]
    })

    await prisma.sportDayColor.createMany({
        data: [
            { id: 1, color: "Blue" },
            { id: 2, color: "Purple" },
            { id: 3, color: "Pink" },
            { id: 4, color: "Green" },
        ]
    });

    await prisma.sportDaySports.createMany({
        data: [
            {
                name: "basketball",
                th_name: "บาสเก็ตบอล",
                limit: 7,
                match_1: "2024-10-05T02:00:00Z",
                match_2: "2024-10-05T03:00:00Z",
                lower_match: "2024-10-05T06:00:00Z",
                final_match: "2024-10-05T07:00:00Z",
                match_time: 60,
            },
            {
                name: "chairball",
                th_name: "แชร์บอล",
                limit: 7,
                match_1: "2024-10-05T03:00:00Z",
                match_time: 60,
            },
            {
                name: "badminton_male_solo",
                th_name: "แบดมินตัน ชาย เดี่ยว",
                limit: 1,
                match_1: "2024-10-05T02:00:00Z",
                match_2: "2024-10-05T03:00:00Z",
                lower_match: "2024-10-05T06:00:00Z",
                final_match: "2024-10-05T07:00:00Z",
                match_time: 60,
            },
            {
                name: "badminton_female_solo",
                th_name: "แบดมินตัน หญิง เดี่ยว",
                limit: 1,
                match_1: "2024-10-05T02:00:00Z",
                match_2: "2024-10-05T03:00:00Z",
                lower_match: "2024-10-05T06:00:00Z",
                final_match: "2024-10-05T07:00:00Z",
                match_time: 60,
            },
            {
                name: "badminton_male_duo",
                th_name: "แบดมินตัน ชาย คู่",
                limit: 2,
                match_1: "2024-10-05T04:00:00Z",
                match_2: "2024-10-05T04:00:00Z",
                lower_match: "2024-10-05T08:00:00Z",
                final_match: "2024-10-05T09:00:00Z",
                match_time: 60,
            },
            {
                name: "badminton_female_duo",
                th_name: "แบดมินตัน หญิง คู่",
                limit: 2,
                match_1: "2024-10-05T04:00:00Z",
                match_2: "2024-10-05T06:00:00Z",
                lower_match: "2024-10-05T08:00:00Z",
                final_match: "2024-10-05T09:00:00Z",
                match_time: 60,
            },
            {
                name: "badminton_mixed_duo",
                th_name: "แบดมินตัน ผสม คู่",
                limit: 2,
                match_1: "2024-10-05T02:00:00Z",
                match_2: "2024-10-05T03:00:00Z",
                lower_match: "2024-10-05T07:00:00Z",
                final_match: "2024-10-05T08:00:00Z",
                match_time: 60,
            },
            {
                name: "tabletennis_male-solo",
                th_name: "ปิงปอง ชาย เดี่ยว",
                limit: 1,
                match_1: "2024-10-05T02:00:00Z",
                match_2: "2024-10-05T02:30:00Z",
                lower_match: "2024-10-05T03:30:00Z",
                final_match: "2024-10-05T04:00:00Z",
                match_time: 30,
            },
            {
                name: "tabletennis_female-solo",
                th_name: "ปิงปอง หญิง เดี่ยว",
                limit: 1,
                match_1: "2024-10-05T02:00:00Z",
                match_2: "2024-10-05T02:30:00Z",
                lower_match: "2024-10-05T03:30:00Z",
                final_match: "2024-10-05T04:00:00Z",
                match_time: 30,
            },
            {
                name: "tabletennis_male_duo",
                th_name: "ปิงปอง ชาย คู่",
                limit: 2,
                match_1: "2024-10-05T06:00:00Z",
                match_2: "2024-10-05T06:30:00Z",
                lower_match: "2024-10-05T07:30:00Z",
                final_match: "2024-10-05T08:00:00Z",
                match_time: 30,
            },
            {
                name: "tabletennis_female_duo",
                th_name: "ปิงปอง หญิง คู่",
                limit: 2,
                match_1: "2024-10-05T06:00:00Z",
                match_2: "2024-10-05T06:30:00Z",
                lower_match: "2024-10-05T07:30:00Z",
                final_match: "2024-10-05T08:00:00Z",
                match_time: 30,
            },
            {
                name: "tabletennis_mixed_duo",
                th_name: "ปิงปอง ผสม คู่",
                limit: 2,
                match_1: "2024-10-05T02:00:00Z",
                match_2: "2024-10-05T02:30:00Z",
                lower_match: "2024-10-05T03:30:00Z",
                final_match: "2024-10-05T04:00:00Z",
                match_time: 30,
            },
        ]
    });
}

seed();