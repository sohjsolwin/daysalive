import ReactGA from 'react-ga4';
import { ANALYTICS_CONFIG } from '../config/analyticsConfig';

let isInitialized = false;

export const initGA = () => {
    if (isInitialized) return;

    // Only init if ID is present
    if (ANALYTICS_CONFIG.MEASUREMENT_ID && ANALYTICS_CONFIG.MEASUREMENT_ID.length > 0) {
        ReactGA.initialize(ANALYTICS_CONFIG.MEASUREMENT_ID, ANALYTICS_CONFIG.GA_OPTIONS);
        isInitialized = true;
        console.log("Analytics Initialized (Privacy Mode)");
    } else {
        console.warn("Analytics: No Measurement ID found. Skipping initialization.");
    }
};

export const trackEvent = (category: string, action: string, label?: string) => {
    if (!isInitialized) return;
    ReactGA.event({
        category,
        action,
        label
    });
};

export const trackPageView = (path: string) => {
    if (!isInitialized) return;
    ReactGA.send({ hitType: "pageview", page: path });
};
