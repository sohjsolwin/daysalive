import React from 'react';

type IconProps = {
    className?: string;
    strokeWidth?: number;
    stroke?: string;
};

const defaultProps = {
    className: "w-6 h-6",
    strokeWidth: 1.5,
    stroke: undefined
};

// Global Gradients Definition (can be included in one of the specific icons or a separate component, 
// using generic IDs is fine if they are unique to the app)
const Defs = () => (
    <defs>
        <linearGradient id="prime-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" /> {/* Sky-400 */}
            <stop offset="100%" stopColor="#818cf8" /> {/* Indigo-400 */}
        </linearGradient>
        <linearGradient id="prime-loop-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2dd4bf" /> {/* Teal-400 */}
            <stop offset="100%" stopColor="#818cf8" /> {/* Indigo-400 */}
        </linearGradient>
        <linearGradient id="sol-winter-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" /> {/* Sky-500 */}
            <stop offset="100%" stopColor="#6366f1" /> {/* Indigo-500 (Winter blend) */}
        </linearGradient>
        <linearGradient id="sol-summer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" /> {/* Amber-500 */}
            <stop offset="100%" stopColor="#ef4444" /> {/* Red-500 (Summer blend) */}
        </linearGradient>
        <linearGradient id="eq-vernal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" /> {/* Blue-500 (Winter) */}
            <stop offset="100%" stopColor="#10b981" /> {/* Emerald-500 (Spring) */}
        </linearGradient>
        <linearGradient id="eq-autumn-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" /> {/* Amber-500 (Summer) */}
            <stop offset="100%" stopColor="#b45309" /> {/* Amber-700/Orange (Autumn) */}
        </linearGradient>

        {/* Season Transitions (20% from previous season) */}
        <linearGradient id="spring-transition" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" /> {/* Winter (Indigo) */}
            <stop offset="20%" stopColor="#10b981" /> {/* Spring (Emerald) */}
            <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id="summer-transition" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" /> {/* Spring (Emerald) */}
            <stop offset="20%" stopColor="#ef4444" /> {/* Summer (Red) */}
            <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <linearGradient id="autumn-transition" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" /> {/* Summer (Red) */}
            <stop offset="20%" stopColor="#f97316" /> {/* Autumn (Orange) */}
            <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <linearGradient id="winter-transition" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" /> {/* Autumn (Orange) */}
            <stop offset="20%" stopColor="#6366f1" /> {/* Winter (Indigo) */}
            <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
    </defs>
);

// 1. Prime Number (Double-struck P)
export const IconPrime: React.FC<IconProps> = ({ className, strokeWidth } = defaultProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Defs />
        {/* Left Stem (Solid Teal) */}
        <path d="M7 4v16" stroke="#2dd4bf" />
        {/* Right Stem (Solid Teal) */}
        <path d="M11 4v16" stroke="#2dd4bf" />
        {/* P Loop (Gradient Teal -> Indigo) */}
        <path d="M7 4h8a4 4 0 0 1 0 8h-8" stroke="url(#prime-loop-gradient)" />
    </svg>
);

// 2. Seasons
export const IconSeasonSpring: React.FC<IconProps> = ({ className, strokeWidth, stroke } = defaultProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke || "currentColor"} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.5a4.5 4.5 0 0 1 4.5 4.5c0 2.485-2.015 4.5-4.5 4.5S7.5 9.485 7.5 7 9.515 2.5 12 2.5z" />
        <path d="M12 21.5v-10" stroke="#10b981" />
        <path d="M12 16.5c-2.5 0-4.5-2-4.5-4.5" />
    </svg>
);

export const IconSeasonSummer: React.FC<IconProps> = ({ className, strokeWidth, stroke } = defaultProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke || "currentColor"} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        <path d="M4.93 4.93l14.14 14.14" />
        <path d="M4.93 19.07l14.14-14.14" />
    </svg>
);

export const IconSeasonAutumn: React.FC<IconProps> = ({ className, strokeWidth, stroke } = defaultProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke || "currentColor"} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19c-5 0-9-4-9-9s4-8 9-8 9 4 9 8-4 9-9 9z" />
        <path d="M12 22v-9" stroke="#f97316" />
    </svg>
);

export const IconSeasonWinter: React.FC<IconProps> = ({ className, strokeWidth, stroke } = defaultProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke || "currentColor"} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h20" />
        <path d="M12 2v20" stroke="#6366f1" />
        <path d="M4.93 4.93l14.14 14.14" />
        <path d="M4.93 19.07L19.07 4.93" />
        <path d="M9 12l-2-2M15 12l2-2M12 9l2-2M12 15l2 2" />
        <circle cx="12" cy="12" r="2" />
    </svg>
);

// 3. Solstices
export const IconSolsticeWinter: React.FC<IconProps> = ({ className, strokeWidth } = defaultProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Defs />
        <g stroke="url(#sol-winter-gradient)">
            <path d="M12 2v20M2 12h20" />
            <path d="M20 12l-4-4M4 12l4 4M12 4l-4 4M12 20l4-4" />
            <circle cx="12" cy="12" r="3" />
        </g>
    </svg>
);

export const IconSolsticeSummer: React.FC<IconProps> = ({ className, strokeWidth } = defaultProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Defs />
        <g stroke="url(#sol-summer-gradient)">
            <path d="M12 2v20M2 12h20" />
            <path d="M18 6l-2 2M6 18l2-2M6 6l2 2M18 18l-2-2" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="9" strokeDasharray="1 4" opacity="0.5" />
        </g>
    </svg>
);

export const IconSolstice = IconSolsticeSummer;

