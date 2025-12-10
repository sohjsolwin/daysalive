import { getMonth, getDate } from 'date-fns';

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export const getSeason = (date: Date): Season => {
    const month = getMonth(date); // 0-11
    const day = getDate(date);

    // Northern Hemisphere approximation
    if (month < 2 || (month === 2 && day < 20) || (month === 11 && day >= 21)) return 'Winter';
    if (month < 5 || (month === 5 && day < 21)) return 'Spring';
    if (month < 8 || (month === 8 && day < 22)) return 'Summer';
    return 'Autumn';
};

interface Event {
    name: string;
    month: number; // 0-11
    day: number;
}

const FIXED_HOLIDAYS: Event[] = [
    { name: "New Year's Day", month: 0, day: 1 },
    { name: "Valentine's Day", month: 1, day: 14 },
    { name: "Halloween", month: 9, day: 31 },
    { name: "Christmas", month: 11, day: 25 },
];

// Simplified celestial events (would need a library for accurate calculation, using placeholders/examples)
const CELESTIAL_EVENTS: Event[] = [
    { name: "Perseids Meteor Shower Peak", month: 7, day: 12 },
    { name: "Geminids Meteor Shower Peak", month: 11, day: 14 },
    { name: "Vernal Equinox", month: 2, day: 20 },
    { name: "Summer Solstice", month: 5, day: 21 },
    { name: "Autumnal Equinox", month: 8, day: 22 },
    { name: "Winter Solstice", month: 11, day: 21 },
];

export const getEventsForDate = (date: Date): string[] => {
    const month = getMonth(date);
    const day = getDate(date);
    const events: string[] = [];

    FIXED_HOLIDAYS.forEach(h => {
        if (h.month === month && h.day === day) events.push(h.name);
    });

    CELESTIAL_EVENTS.forEach(c => {
        if (c.month === month && c.day === day) events.push(c.name);
    });

    return events;
};
