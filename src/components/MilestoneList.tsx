import React, { useMemo, useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { getDateFromDays, formatDate, calculateDaysFrom } from '../utils/dateUtils';
import { isPrime, isSequence, isMilestone } from '../utils/numberUtils';
import { getSeason, getEventsForDate } from '../utils/eventUtils';
import { encodeMilestoneData } from '../utils/encodingUtils';
import type { Options } from './OptionsPanel';
import { CountdownTimer } from './CountdownTimer';
import { MilestoneCard } from './MilestoneCard';

interface MilestoneListProps {
    startDate: string;
    options: Options;
    onTogglePastDays: () => void;
    highlightDay?: number;
    isMobileView?: boolean; // Added optional prop
}

// ... imports and interface definitions remain ...
import { MobileCard } from './MobileCard'; // Import MobileCard

export interface MilestoneItem {
    dayCount: number;
    date: string;
    fullDate: Date;
    tags: string[];
    season: string;
    isToday?: boolean;
}

export const MilestoneList: React.FC<MilestoneListProps> = ({ startDate, options, onTogglePastDays, highlightDay, isMobileView = false }) => {
    // ... existing hooks (start, milestones, etc.) ...
    const start = useMemo(() => new Date(startDate), [startDate]);
    const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
    const [nextMilestone, setNextMilestone] = useState<MilestoneItem | null>(null);
    const [minSearchDay, setMinSearchDay] = useState<number>(0);
    const [maxSearchDay, setMaxSearchDay] = useState<number>(0);
    const listContainerRef = useRef<HTMLDivElement>(null);
    const previousScrollHeightRef = useRef<number>(0);
    const previousScrollTopRef = useRef<number>(0);
    const isPrependingRef = useRef<boolean>(false);
    const [flippedDayCount, setFlippedDayCount] = useState<number | null>(null);
    const clickSequenceRef = useRef<number[]>([]);

    // Mobile Expansion State
    const [expandedMobileItem, setExpandedMobileItem] = useState<MilestoneItem | null>(null);
    const [isOverlayFlipped, setIsOverlayFlipped] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const lastAutoExpandedRef = useRef<number | null>(null);

    // Sync URL with Expanded Card (Mobile) or Flipped Card (Desktop)
    useEffect(() => {
        const path = window.location.pathname;
        let activeDayCount: number | null = null;

        if (isMobileView) {
            if (expandedMobileItem) activeDayCount = expandedMobileItem.dayCount;
        } else {
            activeDayCount = flippedDayCount;
        }

        if (activeDayCount) {
            const nonce = encodeMilestoneData(activeDayCount, startDate);
            const newUrl = `${path}?nonce=${nonce}`;
            window.history.replaceState({ path: newUrl }, '', newUrl);
        } else {
            window.history.replaceState({ path }, '', path);
        }
    }, [expandedMobileItem, flippedDayCount, startDate, isMobileView]);

    const handleCloseMobile = () => {
        setIsClosing(true);
        setTimeout(() => {
            setExpandedMobileItem(null);
            setIsClosing(false);
        }, 200);
    };

    // ... checkDay function ...
    // Note: checkDay logic is unchanged, no need to duplicate in replacement if I can avoid it, 
    // but replace_file_content needs contiguous block. 
    // I will assume checkDay is identical.
    const checkDay = useCallback((i: number): MilestoneItem | null => {
        // ... (Keep existing checkDay logic exactly as is) ...
        let isCandidate = false;
        const tags: string[] = [];
        const currentDayCount = calculateDaysFrom(start, new Date());

        if (options.milestoneMode !== 'none') {
            let interval = 500;
            if (options.milestoneMode === '1000') interval = 1000;
            if (options.milestoneMode === 'custom' && options.customMilestone > 0) interval = options.customMilestone;
            if (isMilestone(i, interval)) { isCandidate = true; tags.push('Milestone'); }
        }
        if (options.showPrimes && isPrime(i)) { isCandidate = true; tags.push('Prime'); }
        if (options.showSequences && isSequence(i)) { isCandidate = true; tags.push('Sequence'); }

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
            if (!options.seasons[season as keyof typeof options.seasons]) return null;
        }
        if (options.filterCelestial && !isCelestial && i !== currentDayCount) return null;

        if (isSeasonChange) tags.push(`First day of ${season}`);
        events.forEach(e => tags.push(e));
        if (i === currentDayCount) tags.push('Today');

        return {
            dayCount: i,
            date: formatDate(date),
            fullDate: date,
            tags: [...new Set(tags)],
            season: season,
            isToday: i === currentDayCount
        };
    }, [start, options]);

    // ... useEffects (Initial Load, Scroll Layout Effect) ...
    // These are reused by both views.
    useEffect(() => {
        if (isNaN(start.getTime())) return;
        const currentDayCount = calculateDaysFrom(start, new Date());
        const initialItems: MilestoneItem[] = [];
        let pivotDay = highlightDay !== undefined ? highlightDay : currentDayCount;

        let centerItem = checkDay(pivotDay);

        // Search Backwards
        const beforeItems: MilestoneItem[] = [];
        let j = pivotDay - 1;
        let foundBefore = 0;
        // Always try to find 4 previous entries down to day 0
        while (foundBefore < 4 && j >= 0) {
            const item = checkDay(j);
            // Always include valid items found in this specific backward search
            if (item) { beforeItems.unshift(item); foundBefore++; }
            j--;
        }

        const afterItems: MilestoneItem[] = [];
        let i = pivotDay + 1;
        let foundAfter = 0;
        while (foundAfter < 20 && i < pivotDay + 50000) {
            const item = checkDay(i);
            if (item) { afterItems.push(item); foundAfter++; }
            i++;
        }

        if (centerItem) initialItems.push(...beforeItems, centerItem, ...afterItems);
        else initialItems.push(...beforeItems, ...afterItems);

        setMinSearchDay(j);
        setMaxSearchDay(i);
        setMilestones(initialItems);

        const next = afterItems.find(m => m.dayCount > currentDayCount) || initialItems.find(m => m.dayCount > currentDayCount);
        setNextMilestone(next || null);

    }, [startDate, options, start, checkDay, highlightDay]);

    useEffect(() => {
        if (highlightDay) {
            // Mobile: Auto-expand the highlighted card
            if (isMobileView) {
                if (lastAutoExpandedRef.current !== highlightDay) {
                    const item = milestones.find(m => m.dayCount === highlightDay);
                    if (item) {
                        setExpandedMobileItem(item);
                        lastAutoExpandedRef.current = highlightDay;
                    }
                }
            } else {
                // Desktop: Auto-Flip the highlighted card
                if (flippedDayCount !== highlightDay) {
                    setFlippedDayCount(highlightDay);
                }
            }

            // Desktop/General: Scroll to view
            const attemptScroll = (retries: number) => {
                const element = document.getElementById(`milestone-${highlightDay}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else if (retries > 0) { setTimeout(() => attemptScroll(retries - 1), 500); }
            };
            attemptScroll(5);
        }
    }, [highlightDay, milestones, isMobileView]);

    const CHEAT_SEQUENCE = [2, 2, 8, 8, 4, 6, 4, 6, 7, 9, 5];
    const handleCardFlip = (dayCount: number, index: number) => {
        setFlippedDayCount(prev => prev === dayCount ? null : dayCount);
        const nextSeq = [...clickSequenceRef.current, index];
        if (nextSeq.length > CHEAT_SEQUENCE.length) nextSeq.shift();
        clickSequenceRef.current = nextSeq;
        if (nextSeq.length === CHEAT_SEQUENCE.length && nextSeq.every((val, i) => val === CHEAT_SEQUENCE[i])) {
            confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
            clickSequenceRef.current = [];
            import('../utils/analytics').then(({ trackEvent }) => {
                trackEvent('Secret', 'Konami Code Triggered');
            });
        }
    };

    const handleScroll = () => {
        if (!listContainerRef.current || isNaN(start.getTime())) return;
        const { scrollTop, scrollHeight, clientHeight } = listContainerRef.current;

        if (scrollHeight - scrollTop - clientHeight < 200) {
            const newItems: MilestoneItem[] = [];
            let found = 0;
            let i = maxSearchDay;
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

    // Render Mobile View
    if (isMobileView) {
        return (
            <div className="h-full flex flex-col relative">
                {/* Mobile Results Header? Or just grid. */}
                {/* Expand Overlay */}
                {expandedMobileItem && (
                    <div className="mobile-card-overlay" onClick={() => setExpandedMobileItem(null)}>
                        <div className="mobile-card-expanded" onClick={e => e.stopPropagation()}>
                            <MilestoneCard
                                dayCount={expandedMobileItem.dayCount}
                                season={expandedMobileItem.season}
                                date={expandedMobileItem.date}
                                tags={expandedMobileItem.tags}
                                isToday={expandedMobileItem.isToday}
                                isNext={false}
                                fullDate={expandedMobileItem.fullDate}
                                isFlipped={flippedDayCount === expandedMobileItem.dayCount}
                                onFlip={() => setFlippedDayCount(prev => prev === expandedMobileItem.dayCount ? null : expandedMobileItem.dayCount)}
                                startDate={startDate}
                                isHighlighted={false}
                            />
                        </div>
                    </div>
                )}

                <div
                    ref={listContainerRef}
                    className="mobile-grid custom-scrollbar"
                    onScroll={handleScroll}
                >
                    {milestones.map((m) => (
                        <MobileCard
                            key={m.dayCount}
                            dayCount={m.dayCount}
                            season={m.season}
                            date={m.fullDate.toISOString().split('T')[0]}
                            tags={m.tags}
                            isToday={m.isToday}
                            onClick={() => {
                                setExpandedMobileItem(m);
                                setIsOverlayFlipped(false);
                            }}
                        />
                    ))}

                    {milestones.length === 0 && (
                        <div className="text-center text-slate-400 p-8 col-span-2">No milestones found.</div>
                    )}

                </div>

                {/* Mobile Card Overlay */}
                {expandedMobileItem && (
                    <div className={`mobile-card-overlay ${isClosing ? 'closing' : ''}`} onClick={handleCloseMobile}>
                        <div className={`mobile-card-expanded ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
                            <MilestoneCard
                                key={expandedMobileItem.dayCount}
                                {...expandedMobileItem}
                                isFlipped={isOverlayFlipped}
                                onFlip={() => setIsOverlayFlipped(!isOverlayFlipped)}
                                fullDate={expandedMobileItem.fullDate}
                                startDate={startDate}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Render Desktop View (Classic)
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
