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
    const [shareOnlyMode, setShareOnlyMode] = useState(false);


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
        if (isFlipped && shareOnlyMode) setShareOnlyMode(false);

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

    // Helper: Render Main Icon (Front) - Synchronized with Back Face logic
    const renderMainIcon = () => (
        <div className="flex-grow flex items-center justify-center gap-8 px-4 flex-wrap mb-2">

            {/* 1. Prime */}
            {tags.includes('Prime') && (
                <div className="flex flex-col items-center justify-center w-16 h-16" title="Prime Number" style={{ color: '#38bdf8' }}>
                    <IconPrime className="w-full h-full" strokeWidth={1.5} />
                </div>
            )}

            {/* 2. Solstice */}
            {tags.some(t => t.toLowerCase().includes('solstice')) && (
                <div className="flex flex-col items-center justify-center w-16 h-16" title="Solstice" style={{ color: tags.some(t => t.toLowerCase().includes('winter')) ? '#818cf8' : '#f87171' }}>
                    {getIconForTag(tags.find(t => t.toLowerCase().includes('solstice')) || 'Solstice', "w-full h-full", 1.5)}
                </div>
            )}

            {/* 3. Equinox */}
            {tags.some(t => t.toLowerCase().includes('equinox')) && (
                <div className="flex flex-col items-center justify-center w-16 h-16" title="Equinox" style={{ color: tags.some(t => t.toLowerCase().includes('spring') || t.toLowerCase().includes('vernal')) ? '#34d399' : '#fb923c' }}>
                    {getIconForTag(tags.find(t => t.toLowerCase().includes('equinox')) || 'Equinox', "w-full h-full", 1.5)}
                </div>
            )}

            {/* 4. First Day */}
            {tags.some(t => t.toLowerCase().includes('first day')) && (() => {
                const tag = tags.find(t => t.toLowerCase().includes('first day')) || '';
                const seasonMatch = tag.split(' ').pop() || '';
                const lowerTag = tag.toLowerCase();
                let color = '#94a3b8';
                let iconStroke: string | undefined = undefined;

                if (lowerTag.includes('spring')) { color = '#34d399'; iconStroke = "url(#spring-transition)"; }
                else if (lowerTag.includes('summer')) { color = '#f87171'; iconStroke = "url(#summer-transition)"; }
                else if (lowerTag.includes('autumn')) { color = '#fb923c'; iconStroke = "url(#autumn-transition)"; }
                else if (lowerTag.includes('winter')) { color = '#818cf8'; iconStroke = "url(#winter-transition)"; }

                return (
                    <div className="flex flex-col items-center justify-center w-16 h-16" title={tag} style={{ color }}>
                        {getIconForTag(seasonMatch, "w-full h-full", 1.5, iconStroke)}
                    </div>
                );
            })()}

            {/* 5. Meteor */}
            {tags.some(t => t.toLowerCase().includes('meteor')) && (
                <div className="flex flex-col items-center justify-center w-16 h-16" title="Meteor Shower" style={{ color: '#c084fc' }}>
                    <IconMeteor className="w-full h-full" strokeWidth={1.5} />
                </div>
            )}

            {/* 6. Sequence */}
            {tags.includes('Sequence') && (
                <div className="flex flex-col items-center justify-center w-16 h-16" title="Fun Sequence" style={{ color: '#f472b6' }}>
                    <IconSequence className="w-full h-full" strokeWidth={1.5} />
                </div>
            )}

            {/* 7. Eclipse */}
            {tags.some(t => t.toLowerCase().includes('eclipse')) && (() => {
                let iconElement;
                let color = '#f87171';
                const lowerTags = tags.map(t => t.toLowerCase());

                if (lowerTags.includes('solar eclipse')) { iconElement = <IconSolarEclipse className="w-full h-full" strokeWidth={1.5} />; }
                else if (lowerTags.some(t => t.includes('solar eclipse (partial)'))) { color = '#fb923c'; iconElement = <IconSolarEclipsePartial className="w-full h-full" strokeWidth={1.5} />; }
                else if (lowerTags.includes('lunar eclipse')) { color = '#fca5a5'; iconElement = <IconLunarEclipse className="w-full h-full" strokeWidth={1.5} />; }
                else if (lowerTags.some(t => t.includes('lunar eclipse (partial)'))) { color = '#fed7aa'; iconElement = <IconLunarEclipsePartial className="w-full h-full" strokeWidth={1.5} />; }

                return iconElement ? (
                    <div className="flex flex-col items-center justify-center w-16 h-16" title="Eclipse" style={{ color }}>
                        {iconElement}
                    </div>
                ) : null;
            })()}
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
                        <div className="flex flex-row items-center w-full px-4 gap-4 justify-center">
                            <a
                                href={getCalendarLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="action-btn calendar-btn justify-center py-2 px-4 w-auto"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    import('../utils/analytics').then(({ trackEvent }) => {
                                        trackEvent('Share', 'Add to Calendar', `Day: ${dayCount}`);
                                    });
                                }}
                                title="Add to Calendar"
                            >
                                <IconCalendar className="w-5 h-5" strokeWidth={1.5} />
                            </a>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShareOnlyMode(true);
                                    if (!isFlipped) onFlip();
                                }}
                                className="action-btn share-btn justify-center py-2 px-4 w-auto"
                                title="Share Milestone"
                            >
                                <IconShare className="w-5 h-5" strokeWidth={1.5} />
                            </button>
                        </div>

                    </div>
                </div>

                {/* Back Face */}
                <div className={`milestone-card-face back ${isToday ? 'today' : ''} ${isNext ? 'next' : ''}`}>

                    {/* Procedural Seasonal Embossment */}
                    {(() => {
                        const seed = Math.abs(Math.sin(dayCount * 1.5));
                        const seasonName = season || 'Winter';
                        let BgIcon = getIconForTag(seasonName, "w-full h-full", 1);

                        // Default Scatter
                        let pattern = (
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', opacity: 0.03, zIndex: 0, pointerEvents: 'none' }}>
                                <div style={{ position: 'absolute', top: '-20%', left: '-20%', width: '60%', height: '60%', transform: 'rotate(-12deg)' }}>{BgIcon}</div>
                                <div style={{ position: 'absolute', bottom: '-10%', right: '-30%', width: '80%', height: '80%', transform: 'rotate(45deg)' }}>{BgIcon}</div>
                            </div>
                        );

                        if (seed > 0.7) {
                            // Large Center
                            pattern = (
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.04, zIndex: 0, pointerEvents: 'none' }}>
                                    <div style={{ width: '90%', height: '90%', transform: 'rotate(3deg)' }}>{BgIcon}</div>
                                </div>
                            );
                        } else if (seed > 0.4) {
                            // Tiled (Simplified as grid)
                            pattern = (
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.02, zIndex: 0, pointerEvents: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', padding: '1rem', gap: '1rem' }}>
                                    <div style={{ transform: 'rotate(3deg)' }}>{BgIcon}</div>
                                    <div style={{ transform: 'rotate(-6deg)' }}>{BgIcon}</div>
                                    <div style={{ transform: 'rotate(-3deg)' }}>{BgIcon}</div>
                                    <div style={{ transform: 'rotate(6deg)' }}>{BgIcon}</div>
                                </div>
                            );
                        }
                        return pattern;
                    })()}

                    <div className={`back-content flex flex-col items-center h-full pt-10 pb-5 ${shareOnlyMode ? 'justify-center' : 'justify-between'}`} style={{ position: 'relative', zIndex: 10 }}>

                        {!shareOnlyMode && (
                            <>
                                {/* Header: Date Only */}
                                <div className="text-xl font-bold text-slate-200 mb-6 font-mono text-center drop-shadow-md">
                                    <span className="desktop-hidden">
                                        {fullDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                    <span className="desktop-only">
                                        {fullDate.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                </div>

                                {/* Tags (Pills) */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '16px', width: '100%', paddingLeft: '16px', paddingRight: '16px' }}>
                                    {tags.map((tag, i) => {
                                        const lowerTag = tag.toLowerCase();
                                        let bg = 'rgba(30, 41, 59, 0.8)'; // Slate-800
                                        let border = 'rgba(51, 65, 85, 0.5)'; // Slate-700
                                        let color = '#cbd5e1'; // Slate-300
                                        let customStroke: string | undefined = undefined;

                                        if (tag === 'Prime') {
                                            bg = 'rgba(12, 74, 110, 0.3)'; border = 'rgba(14, 165, 233, 0.3)'; color = '#bae6fd'; // Sky
                                        } else if (lowerTag.includes('solstice')) {
                                            if (lowerTag.includes('winter')) { bg = 'rgba(49, 46, 129, 0.3)'; border = 'rgba(99, 102, 241, 0.3)'; color = '#c7d2fe'; } // Indigo
                                            else { bg = 'rgba(127, 29, 29, 0.3)'; border = 'rgba(239, 68, 68, 0.3)'; color = '#fecaca'; } // Red
                                        } else if (lowerTag.includes('equinox')) {
                                            if (lowerTag.includes('spring') || lowerTag.includes('vernal')) { bg = 'rgba(6, 78, 59, 0.3)'; border = 'rgba(16, 185, 129, 0.3)'; color = '#a7f3d0'; } // Emerald
                                            else { bg = 'rgba(124, 45, 18, 0.3)'; border = 'rgba(249, 115, 22, 0.3)'; color = '#fed7aa'; } // Orange
                                        } else if (lowerTag.includes('first day')) {
                                            if (lowerTag.includes('spring')) { bg = 'rgba(6, 78, 59, 0.3)'; border = 'rgba(16, 185, 129, 0.3)'; color = '#a7f3d0'; customStroke = "url(#spring-transition)"; }
                                            else if (lowerTag.includes('summer')) { bg = 'rgba(127, 29, 29, 0.3)'; border = 'rgba(239, 68, 68, 0.3)'; color = '#fecaca'; customStroke = "url(#summer-transition)"; }
                                            else if (lowerTag.includes('autumn')) { bg = 'rgba(124, 45, 18, 0.3)'; border = 'rgba(249, 115, 22, 0.3)'; color = '#fed7aa'; customStroke = "url(#autumn-transition)"; }
                                            else if (lowerTag.includes('winter')) { bg = 'rgba(49, 46, 129, 0.3)'; border = 'rgba(99, 102, 241, 0.3)'; color = '#c7d2fe'; customStroke = "url(#winter-transition)"; }
                                        } else if (lowerTag.includes('meteor')) {
                                            bg = 'rgba(88, 28, 135, 0.3)'; border = 'rgba(168, 85, 247, 0.3)'; color = '#e9d5ff'; // Purple
                                        } else if (tag === 'Sequence') {
                                            bg = 'rgba(131, 24, 67, 0.3)'; border = 'rgba(236, 72, 153, 0.3)'; color = '#fbcfe8'; // Pink
                                        } else if (lowerTag.includes('eclipse')) {
                                            bg = 'rgba(127, 29, 29, 0.3)'; border = 'rgba(239, 68, 68, 0.3)'; color = '#fecaca'; // Red
                                        } else if (tag === 'Milestone') {
                                            bg = 'rgba(30, 58, 138, 0.3)'; border = 'rgba(59, 130, 246, 0.3)'; color = '#bfdbfe'; // Blue
                                        } else if (tag === 'Today') {
                                            bg = 'rgba(124, 45, 18, 0.3)'; border = 'rgba(249, 115, 22, 0.3)'; color = '#fed7aa'; // Orange
                                        }

                                        let iconElement;
                                        if (tag.includes('First day')) {
                                            const seasonMatch = tag.split(' ').pop();
                                            iconElement = getIconForTag(seasonMatch || season, "w-full h-full", 2, customStroke);
                                        } else {
                                            iconElement = getIconForTag(tag, "w-full h-full", 2, customStroke);
                                        }

                                        return (
                                            <span key={i} style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '12px',
                                                padding: '6px 16px', borderRadius: '9999px',
                                                fontSize: '0.875rem', fontWeight: 500,
                                                whiteSpace: 'nowrap',
                                                backgroundColor: bg, border: `1px solid ${border}`, color: color
                                            }}>
                                                <div style={{ width: '20px', height: '20px', color: 'inherit' }}>
                                                    {iconElement}
                                                </div>
                                                {tag}
                                            </span>
                                        );
                                    })}
                                </div>
                            </>
                        )}

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
