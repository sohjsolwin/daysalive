import React from 'react';

export type MilestoneMode = 'none' | '500' | '1000' | 'custom';

export interface Options {
    milestoneMode: MilestoneMode;
    customMilestone: number;
    showPrimes: boolean;
    showSequences: boolean;
    filterHolidays: boolean;
    showSeasonalMarkers: boolean;
    filterBySeason: boolean;
    seasons: {
        Spring: boolean;
        Summer: boolean;
        Autumn: boolean;
        Winter: boolean;
    };
    filterCelestial: boolean;
    showPastDays: boolean;
}

interface OptionsPanelProps {
    options: Options;
    onChange: (options: Options) => void;
}

export const OptionsPanel: React.FC<OptionsPanelProps> = ({ options, onChange }) => {
    const toggleOption = (key: keyof Options) => {
        // @ts-ignore - dynamic key access
        onChange({ ...options, [key]: !options[key] });
    };

    const toggleSeason = (season: keyof Options['seasons']) => {
        onChange({
            ...options,
            seasons: {
                ...options.seasons,
                [season]: !options.seasons[season]
            }
        });
    };

    const setMilestoneMode = (mode: MilestoneMode) => {
        onChange({ ...options, milestoneMode: mode });
    };

    const setCustomMilestone = (val: string) => {
        const num = parseInt(val);
        if (!isNaN(num)) {
            onChange({ ...options, customMilestone: num });
        }
    };

    return (
        <div className="glass-panel">
            <h3 className="results-header" style={{ marginTop: 0 }}>Configuration</h3>

            <div className="space-y-6">
                {/* Primary Selectors */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Primary Selectors</h4>
                    <div className="space-y-3">
                        {/* Milestone Mode */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-300 block" title="Choose how frequently to see milestones">Milestone Interval</label>
                            <div className="flex flex-wrap gap-2">
                                {(['none', '500', '1000', 'custom'] as MilestoneMode[]).map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => setMilestoneMode(mode)}
                                        className={`milestone-btn ${options.milestoneMode === mode ? 'selected' : ''}`}
                                        title={`Show milestones every ${mode} days`}
                                    >
                                        {mode === 'none' ? 'None' : mode === 'custom' ? 'Custom' : mode}
                                    </button>
                                ))}
                            </div>
                            {options.milestoneMode === 'custom' && (
                                <input
                                    type="number"
                                    value={options.customMilestone}
                                    onChange={(e) => setCustomMilestone(e.target.value)}
                                    className="input-field mt-2"
                                    placeholder="Enter days..."
                                    title="Enter a custom day interval (e.g. 333)"
                                />
                            )}
                        </div>

                        <label className="option-item" title="Highlight days that are Prime Numbers">
                            <span className="option-label">Prime Numbers</span>
                            <input
                                type="checkbox"
                                className="toggle-switch"
                                checked={options.showPrimes}
                                onChange={() => toggleOption('showPrimes')}
                            />
                        </label>

                        <label className="option-item" title="Highlight interesting patterns like 12345, 11111, etc.">
                            <span className="option-label">Fun Sequences (12345)</span>
                            <input
                                type="checkbox"
                                className="toggle-switch"
                                checked={options.showSequences}
                                onChange={() => toggleOption('showSequences')}
                            />
                        </label>

                        <label className="option-item" title="Include Solstices, Equinoxes, and Season Start dates in your timeline">
                            <span className="option-label">Seasonal Markers</span>
                            <input
                                type="checkbox"
                                className="toggle-switch"
                                checked={options.showSeasonalMarkers}
                                onChange={() => toggleOption('showSeasonalMarkers')}
                            />
                        </label>
                    </div>
                </div>

                <div className="h-px bg-slate-700/50" />

                {/* Secondary Filters */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Secondary Filters</h4>
                    <div className="options-grid">
                        <label className="option-item" title="Show only dates occurring on holidays">
                            <span className="option-label">Holidays</span>
                            <input
                                type="checkbox"
                                className="toggle-switch"
                                checked={options.filterHolidays}
                                onChange={() => toggleOption('filterHolidays')}
                            />
                        </label>

                        <div className="flex flex-col gap-2">
                            <label className="option-item" title="Show only dates occurring in specific seasons">
                                <span className="option-label">Filter by Season</span>
                                <input
                                    type="checkbox"
                                    className="toggle-switch"
                                    checked={options.filterBySeason}
                                    onChange={() => toggleOption('filterBySeason')}
                                />
                            </label>
                            {options.filterBySeason && (
                                <div className="ml-6 space-y-2 border-l-2 border-slate-700/50 pl-3">
                                    {(['Spring', 'Summer', 'Autumn', 'Winter'] as Array<keyof Options['seasons']>).map(season => (
                                        <label key={season} className="flex items-center justify-between cursor-pointer group" title={`Show dates in ${season}`}>
                                            <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors">{season}</span>
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded bg-slate-800 border-slate-600 text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-900"
                                                checked={options.seasons[season]}
                                                onChange={() => toggleSeason(season)}
                                            />
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <label className="option-item" title="Show only dates coinciding with meteor showers or celestial events">
                            <span className="option-label">Celestial Events</span>
                            <input
                                type="checkbox"
                                className="toggle-switch"
                                checked={options.filterCelestial}
                                onChange={() => toggleOption('filterCelestial')}
                            />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};
