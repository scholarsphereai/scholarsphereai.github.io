import { GEMINI_API_KEY, GEMINI_API_URL } from './modules/config.js';

// We'll add JavaScript functionality in later steps
console.log('AI Quiz Generator initialized'); 

// Store quiz data
let currentQuiz = {
    questions: [],
    answers: {}, // Change to object to store answers by question number
    originalText: '', // Store the original text for generating similar quizzes
    flaggedQuestions: new Set() // Store flagged question numbers
};

// DOM Elements
const quizForm = document.getElementById('quizForm');
const textInput = document.getElementById('textInput');
const fileInput = document.getElementById('fileInput');
const questionCount = document.getElementById('questionCount');
const quizSection = document.getElementById('quizSection');
const quizQuestions = document.getElementById('quizQuestions');
const submitQuizBtn = document.getElementById('submitQuiz');
const resultsSection = document.getElementById('resultsSection');
const resultsContainer = document.getElementById('resultsContainer');
const newQuizBtn = document.getElementById('newQuiz');
const difficultyLevel = document.getElementById('difficultyLevel');
const loadingScreen = document.getElementById('loadingScreen');
const themeToggle = document.getElementById('themeToggle');
const questionType = document.getElementById('questionType');
const timerToggle = document.getElementById('timerToggle');
const timerSettings = document.getElementById('timerSettings');
const timerMinutes = document.getElementById('timerMinutes');
const viewMode = document.getElementById('viewMode');
const aboutBtn = document.getElementById('aboutBtn');
const aboutModal = document.getElementById('aboutModal');
const closeBtn = aboutModal.querySelector('.close-btn');
let timerInterval;
let timeLeft;
let currentQuestionIndex = 0;

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
        textInput.value = text;

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

// Add event listener for question type change
questionType.addEventListener('change', function() {
    const mixedInputs = document.getElementById('mixedQuestionInputs');
    const regularCount = document.getElementById('questionCount').parentElement;
    
    if (this.value === 'mixed') {
        mixedInputs.classList.remove('hidden');
        regularCount.classList.add('hidden');
    } else {
        mixedInputs.classList.add('hidden');
        regularCount.classList.remove('hidden');
    }
});

// Add increment/decrement functions for mixed inputs
window.incrementMC = function() {
    const input = document.getElementById('multipleChoiceCount');
    const currentValue = parseInt(input.value) || 0;
    if (currentValue < 20) {
        input.value = currentValue + 1;
    }
};

window.decrementMC = function() {
    const input = document.getElementById('multipleChoiceCount');
    const currentValue = parseInt(input.value) || 0;
    if (currentValue > 1) {
        input.value = currentValue - 1;
    }
};

window.incrementFR = function() {
    const input = document.getElementById('freeResponseCount');
    const currentValue = parseInt(input.value) || 0;
    if (currentValue < 10) {
        input.value = currentValue + 1;
    }
};

window.decrementFR = function() {
    const input = document.getElementById('freeResponseCount');
    const currentValue = parseInt(input.value) || 0;
    if (currentValue > 1) {
        input.value = currentValue - 1;
    }
};

// Update the form submission handler
quizForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const text = textInput.value.trim();
    let mcCount, frCount;
    
    if (questionType.value === 'mixed') {
        mcCount = parseInt(document.getElementById('multipleChoiceCount').value);
        frCount = parseInt(document.getElementById('freeResponseCount').value);
        
        if (isNaN(mcCount) || mcCount < 1 || mcCount > 20 || 
            isNaN(frCount) || frCount < 1 || frCount > 10) {
            showNotification('Please enter valid numbers for both question types', 'error');
        return;
    }
    } else {
        const numQuestions = parseInt(questionCount.value);
    if (isNaN(numQuestions) || numQuestions < 1 || numQuestions > 30) {
        showNotification('Please enter a valid number of questions (1-30)', 'error');
            return;
        }
    }
    
    if (!text) {
        showNotification('Please enter some text or upload a file', 'error');
        return;
    }
    
    try {
        loadingScreen.classList.remove('hidden');
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn) {
            generateBtn.disabled = true;
        }
        
        // Generate the quiz based on question type
        if (questionType.value === 'mixed') {
            await generateMixedQuiz(text, mcCount, frCount);
        } else {
            await generateQuiz(text, parseInt(questionCount.value));
        }
        
        quizForm.classList.add('hidden');
        quizSection.classList.remove('hidden');
        
        if (timerToggle.checked) {
            const duration = parseInt(timerMinutes.value);
            if (duration > 0) {
                startTimer(duration);
            }
        }
    } catch (error) {
        console.error('Quiz generation error:', error);
        showNotification('Error generating quiz: ' + error.message, 'error');
    } finally {
        loadingScreen.classList.add('hidden');
        if (generateBtn) {
            generateBtn.disabled = false;
        }
    }
});

// Update the displayQuestions function
function displayQuestions(questions) {
    currentQuiz.questions = questions;
    currentQuestionIndex = 0;
    
    if (viewMode.value === 'single') {
        displaySingleQuestion();
    } else {
        displayAllQuestions();
    }
}

