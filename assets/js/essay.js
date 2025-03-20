import { API_KEY, API_URL, MODEL_ID } from './modules/config.js';

console.log('Essay Grader initialized');

// Store essay data
let currentEssay = {
    text: '',
    type: '',
    gradeLevel: '',
    rubric: '',
    useCustomRubric: false,
    feedback: null
};

// DOM Elements
const essayForm = document.getElementById('essayForm');
const essayInput = document.getElementById('essayInput');
const fileInput = document.getElementById('fileInput');
const gradeLevel = document.getElementById('gradeLevel');
const essayType = document.getElementById('essayType');
const rubricToggle = document.getElementById('rubricToggle');
const rubricContainer = document.getElementById('rubricContainer');
const rubricText = document.getElementById('rubricText');
const loadingScreen = document.getElementById('loadingScreen');
const resultsSection = document.getElementById('resultsSection');
const feedbackContainer = document.getElementById('feedbackContainer');
const newEssayBtn = document.getElementById('newEssay');
const themeToggle = document.getElementById('themeToggle');
const aboutBtn = document.getElementById('aboutBtn');
const aboutModal = document.getElementById('aboutModal');
const closeBtn = aboutModal.querySelector('.close-btn');

// Handle file input
fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
        const formGroup = fileInput.closest('.form-group');
        formGroup.classList.add('loading');

        let text;
        if (file.type === 'application/pdf') {
            text = await extractTextFromPDF(file);
        } else {
            text = await file.text();
        }
        essayInput.value = text;

        const fileName = file.name || 'No file chosen';
        e.target.parentElement.querySelector('.file-name').textContent = fileName;

        formGroup.classList.remove('loading');
    } catch (error) {
        console.error('Error reading file:', error);
        showNotification('Error reading file: ' + error.message, 'error');
        fileInput.value = ''; // Clear the file input
        formGroup.classList.remove('loading');
    }
});

// Add function to extract text from PDF
async function extractTextFromPDF(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        
        // Use the global pdfjsLib variable
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        
        let fullText = '';
        
        // Extract text from each page
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }
        
        return fullText.trim();
    } catch (error) {
        console.error('Error extracting PDF text:', error);
        throw new Error('Could not read PDF file. Please make sure it\'s a valid PDF document.');
    }
}

// Update the form submission handler
essayForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const text = essayInput.value.trim();
    const essayGradeLevel = gradeLevel.value;
    const essayTypeValue = essayType.value;
    const useCustomRubric = rubricToggle.checked;
    const customRubric = rubricText.value.trim();
    
    if (!text) {
        showNotification('Please enter your essay or upload a file', 'error');
        return;
    }
    
    // Store essay settings
    currentEssay = {
        text,
        type: essayTypeValue,
        gradeLevel: essayGradeLevel,
        rubric: customRubric,
        useCustomRubric
    };
    
    try {
        // Show loading screen
        loadingScreen.classList.remove('hidden');
        const gradeBtn = document.getElementById('gradeBtn');
        if (gradeBtn) {
            gradeBtn.disabled = true;
        }
        
        // Grade the essay
        await gradeEssay();
        
        // Hide form and show results
        essayForm.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        
    } catch (error) {
        console.error('Essay grading error:', error);
        showNotification('Error grading essay: ' + error.message, 'error');
    } finally {
        // Hide loading screen and re-enable button
        loadingScreen.classList.add('hidden');
        const gradeBtn = document.getElementById('gradeBtn');
        if (gradeBtn) {
            gradeBtn.disabled = false;
        }
    }
});

// Grade essay using AI
async function gradeEssay() {
    try {
        // Create the prompt for the API
        let prompt = `Grade the following ${currentEssay.gradeLevel} level ${currentEssay.type} essay. 
        Provide a letter grade (A+, A, A-, B+, etc.) and detailed feedback on:
        1. Structure and organization
        2. Writing style and clarity
        3. Argument quality and evidence (if applicable)
        4. Grammar and mechanics
        5. Overall strengths and areas for improvement
        
        ESSAY:
        "${currentEssay.text}"
        `;

        if (currentEssay.useCustomRubric && currentEssay.rubric) {
            prompt += `
            
            Use the following custom rubric for grading:
            ${currentEssay.rubric}
            `;
        }

        prompt += `
        
        Format your response as JSON with the following structure:
        {
            "grade": "Letter grade",
            "overallFeedback": "General comments about the essay",
            "categories": [
                {
                    "name": "Structure and Organization",
                    "score": "Score out of 10",
                    "feedback": "Detailed feedback"
                },
                {
                    "name": "Content and Development",
                    "score": "Score out of 10",
                    "feedback": "Detailed feedback"
                },
                {
                    "name": "Language and Style",
                    "score": "Score out of 10",
                    "feedback": "Detailed feedback"
                },
                {
                    "name": "Grammar and Mechanics",
                    "score": "Score out of 10",
                    "feedback": "Detailed feedback"
                }
            ],
            "strengths": ["Strength 1", "Strength 2", "Strength 3"],
            "improvements": ["Area for improvement 1", "Area for improvement 2", "Area for improvement 3"]
        }`;

        // Create the URL with API key as a parameter
        const apiUrlWithKey = `${API_URL}?key=${API_KEY}`;

        const response = await fetch(apiUrlWithKey, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.4,
                    maxOutputTokens: 2048,
                    topP: 0.95
                }
            })
        });

        if (!response.ok) {
            let errorMessage = 'Failed to connect to AI service';
            try {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                errorMessage = errorData.error?.message || errorMessage;
            } catch (e) {
                console.error('Error parsing error response:', e);
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0].text) {
            console.error('Invalid API response:', data);
            throw new Error('Invalid response format from AI service');
        }

        const content = data.candidates[0].content.parts[0].text;
        let parsedData;
        
        try {
            // Try parsing the content directly first
            parsedData = JSON.parse(content);
        } catch (e) {
            // If direct parsing fails, try to find JSON in the text
            const match = content.match(/\{[\s\S]*\}/);
            if (!match) {
                throw new Error('Invalid response format received');
            }
            
            try {
                parsedData = JSON.parse(match[0]);
            } catch (e2) {
                console.error('Failed to parse JSON from response:', content);
                throw new Error('Could not parse valid response from AI service');
            }
        }
        
        // Store the feedback
        currentEssay.feedback = parsedData;
        
        // Display the feedback
        displayFeedback(parsedData);
        
        return parsedData;
    } catch (error) {
        console.error('Error in gradeEssay:', error);
        throw new Error(`Failed to grade essay: ${error.message}`);
    }
}

