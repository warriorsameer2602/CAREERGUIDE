// Enhanced AI Assistant JavaScript with Smart Scrolling
document.addEventListener('DOMContentLoaded', function() {
    initAIAssistant();
});

class AIAssistant {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.chatForm = document.getElementById('chatForm');
        this.chatInput = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.clearChatBtn = document.getElementById('clearChat');
        this.suggestionBtns = document.querySelectorAll('.suggestion-btn');
        this.charCount = document.querySelector('.char-count');
        
        this.conversationHistory = [];
        this.isProcessing = false;
        this.currentTypingElement = null;
        
        // Smart scroll variables
        this.autoScroll = true;
        this.scrollThreshold = 50; // pixels from bottom to consider "near bottom"
        
        this.bindEvents();
        this.setupSuggestions();
        this.setupSmartScroll();
    }
    
    // Setup smart scroll behavior
    setupSmartScroll() {
        this.chatMessages.addEventListener('scroll', () => {
            this.autoScroll = this.isNearBottom();
            
            // Visual indicator when auto-scroll is disabled
            this.updateScrollIndicator();
        });
    }
    
    // Check if user is near bottom of chat
    isNearBottom() {
        const container = this.chatMessages;
        return container.scrollHeight - container.scrollTop - container.clientHeight < this.scrollThreshold;
    }
    
    // Update scroll indicator (optional visual feedback)
    updateScrollIndicator() {
        let indicator = document.querySelector('.scroll-indicator');
        
        if (!this.autoScroll && !indicator) {
            // Create scroll indicator when user scrolls up
            indicator = document.createElement('div');
            indicator.className = 'scroll-indicator';
            indicator.innerHTML = `
                <button class="scroll-to-bottom-btn" title="Scroll to bottom">
                    <i class="fas fa-chevron-down"></i>
                    <span>New message</span>
                </button>
            `;
            
            indicator.addEventListener('click', () => {
                this.scrollToBottom(true); // Force scroll
                this.autoScroll = true;
            });
            
            this.chatMessages.parentElement.appendChild(indicator);
        } else if (this.autoScroll && indicator) {
            // Remove indicator when back at bottom
            indicator.remove();
        }
    }
    
    bindEvents() {
        // Form submission
        this.chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSendMessage();
        });
        
        // Input handling
        this.chatInput.addEventListener('input', (e) => {
            this.updateCharCount();
            this.toggleSendButton();
        });
        
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });
        
        // Clear chat
        this.clearChatBtn.addEventListener('click', () => {
            this.clearChat();
        });
    }
    
    setupSuggestions() {
        this.suggestionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-message');
                this.chatInput.value = message;
                this.toggleSendButton();
                this.handleSendMessage();
            });
        });
    }
    
    async handleSendMessage() {
        const message = this.chatInput.value.trim();
        
        if (!message || this.isProcessing) return;
        
        this.isProcessing = true;
        this.addUserMessage(message);
        this.chatInput.value = '';
        this.updateCharCount();
        this.toggleSendButton();
        this.showTypingIndicator();
        
        // Hide suggestions after first message
        const suggestions = document.getElementById('quickSuggestions');
        if (suggestions) {
            suggestions.style.display = 'none';
        }
        
        // Ensure we scroll to new user message
        this.scrollToBottom(true);
        this.autoScroll = true;
        
        try {
            const response = await this.sendToAI(message);
            this.hideTypingIndicator();
            
            // Create empty AI message bubble first
            const messageElement = this.createEmptyAIMessage();
            this.chatMessages.appendChild(messageElement);
            
            // Start typing animation with smart scroll
            await this.typeResponse(messageElement.querySelector('.message-bubble p'), response);
            
        } catch (error) {
            this.hideTypingIndicator();
            this.addAIMessage("Sorry, I'm having trouble connecting right now. Please try again in a moment.", true);
            console.error('AI Error:', error);
        }
        
        this.isProcessing = false;
    }
    
    async sendToAI(message) {
        const response = await fetch('/api/career-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                history: this.conversationHistory
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.response;
    }
    
    addUserMessage(message) {
        this.conversationHistory.push({
            role: 'user',
            parts: [{ text: message }]
        });
        
        const messageElement = this.createMessageElement(message, 'user');
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom(true); // Always scroll for user messages
    }
    
    // Create empty AI message bubble for typing
    createEmptyAIMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-bubble">
                    <p></p>
                </div>
                <span class="message-time">${this.getCurrentTime()}</span>
            </div>
        `;
        
        return messageDiv;
    }
    
    // Enhanced typing animation with smart scroll
    async typeResponse(element, text) {
        return new Promise((resolve) => {
            let i = 0;
            const speed = 30; // Typing speed in milliseconds
            
            // Add cursor while typing
            element.innerHTML = '<span class="typing-cursor">|</span>';
            
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    const currentText = text.slice(0, i + 1);
                    element.innerHTML = this.formatMessage(currentText) + '<span class="typing-cursor">|</span>';
                    i++;
                    
                    // Smart scroll - only if user is near bottom
                    this.scrollToBottom();
                } else {
                    // Remove cursor when done
                    element.innerHTML = this.formatMessage(text);
                    
                    // Add to conversation history
                    this.conversationHistory.push({
                        role: 'model',
                        parts: [{ text: text }]
                    });
                    
                    clearInterval(typeInterval);
                    
                    // Final scroll for completed message
                    this.scrollToBottom();
                    resolve();
                }
            }, speed);
        });
    }
    
    addAIMessage(message, isError = false) {
        if (!isError) {
            this.conversationHistory.push({
                role: 'model',
                parts: [{ text: message }]
            });
        }
        
        const messageElement = this.createMessageElement(message, 'ai', isError);
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }
    
    createMessageElement(message, sender, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
            </div>
            <div class="message-content">
                <div class="message-bubble ${isError ? 'error-bubble' : ''}">
                    ${this.formatMessage(message)}
                </div>
                <span class="message-time">${this.getCurrentTime()}</span>
            </div>
        `;
        
        return messageDiv;
    }
    
    formatMessage(message) {
        // Convert markdown-like formatting to HTML
        let formattedMessage = message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
        
        // Wrap in paragraph if it doesn't start with HTML
        if (!formattedMessage.startsWith('<')) {
            formattedMessage = `<p>${formattedMessage}</p>`;
        }
        
        return formattedMessage;
    }
    
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-message';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-bubble">
                    <div class="loading-message">
                        <span>AI is thinking</span>
                        <div class="loading-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        const typingMessage = this.chatMessages.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }
    
    // Smart scroll implementation
    scrollToBottom(force = false) {
        if (force || this.autoScroll) {
            setTimeout(() => {
                this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
            }, 10);
        }
    }
    
    updateCharCount() {
        const count = this.chatInput.value.length;
        this.charCount.textContent = `${count}/500`;
        
        if (count > 400) {
            this.charCount.style.color = '#ef4444';
        } else {
            this.charCount.style.color = '#64748b';
        }
    }
    
    toggleSendButton() {
        const hasText = this.chatInput.value.trim().length > 0;
        this.sendBtn.disabled = !hasText || this.isProcessing;
    }
    
    clearChat() {
        if (confirm('Are you sure you want to clear the chat history?')) {
            this.conversationHistory = [];
            
            // Keep only the welcome message
            const welcomeMessage = this.chatMessages.querySelector('.welcome-message');
            this.chatMessages.innerHTML = '';
            if (welcomeMessage) {
                this.chatMessages.appendChild(welcomeMessage);
            }
            
            // Reset scroll state
            this.autoScroll = true;
            const indicator = document.querySelector('.scroll-indicator');
            if (indicator) indicator.remove();
            
            // Show suggestions again
            const suggestions = document.getElementById('quickSuggestions');
            if (suggestions) {
                suggestions.style.display = 'block';
            }
            
            this.showNotification('Chat cleared successfully!');
        }
    }
    
    getCurrentTime() {
        return new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize AI Assistant
function initAIAssistant() {
    new AIAssistant();
}
