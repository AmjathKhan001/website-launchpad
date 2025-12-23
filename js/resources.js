// website-launchpad/js/resources.js
// Resources Management System

class ResourcesManager {
    constructor() {
        this.resources = [];
        this.filteredResources = [];
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.init();
    }
    
    init() {
        this.loadResources();
        this.setupEventListeners();
        this.renderResources();
        this.updateUserProgress();
    }
    
    loadResources() {
        // Sample resources data - in production, this would come from an API
        this.resources = [
            {
                id: 1,
                title: 'HTML & CSS Crash Course',
                description: 'Learn the fundamentals of web development with HTML5 and CSS3 in this beginner-friendly course.',
                category: 'tutorial',
                type: 'video',
                duration: '2h 15m',
                difficulty: 'beginner',
                tags: ['html', 'css', 'beginner'],
                icon: 'fas fa-code',
                color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                isFree: true,
                rating: 4.8,
                completed: false
            },
            {
                id: 2,
                title: 'JavaScript Fundamentals',
                description: 'Master JavaScript basics including variables, functions, and DOM manipulation.',
                category: 'tutorial',
                type: 'video',
                duration: '3h 30m',
                difficulty: 'beginner',
                tags: ['javascript', 'beginner'],
                icon: 'fab fa-js',
                color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                isFree: true,
                rating: 4.7,
                completed: false
            },
            {
                id: 3,
                title: 'Responsive Design Mastery',
                description: 'Learn to create websites that work perfectly on all devices and screen sizes.',
                category: 'tutorial',
                type: 'video',
                duration: '2h 45m',
                difficulty: 'intermediate',
                tags: ['css', 'responsive', 'design'],
                icon: 'fas fa-mobile-alt',
                color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                isFree: false,
                rating: 4.9,
                completed: false
            },
            {
                id: 4,
                title: 'Business Website Template',
                description: 'Professional business template with clean design and responsive layout.',
                category: 'template',
                type: 'download',
                duration: 'HTML/CSS/JS',
                difficulty: 'beginner',
                tags: ['business', 'template', 'responsive'],
                icon: 'fas fa-briefcase',
                color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                isFree: true,
                rating: 4.6,
                completed: false
            },
            {
                id: 5,
                title: 'CSS Flexbox & Grid Guide',
                description: 'Complete guide to modern CSS layout with Flexbox and Grid.',
                category: 'article',
                type: 'article',
                duration: '45m read',
                difficulty: 'intermediate',
                tags: ['css', 'layout', 'flexbox', 'grid'],
                icon: 'fas fa-th',
                color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                isFree: true,
                rating: 4.8,
                completed: false
            },
            {
                id: 6,
                title: 'Git & GitHub for Beginners',
                description: 'Learn version control with Git and collaborate using GitHub.',
                category: 'tutorial',
                type: 'video',
                duration: '1h 45m',
                difficulty: 'beginner',
                tags: ['git', 'github', 'tools'],
                icon: 'fab fa-github',
                color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
                isFree: true,
                rating: 4.7,
                completed: false
            },
            {
                id: 7,
                title: 'Web Performance Optimization',
                description: 'Techniques to make your website load faster and perform better.',
                category: 'article',
                type: 'article',
                duration: '30m read',
                difficulty: 'advanced',
                tags: ['performance', 'optimization', 'advanced'],
                icon: 'fas fa-tachometer-alt',
                color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                isFree: false,
                rating: 4.9,
                completed: false
            },
            {
                id: 8,
                title: 'CSS Cheat Sheet',
                description: 'Quick reference guide for CSS properties and selectors.',
                category: 'cheatsheet',
                type: 'download',
                duration: 'PDF',
                difficulty: 'all',
                tags: ['css', 'reference', 'cheatsheet'],
                icon: 'fas fa-file-pdf',
                color: 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
                isFree: true,
                rating: 4.5,
                completed: false
            }
        ];
        
        // Load user's completed resources from localStorage
        this.loadUserProgress();
    }
    
