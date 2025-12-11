import React from 'react';

interface MobileCardProps {
    dayCount: number;
    season: string;
    date: string; // YYYY-MM-DD
    tags: string[];
    isToday?: boolean;
    onClick: () => void;
}

export const MobileCard: React.FC<MobileCardProps> = ({
    dayCount,
    season,
    date,
    isToday,
    onClick
}) => {

    // Config for Season Colors
    const getSeasonConfig = (s: string) => {
        switch (s) {
            case 'Spring': return { color: '#34d399' }; // Emerald
            case 'Summer': return { color: '#fbbf24' }; // Amber
            case 'Autumn': return { color: '#fb923c' }; // Orange
            case 'Winter': return { color: '#22d3ee' }; // Cyan
            default: return { color: '#94a3b8' };
        }
    };

    const { color } = getSeasonConfig(season);

    // Render SVG Icon
    const renderIcon = () => {
        const props = { width: 32, height: 32, stroke: color, strokeWidth: 2, fill: "none", viewBox: "0 0 24 24" };
        switch (season) {
            case 'Spring':
                return <svg {...props}><path d="M12 2.5a4.5 4.5 0 0 1 4.5 4.5c0 2.485-2.015 4.5-4.5 4.5S7.5 9.485 7.5 7 9.515 2.5 12 2.5z" /><path d="M12 21.5v-10" /><path d="M12 16.5c-2.5 0-4.5-2-4.5-4.5" /></svg>;
            case 'Summer':
                return <svg {...props}><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>;
            case 'Autumn':
                // Teardrop Leaf (Simpler, less like fire)
                return <svg {...props}><path d="M12 21c-5 0-9-5-9-11S7 2 12 2s9 6 9 11-4 11-9 11z" /><path d="M12 21v-8" /></svg>;
            case 'Winter':
                return <svg {...props}><path d="M2 12h20M12 2v20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" /></svg>;
            default: return <span style={{ fontSize: '1.5rem', color }}>📅</span>;
        }
    };

    return (
        <button className={`mobile-mini-card ${isToday ? 'today' : ''}`} onClick={onClick}>
            <div className="mobile-mini-card-season" style={{ color }}>
                {renderIcon()}
            </div>
            <div className="mobile-mini-card-number" style={{ marginBottom: '0.5rem' }}>{dayCount.toLocaleString()}</div>
            <div className="mobile-mini-card-date" style={{ fontWeight: 600, fontSize: '0.75rem', opacity: 0.8 }}>{date}</div>
        </button>
    );
};
