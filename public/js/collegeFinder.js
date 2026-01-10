// College Finder JavaScript
class CollegeFinder {
    constructor() {
        this.colleges = [
            // Top 5 NITs
            { name: 'NIT Trichy', fullName: 'National Institute of Technology Tiruchirappalli', city: 'Tiruchirappalli', state: 'Tamil Nadu', type: 'NIT', rank: 1, package: '₹12+ LPA', highlights: ['NIRF Rank 9', 'Top Placements', 'Research Hub'] },
            { name: 'NIT Warangal', fullName: 'National Institute of Technology Warangal', city: 'Warangal', state: 'Telangana', type: 'NIT', rank: 2, package: '₹11+ LPA', highlights: ['NIRF Rank 19', 'Industry Connect', 'Innovation'] },
            { name: 'NIT Surathkal', fullName: 'National Institute of Technology Karnataka', city: 'Mangalore', state: 'Karnataka', type: 'NIT', rank: 3, package: '₹10+ LPA', highlights: ['NIRF Rank 13', 'Coastal Campus', 'Tech Hub'] },
            { name: 'NIT Rourkela', fullName: 'National Institute of Technology Rourkela', city: 'Rourkela', state: 'Odisha', type: 'NIT', rank: 4, package: '₹9+ LPA', highlights: ['NIRF Rank 16', 'Large Campus', 'Diverse'] },
            { name: 'NIT Calicut', fullName: 'National Institute of Technology Calicut', city: 'Kozhikode', state: 'Kerala', type: 'NIT', rank: 5, package: '₹9+ LPA', highlights: ['NIRF Rank 23', 'Beautiful Campus', 'Quality Education'] },

            // Top 5 IITs
            { name: 'IIT Madras', fullName: 'Indian Institute of Technology Madras', city: 'Chennai', state: 'Tamil Nadu', type: 'IIT', rank: 1, package: '₹30+ LPA', highlights: ['NIRF Rank 1', 'Global Recognition', 'Research Leader'] },
            { name: 'IIT Bombay', fullName: 'Indian Institute of Technology Bombay', city: 'Mumbai', state: 'Maharashtra', type: 'IIT', rank: 2, package: '₹28+ LPA', highlights: ['NIRF Rank 3', 'Industry Hub', 'Innovation'] },
            { name: 'IIT Delhi', fullName: 'Indian Institute of Technology Delhi', city: 'New Delhi', state: 'Delhi', type: 'IIT', rank: 3, package: '₹27+ LPA', highlights: ['NIRF Rank 2', 'Capital Advantage', 'Premier'] },
            { name: 'IIT Kanpur', fullName: 'Indian Institute of Technology Kanpur', city: 'Kanpur', state: 'Uttar Pradesh', type: 'IIT', rank: 4, package: '₹26+ LPA', highlights: ['NIRF Rank 4', 'Tech Excellence', 'Alumni Network'] },
            { name: 'IIT Kharagpur', fullName: 'Indian Institute of Technology Kharagpur', city: 'Kharagpur', state: 'West Bengal', type: 'IIT', rank: 5, package: '₹25+ LPA', highlights: ['NIRF Rank 5', 'Oldest IIT', 'Heritage'] },

            // Top 5 IIITs
            { name: 'IIIT Hyderabad', fullName: 'International Institute of Information Technology Hyderabad', city: 'Hyderabad', state: 'Telangana', type: 'IIIT', rank: 1, package: '₹22+ LPA', highlights: ['CS Excellence', 'Research Focus', 'Industry Tie-ups'] },
            { name: 'IIIT Delhi', fullName: 'Indraprastha Institute of Information Technology Delhi', city: 'New Delhi', state: 'Delhi', type: 'IIIT', rank: 2, package: '₹20+ LPA', highlights: ['Modern Campus', 'Innovation Hub', 'Quality Faculty'] },
            { name: 'IIIT Bangalore', fullName: 'International Institute of Information Technology Bangalore', city: 'Bengaluru', state: 'Karnataka', type: 'IIIT', rank: 3, package: '₹19+ LPA', highlights: ['IT Capital', 'Industry Connect', 'Placements'] },
            { name: 'IIIT Allahabad', fullName: 'Indian Institute of Information Technology Allahabad', city: 'Prayagraj', state: 'Uttar Pradesh', type: 'IIIT', rank: 4, package: '₹18+ LPA', highlights: ['Established 1999', 'Government IIIT', 'Quality Program'] },
            { name: 'IIIT Bhubaneswar', fullName: 'International Institute of Information Technology Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', type: 'IIIT', rank: 5, package: '₹17+ LPA', highlights: ['Growing Reputation', 'Modern Infrastructure', 'Tech Focus'] },

            // Top 5 IIMs
            { name: 'IIM Ahmedabad', fullName: 'Indian Institute of Management Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', type: 'IIM', rank: 1, package: '₹35+ LPA', highlights: ['Top MBA', 'Global Ranking', 'Alumni Network'] },
            { name: 'IIM Bangalore', fullName: 'Indian Institute of Management Bangalore', city: 'Bengaluru', state: 'Karnataka', type: 'IIM', rank: 2, package: '₹33+ LPA', highlights: ['IT Hub Location', 'Industry Connect', 'Innovation'] },
            { name: 'IIM Calcutta', fullName: 'Indian Institute of Management Calcutta', city: 'Kolkata', state: 'West Bengal', type: 'IIM', rank: 3, package: '₹32+ LPA', highlights: ['Heritage Campus', 'Academic Excellence', 'Leadership'] },
            { name: 'IIM Lucknow', fullName: 'Indian Institute of Management Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', type: 'IIM', rank: 4, package: '₹30+ LPA', highlights: ['Fast Growing', 'Modern Curriculum', 'Industry Focus'] },
            { name: 'IIM Kozhikode', fullName: 'Indian Institute of Management Kozhikode', city: 'Kozhikode', state: 'Kerala', type: 'IIM', rank: 5, package: '₹28+ LPA', highlights: ['Beautiful Campus', 'Quality Program', 'Coastal Location'] },

            // Top 5 AIIMS
            { name: 'AIIMS Delhi', fullName: 'All India Institute of Medical Sciences New Delhi', city: 'New Delhi', state: 'Delhi', type: 'AIIMS', rank: 1, package: 'Medical Excellence', highlights: ['Premier Medical', 'Research Leader', 'Healthcare Hub'] },
            { name: 'AIIMS Bhopal', fullName: 'All India Institute of Medical Sciences Bhopal', city: 'Bhopal', state: 'Madhya Pradesh', type: 'AIIMS', rank: 2, package: 'Medical Excellence', highlights: ['New AIIMS', 'Modern Facilities', 'Central India'] },
            { name: 'AIIMS Bhubaneswar', fullName: 'All India Institute of Medical Sciences Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', type: 'AIIMS', rank: 3, package: 'Medical Excellence', highlights: ['Eastern India Hub', 'Quality Healthcare', 'Medical Research'] },
            { name: 'AIIMS Jodhpur', fullName: 'All India Institute of Medical Sciences Jodhpur', city: 'Jodhpur', state: 'Rajasthan', type: 'AIIMS', rank: 4, package: 'Medical Excellence', highlights: ['Desert Campus', 'Medical Hub', 'Rajasthan'] },
            { name: 'AIIMS Patna', fullName: 'All India Institute of Medical Sciences Patna', city: 'Patna', state: 'Bihar', type: 'AIIMS', rank: 5, package: 'Medical Excellence', highlights: ['Bihar Medical Hub', 'Quality Education', 'Healthcare'] }
        ];

        this.filteredColleges = [...this.colleges];
        this.currentFilter = 'all';
        
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.renderColleges();
            this.hideLoading();
        });
    }

    setupEventListeners() {
        // Category filters
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const type = card.dataset.type;
                this.filterByType(type);
                this.updateActiveCategory(card);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchColleges(e.target.value);
            });
        }

        // Sort functionality
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortColleges(e.target.value);
            });
        }
    }

    filterByType(type) {
        this.currentFilter = type;
        
        if (type === 'all') {
            this.filteredColleges = [...this.colleges];
        } else {
            this.filteredColleges = this.colleges.filter(college => college.type === type);
        }
        
        this.updateResultsTitle(type);
        this.renderColleges();
    }

    updateActiveCategory(activeCard) {
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('active');
        });
        activeCard.classList.add('active');
    }

    updateResultsTitle(type) {
        const title = document.getElementById('resultsTitle');
        if (title) {
            const typeNames = {
                'all': 'Top Premier Colleges in India',
                'IIT': 'Top 5 Indian Institutes of Technology (IITs)',
                'NIT': 'Top 5 National Institutes of Technology (NITs)',
                'IIIT': 'Top 5 Information Technology Institutes (IIITs)',
                'IIM': 'Top 5 Indian Institutes of Management (IIMs)',
                'AIIMS': 'Top 5 All India Institute of Medical Sciences (AIIMS)'
            };
            title.textContent = `🏫 ${typeNames[type]}`;
        }
    }

    searchColleges(query) {
        const searchTerm = query.toLowerCase().trim();
        
        let baseColleges = this.currentFilter === 'all' 
            ? this.colleges 
            : this.colleges.filter(college => college.type === this.currentFilter);
        
        if (searchTerm === '') {
            this.filteredColleges = baseColleges;
        } else {
            this.filteredColleges = baseColleges.filter(college => 
                college.name.toLowerCase().includes(searchTerm) ||
                college.fullName.toLowerCase().includes(searchTerm) ||
                college.city.toLowerCase().includes(searchTerm) ||
                college.state.toLowerCase().includes(searchTerm) ||
                college.type.toLowerCase().includes(searchTerm)
            );
        }
        
        this.renderColleges();
    }

    sortColleges(sortBy) {
        this.filteredColleges.sort((a, b) => {
            switch (sortBy) {
                case 'rank':
                    return a.rank - b.rank;
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'type':
                    return a.type.localeCompare(b.type);
                case 'state':
                    return a.state.localeCompare(b.state);
                default:
                    return 0;
            }
        });
        
        this.renderColleges();
    }

    renderColleges() {
        const container = document.getElementById('collegesGrid');
        if (!container) return;

        if (this.filteredColleges.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search" style="font-size: 3rem; color: #cbd5e0; margin-bottom: 1rem;"></i>
                    <h3>No colleges found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredColleges.map(college => `
            <div class="college-card" data-type="${college.type}">
                <div class="college-rank">#${college.rank}</div>
                <div class="college-type">${college.type}</div>
                <h3 class="college-name">${college.name}</h3>
                <div class="college-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${college.city}, ${college.state}
                </div>
                <div class="college-package" style="font-weight: 600; color: var(--success-color); margin-bottom: 1rem;">
                    📈 ${college.package}
                </div>
                <div class="college-highlights">
                    ${college.highlights.map(highlight => `
                        <span class="highlight-tag">${highlight}</span>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    hideLoading() {
        const loadingContainer = document.querySelector('.loading-container');
        if (loadingContainer) {
            loadingContainer.style.display = 'none';
        }
    }
}

// Initialize College Finder
const collegeFinder = new CollegeFinder();

// Make it globally available
window.CollegeFinder = CollegeFinder;
