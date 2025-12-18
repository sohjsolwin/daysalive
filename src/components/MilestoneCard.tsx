import React, { useState } from 'react';

import { getIconForTag, IconCalendar, IconShare, IconPrime, IconMeteor, IconSequence, IconSolarEclipse, IconSolarEclipsePartial, IconLunarEclipse, IconLunarEclipsePartial } from './EventIcons';
import { encodeMilestoneData } from '../utils/encodingUtils';

interface MilestoneCardProps {
    dayCount: number;
    season: string;
    date: string;
    tags: string[];
    isToday?: boolean;
    isNext?: boolean;
    fullDate: Date;
    isFlipped: boolean;
    onFlip: () => void;
    isHighlighted?: boolean;
    startDate: string; // The user's source date
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
    dayCount,
    season,
    // date,
    tags,
    isToday,
    isNext,
    fullDate,
    isFlipped,
    onFlip,
    isHighlighted,
    startDate,
}) => {
    // 'default' | 'bounce' | 'spin' | 'unflip-bounce' | 'unflip-spin'
    const [animationType, setAnimationType] = useState('default');
    // 'y' (default, horizontal flip) | 'x' (vertical flip)
    const [flipAxis, setFlipAxis] = useState<'y' | 'x'>('y');

    const [copied, setCopied] = useState(false);

    // ... existing refs ...
    const prevFlipped = React.useRef(isFlipped);
    const isClickingRef = React.useRef(false);

    // ... existing useEffect ...
    React.useEffect(() => {
        if (isFlipped === prevFlipped.current) return;
        if (isFlipped) {
            const axis = Math.random() > 0.7 ? 'x' : 'y';
            setFlipAxis(axis);
            const rand = Math.random();
            let type = 'default';
            if (rand > 0.9) type = 'spin';
            else if (rand > 0.7) type = 'bounce';

            setAnimationType(type);

            if (type !== 'default') {
                import('../utils/analytics').then(({ trackEvent }) => {
                    trackEvent('Easter Egg', 'Special Animation', type);
                });
            }
        } else {
            const isForcedUnflip = !isClickingRef.current;
            const rand = Math.random();
            if (isForcedUnflip) {
                if (rand > 0.8) setAnimationType('unflip-spin');
                else if (rand > 0.4) setAnimationType('unflip-bounce');
                else setAnimationType('default');
            } else {
                if (rand > 0.9) setAnimationType('unflip-spin');
                else if (rand > 0.7) setAnimationType('unflip-bounce');
                else setAnimationType('default');
            }
        }
        prevFlipped.current = isFlipped;
        isClickingRef.current = false;
    }, [isFlipped]);

    const handleFlip = () => {
        if (!isFlipped) {
            // Track Card Flip
            import('../utils/analytics').then(({ trackEvent }) => {
                trackEvent('Interaction', 'Card Flip', `Day: ${dayCount}, Type: ${tags.join(',')} `);
            });
        }
        isClickingRef.current = true;
        onFlip();
    };

    const getCalendarLink = () => {
        const shareId = encodeMilestoneData(dayCount, startDate);
        const url = `https://daysa.live?m=${shareId}`;

        const title = `DaysA.live Milestone: ${dayCount.toLocaleString()} Days`;
        const description = `Celebrating ${dayCount.toLocaleString()} days alive! Check more at ${url}`;
        const start = fullDate.toISOString().replace(/-|:|\.\d\d\d/g, "").substring(0, 15) + "Z";
        const end = new Date(fullDate.getTime() + 86400000).toISOString().replace(/-|:|\.\d\d\d/g, "").substring(0, 15) + "Z";

        return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(description)}`;
    };

    const getShareData = () => {
        const nonce = encodeMilestoneData(dayCount, startDate);
        const url = `https://daysa.live?m=${nonce}`;

        const hashtags = tags
            .filter(t => t !== 'Milestone' && t !== 'Today')
            .map(t => {
                return '#' + t.replace(/[^\w\s]/g, '').replace(/\s+(.)/g, (_, group1) => group1.toUpperCase()).replace(/^\w/, c => c.toUpperCase());
            });

        if (tags.includes('Milestone')) hashtags.push('#Milestone');

        const tagsStr = hashtags.length > 0 ? ` ${hashtags.join(' ')}` : '';
        const text = `I just found my ${dayCount.toLocaleString()} day${tagsStr} at #DaysAlive!`;

        return { url, text };
    };

    const handleCopyLink = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const { url } = getShareData();
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);

            // Track Share
            import('../utils/analytics').then(({ trackEvent }) => {
                trackEvent('Share', 'Copy Link', `Day: ${dayCount}`);
            });
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const { url: shareUrl, text: shareText } = getShareData();

    // Helper: Render Main Icon (Large)
    const renderMainIcon = () => (
        <div className="flex justify-center gap-8 items-center w-full mb-4">
            {tags.includes('Prime') && (
                <div className="flex flex-col items-center justify-center w-16 h-16" title="Prime Number">
                    <IconPrime className="w-full h-full text-sky-400" strokeWidth={1.5} />
                </div>
            )}
            {tags.some(t => t.includes('Solstice')) && (
                <div className="flex flex-col items-center justify-center w-16 h-16" title="Solstice">
                    <div className="w-full h-full text-yellow-400 animate-spin-slow">
                        {getIconForTag(tags.find(t => t.includes('Solstice')) || 'Solstice', "w-full h-full", 1.5)}
                    </div>
                </div>
            )}
            {tags.some(t => t.includes('Equinox')) && (
                <div className="flex flex-col items-center justify-center w-16 h-16" title="Equinox">
                    <div className="w-full h-full text-indigo-400">
                        {getIconForTag(tags.find(t => t.includes('Equinox')) || 'Equinox', "w-full h-full", 1.5)}
                    </div>
                </div>
            )}
            {tags.some(t => t.includes('First day')) && (
                <div className="flex flex-col items-center justify-center w-16 h-16" title={tags.find(t => t.includes('First day')) || "New Season"}>
                    <div className="text-emerald-400 w-full h-full">
                        {getIconForTag(season, "w-full h-full text-emerald-400", 1.5)}
                    </div>
                </div>
            )}
            {tags.some(t => t.includes('Meteor')) && (
                <div className="flex flex-col items-center justify-center w-16 h-16" title="Meteor Shower">
                    <IconMeteor className="w-full h-full text-purple-400" strokeWidth={1.5} />
                </div>
            )}
            {tags.includes('Sequence') && (
                <div className="flex flex-col items-center justify-center w-16 h-16" title="Fun Sequence">
                    <IconSequence className="w-full h-full text-pink-400" strokeWidth={1.5} />
                </div>
            )}
            {tags.some(t => t.includes('Eclipse')) && (
                <div className="flex flex-col items-center justify-center w-16 h-16" title="Eclipse">
                    {tags.some(t => t.toLowerCase() === 'solar eclipse') && <IconSolarEclipse className="w-full h-full text-red-400" strokeWidth={1.5} />}
                    {tags.some(t => t.toLowerCase().includes('solar eclipse (partial)')) && <IconSolarEclipsePartial className="w-full h-full text-orange-400" strokeWidth={1.5} />}
                    {tags.some(t => t.toLowerCase().includes('lunar eclipse')) && <IconLunarEclipse className="w-full h-full text-red-300" strokeWidth={1.5} />}
                    {tags.some(t => t.toLowerCase().includes('lunar eclipse (partial)')) && <IconLunarEclipsePartial className="w-full h-full text-orange-200" strokeWidth={1.5} />}
                </div>
            )}
        </div>
    );

    // Helper: Render Big Number
    const renderBigNumber = () => (
        <div className="flex flex-col items-center flex-grow justify-center mb-2">
            <div className="text-5xl font-black leading-none tracking-tight mb-2" style={{
                background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }}>
                {dayCount.toLocaleString()}
            </div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                Days Alive
            </div>
        </div>
    );

    return (
        <div
            id={`milestone-${dayCount}`}
            className={`milestone-card-container ${isFlipped ? 'flipped' : ''} ${isHighlighted ? 'highlighted' : ''} axis-${flipAxis}`}
            onClick={handleFlip}
        >
            <div className={`milestone-card-inner animation-${animationType}`}>
                {/* Front Face */}
                <div className="milestone-card-face front">
                    <div className="front-content flex flex-col items-center w-full h-full justify-between pt-10 pb-5">

                        {renderMainIcon()}
                        {renderBigNumber()}

                        {/* Actions */}
                        <div className="flex flex-col items-center w-full px-4 gap-4">
                            <a
                                href={getCalendarLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="action-btn calendar-btn w-full justify-center py-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    import('../utils/analytics').then(({ trackEvent }) => {
                                        trackEvent('Share', 'Add to Calendar', `Day: ${dayCount}`);
                                    });
                                }}
                            >
                                <IconCalendar className="w-4 h-4" strokeWidth={1.5} />
                                Add to Calendar
                            </a>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleFlip();
                                }}
                                className="action-btn share-btn w-full justify-center py-2"
                            >
                                <IconShare className="w-4 h-4" strokeWidth={1.5} />
                                Share Milestone
                            </button>
                        </div>

                    </div>
                </div>

                {/* Back Face */}
                <div className={`milestone-card-face back ${isToday ? 'today' : ''} ${isNext ? 'next' : ''}`}>
                    <div className="back-content flex flex-col justify-between items-center h-full pt-10 pb-5">

                        {/* Header: Date Only */}
                        <div className="text-xl font-bold text-slate-200 mb-6 font-mono text-center drop-shadow-md">
                            {fullDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>

                        {/* Tags (Pills) */}
                        <div className="flex flex-wrap justify-center gap-2 mb-4 w-full px-4">
                            {tags.map((tag, i) => {
                                let className = "bg-slate-800/80 text-slate-300 border-slate-700/50";
                                let iconColorClass = "text-current";

                                if (tag === 'Prime') {
                                    className = "bg-sky-900/30 text-sky-200 border-sky-500/30";
                                    iconColorClass = "text-sky-400";
                                } else if (tag.toLowerCase().includes('solstice')) {
                                    className = "bg-yellow-900/30 text-yellow-200 border-yellow-500/30";
                                    iconColorClass = "text-yellow-400";
                                } else if (tag.toLowerCase().includes('equinox')) {
                                    className = "bg-indigo-900/30 text-indigo-200 border-indigo-500/30";
                                    iconColorClass = "text-indigo-400";
                                } else if (tag.toLowerCase().includes('meteor')) {
                                    className = "bg-purple-900/30 text-purple-200 border-purple-500/30";
                                    iconColorClass = "text-purple-400";
                                } else if (tag.toLowerCase().includes('first day')) {
                                    className = "bg-emerald-900/30 text-emerald-200 border-emerald-500/30";
                                    iconColorClass = "text-emerald-400";
                                } else if (tag === 'Sequence') {
                                    className = "bg-pink-900/30 text-pink-200 border-pink-500/30";
                                    iconColorClass = "text-pink-400";
                                } else if (tag === 'Milestone') {
                                    className = "bg-blue-900/30 text-blue-200 border-blue-500/30";
                                    iconColorClass = "text-blue-400";
                                } else if (tag === 'Today') {
                                    className = "bg-orange-900/30 text-orange-200 border-orange-500/30";
                                    iconColorClass = "text-orange-400";
                                } else if (tag.toLowerCase().includes('eclipse')) {
                                    className = "bg-red-900/30 text-red-200 border-red-500/30";
                                    iconColorClass = "text-red-400";
                                }

                                let iconElement;
                                if (tag.includes('First day')) {
                                    const seasonMatch = tag.split(' ').pop();
                                    iconElement = (
                                        <div className={`w-5 h-5 ${iconColorClass} [&>svg]:w-full [&>svg]:h-full`}>
                                            {getIconForTag(seasonMatch || season, "w-full h-full", 2)}
                                        </div>
                                    );
                                } else {
                                    iconElement = getIconForTag(tag, `w-5 h-5 ${iconColorClass}`, 2);
                                }

                                return (
                                    <span key={i} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border whitespace-nowrap ${className}`}>
                                        {iconElement}
                                        {tag}
                                    </span>
                                );
                            })}
                        </div>

                        {/* Share Section (Social Links) */}
                        <div className="flex flex-col items-center w-full gap-3 px-4">
                            <div className="w-full flex flex-col items-center gap-2">
                                <div className="h-[2px] w-3/4 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-lg text-indigo-500"></div>
                                <h4 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Share Milestone</h4>
                            </div>

                            <div className="social-links justify-center w-full gap-4">
                                <button
                                    onClick={handleCopyLink}
                                    className={`social-icon copy-link ${copied ? 'copied' : ''}`}
                                    title="Copy Link"
                                    style={copied ? { backgroundColor: '#10B981', borderColor: '#10B981', color: 'white' } : {}}
                                >
                                    {copied ? (
                                        <svg role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                        </svg>
                                    ) : (
                                        <svg role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                                        </svg>
                                    )}
                                </button>
                                <a
                                    href={`https://bsky.app/intent/compose?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-icon bluesky"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        import('../utils/analytics').then(({ trackEvent }) => trackEvent('Share', 'Social Click', 'Bluesky'));
                                    }}
                                    title="Share on Bluesky"
                                >
                                    <svg role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.202 2.857C7.954 4.922 10.913 9.11 12 11.358c1.087-2.247 4.046-6.436 6.798-8.501C20.783 1.366 24 .213 24 3.883c0 .732-.42 6.156-.667 7.037-.856 3.061-3.978 3.842-6.755 3.37 4.854.826 6.089 3.562 3.422 6.299-5.065 5.196-7.28-1.304-7.847-2.97-.104-.305-.152-.448-.153-.327 0-.121-.05.022-.153.327-.568 1.666-2.782 8.166-7.847 2.97-2.667-2.737-1.432-5.473 3.422-6.3-2.777.473-5.899-.308-6.755-3.369C.42 10.04 0 4.615 0 3.883c0-3.67 3.217-2.517 5.202-1.026" />
                                    </svg>
                                </a>
                                <a
                                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-icon twitter"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        import('../utils/analytics').then(({ trackEvent }) => trackEvent('Share', 'Social Click', 'Twitter'));
                                    }}
                                    title="Share on Twitter"
                                >
                                    𝕏
                                </a>
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-icon facebook"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        import('../utils/analytics').then(({ trackEvent }) => trackEvent('Share', 'Social Click', 'Facebook'));
                                    }}
                                    title="Share on Facebook"
                                >
                                    f
                                </a>
                                <a
                                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-icon linkedin"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        import('../utils/analytics').then(({ trackEvent }) => trackEvent('Share', 'Social Click', 'LinkedIn'));
                                    }}
                                    title="Share on LinkedIn"
                                >
                                    in
                                </a>
                            </div>
                        </div>

                    </div>
                    {/* Add overlay to catch clicks on background to flip back? handled by parent */}
                </div>
            </div>
        </div>
    );
};
