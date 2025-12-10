import React, { useEffect, useState } from 'react';
import { initGA } from '../utils/analytics';

interface CookieBannerProps {
    onOpenPrivacy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenPrivacy }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('daysa.live.analytics_consent');
        if (consent === null) {
            setIsVisible(true);
        } else if (consent === 'true') {
            initGA();
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('daysa.live.analytics_consent', 'true');
        setIsVisible(false);
        initGA();
    };

    const handleDecline = () => {
        localStorage.setItem('daysa.live.analytics_consent', 'false');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="cookie-banner-floating animate-slideDown">
            <div className="cookie-banner-content">
                <p className="cookie-text">
                    We use anonymous analytics to improve the timeline experience and see which features people love.
                    <button onClick={onOpenPrivacy} className="cookie-link">
                        Privacy Policy
                    </button>
                </p>
                <div className="cookie-buttons">
                    <button
                        onClick={handleDecline}
                        className="cookie-btn decline"
                    >
                        Decline
                    </button>
                    <button
                        onClick={handleAccept}
                        className="cookie-btn accept"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
};
// Force Rebuild
