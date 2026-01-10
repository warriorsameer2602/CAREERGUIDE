// Timeline Interactive Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeTimeline();
});

class TimelineManager {
    constructor() {
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.filters = { category: 'all', search: '' };
        this.notifications = {
            email: true,
            push: false,
            sms: false,
            timing: [30, 15, 7, 1]
        };
        
        this.bindEvents();
        this.loadTimelineData();
        this.setupNotifications();
    }
    
    bindEvents() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilterChange(e.target.dataset.filter);
            });
        });
        
        // Search functionality
        const searchInput = document.getElementById('timelineSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
        
        // Timeline navigation
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.navigateMonth(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => this.navigateMonth(1));
        
        // Video modal events
        document.querySelectorAll('.btn-video').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const videoId = e.target.closest('.btn-video').dataset.video;
                this.openVideoModal(videoId);
            });
        });
        
        // Close modal
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeVideoModal());
        }
        
        // Notification panel
        const notificationToggle = document.getElementById('notificationToggle');
        if (notificationToggle) {
            notificationToggle.addEventListener('click', () => this.toggleNotificationPanel());
        }
        
        // Save notifications
        const saveNotifications = document.getElementById('saveNotifications');
        if (saveNotifications) {
            saveNotifications.addEventListener('click', () => this.saveNotificationSettings());
        }
        
        // Cancel notifications
        const cancelNotifications = document.getElementById('cancelNotifications');
        if (cancelNotifications) {
            cancelNotifications.addEventListener('click', () => this.toggleNotificationPanel());
        }
        
        // Reminder buttons
        document.querySelectorAll('.btn-reminder').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const eventId = e.target.closest('.btn-reminder').dataset.event;
                this.setReminder(eventId);
            });
        });
        
        // Details buttons
        document.querySelectorAll('.btn-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const eventId = e.target.closest('.btn-details').dataset.event;
                this.showEventDetails(eventId);
            });
        });
    }
    
    handleFilterChange(category) {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${category}"]`).classList.add('active');
        
        this.filters.category = category;
        this.filterEvents();
    }
    
    handleSearch(query) {
        this.filters.search = query.toLowerCase();
        this.filterEvents();
    }
    
    filterEvents() {
        const events = document.querySelectorAll('.timeline-event');
        
        events.forEach(event => {
            const category = this.filters.category;
            const searchQuery = this.filters.search;
            
            let showEvent = true;
            
            // Category filter
            if (category !== 'all') {
                showEvent = event.classList.contains(category);
            }
            
            // Search filter
            if (searchQuery && showEvent) {
                const eventText = event.textContent.toLowerCase();
                showEvent = eventText.includes(searchQuery);
            }
            
            // Show/hide event with animation
            if (showEvent) {
                event.style.display = 'flex';
                event.classList.add('animate-slide-up');
            } else {
                event.style.display = 'none';
                event.classList.remove('animate-slide-up');
            }
        });
        
        // Update event counts
        this.updateEventCounts();
    }
    
    updateEventCounts() {
        document.querySelectorAll('.timeline-month').forEach(month => {
            const visibleEvents = month.querySelectorAll('.timeline-event[style*="flex"], .timeline-event:not([style])');
            const countElement = month.querySelector('.event-count');
            if (countElement) {
                countElement.textContent = `${visibleEvents.length} Important Events`;
            }
        });
    }
    
    navigateMonth(direction) {
        this.currentMonth += direction;
        
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        
        this.updateCurrentPeriod();
        this.loadTimelineData();
    }
    
    updateCurrentPeriod() {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        const currentPeriod = document.getElementById('currentPeriod');
        if (currentPeriod) {
            currentPeriod.textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;
        }
    }
    
    loadTimelineData() {
        // In a real application, this would fetch data from your server
        // For now, we'll show/hide existing months based on current period
        
        const allMonths = document.querySelectorAll('.timeline-month');
        const currentMonthKey = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}`;
        
        allMonths.forEach(month => {
            const monthData = month.dataset.month;
            if (monthData === currentMonthKey) {
                month.style.display = 'block';
                month.classList.add('animate-fade-in');
            } else {
                month.style.display = 'none';
            }
        });
    }
    
    openVideoModal(videoId) {
        const modal = document.getElementById('videoModal');
        const container = document.getElementById('videoContainer');
        const title = document.getElementById('modalTitle');
        
        // Video data mapping
        const videos = {
            'nsp-guide': {
                title: 'National Scholarship Portal - Complete Guide',
                videoId: 'dQw4w9WgXcQ' // Replace with actual video ID
            },
            'women-pilots': {
                title: 'Women Fighter Pilots - Breaking Barriers',
                videoId: 'dQw4w9WgXcQ' // Replace with actual video ID
            },
            'cat-preparation': {
                title: 'CAT 2025 Preparation Strategy',
                videoId: 'dQw4w9WgXcQ' // Replace with actual video ID
            }
        };
        
        const videoData = videos[videoId];
        if (videoData) {
            title.textContent = videoData.title;
            
            // Create responsive YouTube embed
            container.innerHTML = `
                <iframe 
                    src="https://www.youtube.com/embed/${videoData.videoId}?autoplay=1&rel=0"
                    title="${videoData.title}"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                </iframe>
            `;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeVideoModal() {
        const modal = document.getElementById('videoModal');
        const container = document.getElementById('videoContainer');
        
        modal.classList.remove('active');
        container.innerHTML = '';
        document.body.style.overflow = 'auto';
    }
    
    toggleNotificationPanel() {
        const panel = document.getElementById('notificationPanel');
        panel.classList.toggle('active');
    }
    
    saveNotificationSettings() {
        // Get notification preferences
        const emailNotifications = document.getElementById('emailNotifications').checked;
        const pushNotifications = document.getElementById('pushNotifications').checked;
        const smsNotifications = document.getElementById('smsNotifications').checked;
        
        this.notifications = {
            email: emailNotifications,
            push: pushNotifications,
            sms: smsNotifications,
            timing: this.notifications.timing
        };
        
        // Save to localStorage or send to server
        localStorage.setItem('timelineNotifications', JSON.stringify(this.notifications));
        
        // Request push notification permission if enabled
        if (pushNotifications && 'Notification' in window) {
            Notification.requestPermission();
        }
        
        this.showNotification('Notification preferences saved successfully!', 'success');
        this.toggleNotificationPanel();
    }
    
    setReminder(eventId) {
        // Add reminder logic here
        console.log('Setting reminder for event:', eventId);
        
        // For demonstration, we'll show a success message
        this.showNotification('Reminder set successfully! You\'ll be notified before the deadline.', 'success');
        
        // In a real app, you would:
        // 1. Send reminder data to server
        // 2. Schedule local notifications
        // 3. Update UI to show reminder is set
    }
    
    showEventDetails(eventId) {
        // Show detailed information about the event
        const eventDetails = {
            'ignou-details': {
                title: 'IGNOU Admission Details',
                content: `
                    <h4>Indira Gandhi National Open University</h4>
                    <p><strong>Courses Available:</strong></p>
                    <ul>
                        <li>Bachelor's Programs: BBA, B.Com, BA, B.Sc, etc.</li>
                        <li>Master's Programs: MBA, MCA, MA, M.Sc, etc.</li>
                        <li>Diploma & Certificate Courses</li>
                    </ul>
                    <p><strong>Key Features:</strong></p>
                    <ul>
                        <li>Distance Learning Mode</li>
                        <li>Affordable Fee Structure</li>
                        <li>Flexible Study Schedule</li>
                        <li>Recognized by UGC</li>
                    </ul>
                    <p><strong>Application Fee:</strong> ₹200 - ₹500 depending on course</p>
                    <p><strong>Documents Required:</strong></p>
                    <ul>
                        <li>10th & 12th Mark Sheets</li>
                        <li>Graduation Certificate (for PG courses)</li>
                        <li>Identity Proof</li>
                        <li>Recent Photographs</li>
                    </ul>
                `
            }
        };
        
        const details = eventDetails[eventId];
        if (details) {
            // Create and show details modal
            this.showDetailsModal(details);
        }
    }
    
    showDetailsModal(details) {
        // Create modal HTML
        const modalHTML = `
            <div class="details-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4>${details.title}</h4>
                        <button class="close-btn" onclick="this.closest('.details-modal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${details.content}
                    </div>
                </div>
            </div>
        `;
        
        // Add to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.body.style.overflow = 'hidden';
        
        // Auto-remove on backdrop click
        const modal = document.querySelector('.details-modal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    setupNotifications() {
        // Load saved notification preferences
        const saved = localStorage.getItem('timelineNotifications');
        if (saved) {
            this.notifications = JSON.parse(saved);
            this.updateNotificationUI();
        }
        
        // Setup service worker for push notifications
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            this.registerServiceWorker();
        }
    }
    
    updateNotificationUI() {
        document.getElementById('emailNotifications').checked = this.notifications.email;
        document.getElementById('pushNotifications').checked = this.notifications.push;
        document.getElementById('smsNotifications').checked = this.notifications.sms;
    }
    
    registerServiceWorker() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `toast-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles for toast notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#6366f1'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize timeline when DOM is loaded
function initializeTimeline() {
    const timeline = new TimelineManager();
    
    // Add animation to timeline events on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-up');
            }
        });
    }, observerOptions);
    
    // Observe all timeline events
    document.querySelectorAll('.timeline-event').forEach(event => {
        observer.observe(event);
    });
}

// Add CSS animations for toast notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .toast-notification {
        transform: translateX(0);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .details-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.3s ease;
    }
    
    .details-modal .modal-content {
        background: white;
        border-radius: 15px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        margin: 1rem;
    }
    
    .details-modal .modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .details-modal .modal-body {
        padding: 1.5rem;
    }
    
    .details-modal .modal-body ul {
        margin: 0.5rem 0;
        padding-left: 1.5rem;
    }
    
    .details-modal .modal-body li {
        margin: 0.25rem 0;
    }
`;
document.head.appendChild(style);
