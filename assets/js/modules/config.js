// API configuration
export const GEMINI_API_KEY = 'AIzaSyDt1DYSOVz17eacgowTXL__MOLcpiPGsek';
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';
export const MODEL_ID = 'gemini-2.0-flash';
export const USE_LOCAL_GENERATION = false; // Set to false to use Gemini API

// AP Tests Configuration
export const AP_CONFIG = {
    // Default exam settings
    examDuration: 90 * 60, // 90 minutes in seconds
    questionsPerTest: 45,  // Default number of questions
    
    // API endpoints (you would replace these with your actual endpoints)
    endpoints: {
        questions: '/api/questions',
        results: '/api/results',
    },
    
    // Cache settings
    cacheExpiration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    
    // Feature flags
    features: {
        enableTimer: true,
        enableScoring: true,
        enableReview: true,
        enableProgress: true
    }
};

// Validate API key on load
if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_ACTUAL_GEMINI_API_KEY') {
    console.error('Please set your Gemini API key in config.js');
    USE_LOCAL_GENERATION = true;
}

// Add these exports if they don't exist
export const API_KEY = 'your-api-key';
export const API_URL = 'your-api-url';
export const MODEL_ID = 'your-model-id'; 