// Update displaySingleQuestion to include progress dots
function displaySingleQuestion() {
    const question = currentQuiz.questions[currentQuestionIndex];
    const totalQuestions = currentQuiz.questions.length;
    const questionNumber = currentQuestionIndex + 1;
    
    // Create progress dots
    let progressDotsHTML = '<div class="progress-indicator">';
    for (let i = 0; i < totalQuestions; i++) {
        const dotClass = i === currentQuestionIndex ? 'active' : 
                        i < currentQuestionIndex ? 'completed' : '';
        progressDotsHTML += `<div class="progress-dot ${dotClass}"></div>`;
    }
    progressDotsHTML += '</div>';

    quizQuestions.innerHTML = `
        <div class="progress-container">
            <div class="progress-text">
                <span>Question ${questionNumber} of ${totalQuestions}</span>
            </div>
            ${progressDotsHTML}
        </div>
        <div class="question-container">
            ${generateQuestionHTML(question, currentQuestionIndex)}
        </div>
        <div class="question-navigation">
            <button type="button" class="nav-btn" id="prevQuestion" ${currentQuestionIndex === 0 ? 'disabled' : ''}>
                Previous
            </button>
            <button type="button" class="nav-btn" id="reviewQuestions">Review All</button>
            <button type="button" class="nav-btn" id="nextQuestion">
                ${currentQuestionIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next'}
            </button>
        </div>
    `;

    // Add styles for the new elements
    const style = document.createElement('style');
    style.textContent = `
        .progress-container {
            margin: 20px 0;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 8px;
            list-style-type: none;
        }
        .progress-container::before {
            display: none;
        }
        .progress-text {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            color: #333;
            font-weight: 500;
            list-style: none;
        }
        .progress-bar {
            height: 8px;
            background: #e0e0e0;
            border-radius: 4px;
            overflow: hidden;
            list-style: none;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4CAF50, #8BC34A);
            transition: width 0.3s ease;
        }
        .question-container {
            position: relative;
            padding: 1rem;
            background: var(--card-background);
            border-radius: var(--border-radius);
            border: 1px solid var(--border-color);
            margin-bottom: 1rem;
        }
        .question-text {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        .difficulty-badge {
            background-color: var(--primary-color);
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: var(--border-radius);
        }
        .question-type-badge {
            background-color: var(--success-color);
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: var(--border-radius);
        }
        .options {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        .option {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .option label {
            cursor: pointer;
        }
        .option input {
            cursor: pointer;
        }
        .question-navigation {
            display: flex;
            justify-content: space-between;
            gap: 1rem;
            margin-top: 2rem;
            padding: 1rem 0;
        }
        .nav-btn {
            padding: 0.75rem 1.5rem;
            background-color: var(--card-background);
            border: 2px solid var(--primary-color);
            color: var(--primary-color);
            border-radius: var(--border-radius);
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s ease;
            min-width: 140px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        .nav-btn::before,
        .nav-btn::after {
            content: '';
            width: 20px;
            height: 20px;
            background-position: center;
            background-repeat: no-repeat;
            opacity: 0.8;
        }
        #prevQuestion::before {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234B4EFC'%3E%3Cpath d='M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z'/%3E%3C/svg%3E");
        }
        #nextQuestion::after {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234B4EFC'%3E%3Cpath d='M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z'/%3E%3C/svg%3E");
        }
        .nav-btn:hover:not(:disabled) {
            background-color: var(--primary-color);
            color: white;
            transform: translateY(-2px);
            box-shadow: var(--shadow-sm);
        }
        .nav-btn:hover::before,
        .nav-btn:hover::after {
            filter: brightness(0) invert(1);
        }
        .nav-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            border-color: var(--border-color);
            color: var(--text-secondary);
        }
        .nav-btn:disabled::before,
        .nav-btn:disabled::after {
            opacity: 0.3;
        }
        #reviewQuestions {
            background-color: var(--primary-color);
            color: white;
            border: none;
        }
        #reviewQuestions:hover {
            background-color: var(--primary-hover);
            transform: translateY(-2px);
            box-shadow: var(--shadow-sm);
        }
        /* Dark theme support */
        [data-theme="dark"] .nav-btn {
            background-color: var(--card-background);
            color: var(--primary-color);
        }
        [data-theme="dark"] .nav-btn:hover:not(:disabled) {
            background-color: var(--primary-color);
            color: white;
        }
        [data-theme="dark"] .nav-btn:disabled {
            border-color: var(--border-color);
            color: var(--text-secondary);
        }
        [data-theme="dark"] #reviewQuestions {
            background-color: var(--primary-color);
            color: white;
        }
        [data-theme="dark"] #reviewQuestions:hover {
            background-color: var(--primary-hover);
        }
        /* Add a progress indicator */
        .progress-indicator {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin: 1rem 0;
        }
        .progress-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: var(--border-color);
            transition: all 0.2s ease;
        }
        .progress-dot.active {
            background-color: var(--primary-color);
            transform: scale(1.2);
        }
        .progress-dot.completed {
            background-color: var(--success-color);
        }
    `;
    document.head.appendChild(style);

    // Restore previous answer if it exists
    const savedAnswer = currentQuiz.answers[questionNumber];
    if (savedAnswer !== undefined) {
        if (question.type === 'multiple-choice') {
            const radioBtn = document.querySelector(`input[name="question${questionNumber}"][value="${savedAnswer}"]`);
            if (radioBtn) {
                radioBtn.checked = true;
                console.log(`Restored answer for question ${questionNumber}:`, savedAnswer); // Debug log
            }
        } else {
            const textarea = document.querySelector(`#q${questionNumber}response`);
            if (textarea) {
                textarea.value = savedAnswer;
            }
        }
    }

    // Add navigation event listeners
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    const reviewBtn = document.getElementById('reviewQuestions');

    prevBtn?.addEventListener('click', () => {
        saveCurrentAnswer(); // Save current answer before navigating
        currentQuestionIndex--;
        displaySingleQuestion();
    });

    nextBtn?.addEventListener('click', () => {
        saveCurrentAnswer(); // Save current answer before navigating
        if (currentQuestionIndex === totalQuestions - 1) {
            showReviewScreen();
        } else {
            currentQuestionIndex++;
            displaySingleQuestion();
        }
    });

    reviewBtn?.addEventListener('click', () => {
        saveCurrentAnswer(); // Save current answer before showing review
        showReviewScreen();
    });
}