    loadUserProgress() {
        const user = window.auth ? window.auth.getCurrentUser() : null;
        if (user && user.completedResources) {
            user.completedResources.forEach(resourceId => {
                const resource = this.resources.find(r => r.id === resourceId);
                if (resource) {
                    resource.completed = true;
                }
            });
        }
    }
    
    saveUserProgress() {
        const user = window.auth ? window.auth.getCurrentUser() : null;
        if (user) {
            const completedResources = this.resources
                .filter(r => r.completed)
                .map(r => r.id);
            
            user.completedResources = completedResources;
            
            // Update user in localStorage
            const auth = window.auth || new AuthSystem();
            auth.setCurrentUser(user);
        }
    }
    
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.filterResources();
            this.renderResources();
        });
        
        searchBtn.addEventListener('click', () => {
            this.filterResources();
            this.renderResources();
        });
        
        // Category filters
        const filterTags = document.querySelectorAll('.filter-tag');
        filterTags.forEach(tag => {
            tag.addEventListener('click', (e) => {
                // Update active state
                filterTags.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                // Update category
                this.currentCategory = e.target.getAttribute('data-category');
                this.filterResources();
                this.renderResources();
            });
        });
        
        // Newsletter form
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input[type="email"]').value;
                this.subscribeToNewsletter(email);
            });
        }
    }
    
    filterResources() {
        this.filteredResources = this.resources.filter(resource => {
            // Category filter
            if (this.currentCategory !== 'all' && resource.category !== this.currentCategory) {
                return false;
            }
            
            // Search filter
            if (this.searchQuery) {
                const searchIn = resource.title.toLowerCase() + ' ' + 
                               resource.description.toLowerCase() + ' ' +
                               resource.tags.join(' ').toLowerCase();
                return searchIn.includes(this.searchQuery);
            }
            
            return true;
        });
    }
    
    renderResources() {
        const resourcesGrid = document.getElementById('resourcesGrid');
        if (!resourcesGrid) return;
        
        if (this.filteredResources.length === 0) {
            resourcesGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3>No resources found</h3>
                    <p>Try a different search term or category</p>
                </div>
            `;
            return;
        }
        
        resourcesGrid.innerHTML = this.filteredResources.map(resource => `
            <div class="resource-card" data-id="${resource.id}">
                <div class="resource-image" style="background: ${resource.color};">
                    <i class="${resource.icon}"></i>
                    <span class="resource-badge">
                        ${resource.isFree ? 'Free' : 'Pro'}
                    </span>
                    ${resource.completed ? `
                        <div style="position: absolute; top: 1rem; left: 1rem; background: var(--success-green); color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">
                            <i class="fas fa-check"></i> Completed
                        </div>
                    ` : ''}
                </div>
                <div class="resource-content">
                    <span class="resource-category">${this.formatCategory(resource.category)}</span>
                    <h3 class="resource-title">${resource.title}</h3>
                    <p class="resource-description">${resource.description}</p>
                    <div class="resource-meta">
                        <div class="resource-duration">
                            <i class="fas fa-clock"></i> ${resource.duration}
                        </div>
                        <div class="resource-difficulty difficulty-${resource.difficulty}">
                            ${this.formatDifficulty(resource.difficulty)}
                        </div>
                    </div>
                    <div class="resource-actions">
                        <button class="btn btn-primary view-resource" style="flex: 1;" data-id="${resource.id}">
                            <i class="fas fa-${this.getActionIcon(resource.type)}"></i> ${this.getActionText(resource.type)}
                        </button>
                        ${resource.type === 'video' ? `
                            <button class="btn btn-secondary mark-complete" data-id="${resource.id}" title="Mark as complete">
                                <i class="fas fa-check"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to the new buttons
        this.addResourceEventListeners();
    }
    
    addResourceEventListeners() {
        // View resource buttons
        document.querySelectorAll('.view-resource').forEach(button => {
            button.addEventListener('click', (e) => {
                const resourceId = parseInt(e.target.closest('button').getAttribute('data-id'));
                this.openResource(resourceId);
            });
        });
        
        // Mark complete buttons
        document.querySelectorAll('.mark-complete').forEach(button => {
            button.addEventListener('click', (e) => {
                const resourceId = parseInt(e.target.closest('button').getAttribute('data-id'));
                this.toggleComplete(resourceId);
            });
        });
    }
    
    formatCategory(category) {
        const categories = {
            'tutorial': 'Video Tutorial',
            'template': 'Template',
            'article': 'Article',
            'cheatsheet': 'Cheat Sheet',
            'tool': 'Tool'
        };
        return categories[category] || category;
    }
    
    formatDifficulty(difficulty) {
        return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    }
    
    getActionIcon(type) {
        const icons = {
            'video': 'play',
            'article': 'book-open',
            'download': 'download',
            'tool': 'external-link-alt'
        };
        return icons[type] || 'eye';
    }
    
    getActionText(type) {
        const texts = {
            'video': 'Watch Now',
            'article': 'Read Article',
            'download': 'Download',
            'tool': 'Use Tool'
        };
        return texts[type] || 'View';
    }
    
    openResource(resourceId) {
        const resource = this.resources.find(r => r.id === resourceId);
        if (!resource) return;
        
        // Show a modal or redirect to resource page
        alert(`Opening: ${resource.title}\n\nThis would open the resource in a new page or modal.`);
        
        // Mark as viewed (but not completed)
        // In a real app, you might track views separately
    }
    
    toggleComplete(resourceId) {
        const resource = this.resources.find(r => r.id === resourceId);
        if (!resource) return;
        
        resource.completed = !resource.completed;
        this.saveUserProgress();
        this.renderResources();
        this.updateUserProgress();
        
        // Show feedback
        const message = resource.completed 
            ? `🎉 Great job! "${resource.title}" marked as completed.`
            : `Resource "${resource.title}" marked as incomplete.`;
        
        this.showNotification(message, resource.completed ? 'success' : 'info');
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            ${message}
        `;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-green)' : 'var(--primary-blue)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
    
    subscribeToNewsletter(email) {
        if (!email || !email.includes('@')) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate API call
        setTimeout(() => {
            this.showNotification(`🎉 Thank you! You've subscribed to our newsletter.`, 'success');
            
            // Clear form
            const form = document.getElementById('newsletterForm');
            if (form) {
                form.reset();
            }
            
            // Save subscription in localStorage
            let subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
            subscriptions.push({
                email: email,
                date: new Date().toISOString()
            });
            localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
        }, 500);
    }
    
    updateUserProgress() {
        // Update progress bars based on completed resources
        const completedCount = this.resources.filter(r => r.completed).length;
        const totalCount = this.resources.length;
        const progressPercentage = Math.round((completedCount / totalCount) * 100);
        
        // Update UI if elements exist
        const progressElements = document.querySelectorAll('.user-progress');
        progressElements.forEach(el => {
            el.textContent = `${progressPercentage}% Complete`;
        });
        
        // Update learning path progress (demo)
        const pathProgress = document.querySelectorAll('.path-progress .progress-fill');
        pathProgress.forEach((progressBar, index) => {
            // Simulate some progress for demo
            const progress = index === 0 ? 0 : index === 1 ? 25 : 10;
            progressBar.style.width = `${progress}%`;
            progressBar.previousElementSibling.querySelector('span:last-child').textContent = `${progress}%`;
        });
    }
}

// Initialize resources manager
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication (optional for resources page)
    const auth = window.auth || new AuthSystem();
    const user = auth.getCurrentUser();
    
    if (!user && window.location.pathname.includes('resources.html')) {
        // Allow access to resources even without login
        console.log('Viewing resources as guest');
    }
    
    // Initialize resources manager
    const resourcesManager = new ResourcesManager();
    window.resourcesManager = resourcesManager;
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification-error {
            background: var(--error-red) !important;
        }
    `;
    document.head.appendChild(style);
    
    console.log('Resources Manager initialized');
});
