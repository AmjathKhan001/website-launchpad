/**
 * WebsiteLaunchPad.com - Main Application Logic
 * Handles core app initialization, session management, navigation, and global events
 */

class WebsiteLaunchPad {
    constructor() {
        this.currentUser = null;
        this.currentPage = window.location.pathname.split('/').pop();
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.checkAuthentication();
        this.setupNavigation();
        this.setupEventListeners();
        this.initializePage();
        this.setupSessionManagement();
        this.setupErrorHandling();
        
        console.log('WebsiteLaunchPad initialized');
    }

    /**
     * Check user authentication status
     */
    checkAuthentication() {
        const user = localStorage.getItem('currentUser');
        const protectedPages = ['dashboard.html', 'create-project.html', 'project.html', 'project-settings.html', 'project-analytics.html'];
        
        if (user) {
            this.currentUser = JSON.parse(user);
            
            // Redirect from auth pages to dashboard if logged in
            if (this.currentPage === 'login.html' || this.currentPage === 'register.html') {
                window.location.href = 'dashboard.html';
                return;
            }
        } else {
            // Redirect to login if trying to access protected pages
            if (protectedPages.includes(this.currentPage)) {
                window.location.href = 'login.html';
                return;
            }
        }
    }

    /**
     * Setup navigation and routing
     */
    setupNavigation() {
        // Handle internal navigation
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link || !link.href) return;
            
            const url = new URL(link.href);
            const currentOrigin = window.location.origin;
            
