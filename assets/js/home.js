// Remove the entire file content and replace with this minimal version
document.addEventListener('DOMContentLoaded', () => {
    // Initialize preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.display = 'none';
        });
    }

    // Modal functionality
    const aboutBtn = document.getElementById('aboutBtn');
    const aboutModal = document.getElementById('aboutModal');
    const closeBtn = aboutModal.querySelector('.close-btn');

    function showModal() {
        aboutModal.style.display = 'flex';
        aboutModal.classList.remove('hidden');
    }

    function hideModal() {
        aboutModal.classList.add('hidden');
        setTimeout(() => {
            aboutModal.style.display = 'none';
        }, 300);
    }

    // Event Listeners
    aboutBtn.addEventListener('click', showModal);
    
    closeBtn.addEventListener('click', hideModal);

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === aboutModal) {
            hideModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !aboutModal.classList.contains('hidden')) {
            hideModal();
        }
    });
}); 