// Add function to toggle flag status
function toggleFlag(questionNumber) {
    // Save the current answer before toggling flag
    saveCurrentAnswer();
    
    if (currentQuiz.flaggedQuestions.has(questionNumber)) {
        currentQuiz.flaggedQuestions.delete(questionNumber);
    } else {
        currentQuiz.flaggedQuestions.add(questionNumber);
    }
    
    // Redisplay the question, which will restore the saved answer
    displaySingleQuestion();
}

// Add function to show review screen
function showReviewScreen() {
    saveCurrentAnswer();
    
    const totalQuestions = currentQuiz.questions.length;
    let reviewHTML = `
        <div class="review-screen">
            <h2>Review Questions</h2>
            <div class="questions-grid">
    `;
    
    for (let i = 0; i < totalQuestions; i++) {
        const questionNum = i + 1;
        const hasAnswer = currentQuiz.answers[questionNum] !== undefined;
        const isFlagged = currentQuiz.flaggedQuestions.has(questionNum);
        
        reviewHTML += `
            <div class="question-box ${isFlagged ? 'flagged' : ''}"
                 onclick="goToQuestion(${i})">
                <div class="question-number">Q${questionNum}</div>
                <div class="question-status">
                    ${isFlagged ? '🚩' : ''}
                </div>
            </div>
        `;
    }
    
    reviewHTML += `
            </div>
            <div class="review-info">
                <p>Click any question to review or modify your answer.</p>
                <p>Click the submit button when you're ready to finish the quiz.</p>
            </div>
        </div>
    `;
    
    quizQuestions.innerHTML = reviewHTML;
    
    // Add styles for review screen
    const style = document.createElement('style');
    style.textContent = `
        .review-screen {
            padding: 20px;
        }
        .questions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .question-box {
            padding: 15px;
            border-radius: 8px;
            background: #f5f5f5;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            border: 2px solid transparent;
        }
        .question-box:hover {
            transform: translateY(-2px);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-color: #2196F3;
        }
        .question-box.flagged {
            border: 2px solid #ff9800;
        }
        .question-number {
            font-weight: bold;
            color: #333;
        }
        .question-status {
            font-size: 0.9em;
            color: #666;
        }
        .review-info {
            margin-top: 20px;
            text-align: center;
            color: #666;
            font-size: 0.9em;
        }
    `;
    document.head.appendChild(style);
}

// Add function to navigate to specific question
function goToQuestion(index) {
    currentQuestionIndex = index;
    displaySingleQuestion();
}

// Make toggleFlag and goToQuestion available globally
window.toggleFlag = toggleFlag;
window.goToQuestion = goToQuestion;

// Update the saveCurrentAnswer function
function saveCurrentAnswer() {
    const questionNumber = currentQuestionIndex + 1;
    const question = currentQuiz.questions[currentQuestionIndex];
    
    if (question.type === 'multiple-choice') {
        const selectedOption = document.querySelector(`input[name="question${questionNumber}"]:checked`);
        if (selectedOption) {
            // Store the value as a string to match correctAnswer type
            currentQuiz.answers[questionNumber] = selectedOption.value;
            console.log(`Saved MC answer for question ${questionNumber}:`, selectedOption.value); // Debug log
        }
    } else if (question.type === 'free-response') {
        const textarea = document.querySelector(`#q${questionNumber}response`);
        if (textarea) {
            currentQuiz.answers[questionNumber] = textarea.value;
        }
    }
}

// Add function to display all questions
function displayAllQuestions() {
    quizQuestions.innerHTML = `
        <div class="all-questions-container">
            ${currentQuiz.questions.map((question, index) => generateQuestionHTML(question, index)).join('')}
        </div>
    `;
}

