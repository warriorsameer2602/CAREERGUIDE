class CareerQuiz {
    constructor() {
        this.questions = [];
        this.currentIndex = 0;
        this.answers = {};
        this.startTime = null;
        this.timerInterval = null;
        this.isSubmitting = false;
        
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    async setup() {
        try {
            await this.loadQuestions();
            this.setupEventListeners();
            this.startQuiz();
        } catch (error) {
            console.error('Setup error:', error);
            // Don't show alert, just log error
            console.log('Failed to load quiz. Redirecting...');
        }
    }
    
    async loadQuestions() {
        try {
            const response = await fetch('/quiz/api/questions');
            const data = await response.json();
            
            if (!data.success || !data.questions) {
                throw new Error('No questions received');
            }
            
            this.questions = data.questions;
            console.log('✅ Loaded', this.questions.length, 'questions');
        } catch (error) {
            console.error('Load questions error:', error);
            throw error;
        }
    }
    
    setupEventListeners() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousQuestion());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextQuestion());
        if (submitBtn) submitBtn.addEventListener('click', () => this.submitQuiz());
    }
    
    startQuiz() {
        this.hideLoading();
        document.getElementById('total-questions').textContent = this.questions.length;
        this.startTimer();
        this.showQuestion(0);
    }
    
    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            document.getElementById('timer').textContent = `${minutes}:${seconds}`;
        }, 1000);
    }
    
    showQuestion(index) {
        if (index < 0 || index >= this.questions.length || this.isSubmitting) {
            return;
        }
        
        this.currentIndex = index;
        const question = this.questions[index];
        
        document.getElementById('current-question').textContent = index + 1;
        document.getElementById('question-number').textContent = index + 1;
        document.getElementById('question-text').textContent = question.question;
        document.getElementById('section-badge').textContent = this.formatSectionName(question.section);
        
        this.updateProgress();
        this.createOptions(question);
        this.updateNavigation();
    }
    
    formatSectionName(section) {
        const names = {
            'numerical-reasoning': 'Numerical Reasoning',
            'verbal-reasoning': 'Verbal Reasoning',
            'logical-spatial': 'Logical & Spatial',
            'activity-preferences': 'Activity Preferences',
            'subject-learning': 'Subject & Learning',
            'career-interests': 'Career Interests',
            'behavioral': 'Behavioral',
            'stream-indicators': 'Stream Indicators'
        };
        return names[section] || section.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    updateProgress() {
        const progress = ((this.currentIndex + 1) / this.questions.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        document.getElementById('progress-percent').textContent = `${Math.round(progress)}%`;
    }
    
    createOptions(question) {
        const container = document.getElementById('options-container');
        container.innerHTML = '';
        
        question.options.forEach((option, i) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option-item';
            optionDiv.innerHTML = `
                <div class="option-radio"></div>
                <div class="option-text">${option}</div>
            `;
            
            if (this.answers[question.id] === i) {
                optionDiv.classList.add('selected');
            }
            
            optionDiv.addEventListener('click', () => {
                this.selectAnswer(i, optionDiv, question.id);
            });
            
            container.appendChild(optionDiv);
        });
    }
    
    selectAnswer(index, optionEl, questionId) {
        this.answers[questionId] = index;
        document.querySelectorAll('.option-item').forEach(el => el.classList.remove('selected'));
        optionEl.classList.add('selected');
        this.updateNavigation();
    }
    
    updateNavigation() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        
        if (prevBtn) prevBtn.disabled = (this.currentIndex === 0);
        
        const hasAnswer = this.answers[this.questions[this.currentIndex].id] !== undefined;
        const isLastQuestion = (this.currentIndex === this.questions.length - 1);
        
        if (isLastQuestion) {
            if (nextBtn) nextBtn.style.display = 'none';
            if (submitBtn) {
                submitBtn.style.display = 'inline-flex';
                submitBtn.disabled = !hasAnswer;
            }
        } else {
            if (nextBtn) {
                nextBtn.style.display = 'inline-flex';
                nextBtn.disabled = !hasAnswer;
            }
            if (submitBtn) submitBtn.style.display = 'none';
        }
    }
    
    previousQuestion() {
        if (this.currentIndex > 0 && !this.isSubmitting) {
            this.showQuestion(this.currentIndex - 1);
        }
    }
    
    nextQuestion() {
        if (this.currentIndex < this.questions.length - 1 && !this.isSubmitting) {
            this.showQuestion(this.currentIndex + 1);
        }
    }
    
    // FIXED: Submit Quiz Method
    async submitQuiz() {
        if (this.isSubmitting) return;
        
        this.isSubmitting = true;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
        
        try {
            this.showLoading('Processing your results...');
            
            const response = await fetch('/quiz/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    answers: this.answers,
                    timeSpent: timeSpent,
                    totalQuestions: this.questions.length
                })
            });
            
            if (response.ok) {
                // Redirect to results page immediately
                window.location.href = '/quiz/results';
            } else {
                throw new Error('Submission failed');
            }
            
        } catch (error) {
            console.error('Submit error:', error);
            this.hideLoading();
            this.isSubmitting = false;
            // Redirect anyway to show results
            window.location.href = '/quiz/results';
        }
    }
    
    showLoading(message) {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
            const p = overlay.querySelector('p');
            if (p) p.textContent = message;
        }
    }
    
    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.quiz = new CareerQuiz();
});