// 4. Equinoxes
export const IconEquinox: React.FC<IconProps> = ({ className, strokeWidth } = defaultProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M2 12h20" />
        <circle cx="12" cy="12" r="8" />
        <path d="M12 12l5-5M12 12l-5 5" />
    </svg>
);

export const IconEquinoxVernal: React.FC<IconProps> = ({ className, strokeWidth } = defaultProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Defs />
        <g stroke="url(#eq-vernal-gradient)">
            <path d="M12 3v18M3 12h18" />
            <circle cx="12" cy="12" r="7" />
            <path d="M12 12c0-3 2.5-3 2.5-3" />
            <path d="M12 12c0-3-2.5-3-2.5-3" />
        </g>
    </svg>
);

export const IconEquinoxAutumnal: React.FC<IconProps> = ({ className, strokeWidth } = defaultProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Defs />
        <g stroke="url(#eq-autumn-gradient)">
            <path d="M12 3v18M3 12h18" />
            <circle cx="12" cy="12" r="7" />
            <path d="M12 12c0 2 2 2 3 4" opacity="0.8" />
            <path d="M12 12c3-4 6 0 6 0s-3 4-6 0z" transform="translate(-1, -4) scale(0.6)" />
        </g>
    </svg>
);


// 5. Meteor
export const IconMeteor: React.FC<IconProps> = ({ className, strokeWidth } = defaultProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2.5l-2 6-6 2 6 2 2 6 2-6 6-2-6-2-2-6z" />
        <path d="M16 4l6-2M20 9l4-1" />
    </svg>
);

// 6. Eclipses
export const IconSolarEclipse: React.FC<IconProps> = ({ className, strokeWidth } = defaultProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="5" strokeDasharray="3 3" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
    </svg>
);

export const IconSolarEclipsePartial: React.FC<IconProps> = ({ className, strokeWidth } = defaultProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 5l2 2M2 12h3M5 19l2-2" />
        <mask id="moon-mask">
            <rect x="0" y="0" width="24" height="24" fill="white" />
            <circle cx="14" cy="14" r="6" fill="black" />
        </mask>
        <circle cx="10" cy="10" r="7" mask="url(#moon-mask)" />
        <circle cx="14" cy="14" r="6" />
    </svg>
);

export const IconLunarEclipse: React.FC<IconProps> = ({ className, strokeWidth } = defaultProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="7" />
        <path d="M8 17l8-10M6 15l12-6" opacity="0.5" />
    </svg>
);

export const IconLunarEclipsePartial: React.FC<IconProps> = ({ className, strokeWidth } = defaultProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="7" />
        <path d="M14 5a7 7 0 0 0 0 14" opacity="0.5" />
    </svg>
);

// 7. Sequence
export const IconSequence: React.FC<IconProps> = ({ className, strokeWidth } = defaultProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {/* Dot 1: Pink */}
        <circle cx="5" cy="12" r="2" fill="#ec4899" opacity="0.9" stroke="none" />
        {/* Arc 1: Purple */}
        <path d="M5 12 Q 8.5 2 12 12" stroke="#a855f7" />

        {/* Dot 2: Indigo */}
        <circle cx="12" cy="12" r="2" fill="#6366f1" opacity="0.9" stroke="none" />
        {/* Arc 2: Sky */}
        <path d="M12 12 Q 15.5 22 19 12" stroke="#38bdf8" />

        {/* Dot 3: Emerald */}
        <circle cx="19" cy="12" r="2" fill="#10b981" opacity="0.9" stroke="none" />
    </svg>
);

// 8. General
export const IconMilestone: React.FC<IconProps> = ({ className, strokeWidth } = defaultProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
);

export const IconCalendar: React.FC<IconProps> = ({ className, strokeWidth } = defaultProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

export const IconShare: React.FC<IconProps> = ({ className, strokeWidth } = defaultProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
);

// Helper to get icon by tag name mapping
export const getIconForTag = (tag: string, className?: string, strokeWidth?: number, stroke?: string) => {
    const props = { className, strokeWidth, stroke };
    const lower = tag.toLowerCase();

    if (lower === 'prime') return <IconPrime {...props} />;

    // Solstices
    if (lower.includes('winter solstice')) return <IconSolsticeWinter {...props} />;
    if (lower.includes('summer solstice')) return <IconSolsticeSummer {...props} />;
    if (lower.includes('solstice')) return <IconSolsticeSummer {...props} />;

    // Equinoxes (Specific first)
    if (lower.includes('vernal equinox') || lower.includes('spring equinox')) return <IconEquinoxVernal {...props} />;
    if (lower.includes('autumnal equinox') || lower.includes('autumn equinox')) return <IconEquinoxAutumnal {...props} />;
    if (lower.includes('equinox')) return <IconEquinox {...props} />;

    // Seasons
    if (lower.includes('winter')) return <IconSeasonWinter {...props} />;
    if (lower.includes('spring')) return <IconSeasonSpring {...props} />;
    if (lower.includes('summer')) return <IconSeasonSummer {...props} />;
    if (lower.includes('autumn')) return <IconSeasonAutumn {...props} />;

    // Eclipses
    if (lower.includes('solar eclipse (partial)')) return <IconSolarEclipsePartial {...props} />;
    if (lower.includes('solar eclipse')) return <IconSolarEclipse {...props} />;
    if (lower.includes('lunar eclipse (partial)')) return <IconLunarEclipsePartial {...props} />;
    if (lower.includes('lunar eclipse')) return <IconLunarEclipse {...props} />;

    if (lower.includes('meteor')) return <IconMeteor {...props} />;
    if (lower === 'sequence') return <IconSequence {...props} />;
    if (lower === 'milestone') return <IconMilestone {...props} />;
    if (lower === 'today') return <IconCalendar {...props} />;

    return null;
};
