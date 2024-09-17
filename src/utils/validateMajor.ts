type Major = "IT" | "ITI" | "INE" | "INET";

export const majorFields: { [key: string]: Major } = {
    "16": "IT",
    "14": "ITI",
    "26": "INE",
    "24": "INET"
}

export default function validateMajor(stdId: string): {
    majorId: string;
    major: Major;
} | null {
    if (!stdId) return null;

    if (isNaN(parseInt(stdId)) && stdId.length == 13) return null;
    if (!stdId.startsWith("s")) stdId = "s" + stdId;

    if (stdId.length !== 14) return null;

    // Check if student is in department
    const department = stdId.substring(3, 7);
    if (department !== "0602") return null;

    // Check field
    const major = stdId.substring(7, 9);
    if (major in majorFields) {
        return {
            majorId: major,
            major: majorFields[major] as Major
        }
    }
    return null;
}