            // Only handle internal navigation
            if (url.origin === currentOrigin && url.pathname.endsWith('.html')) {
                e.preventDefault();
                this.navigateTo(url.pathname);
            }
        });

        // Handle browser navigation
        window.addEventListener('popstate', () => {
            this.handleRouteChange();
        });
    }

    /**
     * Navigate to a page
     * @param {string} path - Path to navigate to
     */
    navigateTo(path) {
        // Update URL without reload if it's a SPA page
        if (this.isSPAPage(path)) {
            window.history.pushState({}, '', path);
            this.handleRouteChange();
        } else {
            window.location.href = path;
        }
    }

    /**
     * Check if page should be loaded as SPA
     * @param {string} path - Path to check
     * @returns {boolean} True if SPA page
     */
    isSPAPage(path) {
        const spaPages = ['dashboard.html', 'create-project.html', 'resources.html', 'project.html'];
        const page = path.split('/').pop();
        return spaPages.includes(page);
    }

    /**
     * Handle route changes
     */
    async handleRouteChange() {
        const path = window.location.pathname;
        const page = path.split('/').pop();
        
        // Update current page
        this.currentPage = page;
        
        // Load page content
        await this.loadPageContent(page);
        
        // Update active navigation
        this.updateActiveNav();
        
        // Initialize page-specific functionality
        this.initializePage();
    }

    /**
     * Load page content dynamically
     * @param {string} page - Page to load
     */
    async loadPageContent(page) {
        // For demo purposes, we'll just redirect
        // In a real app, this would fetch and inject HTML
        if (!this.isSPAPage(page)) {
            window.location.href = page;
            return;
        }
        
        try {
            // Show loading indicator
            this.showLoading();
            
            // Simulate loading delay
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Hide loading indicator
            this.hideLoading();
            
        } catch (error) {
            console.error('Failed to load page:', error);
            this.showError('Failed to load page content. Please try again.');
        }
    }

    /**
     * Update active navigation item
     */
    updateActiveNav() {
        const navItems = document.querySelectorAll('.nav-link, .dashboard-nav a');
        const currentPage = this.currentPage;
        
        navItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href === currentPage) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    /**
     * Initialize page-specific functionality
     */
    initializePage() {
        switch (this.currentPage) {
            case 'dashboard.html':
                this.initializeDashboard();
                break;
            case 'create-project.html':
                this.initializeCreateProject();
                break;
            case 'resources.html':
                this.initializeResources();
                break;
            case 'project.html':
                this.initializeProjectPage();
                break;
            case 'project-settings.html':
                this.initializeProjectSettings();
                break;
            case 'project-analytics.html':
                this.initializeProjectAnalytics();
                break;
        }
    }

    /**
     * Initialize dashboard page
     */
    initializeDashboard() {
        // Update user welcome message
        const welcomeEl = document.getElementById('userWelcome');
        if (welcomeEl && this.currentUser) {
            welcomeEl.textContent = `Welcome back, ${this.currentUser.name || this.currentUser.email}!`;
        }
        
        // Load user projects
        this.loadUserProjects();
        
        // Initialize progress charts if available
        if (window.progressTracker) {
            window.progressTracker.initializeCharts();
        }
    }

    /**
     * Load user projects for dashboard
     */
    loadUserProjects() {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        const userProjects = projects.filter(p => p.userId === this.currentUser?.id);
        const container = document.getElementById('projectsContainer');
        
        if (!container) return;
        
        if (userProjects.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🚀</div>
                    <h3>No Projects Yet</h3>
                    <p>Create your first website project to get started!</p>
                    <a href="create-project.html" class="btn btn-primary">Create Project</a>
                </div>
            `;
            return;
        }
        
        container.innerHTML = userProjects.map(project => `
            <div class="project-card" data-project-id="${project.id}">
                <div class="project-card-header">
                    <h3>${project.name}</h3>
                    <span class="project-status ${project.progress === 100 ? 'completed' : 'in-progress'}">
                        ${project.progress === 100 ? 'Completed' : 'In Progress'}
                    </span>
                </div>
                <p class="project-description">${project.description || 'No description'}</p>
                <div class="project-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${project.progress || 0}%"></div>
                    </div>
                    <span class="progress-text">${project.progress || 0}%</span>
                </div>
                <div class="project-card-footer">
                    <a href="project.html?id=${project.id}" class="btn btn-outline">View Project</a>
                    <div class="project-meta">
                        <span>Updated: ${this.formatDate(project.lastUpdated)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Initialize create project page
     */
    initializeCreateProject() {
        // Initialize wizard if available
        if (window.projectWizard) {
            window.projectWizard.init();
        }
    }

    /**
     * Initialize resources page
     */
    initializeResources() {
        // Initialize resources if available
        if (window.resourcesManager) {
            window.resourcesManager.init();
        }
    }

    /**
     * Initialize project page
     */
    initializeProjectPage() {
        // Get project ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');
        
        if (!projectId) {
            window.location.href = 'dashboard.html';
            return;
        }
        
        // Load project data
        this.loadProjectData(projectId);
    }

    /**
     * Load project data
     * @param {string} projectId - Project ID
     */
    loadProjectData(projectId) {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        const project = projects.find(p => p.id === projectId);
        
        if (!project) {
            window.location.href = 'dashboard.html';
            return;
        }
        
        // Update page title
        document.title = `${project.name} - WebsiteLaunchPad`;
        
        // Update project header
        const headerEl = document.getElementById('projectHeader');
        if (headerEl) {
            headerEl.innerHTML = `
                <h1>${project.name}</h1>
                <p>${project.description || ''}</p>
                <div class="project-meta">
                    <span>Created: ${this.formatDate(project.createdAt)}</span>
                    <span>Progress: ${project.progress || 0}%</span>
                </div>
            `;
        }
        
        // Initialize project steps if available
        if (window.progressTracker) {
            this.initializeProjectSteps(project);
        }
    }

    /**
     * Initialize project steps
     * @param {Object} project - Project object
     */
    initializeProjectSteps(project) {
        const stepsContainer = document.getElementById('projectSteps');
        if (!stepsContainer) return;
        
        const steps = [
            { id: 'domain', name: 'Domain Setup', icon: '🌐' },
            { id: 'hosting', name: 'Hosting Configuration', icon: '☁️' },
            { id: 'design', name: 'Website Design', icon: '🎨' },
            { id: 'content', name: 'Content Creation', icon: '📝' },
            { id: 'seo', name: 'SEO Optimization', icon: '📈' },
            { id: 'launch', name: 'Launch Website', icon: '🚀' }
        ];
        
        stepsContainer.innerHTML = steps.map(step => {
            const stepData = project[step.id] || {};
            const completed = stepData.completed || false;
            
            return `
                <div class="project-step ${completed ? 'completed' : ''}" data-step="${step.id}">
                    <div class="step-icon">${step.icon}</div>
                    <div class="step-content">
                        <h3>${step.name}</h3>
                        <p>${this.getStepDescription(step.id, stepData)}</p>
                        ${!completed ? `
                            <button class="btn btn-sm btn-outline complete-step" data-step="${step.id}">
                                Mark Complete
                            </button>
                        ` : `
                            <span class="step-completed">✓ Completed</span>
                        `}
                    </div>
                </div>
            `;
        }).join('');
        
        // Add event listeners for complete buttons
        stepsContainer.querySelectorAll('.complete-step').forEach(button => {
            button.addEventListener('click', (e) => {
                const stepId = e.target.dataset.step;
                this.completeProjectStep(project.id, stepId);
            });
        });
    }

    /**
     * Get step description
     * @param {string} stepId - Step ID
     * @param {Object} data - Step data
     * @returns {string} Step description
     */
    getStepDescription(stepId, data) {
        const descriptions = {
            domain: data.domainName ? `Domain: ${data.domainName}` : 'Set up your website domain name',
            hosting: data.provider ? `Hosting provider: ${data.provider}` : 'Configure your hosting service',
            design: data.template ? `Using template: ${data.template}` : 'Choose and customize your website design',
            content: data.pages ? `${data.pages} pages created` : 'Add content to your website',
            seo: data.keywords ? `Keywords: ${data.keywords.join(', ')}` : 'Optimize for search engines',
            launch: data.launchDate ? `Scheduled for: ${data.launchDate}` : 'Launch your website live'
        };
        
        return descriptions[stepId] || 'Complete this step';
    }

    /**
     * Complete a project step
     * @param {string} projectId - Project ID
     * @param {string} stepId - Step ID
     */
    completeProjectStep(projectId, stepId) {
        if (!window.progressTracker) return;
        
        const stepData = this.getStepDefaultData(stepId);
        const success = window.progressTracker.updateProjectProgress(projectId, stepId, stepData);
        
        if (success) {
            this.showSuccess('Step completed successfully!');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }

    /**
     * Get default data for a step
     * @param {string} stepId - Step ID
     * @returns {Object} Step data
     */
    getStepDefaultData(stepId) {
        const defaults = {
            domain: { domainName: 'mywebsite.com' },
            hosting: { provider: 'WebsiteLaunchPad Hosting' },
            design: { template: 'Modern Business' },
            content: { pages: 5 },
            seo: { keywords: ['business', 'website', 'online'] },
            launch: { launchDate: new Date().toLocaleDateString() }
        };
        
        return defaults[stepId] || {};
    }

    /**
     * Initialize project settings page
     */
    initializeProjectSettings() {
        // Get project ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');
        
        if (projectId) {
            // Load project settings
            this.loadProjectSettings(projectId);
        }
    }

    /**
     * Load project settings
     * @param {string} projectId - Project ID
     */
    loadProjectSettings(projectId) {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        const project = projects.find(p => p.id === projectId);
        
        if (project) {
            // Populate form fields
            const nameInput = document.getElementById('projectName');
            const descInput = document.getElementById('projectDescription');
            
            if (nameInput) nameInput.value = project.name;
            if (descInput) descInput.value = project.description || '';
            
            // Setup form submission
            const form = document.getElementById('projectSettingsForm');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.saveProjectSettings(projectId, form);
                });
            }
        }
    }

    /**
     * Save project settings
     * @param {string} projectId - Project ID
     * @param {HTMLFormElement} form - Settings form
     */
    saveProjectSettings(projectId, form) {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        const projectIndex = projects.findIndex(p => p.id === projectId);
        
        if (projectIndex === -1) return;
        
        const formData = new FormData(form);
        projects[projectIndex].name = formData.get('projectName') || projects[projectIndex].name;
        projects[projectIndex].description = formData.get('projectDescription') || projects[projectIndex].description;
        projects[projectIndex].lastUpdated = new Date().toISOString();
        
        localStorage.setItem('projects', JSON.stringify(projects));
        this.showSuccess('Project settings saved successfully!');
    }

    /**
     * Initialize project analytics page
     */
    initializeProjectAnalytics() {
        // Get project ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');
        
        if (projectId && window.progressTracker) {
            const projects = JSON.parse(localStorage.getItem('projects')) || [];
            const project = projects.find(p => p.id === projectId);
            
            if (project) {
                const progress = window.progressTracker.calculateProjectProgress(project);
                const timeSpent = window.progressTracker.calculateTimeSpent(project);
                const milestones = window.progressTracker.getProjectMilestones(project);
                
                // Update analytics display
                this.updateAnalyticsDisplay(progress, timeSpent, milestones);
            }
        }
    }

    /**
     * Update analytics display
     * @param {Object} progress - Progress data
     * @param {Object} time - Time data
     * @param {Array} milestones - Milestones data
     */
    updateAnalyticsDisplay(progress, time, milestones) {
        // Update progress stats
        const progressEl = document.getElementById('progressStats');
        if (progressEl) {
            progressEl.innerHTML = `
                <div class="stat-card">
                    <h3>${progress.percentage}%</h3>
                    <p>Overall Progress</p>
                </div>
                <div class="stat-card">
                    <h3>${progress.completed}/${progress.total}</h3>
                    <p>Steps Completed</p>
                </div>
                <div class="stat-card">
                    <h3>${time.totalHours}h</h3>
                    <p>Time Spent</p>
                </div>
                <div class="stat-card">
                    <h3>${milestones.filter(m => m.completed).length}</h3>
                    <p>Milestones</p>
                </div>
            `;
        }
        
        // Update milestones
        const milestonesEl = document.getElementById('milestonesList');
        if (milestonesEl) {
            milestonesEl.innerHTML = milestones.map(milestone => `
                <div class="milestone-item ${milestone.completed ? 'completed' : 'pending'}">
                    <div class="milestone-icon">${milestone.icon}</div>
                    <div class="milestone-content">
                        <h4>${milestone.name}</h4>
                        <p>${milestone.description}</p>
                        ${milestone.date ? `<small>${this.formatDate(milestone.date)}</small>` : ''}
                    </div>
                </div>
            `).join('');
        }
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Logout button
        document.addEventListener('click', (e) => {
            if (e.target.matches('.logout-btn') || e.target.closest('.logout-btn')) {
                e.preventDefault();
                this.logout();
            }
        });
        
        // Mobile menu toggle
        document.addEventListener('click', (e) => {
            if (e.target.matches('.menu-toggle') || e.target.closest('.menu-toggle')) {
                e.preventDefault();
                this.toggleMobileMenu();
            }
        });
        
        // Close mobile menu on outside click
        document.addEventListener('click', (e) => {
            const mobileMenu = document.querySelector('.mobile-menu');
            const menuToggle = document.querySelector('.menu-toggle');
            
            if (mobileMenu && mobileMenu.classList.contains('active') && 
                !mobileMenu.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                this.toggleMobileMenu(false);
            }
        });
        
        // Handle form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.matches('.ajax-form')) {
                e.preventDefault();
                this.handleAjaxForm(form);
            }
        });
    }

    /**
     * Logout user
     */
    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }

    /**
     * Toggle mobile menu
     * @param {boolean} show - Whether to show or hide
     */
    toggleMobileMenu(show = null) {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (!mobileMenu) return;
        
        if (show === null) {
            mobileMenu.classList.toggle('active');
        } else {
            mobileMenu.classList.toggle('active', show);
        }
        
        // Toggle body scroll
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    /**
     * Handle AJAX form submissions
     * @param {HTMLFormElement} form - Form element
     */
    async handleAjaxForm(form) {
        const formData = new FormData(form);
        const action = form.getAttribute('action') || '';
        const method = form.getAttribute('method') || 'POST';
        
        try {
            // Show loading state
            const submitBtn = form.querySelector('[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Processing...';
            submitBtn.disabled = true;
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success message
            this.showSuccess('Form submitted successfully!');
            
            // Reset form if needed
            if (form.hasAttribute('data-reset')) {
                form.reset();
            }
            
            // Redirect if specified
            const redirect = form.getAttribute('data-redirect');
            if (redirect) {
                setTimeout(() => {
                    this.navigateTo(redirect);
                }, 1500);
            }
            
        } catch (error) {
            this.showError('Failed to submit form. Please try again.');
            console.error('Form submission error:', error);
        } finally {
            // Reset button state
            const submitBtn = form.querySelector('[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    }

    /**
     * Setup session management
     */
    setupSessionManagement() {
        // Check session expiration
        setInterval(() => {
            const user = localStorage.getItem('currentUser');
            if (user) {
                const userData = JSON.parse(user);
                const lastActivity = localStorage.getItem('lastActivity');
                const now = Date.now();
                
                // 1 hour timeout
                if (lastActivity && now - parseInt(lastActivity) > 3600000) {
                    this.showInfo('Session expired. Please log in again.');
                    this.logout();
                }
            }
        }, 60000); // Check every minute
        
        // Update last activity on user interaction
        document.addEventListener('click', () => {
            localStorage.setItem('lastActivity', Date.now().toString());
        });
    }

    /**
     * Setup error handling
     */
    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.showError('An unexpected error occurred. Please try again.');
        });
        
        // Unhandled promise rejection
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.showError('An operation failed. Please try again.');
        });
    }

    /**
     * Show loading indicator
     */
    showLoading() {
        let loader = document.getElementById('globalLoader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'globalLoader';
            loader.innerHTML = `
                <div class="loader-spinner"></div>
                <div class="loader-text">Loading...</div>
            `;
            document.body.appendChild(loader);
        }
        loader.classList.add('active');
    }

    /**
     * Hide loading indicator
     */
    hideLoading() {
        const loader = document.getElementById('globalLoader');
        if (loader) {
            loader.classList.remove('active');
        }
    }

    /**
     * Show success message
     * @param {string} message - Success message
     */
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        this.showNotification(message, 'error');
    }

    /**
     * Show info message
     * @param {string} message - Info message
     */
    showInfo(message) {
        this.showNotification(message, 'info');
    }

    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, info)
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add to container or create one
        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            document.body.appendChild(container);
        }
        
        container.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
        
        // Add click to dismiss
        notification.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    }

    /**
     * Format date
     * @param {string} dateString - Date string
     * @returns {string} Formatted date
     */
    formatDate(dateString) {
        if (!dateString) return 'N/A';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new WebsiteLaunchPad();
});

