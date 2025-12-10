import React, { useState } from 'react';
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
    date,
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
        // ... (unchanged logic) ...
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
                trackEvent('Interaction', 'Card Flip', `Day: ${dayCount}, Type: ${tags.join(',')}`);
            });
        }
        isClickingRef.current = true;
        onFlip();
    };

    const getCalendarLink = () => {
        const title = `DaysA.live Milestone: ${dayCount.toLocaleString()} Days`;
        const description = `Celebrating ${dayCount.toLocaleString()} days alive! Check more at https://daysa.live`;
        const start = fullDate.toISOString().replace(/-|:|\.\d\d\d/g, "").substring(0, 15) + "Z";
        const end = new Date(fullDate.getTime() + 86400000).toISOString().replace(/-|:|\.\d\d\d/g, "").substring(0, 15) + "Z";

        // Track Calendar Click (lazy way: clicking the link triggers this getter? No. Link click needs onCLick)
        // We will add onClick to the anchor tag below.
        return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(description)}`;
    };

    const getShareData = () => {
        // Use startDate (User's source date, not the milestone date)
        const nonce = encodeMilestoneData(dayCount, startDate);
        const url = `https://daysa.live?nonce=${nonce}`;

        // Text: "I just found my [number] [Prime/Sequence] milestone day at #DaysAlive! [link]"
        const specialTags = tags.filter(t => t === 'Prime' || t === 'Sequence');
        let label = specialTags.join('/');
        if (!label && tags.includes('Milestone')) label = '';
        const labelStr = label ? ` ${label}` : '';
        const text = `I just found my ${dayCount.toLocaleString()}${labelStr} milestone day at #DaysAlive!`;

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

    return (
        <div
            id={`milestone-${dayCount}`}
            className={`milestone-card-container ${isFlipped ? 'flipped' : ''} ${isHighlighted ? 'highlighted' : ''} axis-${flipAxis}`}
            onClick={handleFlip}
        >
            <div className={`milestone-card-inner animation-${animationType}`}>
                {/* Front Face */}
                <div className={`milestone-card-face front ${isToday ? 'today' : ''} ${isNext ? 'next' : ''}`}>
                    <div className="milestone-header">
                        <span className="day-count">{dayCount.toLocaleString()}</span>
                        <span className={`season-badge ${season.toLowerCase()}`}>{season}</span>
                    </div>
                    <div className="milestone-date">{date}</div>
                    <div className="tags">
                        {tags.map((tag, idx) => (
                            <span key={idx} className={`tag ${tag === 'Milestone' ? 'milestone' :
                                tag === 'Prime' ? 'prime' :
                                    tag === 'Sequence' ? 'sequence' :
                                        tag === 'Today' ? 'today-tag' :
                                            ''
                                }`}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Back Face */}
                <div className={`milestone-card-face back ${isToday ? 'today' : ''} ${isNext ? 'next' : ''}`}>
                    <div className="back-content">
                        <h4 className="text-lg font-bold mb-1 text-white">Share Milestone</h4>
                        <div className="text-sm font-bold mb-4" style={{ color: 'var(--accent-primary)' }}>
                            {dayCount.toLocaleString()} Days Alive
                        </div>

                        <a
                            href={getCalendarLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-btn calendar-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                import('../utils/analytics').then(({ trackEvent }) => {
                                    trackEvent('Share', 'Add to Calendar', `Day: ${dayCount}`);
                                });
                            }}
                        >
                            📅 Add to Calendar
                        </a>

                        <div className="social-links">
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
            </div>
        </div>
    );
};
