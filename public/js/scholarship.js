document.addEventListener('DOMContentLoaded', function() {
    initScholarshipTabs();
    initScholarshipSearch();
    initApplicationTracker();
});

function initScholarshipTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const scholarshipCards = document.querySelectorAll('.scholarship-card');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-category');
            filterScholarships(category, scholarshipCards);
        });
    });
}

function initScholarshipSearch() {
    const searchInput = document.querySelector('.scholarship-search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            searchScholarships(query);
        }
    });
}

function initApplicationTracker() {
    const trackerTabs = document.querySelectorAll('.tracker-tab');
    
    trackerTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            trackerTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const status = tab.getAttribute('data-status');
            loadApplications(status);
        });
    });
    
    // Initialize apply buttons
    const applyBtns = document.querySelectorAll('.apply-btn');
    applyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.scholarship-card');
            const title = card.querySelector('h3').textContent;
            applyForScholarship(title);
        });
    });
}

function filterScholarships(category, cards) {
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function searchScholarships(query) {
    console.log('Searching scholarships for:', query);
    // Implement search
}

function loadApplications(status) {
    console.log('Loading applications with status:', status);
    // Implement application loading
}

function applyForScholarship(title) {
    console.log('Applying for scholarship:', title);
    // Show application modal or redirect
}
