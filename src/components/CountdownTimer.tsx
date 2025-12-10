import React, { useState, useEffect } from 'react';
import { differenceInSeconds } from 'date-fns';

interface CountdownTimerProps {
    targetDate: Date;
    milestoneName: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, milestoneName }) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const diff = differenceInSeconds(targetDate, now);
            setTimeLeft(diff > 0 ? diff : 0);
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const days = Math.floor(timeLeft / (3600 * 24));

    if (timeLeft <= 0) return null;

    return (
        <div className="glass-panel p-0 mb-6 border-l-4 border-l-emerald-400 overflow-hidden">
            <div className="flex flex-col md:flex-row h-full">
                {/* Left Side: Milestone Info */}
                <div className="flex-1 p-6 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-700/50">
                    <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">Next Milestone</div>
                    <div className="text-4xl font-bold text-white mb-2">{milestoneName}</div>
                    <div className="text-emerald-400 text-lg font-medium">
                        {targetDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                {/* Right Side: Days Remaining */}
                <div className="flex-1 p-6 flex flex-col justify-center items-center bg-slate-800/30">
                    <div className="text-7xl font-bold text-white tracking-tighter leading-none" style={{ textShadow: '0 0 30px rgba(56, 189, 248, 0.3)' }}>
                        {days}
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-widest mt-2">Days Remaining</div>
                </div>
            </div>
        </div>
    );
};
