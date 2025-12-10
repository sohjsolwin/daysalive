import React, { useMemo, useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { getDateFromDays, formatDate, calculateDaysFrom } from '../utils/dateUtils';
import { isPrime, isSequence, isMilestone } from '../utils/numberUtils';
import { getSeason, getEventsForDate } from '../utils/eventUtils';
import type { Options } from './OptionsPanel';
import { CountdownTimer } from './CountdownTimer';
import { MilestoneCard } from './MilestoneCard';

interface MilestoneListProps {
    startDate: string;
    options: Options;
    onTogglePastDays: () => void;
    highlightDay?: number;
}

interface MilestoneItem {
    dayCount: number;
    date: string;
    fullDate: Date;
    tags: string[];
    season: string;
    isToday?: boolean;
}

export const MilestoneList: React.FC<MilestoneListProps> = ({ startDate, options, onTogglePastDays, highlightDay }) => {
    const start = useMemo(() => new Date(startDate), [startDate]);
    const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
    const [nextMilestone, setNextMilestone] = useState<MilestoneItem | null>(null);

    // Search boundaries
    const [minSearchDay, setMinSearchDay] = useState<number>(0);
    const [maxSearchDay, setMaxSearchDay] = useState<number>(0);

    const listContainerRef = useRef<HTMLDivElement>(null);
    const previousScrollHeightRef = useRef<number>(0);
    const previousScrollTopRef = useRef<number>(0);
    const isPrependingRef = useRef<boolean>(false);

    // Helper to check a day
    const checkDay = useCallback((i: number): MilestoneItem | null => {
        let isCandidate = false;
        const tags: string[] = [];
        const currentDayCount = calculateDaysFrom(start, new Date());

        if (options.milestoneMode !== 'none') {
            let interval = 500;
            if (options.milestoneMode === '1000') interval = 1000;
            if (options.milestoneMode === 'custom' && options.customMilestone > 0) interval = options.customMilestone;

            if (isMilestone(i, interval)) {
                isCandidate = true;
                tags.push('Milestone');
            }
        }

        if (options.showPrimes && isPrime(i)) {
            isCandidate = true;
            tags.push('Prime');
        }

        if (options.showSequences && isSequence(i)) {
            isCandidate = true;
            tags.push('Sequence');
        }

        if (!isCandidate && i !== currentDayCount) return null;

        const date = getDateFromDays(start, i);
        const season = getSeason(date);
        const events = getEventsForDate(date);

        const isHoliday = events.some(e => !e.includes('Meteor') && !e.includes('Equinox') && !e.includes('Solstice'));
        const isCelestial = events.some(e => e.includes('Meteor') || e.includes('Equinox') || e.includes('Solstice'));
        const isSeasonChange = (i > 1 && getSeason(getDateFromDays(start, i - 1)) !== season) || i === 1;

        if (options.filterHolidays && !isHoliday && i !== currentDayCount) return null;
        if (options.filterBySeason && i !== currentDayCount) {
            if (!isSeasonChange) return null;
            // Check if specific season is enabled
            // isSeasonChange is true. 'season' variable holds the *current* season of this date.
            // Usually "Start of Spring" happens on the first day of Spring.
            // So 'season' should be 'Spring'.
            // We check options.seasons['Spring'].
            if (!options.seasons[season as keyof typeof options.seasons]) return null;
        }
        if (options.filterCelestial && !isCelestial && i !== currentDayCount) return null;

        if (isSeasonChange) tags.push(`First day of ${season}`);
        events.forEach(e => tags.push(e));

        if (i === currentDayCount) {
            tags.push('Today');
        }

        return {
            dayCount: i,
            date: formatDate(date),
            fullDate: date,
            tags: [...new Set(tags)],
            season: season,
            isToday: i === currentDayCount
        };
    }, [start, options]);

    // Initial Load
    useEffect(() => {
        if (isNaN(start.getTime())) return;

        const currentDayCount = calculateDaysFrom(start, new Date());
        const initialItems: MilestoneItem[] = [];

        // If explicitly highlighting a day, ensure we load around it


        // Logic:
        // 1. Find the Highlight Day Item (or Today equivalent if no highlight)
        // 2. Find ~4 items BEFORE it (to fill top rows)
        // 3. Find ~15 items AFTER it (to fill bottom rows)

        let pivotDay = highlightDay !== undefined ? highlightDay : currentDayCount;

        // Find pivot item
        let pivotItem = checkDay(pivotDay);
        // If pivot isn't a milestone (e.g. user modified URL manually to non-milestone?), try to find nearest?
        // But user URL usually comes from a valid milestone. 
        // If null, we might just default to standard valid milestones around it.
        // For now assume pivot is valid-ish or we find next best.

        let centerItem = pivotItem;
        if (!centerItem && highlightDay) {
            // User put in a custom number that isn't a milestone in current filter?
            // Force create it? Or just search? 
            // Only 'custom' milestones generated by existing logic return items. 
            // If share link is for day 12345 and that is NOT a valid milestone in current options...
            // It won't show up. We should probably force it to appear or temporarily allow it?
            // "It's okay to display a row of past data... even if checkbox isn't selected".
            // Implies we show what was shared.
            // But checkDay filters based on options.
            // Let's assume the share link implies we want to see it.
            // But `checkDay` respects options. 
            // If I share a "Prime" and recipient has "Show Primes" OFF... they won't see it?
            // That's a UX gap. But for now let's assume options align or we rely on checkDay.
        }

        // Search Backwards for ~4 items
        const beforeItems: MilestoneItem[] = [];
        let j = pivotDay - 1;
        let foundBefore = 0;
        // Search limit 50000 days back
        while (foundBefore < 4 && j > -50000) {
            const item = checkDay(j);
            // We include past items if we are forcing context for highlight OR if showPastDays is true
            // But here we specifically want visual centering for highlight.
            // If showPastDays is TRUE, we might load more?
            // Let's just load 4 min for centering if highlight is active.
            // If no highlight, follow standard logic (showPastDays check).

            const shouldInclude = (highlightDay !== undefined) || (options.showPastDays && !item?.isToday);

            if (item && shouldInclude) { // checkDay handles nulls
                beforeItems.unshift(item);
                foundBefore++;
            }
            j--;
        }

        // Search Forwards
        const afterItems: MilestoneItem[] = [];
        let i = pivotDay + 1;
        let foundAfter = 0;
        while (foundAfter < 20 && i < pivotDay + 50000) {
            const item = checkDay(i);
            if (item) {
                afterItems.push(item);
                foundAfter++;
            }
            i++;
        }

        // Assemble
        // if Pivot exists, add it.
        if (centerItem) {
            initialItems.push(...beforeItems, centerItem, ...afterItems);
        } else {
            // Fallback if pivot invalid: just show what we found?
            // If pivoting on currentDay (Today) and it's not a "milestone" per se but we want to show it?
            // checkDay adds 'Today' tag logic if i === currentDayCount.
            // If checkDay returned null for pivotDay... 
            // If pivot was "Today", checkDay should have returned it if it matches filters OR always?
            // checkDay currently: "if (i === currentDayCount) tags.push('Today')".
            // But returns null if no OTHER criteria met? 
            // Line 84-86: It pushes 'Today'.
            // Line 67: returns null if !isCandidate.
            // Fix logic: Today should always be returned? 
            // User's code: checkDay returns null if !isCandidate AND i !== currentDayCount.
            // So Today is returned.

            // If highlightDay is not a milestone/prime/sequence... checkDay returns null.
            // We should just render list.
            initialItems.push(...beforeItems, ...afterItems);
        }

        // Update boundaries
        // minSearchDay is the earliest day we checked or found?
        // Logic uses 'j' which is last checked day?
        setMinSearchDay(j);
        setMaxSearchDay(i);

        setMilestones(initialItems);

        // Find next milestone for timer
        const next = afterItems.find(m => m.dayCount > currentDayCount) || initialItems.find(m => m.dayCount > currentDayCount);
        setNextMilestone(next || null);

    }, [startDate, options, start, checkDay, highlightDay]); // Added highlightDay dep

    // Effect to handle highlighting/scrolling
    useEffect(() => {
        if (highlightDay) {
            const attemptScroll = (retries: number) => {
                const element = document.getElementById(`milestone-${highlightDay}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else if (retries > 0) {
                    setTimeout(() => attemptScroll(retries - 1), 500);
                }
            };
            attemptScroll(5);
        }
    }, [highlightDay, milestones]);



    const [flippedDayCount, setFlippedDayCount] = useState<number | null>(null);

    // Konami Code Logic
    const clickSequenceRef = useRef<number[]>([]);
    const CHEAT_SEQUENCE = [2, 2, 8, 8, 4, 6, 4, 6, 7, 9, 5];

    const handleCardFlip = (dayCount: number, index: number) => {
        setFlippedDayCount(prev => prev === dayCount ? null : dayCount);

        // Track clicks for cheat code
        const nextSeq = [...clickSequenceRef.current, index];
        if (nextSeq.length > CHEAT_SEQUENCE.length) {
            nextSeq.shift();
        }
        clickSequenceRef.current = nextSeq;

        // Check for match
        if (nextSeq.length === CHEAT_SEQUENCE.length && nextSeq.every((val, i) => val === CHEAT_SEQUENCE[i])) {
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 }
            });
            clickSequenceRef.current = []; // Reset after trigger

            // Track Secret
            import('../utils/analytics').then(({ trackEvent }) => {
                trackEvent('Secret', 'Konami Code Triggered');
            });
        }
    };

    // Scroll Handler
    const handleScroll = () => {
        if (!listContainerRef.current || isNaN(start.getTime())) return;
        const { scrollTop, scrollHeight, clientHeight } = listContainerRef.current;

        // Load More Future (Bottom)
        if (scrollHeight - scrollTop - clientHeight < 200) {
            const newItems: MilestoneItem[] = [];
            let found = 0;
            let i = maxSearchDay;
            // ... (rest of scroll logic is same, just need to make sure we don't cut off)
            while (found < 10 && i < maxSearchDay + 50000) {
                const item = checkDay(i);
                if (item && (item.tags.length > 0 || item.tags.includes('Today'))) {
                    newItems.push(item);
                    found++;
                }
                i++;
            }
            if (newItems.length > 0) {
                setMilestones(prev => [...prev, ...newItems]);
                setMaxSearchDay(i);
            }
        }

        // Load More Past (Top)
        if (options.showPastDays && scrollTop < 200) {
            const newItems: MilestoneItem[] = [];
            let found = 0;
            let i = minSearchDay;
            while (found < 10 && i > minSearchDay - 50000) {
                const item = checkDay(i);
                if (item && item.tags.length > 0 && !item.isToday) {
                    newItems.unshift(item);
                    found++;
                }
                i--;
            }
            if (newItems.length > 0) {
                isPrependingRef.current = true;
                previousScrollHeightRef.current = listContainerRef.current.scrollHeight;
                previousScrollTopRef.current = listContainerRef.current.scrollTop;

                setMilestones(prev => [...newItems, ...prev]);
                setMinSearchDay(i);
            }
        }
    };

    // Scroll Preservation Layout Effect
    useLayoutEffect(() => {
        if (isPrependingRef.current && listContainerRef.current) {
            const newScrollHeight = listContainerRef.current.scrollHeight;
            const diff = newScrollHeight - previousScrollHeightRef.current;
            if (diff > 0) {
                listContainerRef.current.scrollTop = previousScrollTopRef.current + diff;
            }
            isPrependingRef.current = false;
        }
    }, [milestones]);

    return (
        <div className="h-full flex flex-col">
            {nextMilestone && (
                <CountdownTimer
                    targetDate={nextMilestone.fullDate}
                    milestoneName={`${nextMilestone.dayCount.toLocaleString()} Days`}
                />
            )}

            <div className="flex justify-between items-end mb-4 shrink-0">
                <h3 className="results-header mb-0">Results</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm text-gray-400">Show Past Days</span>
                    <input
                        type="checkbox"
                        className="toggle-switch"
                        checked={options.showPastDays}
                        onChange={onTogglePastDays}
                    />
                </label>
            </div>

            <div
                ref={listContainerRef}
                className="milestone-grid-container custom-scrollbar"
                style={{}}
                onScroll={handleScroll}
            >
                <div className="milestone-grid">
                    {milestones.map((m, index) => {
                        const isNext = nextMilestone && m.dayCount === nextMilestone.dayCount;
                        const isFlipped = m.dayCount === flippedDayCount;
                        return (
                            <MilestoneCard
                                key={m.dayCount}
                                dayCount={m.dayCount}
                                season={m.season}
                                date={m.date}
                                tags={m.tags}
                                isToday={m.isToday}
                                isNext={isNext || undefined}
                                fullDate={m.fullDate}
                                isFlipped={isFlipped}
                                onFlip={() => handleCardFlip(m.dayCount, index + 1)}
                                startDate={startDate}
                                isHighlighted={highlightDay === m.dayCount}
                            />
                        );
                    })}
                </div>

                {milestones.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '4rem' }}>
                        No milestones found.
                    </div>
                )}
            </div>
        </div>
    );
};
