export const ANALYTICS_CONFIG = {
    // defaults to empty if not set, preventing GA init
    MEASUREMENT_ID: import.meta.env.VITE_GA_MEASUREMENT_ID || "", 
    GA_OPTIONS: {
        gtagOptions: {
            anonymize_ip: true,
            allow_google_signals: false, // Privacy: Disable Ad Features
            allow_ad_personalization_signals: false, // Privacy: Disable Personalization
            restricted_data_processing: true // Privacy: CCPA
        }
    }
};
