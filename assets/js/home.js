// Check if there's an import statement at the top and update it
import { API_KEY, API_URL, MODEL_ID } from './modules/config.js';

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const aboutBtn = document.getElementById('aboutBtn');
const aboutModal = document.getElementById('aboutModal');
const closeBtn = aboutModal.querySelector('.close-btn');

// Theme Toggle Functionality
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

// Toggle theme when button is clicked
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
});

// About Modal Functionality
aboutBtn.addEventListener('click', () => {
    aboutModal.classList.remove('hidden');
    aboutModal.classList.add('show');
    
    // Focus on close button for accessibility
    setTimeout(() => {
        closeBtn.focus();
    }, 100);
});

closeBtn.addEventListener('click', closeModal);

// Close modal when clicking outside of it
aboutModal.addEventListener('click', (e) => {
    if (e.target === aboutModal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !aboutModal.classList.contains('hidden')) {
        closeModal();
    }
});

function closeModal() {
    aboutModal.classList.remove('show');
    setTimeout(() => {
        aboutModal.classList.add('hidden');
    }, 300);
}

// Initialize accessibility features
function improveAccessibility() {
    // Add ARIA attributes
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    aboutBtn.setAttribute('aria-label', 'About this site');
    closeBtn.setAttribute('aria-label', 'Close modal');
    
    // Add keyboard navigation for modal
    initializeModalKeyboardNav();
}

function initializeModalKeyboardNav() {
    const modalContent = aboutModal.querySelector('.modal-content');
    
    modalContent.addEventListener('keydown', (e) => {
        // Trap focus inside modal when open
        if (e.key === 'Tab') {
            const focusableElements = modalContent.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
}

// Initialize accessibility features
improveAccessibility(); 