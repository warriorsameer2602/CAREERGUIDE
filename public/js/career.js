document.addEventListener('DOMContentLoaded', function() {
    initCareerSearch();
    initCareerCards();
    initExpandButtons();
});

function initCareerSearch() {
    const searchInput = document.querySelector('.career-search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                searchCareers(query);
            }
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) {
                    searchCareers(query);
                }
            }
        });
    }
}

function initCareerCards() {
    // Handle subcard clicks for navigation
    const subcards = document.querySelectorAll('.career-subcard');
    
    subcards.forEach(subcard => {
        subcard.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Get the URL from onclick attribute
            const onclickValue = this.getAttribute('onclick');
            if (onclickValue) {
                const urlMatch = onclickValue.match(/window\.location\.href\s*=\s*['"]([^'"]+)['"]/);
                if (urlMatch) {
                    const url = urlMatch[1];
                    console.log('Navigating to:', url); // Debug log
                    window.location.href = url;
                }
            }
        });
    });
}

function initExpandButtons() {
    const expandBtns = document.querySelectorAll('.expand-btn');
    
    expandBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const card = btn.closest('.career-main-card');
            card.classList.toggle('expanded');
            
            const icon = btn.querySelector('i');
            if (icon) {
                if (card.classList.contains('expanded')) {
                    icon.style.transform = 'rotate(180deg)';
                } else {
                    icon.style.transform = 'rotate(0deg)';
                }
            }
        });
    });
}

function searchCareers(query) {
    console.log('Searching careers for:', query);
    const cards = document.querySelectorAll('.career-main-card');
    const searchTerms = query.toLowerCase();
    
    cards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const description = card.querySelector('.card-description').textContent.toLowerCase();
        const subcards = card.querySelectorAll('.career-subcard h4');
        
        let hasMatch = title.includes(searchTerms) || description.includes(searchTerms);
        
        subcards.forEach(subcard => {
            if (subcard.textContent.toLowerCase().includes(searchTerms)) {
                hasMatch = true;
            }
        });
        
        if (hasMatch) {
            card.style.display = 'block';
            card.classList.add('expanded');
        } else {
            card.style.display = 'none';
        }
    });
}
