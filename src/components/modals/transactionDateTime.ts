export interface TransactionDateTimeValue {
    date: string;
    time: string;
}

const pad = (value: number) => value.toString().padStart(2, '0');

export const getCurrentTransactionDateTime = (referenceDate = new Date()): TransactionDateTimeValue => ({
    date: `${referenceDate.getFullYear()}-${pad(referenceDate.getMonth() + 1)}-${pad(referenceDate.getDate())}`,
    time: `${pad(referenceDate.getHours())}:${pad(referenceDate.getMinutes())}`
});

export const combineTransactionDateTime = (dateValue: string, timeValue: string): Date => {
    const [year, month, day] = dateValue.split('-').map(Number);
    const [hours, minutes] = timeValue.split(':').map(Number);

    return new Date(year, month - 1, day, hours, minutes, 0, 0);
};