// Update the generateQuiz function to better handle specific topics
async function generateQuiz(text, numQuestions, isVariation = false) {
    try {
        if (!isVariation) {
            currentQuiz.originalText = text;
        }

        // Adjust temperature based on difficulty level
        const temperature = difficultyLevel.value === 'expert' || difficultyLevel.value === 'hard' ? 0.3 : 0.7;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are a quiz generator AI. Generate ${numQuestions} ${questionType.value} questions about: "${text}".

                        YOU MUST RETURN A JSON OBJECT IN THIS EXACT FORMAT WITH NO ADDITIONAL TEXT:
                        {
                            "questions": [
                                {
                                    "question": "question text",
                                    "type": "${questionType.value}",
                                    "difficulty": "${difficultyLevel.value}",
                                    "subject": "topic area",
                                    ${questionType.value === 'multiple-choice' ? `
                                    "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
                                    "correctAnswer": 0,` : `
                                    "sampleAnswer": "detailed model answer",
                                    "keyPoints": ["point1", "point2", "point3"],`}
                                    "explanation": "explanation text"
                                }
                            ]
                        }

                        Rules:
                        1. Return ONLY the JSON object, no other text
                        2. Each question must have ALL required fields
                        3. Multiple choice questions must have EXACTLY 4 options
                        4. Free response must have sample answer and 3+ key points
                        5. Make questions match ${difficultyLevel.value} difficulty
                        6. Include detailed explanations
                        7. Base all questions on the provided text
                        8. Format must be exact - no extra fields or missing fields`
                    }]
                }],
                generationConfig: {
                    temperature: temperature,
                    maxOutputTokens: 2000,
                    topP: 0.95,
                    topK: 40
                }
            })
        });

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
            throw new Error('Invalid API response structure');
        }

        let responseText = data.candidates[0].content.parts[0].text.trim();
        
        // Try to extract JSON if response contains extra text
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No valid JSON found in response');
        }

        let parsedData;
        try {
            parsedData = JSON.parse(jsonMatch[0]);
            
            if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
                throw new Error('Missing questions array in response');
            }

            // Validate and standardize each question
            parsedData.questions = parsedData.questions.map((q, index) => {
                // Validate required fields
                if (!q.question || !q.type || !q.subject) {
                    throw new Error(`Question ${index + 1} missing required fields`);
                }

                // Validate question type specific fields
                if (q.type === 'multiple-choice') {
                    if (!Array.isArray(q.options) || q.options.length !== 4) {
                        throw new Error(`Question ${index + 1} must have exactly 4 options`);
                    }
                    if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
                        throw new Error(`Question ${index + 1} has invalid correctAnswer`);
                    }
                } else if (q.type === 'free-response') {
                    if (!q.sampleAnswer || !Array.isArray(q.keyPoints) || q.keyPoints.length < 3) {
                        throw new Error(`Question ${index + 1} missing required free-response fields`);
                    }
                }

                // Return standardized question object
                return {
                    ...q,
                    difficulty: difficultyLevel.value,
                    explanation: q.explanation || 'No explanation provided',
                    id: index + 1
                };
            });

            displayQuestions(parsedData.questions);
            return parsedData.questions;

        } catch (parseError) {
            console.error('Response:', responseText);
            console.error('Parse error:', parseError);
            throw new Error(`Failed to parse questions: ${parseError.message}`);
        }

    } catch (error) {
        console.error('Quiz generation error:', error);
        showNotification(`Failed to generate quiz: ${error.message}`, 'error');
        throw error;
    }
}

// Update the displayQuestions function to show subject information
function generateQuestionHTML(question, index) {
    const questionNumber = index + 1;
    const isFlagged = currentQuiz.flaggedQuestions.has(questionNumber);
    const isViewModeSingle = viewMode.value === 'single';
    
    return `
        <div class="question-container">
            ${isViewModeSingle ? `
            <button class="flag-btn ${isFlagged ? 'flagged' : ''}" 
                    onclick="toggleFlag(${questionNumber})" 
                    title="${isFlagged ? 'Unflag Question' : 'Flag Question'}">
                <svg viewBox="0 0 24 24">
                    <path d="${isFlagged ? 
                        'M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z' : 
                        'M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z'}"/>
                </svg>
            </button>
            ` : ''}
            <div class="question-content">
                <div class="question-header">
                    <span class="difficulty-badge ${question.difficulty}">${question.difficulty}</span>
                    <span class="subject-badge">${question.subject}</span>
                </div>
                ${question.type === 'multiple-choice' ? `
                    <div class="question-text">
                        ${question.question}
                    </div>
                    <div class="options">
                        ${question.options.map((option, optionIndex) => `
                            <label class="option" for="q${questionNumber}o${optionIndex}">
                                <input type="radio" 
                                       name="question${questionNumber}" 
                                       value="${optionIndex}"
                                       id="q${questionNumber}o${optionIndex}">
                                <span>${option}</span>
                            </label>
                        `).join('')}
                    </div>
                ` : `
                    <div class="question-text">
                        <span class="question-type-badge">Free Response</span>
                        ${question.question}
                    </div>
                    <div class="free-response">
                        <textarea 
                            class="response-input" 
                            rows="4" 
                            placeholder="Type your answer here..."
                            id="q${questionNumber}response"
                        ></textarea>
                    </div>
                `}
            </div>
        </div>
    `;
}

// Display a single question
function displayQuestion(question) {
    const questionDiv = document.createElement('div');
    questionDiv.className = `question ${question.difficulty}`;
    
    if (question.type === 'multiple-choice') {
        questionDiv.innerHTML = `
            <div class="question-text">
                <span class="question-number">${question.id}</span>
                <div>
                    <span class="difficulty-badge ${question.difficulty}">${question.difficulty}</span>
                    ${question.question}
                </div>
            </div>
            <div class="options">
                ${question.options.map((option, index) => `
                    <label class="option" for="q${question.id}o${index}">
                        <input type="radio" 
                               name="question${question.id}" 
                               value="${index}"
                               id="q${question.id}o${index}">
                        <span>${option}</span>
                    </label>
                `).join('')}
            </div>
        `;
    } else {
        questionDiv.innerHTML = `
            <div class="question-text">
                <span class="question-number">${question.id}</span>
                <div>
                    <span class="difficulty-badge ${question.difficulty}">${question.difficulty}</span>
                    <span class="question-type-badge">Free Response</span>
                    ${question.question}
                </div>
            </div>
            <div class="free-response">
                <textarea 
                    class="response-input" 
                    rows="4" 
                    placeholder="Type your answer here..."
                    id="q${question.id}response"
                ></textarea>
            </div>
        `;
    }
    
    quizQuestions.appendChild(questionDiv);
}

// Update the gradeFreePonseQuestion function to consider difficulty
async function gradeFreePonseQuestion(question, userResponse) {
    try {
        const difficultyWeights = {
            'easy': {
                contentThreshold: 60,
                keyPointsRequired: 0.5, // 50% of key points needed
                clarityEmphasis: 1.2,
                technicalThreshold: 70
            },
            'medium': {
                contentThreshold: 70,
                keyPointsRequired: 0.7, // 70% of key points needed
                clarityEmphasis: 1.0,
                technicalThreshold: 80
            },
            'hard': {
                contentThreshold: 80,
                keyPointsRequired: 0.85, // 85% of key points needed
                clarityEmphasis: 0.8,
                technicalThreshold: 90
            }
        };

        const difficulty = question.difficulty.toLowerCase();
        const weights = difficultyWeights[difficulty] || difficultyWeights.medium;

        const aiGradingResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                        text: `As an expert grader, evaluate this ${difficulty} level free response answer with high precision.

                        Question: "${question.question}"
                        
                        Student's Answer: "${userResponse}"
                        
                        Sample Answer: "${question.sampleAnswer}"
                        
                        Required Key Points: ${JSON.stringify(question.keyPoints)}
                        
                        Difficulty Level: ${difficulty}
                        
                        Grading Criteria (${difficulty} level):
                        1. Content accuracy and completeness (40%)
                           - For ${difficulty} level, minimum content threshold: ${weights.contentThreshold}%
                           - Evaluate depth of understanding appropriate for ${difficulty} level
                        
                        2. Key points coverage (30%)
                           - Required coverage: ${Math.round(weights.keyPointsRequired * 100)}% of key points
                           - Evaluate thoroughness of key concept coverage
                        
                        3. Clarity and organization (20%)
                           - Clarity weight factor: ${weights.clarityEmphasis}
                           - Assess communication effectiveness
                        
                        4. Technical accuracy (10%)
                           - Technical threshold: ${weights.technicalThreshold}%
                           - Evaluate technical precision
                        
                        Provide a detailed evaluation in this exact JSON format:
                        {
                            "score": [number between 0-100],
                            "feedback": [comprehensive feedback considering difficulty level],
                            "strengths": [array of specific strong points],
                            "improvements": [array of specific areas to improve],
                            "keyPointsCovered": [array of key points successfully addressed],
                            "missingPoints": [array of key points not adequately covered],
                            "gradeBreakdown": {
                                "contentScore": [number 0-40],
                                "keyPointsScore": [number 0-30],
                                "clarityScore": [number 0-20],
                                "technicalScore": [number 0-10]
                            },
                            "difficultyAdjustment": {
                                "originalScore": [raw score before difficulty adjustment],
                                "finalScore": [score after difficulty adjustment],
                                "adjustmentFactor": [difficulty adjustment applied]
                            }
                        }`
                    }]
                }]
                    })
                });

        if (!aiGradingResponse.ok) {
            throw new Error('Failed to get AI response');
        }

        const aiResponseData = await aiGradingResponse.json();
        const responseText = aiResponseData.candidates[0].content.parts[0].text;
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) {
            throw new Error('Invalid AI response format');
        }

        const gradingResult = JSON.parse(jsonMatch[0]);

        // Apply difficulty-based adjustments
        gradingResult.score = gradingResult.difficultyAdjustment.finalScore;

        return gradingResult;
    } catch (error) {
        console.error('Error in gradeFreePonseQuestion:', error);
        throw error;
    }
}

// Update the quiz submission handler
submitQuizBtn.addEventListener('click', async () => {
    try {
    // Save the current answer before submitting
    if (viewMode.value === 'single') {
        saveCurrentAnswer();
    } else {
        // Save all answers from the all-questions view
        currentQuiz.questions.forEach((question, index) => {
            const questionNumber = index + 1;
            if (question.type === 'multiple-choice') {
                const selectedOption = document.querySelector(`input[name="question${questionNumber}"]:checked`);
                if (selectedOption) {
                    currentQuiz.answers[questionNumber] = selectedOption.value;
                        console.log(`Saved MC answer from all-questions view for question ${questionNumber}:`, selectedOption.value);
                }
            } else {
                const textarea = document.querySelector(`#q${questionNumber}response`);
                if (textarea) {
                    currentQuiz.answers[questionNumber] = textarea.value;
                }
            }
        });
    }

        const quizSection = document.getElementById('quizSection');
        const resultsSection = document.getElementById('resultsSection');
        const loadingScreen = document.getElementById('loadingScreen');

        if (!quizSection || !resultsSection) {
            throw new Error('Required quiz sections not found');
        }

        loadingScreen.classList.remove('hidden');

        const userAnswers = [];
        let totalPoints = 0;
        let totalPossiblePoints = 0;
        
        // Process each question
        for (let index = 0; index < currentQuiz.questions.length; index++) {
            const question = currentQuiz.questions[index];
            const questionNumber = index + 1;
            
            if (question.type === 'multiple-choice') {
                const userAnswer = currentQuiz.answers[questionNumber];
                console.log(`Checking MC answer for question ${questionNumber}:`, {
                    userAnswer,
                    correctAnswer: question.correctAnswer,
                    storedAnswers: currentQuiz.answers
                });
                
                // Convert both to strings for comparison
                const isCorrect = userAnswer !== undefined && 
                                userAnswer.toString() === question.correctAnswer.toString();
                
                if (isCorrect) {
                    totalPoints += 100;
                }
                totalPossiblePoints += 100;
                
                userAnswers.push({
                    question: question.question,
                    type: 'multiple-choice',
                    userAnswer: userAnswer,
                    correctAnswer: question.correctAnswer,
                    isCorrect: isCorrect,
                    explanation: question.explanation || 'No explanation provided',
                    options: question.options,
                    score: isCorrect ? 100 : 0
                });
            } else if (question.type === 'free-response') {
                const textarea = document.querySelector(`#q${questionNumber}response`);
                const userResponse = textarea ? textarea.value.trim() : '';
                
                try {
                    const gradingResult = await gradeFreePonseQuestion(question, userResponse);
                    
                    totalPoints += gradingResult.score;
                    totalPossiblePoints += 100;

                    userAnswers.push({
                    question: question.question,
                    type: 'free-response',
                    userAnswer: userResponse,
                        sampleAnswer: question.sampleAnswer,
                        keyPoints: question.keyPoints,
                        aiGrading: gradingResult,
                        explanation: question.explanation || 'No explanation provided',
                        score: gradingResult.score
                });
            } catch (error) {
                    console.error('Error grading free response:', error);
                    userAnswers.push({
                    question: question.question,
                    type: 'free-response',
                    userAnswer: userResponse,
                        sampleAnswer: question.sampleAnswer,
                        keyPoints: question.keyPoints,
                        aiGrading: {
                            score: 0,
                            feedback: 'Error grading response: ' + error.message,
                            strengths: [],
                            improvements: ['Unable to grade response'],
                            keyPointsCovered: [],
                            missingPoints: question.keyPoints,
                            gradeBreakdown: {
                                contentScore: 0,
                                keyPointsScore: 0,
                                clarityScore: 0,
                                technicalScore: 0
                            }
                        },
                        explanation: question.explanation || 'No explanation provided',
                        score: 0
                    });
                    totalPossiblePoints += 100;
                }
            }
        }

        // Calculate overall score
        const finalScore = Math.round((totalPoints / totalPossiblePoints) * 100);

        // Display results
        displayResults(userAnswers, finalScore, totalPoints, totalPossiblePoints);
        quizSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');

    } catch (error) {
        console.error('Grading error:', error);
        showNotification('Error grading quiz: ' + error.message, 'error');
    } finally {
        loadingScreen.classList.add('hidden');
    }
});

