import { addDays, differenceInDays, format } from 'date-fns';

export const calculateDaysFrom = (startDate: Date, targetDate: Date = new Date()): number => {
    return differenceInDays(targetDate, startDate);
};

export const getDateFromDays = (startDate: Date, daysToAdd: number): Date => {
    return addDays(startDate, daysToAdd);
};

export const formatDate = (date: Date): string => {
    return format(date, 'MMMM do, yyyy');
};