// Add global styles for notifications and loader
const globalStyles = document.createElement('style');
globalStyles.textContent = `
    /* Global Loader */
    #globalLoader {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s, visibility 0.3s;
    }
    
    #globalLoader.active {
        opacity: 1;
        visibility: visible;
    }
    
    .loader-spinner {
        width: 50px;
        height: 50px;
        border: 3px solid #e5e7eb;
        border-top-color: #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    .loader-text {
        margin-top: 15px;
        color: #6b7280;
        font-size: 0.9rem;
    }
    
    /* Notifications */
    #notificationContainer {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
    }
    
    .notification {
        background: white;
        padding: 15px 20px;
        border-radius: 8px;
        margin-bottom: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateX(100%);
        opacity: 0;
        transition: transform 0.3s, opacity 0.3s;
        cursor: pointer;
        border-left: 4px solid #3b82f6;
    }
    
    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .notification-success {
        border-left-color: #10b981;
        background: #f0fdf4;
    }
    
    .notification-error {
        border-left-color: #ef4444;
        background: #fef2f2;
    }
    
    .notification-info {
        border-left-color: #3b82f6;
        background: #eff6ff;
    }
    
    /* Mobile Menu */
    .mobile-menu {
        display: none;
    }
    
    .mobile-menu.active {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: white;
        z-index: 1000;
        padding: 20px;
        overflow-y: auto;
    }
    
    /* Animations */
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    /* Project Steps */
    .project-step {
        background: white;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 15px;
        border: 2px solid #e5e7eb;
        transition: all 0.3s;
        display: flex;
        align-items: flex-start;
        gap: 15px;
    }
    
    .project-step.completed {
        border-color: #10b981;
        background: #f0fdf4;
    }
    
    .step-icon {
        font-size: 2rem;
        flex-shrink: 0;
    }
    
    .step-content h3 {
        margin: 0 0 5px 0;
        font-size: 1.1rem;
    }
    
    .step-content p {
        margin: 0 0 10px 0;
        color: #6b7280;
        font-size: 0.9rem;
    }
    
    .step-completed {
        color: #10b981;
        font-weight: 600;
        font-size: 0.9rem;
    }
    
    /* Empty State */
    .empty-state {
        text-align: center;
        padding: 40px 20px;
    }
    
    .empty-state-icon {
        font-size: 3rem;
        margin-bottom: 15px;
    }
    
    .empty-state h3 {
        margin: 0 0 10px 0;
        font-size: 1.5rem;
    }
    
    .empty-state p {
        color: #6b7280;
        margin-bottom: 20px;
    }
`;
document.head.appendChild(globalStyles);