// Display feedback
function displayFeedback(feedback) {
    // Update the grade display
    document.querySelector('.grade-display').textContent = feedback.grade || 'N/A';
    
    // Create feedback HTML
    let feedbackHTML = `
        <div class="overall-feedback">
            <h3>Overall Assessment</h3>
            <p>${feedback.overallFeedback}</p>
        </div>
        
        <div class="category-feedback">
            <h3>Detailed Evaluation</h3>
    `;
    
    // Add category feedback
    if (feedback.categories && Array.isArray(feedback.categories)) {
        feedback.categories.forEach(category => {
            feedbackHTML += `
                <div class="feedback-category">
                    <h4>${category.name} <span class="category-score">${category.score}/10</span></h4>
                    <p>${category.feedback}</p>
                </div>
            `;
        });
    }
    
    // Add strengths and areas for improvement
    feedbackHTML += `
        <div class="strengths-improvements">
            <div class="strengths">
                <h3>Strengths</h3>
                <ul>
    `;
    
    if (feedback.strengths && Array.isArray(feedback.strengths)) {
        feedback.strengths.forEach(strength => {
            feedbackHTML += `<li>${strength}</li>`;
        });
    }
    
    feedbackHTML += `
                </ul>
            </div>
            <div class="improvements">
                <h3>Areas for Improvement</h3>
                <ul>
    `;
    
    if (feedback.improvements && Array.isArray(feedback.improvements)) {
        feedback.improvements.forEach(improvement => {
            feedbackHTML += `<li>${improvement}</li>`;
        });
    }
    
    feedbackHTML += `
                </ul>
            </div>
        </div>
    `;
    
    // Insert the feedback HTML
    feedbackContainer.innerHTML = feedbackHTML;
}

// Handle "Grade New Essay" button
newEssayBtn.addEventListener('click', () => {
    currentEssay = {
        text: '',
        type: '',
        gradeLevel: '',
        rubric: '',
        useCustomRubric: false,
        feedback: null
    };
    essayInput.value = '';
    fileInput.value = '';
    resultsSection.classList.add('hidden');
    essayForm.classList.remove('hidden');
    document.querySelector('.file-name').textContent = 'No file chosen';
});

// Update the theme toggle function
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Check for saved theme preference or set dark as default
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme);
} else {
    // Set dark theme as default
    setTheme('dark');
}

// Update theme toggle event listener
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
});

// Add rubric toggle functionality
rubricToggle.addEventListener('change', () => {
    rubricContainer.classList.toggle('hidden', !rubricToggle.checked);
});

// Create a custom popup notification system
function showNotification(message, type = 'warning') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">×</button>
        </div>
    `;

    document.body.appendChild(notification);

    // Add the styles if they don't exist
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 10000;
                padding: 16px 24px;
                border-radius: 8px;
                background: var(--card-background);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                animation: slideDown 0.3s ease-out;
                border: 1px solid var(--border-color);
            }

            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
                color: var(--text-color);
            }

            .notification.warning {
                border-left: 4px solid #ff9800;
            }

            .notification.error {
                border-left: 4px solid var(--danger-color);
            }

            .notification.success {
                border-left: 4px solid var(--success-color);
            }

            .notification-message {
                font-size: 14px;
                font-weight: 500;
            }

            .notification-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                margin-left: 12px;
            }

            .notification-close:hover {
                color: var(--text-color);
            }

            @keyframes slideDown {
                from {
                    transform: translate(-50%, -100%);
                    opacity: 0;
                }
                to {
                    transform: translate(-50%, 0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Add close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.remove();
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Modal functionality
aboutBtn.addEventListener('click', () => {
    aboutModal.classList.remove('hidden');
    setTimeout(() => aboutModal.classList.add('show'), 10);
});

closeBtn.addEventListener('click', closeModal);

aboutModal.addEventListener('click', (e) => {
    if (e.target === aboutModal) {
        closeModal();
    }
});

function closeModal() {
    aboutModal.classList.remove('show');
    setTimeout(() => aboutModal.classList.add('hidden'), 300);
}

// Add escape key handler
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !aboutModal.classList.contains('hidden')) {
        closeModal();
    }
});

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Set initial theme
    if (savedTheme) {
        setTheme(savedTheme);
    }
    
    // Clear any existing form data
    essayForm.reset();
}); 