// Update the displayResults function to show difficulty-adjusted scoring
function displayResults(answers, finalScore, totalPoints, totalPossiblePoints) {
    const resultsContainer = document.getElementById('resultsContainer');
    if (!resultsContainer) {
        console.error('Results container element not found');
        return;
    }

    let resultsHTML = `
        <div class="total-score-container">
            <h2>Quiz Results</h2>
            <div class="score-summary">
                <div class="score-percentage">${finalScore}%</div>
                <div class="score-details">
                    Total Score: ${totalPoints.toFixed(1)} out of ${totalPossiblePoints} points
                </div>
            </div>
        </div>
    `;

    resultsHTML += answers.map((answer, index) => {
        if (answer.type === 'multiple-choice') {
            const userAnswerText = answer.userAnswer !== undefined ? 
                answer.options[parseInt(answer.userAnswer)] : 
                'No answer provided';
            
            return `
                <div class="question-result ${answer.isCorrect ? 'correct' : 'incorrect'}">
            <div class="question-header">
                        <h3>Question ${index + 1} (Multiple Choice)</h3>
                        <span class="score-badge">${answer.score}%</span>
            </div>
            <div class="question-content">
                        <p class="question-text">${answer.question}</p>
                <div class="answer-section">
                            <p class="user-answer ${answer.isCorrect ? 'correct-text' : 'incorrect-text'}">
                                Your answer: ${userAnswerText}
                        </p>
                            ${!answer.isCorrect ? `
                            <p class="correct-answer">
                                    Correct answer: ${answer.options[parseInt(answer.correctAnswer)]}
                            </p>
                        ` : ''}
                </div>
                <div class="explanation">
                            <p><strong>Explanation:</strong> ${answer.explanation}</p>
                </div>
            </div>
        </div>
            `;
        } else {
            const grading = answer.aiGrading;
            return `
                <div class="question-result free-response">
                    <div class="question-header">
                        <h3>Question ${index + 1} (Free Response - ${answer.difficulty})</h3>
                        <span class="score-badge">${grading.score}%</span>
                    </div>
                    <div class="question-content">
                        <p class="question-text">${answer.question}</p>
                        <div class="answer-section">
                            <div class="user-response">
                                <h4>Your Response:</h4>
                                <p>${answer.userAnswer || 'No answer provided'}</p>
                            </div>
                            <div class="grade-breakdown">
                                <h4>Grade Breakdown:</h4>
                                <ul>
                                    <li>Content (40%): ${grading.gradeBreakdown.contentScore}/40</li>
                                    <li>Key Points (30%): ${grading.gradeBreakdown.keyPointsScore}/30</li>
                                    <li>Clarity (20%): ${grading.gradeBreakdown.clarityScore}/20</li>
                                    <li>Technical (10%): ${grading.gradeBreakdown.technicalScore}/10</li>
                                </ul>
                                <div class="difficulty-adjustment">
                                    <p>Original Score: ${grading.difficultyAdjustment.originalScore}%</p>
                                    <p>Difficulty Adjustment: ${(grading.difficultyAdjustment.adjustmentFactor * 100 - 100).toFixed(1)}%</p>
                                    <p>Final Score: ${grading.score}%</p>
                                </div>
                            </div>
                            <div class="ai-feedback">
                                <h4>Feedback:</h4>
                                <p>${grading.feedback}</p>
                            </div>
                            <div class="feedback-details">
                                <div class="strengths">
                                    <h4>Strengths:</h4>
                                    <ul>
                                        ${grading.strengths.map(strength => `<li>${strength}</li>`).join('')}
                                    </ul>
                                </div>
                                <div class="improvements">
                                    <h4>Areas for Improvement:</h4>
                                    <ul>
                                        ${grading.improvements.map(improvement => `<li>${improvement}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                            <div class="key-points-analysis">
                                <h4>Key Points Analysis:</h4>
                                <div class="covered-points">
                                    <h5>Points Covered:</h5>
                                    <ul>
                                        ${grading.keyPointsCovered.map(point => `<li class="covered">${point}</li>`).join('')}
                                    </ul>
                                </div>
                                <div class="missing-points">
                                    <h5>Points Missing:</h5>
                                    <ul>
                                        ${grading.missingPoints.map(point => `<li class="missing">${point}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                            <div class="sample-answer">
                                <h4>Sample Answer:</h4>
                                <p>${answer.sampleAnswer}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }).join('');

    resultsContainer.innerHTML = resultsHTML;
}

// Handle "Generate New Quiz" button
newQuizBtn.addEventListener('click', () => {
    if (timerInterval) {
        clearInterval(timerInterval);
        const timerDisplay = document.querySelector('.timer-display');
        if (timerDisplay) {
            timerDisplay.remove();
        }
    }
    currentQuiz = {
        questions: [],
        answers: {},
        originalText: '',
        flaggedQuestions: new Set()
    };
    quizQuestions.innerHTML = '';
    resultsContainer.innerHTML = '';
    textInput.value = '';
    fileInput.value = '';
    resultsSection.classList.add('hidden');
    quizForm.classList.remove('hidden');
});

// Update the theme toggle function
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Update theme toggle event listener
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// Add timer toggle functionality
timerToggle.addEventListener('change', () => {
    timerSettings.classList.toggle('hidden', !timerToggle.checked);
});

// Function to format time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Function to create timer display
function createTimerDisplay() {
    const timerDisplay = document.createElement('div');
    timerDisplay.className = 'timer-display';
    document.body.appendChild(timerDisplay);
    return timerDisplay;
}

// Function to start timer
function startTimer(duration) {
    const timerDisplay = createTimerDisplay();
    timeLeft = duration * 60; // Convert minutes to seconds
    const fiveMinutes = 5 * 60; // 5 minutes in seconds
    const oneMinute = 60; // 1 minute in seconds
    
    function updateTimer() {
        timerDisplay.textContent = formatTime(timeLeft);
        
        // Add warning classes based on time remaining
        if (timeLeft <= fiveMinutes) {
            timerDisplay.classList.remove('normal');
            timerDisplay.classList.add('warning');
            
            if (timeLeft === fiveMinutes) {
                // Flash 5-minute warning
                showTimerAlert('5 minutes remaining!');
            }
            
            if (timeLeft <= oneMinute) {
                timerDisplay.classList.remove('warning');
                timerDisplay.classList.add('urgent');
                
                if (timeLeft === oneMinute) {
                    // Flash 1-minute warning
                    showTimerAlert('1 minute remaining!');
                }
            }
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showTimerAlert('Time\'s up!');
            submitQuizBtn.click(); // Auto-submit when time is up
            timerDisplay.remove();
        }
        timeLeft--;
    }
    
    updateTimer(); // Initial display
    timerInterval = setInterval(updateTimer, 1000);
}

// Add function to show timer alerts
function showTimerAlert(message) {
    const alert = document.createElement('div');
    alert.className = 'timer-alert';
    alert.textContent = message;
    document.body.appendChild(alert);
    
    // Remove alert after animation
    setTimeout(() => {
        alert.classList.add('fade-out');
        setTimeout(() => alert.remove(), 500);
    }, 2000);
}

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
                background: var(--background-alt);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                animation: slideDown 0.3s ease-out;
                border: 1px solid var(--border-color);
            }

            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
                color: var(--text-primary);
            }

            .notification.warning {
                border-left: 4px solid #ff9800;
            }

            .notification.error {
                border-left: 4px solid var(--incorrect-color);
            }

            .notification.success {
                border-left: 4px solid var(--correct-color);
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
                color: var(--text-primary);
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

            @media (prefers-color-scheme: dark) {
                .notification {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Set initial theme
    setTheme(savedTheme);
    
    // Set initial tab
    const activeTab = document.querySelector('.tab-btn.active');
    if (activeTab) {
        const tabContent = document.getElementById(activeTab.dataset.tab + 'Tab');
        if (tabContent) {
            tabContent.classList.add('active');
        }
    }
    
    // Clear any existing form data
    quizForm.reset();
    if (essayInput) {
        essayInput.value = '';
    }
});

// Add view mode change handler
viewMode.addEventListener('change', () => {
    if (currentQuiz.questions.length > 0) {
        displayQuestions(currentQuiz.questions);
    }
});

// Add modal functionality
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

// Add these functions for number input controls
window.incrementQuestions = function() {
    const input = document.getElementById('questionCount');
    const currentValue = parseInt(input.value) || 0;
    if (currentValue < 30) {
        input.value = currentValue + 1;
    }
};

window.decrementQuestions = function() {
    const input = document.getElementById('questionCount');
    const currentValue = parseInt(input.value) || 0;
    if (currentValue > 1) {
        input.value = currentValue - 1;
    }
};

// Add input validation
document.getElementById('questionCount').addEventListener('input', function(e) {
    let value = parseInt(e.target.value);
    if (value > 30) e.target.value = 30;
    if (value < 1) e.target.value = 1;
});

// Add some CSS to handle the flag button visibility
const style = document.createElement('style');
style.textContent = `
    .flag-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 5px;
        transition: transform 0.2s ease;
    }

    .flag-btn svg {
        width: 24px;
        height: 24px;
        fill: var(--text-secondary);
    }

    .flag-btn.flagged svg {
        fill: #ff9800;
    }

    .flag-btn:hover {
        transform: scale(1.1);
    }

    .question-container {
        position: relative;
    }

    /* Hide flag button in all questions view */
    .all-questions-container .flag-btn {
        display: none;
    }
`;
document.head.appendChild(style);

// Add function to generate mixed quiz
async function generateMixedQuiz(text, mcCount, frCount) {
    try {
        // Generate multiple choice questions first
        const mcQuestions = await generateQuizByType(text, mcCount, 'multiple-choice');
        
        // Then generate free response questions
        const frQuestions = await generateQuizByType(text, frCount, 'free-response');
        
        // Combine questions
        const allQuestions = [...mcQuestions, ...frQuestions];
        
        // Display the combined questions
        displayQuestions(allQuestions);
        return allQuestions;
    } catch (error) {
        console.error('Error generating mixed quiz:', error);
        throw error;
    }
}

// Add function to generate questions by type
async function generateQuizByType(text, numQuestions, type) {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `Generate ${numQuestions} ${type} questions about: "${text}".
                    
                    Return ONLY a JSON object in this EXACT format:
                    {
                        "questions": [
                            {
                                "question": "question text",
                                "type": "${type}",
                                "difficulty": "${difficultyLevel.value}",
                                "subject": "topic area",
                                ${type === 'multiple-choice' ? `
                                "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
                                "correctAnswer": 0,` : `
                                "sampleAnswer": "detailed model answer",
                                "keyPoints": ["point1", "point2", "point3"],`}
                                "explanation": "explanation text"
                            }
                        ]
                    }`
                }]
            }],
            generationConfig: {
                temperature: difficultyLevel.value === 'expert' || difficultyLevel.value === 'hard' ? 0.3 : 0.7,
                maxOutputTokens: 2000,
                topP: 0.95,
                topK: 40
            }
        })
    });

    const data = await response.json();
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid API response structure');
    }

    const responseText = data.candidates[0].content.parts[0].text.trim();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
    }

    const parsedData = JSON.parse(jsonMatch[0]);
    if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
        throw new Error('Missing questions array in response');
    }

    return parsedData.questions;
}