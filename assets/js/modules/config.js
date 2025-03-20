// Gemini API configuration
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = 'AIzaSyDt1DYSOVz17eacgowTXL__MOLcpiPGsek';
const MODEL_ID = 'gemini-2.0-flash';
const USE_LOCAL_GENERATION = false; // Set to false to use Gemini API

// Validate API key on load
if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_ACTUAL_GEMINI_API_KEY') {
    console.error('Please set your Gemini API key in config.js');
    USE_LOCAL_GENERATION = true;
}

export { 
    GEMINI_API_KEY,
    GEMINI_API_URL,
    MODEL_ID,
    USE_LOCAL_GENERATION
}; 