import React from 'react';

interface DateInputProps {
    value: string;
    onChange: (date: string) => void;
    onClear: () => void;
}

export const DateInput: React.FC<DateInputProps> = ({ value, onChange, onClear }) => {
    const [localValue, setLocalValue] = React.useState(value);

    // Sync from prop if it changes externally (e.g. from local storage load or clear)
    React.useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleCommit = () => {
        if (localValue !== value) {
            onChange(localValue);
            // Track calculation event 
            import('../utils/analytics').then(({ trackEvent }) => {
                trackEvent('Engagement', 'Calculate Days', 'Date Input');
            });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCommit();
        }
    };

    return (
        <div className="input-group">
            <div className="flex gap-2">
                <input
                    type="date"
                    id="start-date"
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    onBlur={handleCommit}
                    onKeyDown={handleKeyDown}
                    className="input-field flex-1"
                />
                <button
                    onClick={handleCommit}
                    className="reset-btn"
                    title="Calculate Days Alive"
                    aria-label="Calculate"
                >
                    {/* User icon / Clock icon / Days Alive Icon */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                </button>
                <button
                    onClick={onClear}
                    className="reset-btn"
                    title="Reset to default"
                    aria-label="Reset date"
                >
                    ↺
                </button>
            </div>
        </div>
    );
};
