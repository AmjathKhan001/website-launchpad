// website-launchpad/js/wizard.js
// Project Creation Wizard

class ProjectWizard {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5;
        this.projectData = {
            name: '',
            type: 'business',
            goal: '',
            description: '',
            technologies: ['html', 'css'],
            template: 'business-basic',
            includeDemoContent: true
        };
        
        this.init();
    }
    
    init() {
        // Initialize step navigation
        this.setupStepNavigation();
        
        // Setup project type selection
        this.setupTypeSelection();
        
        // Setup technology selection
        this.setupTechSelection();
        
        // Setup template selection
        this.setupTemplateSelection();
        
        // Setup form validation
        this.setupFormValidation();
        
        // Load saved data if exists
        this.loadSavedData();
    }
    
    setupStepNavigation() {
        const btnNext = document.getElementById('btnNext');
        const btnPrev = document.getElementById('btnPrev');
        const btnFinish = document.getElementById('btnFinish');
        const stepCounter = document.getElementById('stepCounter');
        
        btnNext.addEventListener('click', () => this.nextStep());
        btnPrev.addEventListener('click', () => this.prevStep());
        btnFinish.addEventListener('click', () => this.createProject());
        
        // Update step counter
        this.updateStepCounter();
    }
    
    setupTypeSelection() {
        const typeCards = document.querySelectorAll('.type-card');
        const projectTypeInput = document.getElementById('projectType');
        
        typeCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove selected class from all cards
                typeCards.forEach(c => c.classList.remove('selected'));
                
                // Add selected class to clicked card
                card.classList.add('selected');
                
                // Update project data
                const type = card.getAttribute('data-type');
                this.projectData.type = type;
                projectTypeInput.value = type;
            });
        });
        
        // Set default selection
        if (typeCards.length > 0) {
            const defaultCard = document.querySelector('.type-card[data-type="business"]');
            if (defaultCard) {
                defaultCard.click();
            }
        }
    }
    
    setupTechSelection() {
        const techTags = document.querySelectorAll('.tech-tag');
        const techInput = document.getElementById('selectedTechnologies');
        
        techTags.forEach(tag => {
            tag.addEventListener('click', () => {
                const tech = tag.getAttribute('data-tech');
                
                // Toggle selection
                tag.classList.toggle('selected');
                
                // Update technologies array
                if (tag.classList.contains('selected')) {
                    if (!this.projectData.technologies.includes(tech)) {
                        this.projectData.technologies.push(tech);
                    }
                } else {
                    this.projectData.technologies = this.projectData.technologies.filter(t => t !== tech);
                }
                
                // Update hidden input
                techInput.value = this.projectData.technologies.join(',');
            });
        });
    }
    
    setupTemplateSelection() {
        const templateCards = document.querySelectorAll('.template-card');
        const templateSelect = document.getElementById('templateChoice');
        const demoContentCheckbox = document.getElementById('includeDemoContent');
        
        templateCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove selected class from all cards
                templateCards.forEach(c => c.classList.remove('selected'));
                
                // Add selected class to clicked card
                card.classList.add('selected');
                
                // Update project data
                const template = card.getAttribute('data-template');
                this.projectData.template = template;
                
                // Update select dropdown
                templateSelect.value = template;
            });
        });
        
        templateSelect.addEventListener('change', (e) => {
            this.projectData.template = e.target.value;
            
            // Update card selection
            templateCards.forEach(card => {
                const template = card.getAttribute('data-template');
                card.classList.toggle('selected', template === e.target.value);
            });
        });
        
        demoContentCheckbox.addEventListener('change', (e) => {
            this.projectData.includeDemoContent = e.target.checked;
        });
    }
    
    setupFormValidation() {
        // Project name validation
        const projectNameInput = document.getElementById('projectName');
        projectNameInput.addEventListener('input', (e) => {
            this.projectData.name = e.target.value.trim();
        });
        
        // Project goal validation
        const projectGoalSelect = document.getElementById('projectGoal');
        projectGoalSelect.addEventListener('change', (e) => {
            this.projectData.goal = e.target.value;
        });
        
        // Project description
        const projectDescriptionInput = document.getElementById('projectDescription');
        projectDescriptionInput.addEventListener('input', (e) => {
            this.projectData.description = e.target.value;
        });
    }
    
    nextStep() {
        // Validate current step before proceeding
        if (!this.validateCurrentStep()) {
            return;
        }
        
        // Save step data
        this.saveStepData();
        
        if (this.currentStep < this.totalSteps) {
            // Move to next step
            this.hideStep(this.currentStep);
            this.currentStep++;
            this.showStep(this.currentStep);
            this.updateProgress();
            this.updateNavigation();
            this.updateStepCounter();
            
            // Update review if we're on step 5
            if (this.currentStep === 5) {
                this.updateReview();
            }
        }
    }
    
    prevStep() {
        if (this.currentStep > 1) {
            // Move to previous step
            this.hideStep(this.currentStep);
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateProgress();
            this.updateNavigation();
            this.updateStepCounter();
        }
    }
    
    hideStep(stepNumber) {
        const stepElement = document.getElementById(`step${stepNumber}`);
        if (stepElement) {
            stepElement.classList.remove('active');
        }
        
        // Update step indicator
        const stepIndicator = document.querySelector(`.step[data-step="${stepNumber}"]`);
        if (stepIndicator) {
            stepIndicator.classList.remove('active');
        }
    }
    
    showStep(stepNumber) {
        const stepElement = document.getElementById(`step${stepNumber}`);
        if (stepElement) {
            stepElement.classList.add('active');
        }
        
        // Update step indicator
        const stepIndicator = document.querySelector(`.step[data-step="${stepNumber}"]`);
        if (stepIndicator) {
            stepIndicator.classList.add('active');
            
            // Mark previous steps as completed
            for (let i = 1; i < stepNumber; i++) {
                const prevStep = document.querySelector(`.step[data-step="${i}"]`);
                if (prevStep) {
                    prevStep.classList.add('completed');
                }
            }
        }
    }
    
    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            const percentage = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
            progressFill.style.width = `${percentage}%`;
        }
    }
    
    updateNavigation() {
        const btnPrev = document.getElementById('btnPrev');
        const btnNext = document.getElementById('btnNext');
        const btnFinish = document.getElementById('btnFinish');
        
        // Previous button
        btnPrev.disabled = this.currentStep === 1;
        
        // Next/Finish button
        if (this.currentStep === this.totalSteps) {
            btnNext.style.display = 'none';
            btnFinish.style.display = 'block';
        } else {
            btnNext.style.display = 'block';
            btnFinish.style.display = 'none';
        }
    }
    
    updateStepCounter() {
        const stepCounter = document.getElementById('stepCounter');
        if (stepCounter) {
            stepCounter.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
        }
    }
    
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.validateStep1();
            case 2:
                return this.validateStep2();
            case 3:
                return this.validateStep3();
            case 4:
                return this.validateStep4();
            default:
                return true;
        }
    }
    
    validateStep1() {
        const projectName = document.getElementById('projectName').value.trim();
        
        if (!projectName) {
            this.showError('Please enter a project name');
            document.getElementById('projectName').focus();
            return false;
        }
        
        if (projectName.length < 3) {
            this.showError('Project name must be at least 3 characters');
            document.getElementById('projectName').focus();
            return false;
        }
        
        return true;
    }
    
    validateStep2() {
        if (!this.projectData.type) {
            this.showError('Please select a project type');
            return false;
        }
        
        return true;
    }
    
    validateStep3() {
        if (this.projectData.technologies.length === 0) {
            this.showError('Please select at least one technology');
            return false;
        }
        
        return true;
    }
    
    validateStep4() {
        if (!this.projectData.template) {
            this.showError('Please select a template or choose "Blank Canvas"');
            return false;
        }
        
        return true;
    }
    
    showError(message) {
        // Create error message element
        let errorElement = document.querySelector('.wizard-error');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'alert alert-error wizard-error';
            errorElement.style.marginBottom = '1rem';
            
            const content = document.querySelector('.step-content.active');
            if (content) {
                content.prepend(errorElement);
            }
        }
        
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.remove();
            }
        }, 5000);
    }
    
    saveStepData() {
        // Save to localStorage for persistence
        localStorage.setItem('wizardProjectData', JSON.stringify(this.projectData));
    }
    
    loadSavedData() {
        const savedData = localStorage.getItem('wizardProjectData');
        if (savedData) {
            try {
                this.projectData = JSON.parse(savedData);
                
                // Apply loaded data to form
                this.applyLoadedData();
            } catch (e) {
                console.log('Could not load saved data:', e);
            }
        }
    }
    
    applyLoadedData() {
        // Apply to form fields
        document.getElementById('projectName').value = this.projectData.name || '';
        document.getElementById('projectGoal').value = this.projectData.goal || '';
        document.getElementById('projectDescription').value = this.projectData.description || '';
        document.getElementById('templateChoice').value = this.projectData.template || 'business-basic';
        document.getElementById('includeDemoContent').checked = this.projectData.includeDemoContent !== false;
        
        // Apply type selection
        const typeCard = document.querySelector(`.type-card[data-type="${this.projectData.type}"]`);
        if (typeCard) {
            document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
            typeCard.classList.add('selected');
        }
        
        // Apply technology selection
        this.projectData.technologies.forEach(tech => {
            const techTag = document.querySelector(`.tech-tag[data-tech="${tech}"]`);
            if (techTag) {
                techTag.classList.add('selected');
            }
        });
        
        // Apply template selection
        const templateCard = document.querySelector(`.template-card[data-template="${this.projectData.template}"]`);
        if (templateCard) {
            document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
            templateCard.classList.add('selected');
        }
    }
    
    updateReview() {
        // Update review section with collected data
        document.getElementById('reviewName').textContent = this.projectData.name || 'Not specified';
        document.getElementById('reviewType').textContent = this.formatType(this.projectData.type);
        document.getElementById('reviewGoal').textContent = this.formatGoal(this.projectData.goal);
        document.getElementById('reviewTech').textContent = this.formatTech(this.projectData.technologies);
        document.getElementById('reviewTemplate').textContent = this.formatTemplate(this.projectData.template);
        document.getElementById('reviewDescription').textContent = 
            this.projectData.description || 'No description provided';
    }
    
    formatType(type) {
        const types = {
            'business': 'Business Website',
            'portfolio': 'Portfolio',
            'ecommerce': 'E-commerce Store',
            'blog': 'Blog',
            'landing': 'Landing Page',
            'other': 'Other'
        };
        return types[type] || type;
    }
    
    formatGoal(goal) {
        const goals = {
            'business': 'Grow my business',
            'portfolio': 'Showcase my work',
            'ecommerce': 'Sell products online',
            'blog': 'Share content/blog',
            'community': 'Build a community',
            'personal': 'Personal website'
        };
        return goals[goal] || goal || 'Not specified';
    }
    
    formatTech(techArray) {
        const techNames = {
            'html': 'HTML5',
            'css': 'CSS3',
            'javascript': 'JavaScript',
            'bootstrap': 'Bootstrap',
            'tailwind': 'Tailwind CSS',
            'react': 'React',
            'vue': 'Vue.js',
            'git': 'Git',
            'github': 'GitHub',
            'vscode': 'VS Code',
            'figma': 'Figma'
        };
        
        return techArray.map(tech => techNames[tech] || tech).join(', ');
    }
    
    formatTemplate(template) {
        const templates = {
            'blank': 'Blank Canvas',
            'business-basic': 'Business Basic',
            'portfolio-modern': 'Modern Portfolio',
            'blog-minimal': 'Minimal Blog'
        };
        return templates[template] || template;
    }
    
    createProject() {
        // Validate final step
        if (!this.validateCurrentStep()) {
            return;
        }
        
        // Check authentication
        const auth = window.auth || new AuthSystem();
        if (!auth.isLoggedIn()) {
            window.location.href = 'login.html';
            return;
        }
        
        // Get final form data
        this.projectData.name = document.getElementById('projectName').value.trim();
        this.projectData.goal = document.getElementById('projectGoal').value;
        this.projectData.description = document.getElementById('projectDescription').value;
        this.projectData.includeDemoContent = document.getElementById('includeDemoContent').checked;
        
        // Show loading state
        const btnFinish = document.getElementById('btnFinish');
        const originalText = btnFinish.innerHTML;
        btnFinish.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
        btnFinish.disabled = true;
        
        // Create project using project manager
        setTimeout(() => {
            const projectManager = window.projectManager || new ProjectManager();
            const result = projectManager.createProject({
                name: this.projectData.name,
                type: this.projectData.type,
                description: this.projectData.description,
                goal: this.projectData.goal,
                technology: this.projectData.technologies
            });
            
            if (result.success) {
                // Show success screen
                this.showSuccessScreen(result.project);
                
                // Clear saved data
                localStorage.removeItem('wizardProjectData');
            } else {
                this.showError(result.message);
                btnFinish.innerHTML = originalText;
                btnFinish.disabled = false;
            }
        }, 1500);
    }
    
    showSuccessScreen(project) {
        // Hide current step and navigation
        document.querySelector('.step-content.active').style.display = 'none';
        document.querySelector('.wizard-navigation').style.display = 'none';
        document.querySelector('.wizard-progress').style.display = 'none';
        
        // Show success screen
        const successScreen = document.getElementById('successScreen');
        successScreen.style.display = 'block';
        successScreen.classList.add('active');
        
        // Update project name in success message
        document.getElementById('successProjectName').textContent = project.name;
        
        // Update view project button
        const viewProjectBtn = document.getElementById('viewProjectBtn');
        viewProjectBtn.href = `project.html?id=${project.id}`;
        
        // Update step indicators to all completed
        document.querySelectorAll('.step').forEach(step => {
            step.classList.add('completed');
            step.classList.remove('active');
        });
    }
}

// Initialize wizard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const auth = window.auth || new AuthSystem();
    if (!auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize wizard
    const wizard = new ProjectWizard();
    window.projectWizard = wizard;
    
    console.log('Project Wizard initialized');
    
    // Auto-save form data periodically
    setInterval(() => {
        if (wizard && wizard.saveStepData) {
            wizard.saveStepData();
        }
    }, 5000);
});
