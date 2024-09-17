export default function getStudentYear(stdId: string): number {
    if (!stdId) return 0;

    if (isNaN(parseInt(stdId)) && stdId.length == 13) return 0;
    if (!stdId.startsWith("s")) stdId = "s" + stdId;

    if (stdId.length !== 14) return 0;

    const year = stdId.substring(1, 3);
    const buddhistYear = new Date().getFullYear() + 543;
    const lastTwoDigits = buddhistYear.toString().substring(2, 4);
    const studentYear = parseInt(lastTwoDigits) - parseInt(year) + 1;

    return studentYear;
}