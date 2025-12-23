/**
 * WebsiteLaunchPad.com - Template Management System
 * Handles template preview, download, and customization
 */

class TemplateManager {
    constructor() {
        this.templates = [];
        this.categories = [];
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.init();
    }

    async init() {
        await this.loadTemplates();
        this.renderCategories();
        this.renderTemplates();
        this.setupEventListeners();
    }

    async loadTemplates() {
        try {
            // In a real app, this would fetch from an API
            // For now, we'll use the mock data structure
            this.templates = [
                {
                    id: 'business',
                    name: 'Business Website',
                    description: 'Professional business template with services section, contact form, and modern design',
                    category: 'business',
                    price: 'free',
                    preview: 'https://placehold.co/800x600/3b82f6/ffffff?text=Business+Template',
                    file: 'business-template.zip',
                    features: [
                        'Responsive design',
                        'Service showcase',
                        'Contact section',
                        'Modern navigation',
                        'SEO optimized'
                    ],
                    tags: ['business', 'professional', 'services', 'corporate']
                },
                {
                    id: 'portfolio',
                    name: 'Portfolio Website',
                    description: 'Showcase your work with this beautiful portfolio template',
                    category: 'portfolio',
                    price: 'free',
                    preview: 'https://placehold.co/800x600/10b981/ffffff?text=Portfolio+Template',
                    file: 'portfolio-template.zip',
                    features: [
                        'Project gallery',
                        'About section',
                        'Skills showcase',
                        'Contact form',
                        'Mobile friendly'
                    ],
                    tags: ['portfolio', 'creative', 'design', 'photography']
                },
                {
                    id: 'blog',
                    name: 'Blog Website',
                    description: 'Start your blog with this clean and readable template',
                    category: 'blog',
                    price: 'free',
                    preview: 'https://placehold.co/800x600/8b5cf6/ffffff?text=Blog+Template',
                    file: 'blog-template.zip',
                    features: [
                        'Blog post layout',
                        'Categories',
                        'Author profile',
                        'Comment section',
                        'Social sharing'
                    ],
                    tags: ['blog', 'writing', 'content', 'news']
                }
            ];

            this.categories = [
                { id: 'all', name: 'All Templates', count: this.templates.length },
                { id: 'business', name: 'Business', count: this.templates.filter(t => t.category === 'business').length },
                { id: 'portfolio', name: 'Portfolio', count: this.templates.filter(t => t.category === 'portfolio').length },
                { id: 'blog', name: 'Blog', count: this.templates.filter(t => t.category === 'blog').length },
                { id: 'ecommerce', name: 'E-commerce', count: 0 },
                { id: 'landing', name: 'Landing Page', count: 0 }
            ];

        } catch (error) {
            console.error('Failed to load templates:', error);
            this.showError('Failed to load templates. Please try again.');
        }
    }

    renderCategories() {
        const container = document.getElementById('templateCategories');
        if (!container) return;

        container.innerHTML = this.categories.map(category => `
            <button class="category-btn ${this.currentFilter === category.id ? 'active' : ''}" 
                    data-category="${category.id}">
                ${category.name}
                <span class="category-count">${category.count}</span>
            </button>
        `).join('');
    }

    renderTemplates() {
        const container = document.getElementById('templatesContainer');
        if (!container) return;

        let filteredTemplates = this.templates;

        // Apply category filter
        if (this.currentFilter !== 'all') {
            filteredTemplates = filteredTemplates.filter(t => t.category === this.currentFilter);
        }

        // Apply search filter
        if (this.currentSearch) {
            const searchTerm = this.currentSearch.toLowerCase();
            filteredTemplates = filteredTemplates.filter(t => 
                t.name.toLowerCase().includes(searchTerm) ||
                t.description.toLowerCase().includes(searchTerm) ||
                t.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }

        if (filteredTemplates.length === 0) {
            container.innerHTML = `
                <div class="no-templates">
                    <div class="empty-state-icon">🔍</div>
                    <h3>No Templates Found</h3>
                    <p>Try a different search term or category</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredTemplates.map(template => `
            <div class="template-card" data-template-id="${template.id}">
                <div class="template-preview">
                    <img src="${template.preview}" alt="${template.name}" 
                         onerror="this.src='https://placehold.co/800x600/6b7280/ffffff?text=Template+Preview'">
                    ${template.price === 'free' ? '<span class="template-badge free">Free</span>' : ''}
                </div>
                
                <div class="template-content">
                    <div class="template-header">
                        <h3>${template.name}</h3>
                        <span class="template-category">${template.category}</span>
                    </div>
                    
                    <p class="template-description">${template.description}</p>
                    
                    <div class="template-features">
                        ${template.features.slice(0, 3).map(feature => `
                            <span class="feature-tag">${feature}</span>
                        `).join('')}
                    </div>
                    
                    <div class="template-actions">
                        <button class="btn btn-outline preview-template" data-template-id="${template.id}">
                            Preview
                        </button>
                        <button class="btn btn-primary download-template" data-template-id="${template.id}">
                            Download
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Category filter buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.category-btn')) {
                const button = e.target.closest('.category-btn');
                this.currentFilter = button.dataset.category;
                this.renderCategories();
                this.renderTemplates();
            }

            // Preview button
            if (e.target.closest('.preview-template')) {
                const button = e.target.closest('.preview-template');
                const templateId = button.dataset.templateId;
                this.previewTemplate(templateId);
            }

            // Download button
            if (e.target.closest('.download-template')) {
                const button = e.target.closest('.download-template');
                const templateId = button.dataset.templateId;
                this.downloadTemplate(templateId);
            }
        });

        // Search input
        const searchInput = document.getElementById('templateSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentSearch = e.target.value;
                this.renderTemplates();
            });
        }

        // Category filter dropdown (for mobile)
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.renderTemplates();
            });
        }
    }

    previewTemplate(templateId) {
        const template = this.templates.find(t => t.id === templateId);
        if (!template) return;

        // Create preview modal
        const modal = document.createElement('div');
        modal.className = 'template-preview-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${template.name} - Preview</h2>
                    <button class="close-modal">&times;</button>
                </div>
                
                <div class="modal-body">
                    <div class="preview-image">
                        <img src="${template.preview}" alt="${template.name}">
                    </div>
                    
                    <div class="preview-info">
                        <h3>Template Details</h3>
                        <p>${template.description}</p>
                        
                        <div class="preview-features">
                            <h4>Features:</h4>
                            <ul>
                                ${template.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="preview-tags">
                            <h4>Tags:</h4>
                            <div class="tags-container">
                                ${template.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button class="btn btn-outline close-modal">Close Preview</button>
                    <button class="btn btn-primary download-from-preview" data-template-id="${template.id}">
                        Download Template
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Add event listeners
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                document.body.removeChild(modal);
                document.body.style.overflow = '';
            });
        });

        modal.querySelector('.download-from-preview').addEventListener('click', () => {
            this.downloadTemplate(templateId);
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        });

        // Close on overlay click
        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        });
    }

    downloadTemplate(templateId) {
        const template = this.templates.find(t => t.id === templateId);
        if (!template) return;

        // Show download confirmation
        this.showDownloadModal(template);
    }

    showDownloadModal(template) {
        const modal = document.createElement('div');
        modal.className = 'download-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Download ${template.name}</h2>
                    <button class="close-modal">&times;</button>
                </div>
                
                <div class="modal-body">
                    <div class="download-options">
                        <div class="option-card">
                            <h3>📁 Download ZIP</h3>
                            <p>Complete template files including HTML, CSS, and images</p>
                            <button class="btn btn-primary download-option" data-format="zip">
                                Download ZIP File
                            </button>
                        </div>
                        
                        <div class="option-card">
                            <h3>📋 Copy HTML Code</h3>
                            <p>Copy just the HTML code to paste into your project</p>
                            <button class="btn btn-outline download-option" data-format="html">
                                Copy HTML
                            </button>
                        </div>
                    </div>
                    
                    <div class="download-instructions">
                        <h3>How to Use:</h3>
                        <ol>
                            <li>Download the ZIP file</li>
                            <li>Extract all files to a folder</li>
                            <li>Open index.html in a text editor</li>
                            <li>Replace placeholder content with your own</li>
                            <li>Upload to your hosting provider</li>
                        </ol>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        });

        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        });

        // Download option buttons
        modal.querySelectorAll('.download-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = e.target.dataset.format;
                this.processDownload(template, format);
                document.body.removeChild(modal);
                document.body.style.overflow = '';
            });
        });
    }

    async processDownload(template, format) {
        if (format === 'html') {
            // Copy HTML to clipboard
            try {
                // For demo, we'll use a sample HTML string
                const sampleHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.name} - WebsiteLaunchPad Template</title>
    <style>
        /* Your template styles here */
        body { font-family: Arial, sans-serif; }
    </style>
</head>
<body>
    <h1>${template.name} Template</h1>
    <p>Downloaded from WebsiteLaunchPad.com</p>
    <!-- Add your content here -->
</body>
</html>`;

                await navigator.clipboard.writeText(sampleHTML);
                this.showSuccess('HTML code copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy:', err);
                this.showError('Failed to copy to clipboard. Please try again.');
            }
        } else if (format === 'zip') {
            // Simulate download (in real app, this would download actual file)
            this.simulateDownload(template);
        }
    }

    simulateDownload(template) {
        // Create a fake download for demo purposes
        const link = document.createElement('a');
        link.href = '#';
        link.download = `${template.id}-template.zip`;
        
        // Create a simple text file as demo content
        const content = `This is a demo of the ${template.name} template.\n\nIn the real application, this would be a complete website template.\n\nVisit WebsiteLaunchPad.com for more templates!`;
        const blob = new Blob([content], { type: 'text/plain' });
        link.href = URL.createObjectURL(blob);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        
        this.showSuccess(`Downloading ${template.name} template...`);
        
        // Track download in localStorage
        this.trackTemplateDownload(template.id);
    }

    trackTemplateDownload(templateId) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) return;

        const downloads = JSON.parse(localStorage.getItem('templateDownloads')) || {};
        if (!downloads[user.id]) {
            downloads[user.id] = [];
        }

        downloads[user.id].push({
            templateId,
            downloadedAt: new Date().toISOString()
        });

        localStorage.setItem('templateDownloads', JSON.stringify(downloads));
    }

    showSuccess(message) {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    showError(message) {
        const notification = document.createElement('div');
        notification.className = 'notification error';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
}

// Add CSS for template system
const templateStyles = document.createElement('style');
templateStyles.textContent = `
    /* Template Gallery */
    .templates-header {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        color: white;
        padding: 60px 0;
        margin-bottom: 40px;
    }
    
    .templates-header h1 {
        font-size: 2.5rem;
        margin-bottom: 15px;
        text-align: center;
    }
    
    .templates-header p {
        font-size: 1.1rem;
        text-align: center;
        max-width: 700px;
        margin: 0 auto 30px;
        opacity: 0.9;
    }
    
    .template-search {
        display: flex;
        gap: 15px;
        max-width: 600px;
        margin: 0 auto;
        padding: 0 20px;
    }
    
    .template-search input {
        flex: 1;
        padding: 12px 20px;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
    }
    
    .template-search select {
        padding: 12px 20px;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        background: white;
        min-width: 150px;
    }
    
    /* Template Categories */
    .template-categories {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 30px;
        padding: 20px 0;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .category-btn {
        padding: 8px 20px;
        background: #f3f4f6;
        border: 2px solid #e5e7eb;
        border-radius: 20px;
        font-weight: 500;
        color: #6b7280;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .category-btn:hover {
        border-color: #3b82f6;
        color: #3b82f6;
    }
    
    .category-btn.active {
        background: #3b82f6;
        border-color: #3b82f6;
        color: white;
    }
    
    .category-count {
        background: rgba(255, 255, 255, 0.2);
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 0.8rem;
    }
    
    .category-btn.active .category-count {
        background: rgba(255, 255, 255, 0.3);
    }
    
    /* Template Grid */
    .templates-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 30px;
        margin-bottom: 60px;
    }
    
    .template-card {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s, box-shadow 0.3s;
        border: 1px solid #e5e7eb;
    }
    
    .template-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }
    
    .template-preview {
        position: relative;
        height: 200px;
        overflow: hidden;
    }
    
    .template-preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s;
    }
    
    .template-card:hover .template-preview img {
        transform: scale(1.05);
    }
    
    .template-badge {
        position: absolute;
        top: 15px;
        right: 15px;
        padding: 5px 15px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .template-badge.free {
        background: #10b981;
        color: white;
    }
    
    .template-badge.premium {
        background: #f59e0b;
        color: white;
    }
    
    .template-content {
        padding: 25px;
    }
    
    .template-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 15px;
    }
    
    .template-header h3 {
        margin: 0;
        font-size: 1.25rem;
        color: #1f2937;
    }
    
    .template-category {
        background: #e0f2fe;
        color: #0369a1;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .template-description {
        color: #6b7280;
        margin-bottom: 20px;
        line-height: 1.5;
        font-size: 0.95rem;
    }
    
    .template-features {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 20px;
    }
    
    .feature-tag {
        background: #f3f4f6;
        color: #6b7280;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 0.8rem;
    }
    
    .template-actions {
        display: flex;
        gap: 10px;
    }
    
    /* Template Guide */
    .template-guide {
        background: #f9fafb;
        border-radius: 12px;
        padding: 40px;
        margin-bottom: 40px;
    }
    
    .template-guide h2 {
        text-align: center;
        margin-bottom: 40px;
        color: #1f2937;
    }
    
    .guide-steps {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 30px;
    }
    
    .guide-step {
        text-align: center;
        padding: 20px;
    }
    
    .step-number {
        width: 40px;
        height: 40px;
        background: #3b82f6;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        margin: 0 auto 15px;
    }
    
    .guide-step h3 {
        margin: 0 0 10px 0;
        font-size: 1.1rem;
        color: #1f2937;
    }
    
    .guide-step p {
        margin: 0;
        color: #6b7280;
        font-size: 0.9rem;
    }
    
    /* Modals */
    .template-preview-modal,
    .download-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
    }
    
    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
    }
    
    .modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 900px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 30px;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .modal-header h2 {
        margin: 0;
        font-size: 1.5rem;
        color: #1f2937;
    }
    
    .close-modal {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #6b7280;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.2s;
    }
    
    .close-modal:hover {
        background: #f3f4f6;
    }
    
    .modal-body {
        padding: 30px;
    }
    
    .modal-footer {
        padding: 20px 30px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        justify-content: flex-end;
        gap: 15px;
    }
    
    /* Preview Modal Specific */
    .preview-image {
        margin-bottom: 30px;
    }
    
    .preview-image img {
        width: 100%;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .preview-info h3 {
        margin: 0 0 15px 0;
        color: #1f2937;
    }
    
    .preview-features,
    .preview-tags {
        margin-top: 25px;
    }
    
    .preview-features h4,
    .preview-tags h4 {
        margin: 0 0 10px 0;
        color: #4b5563;
    }
    
    .preview-features ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 10px;
    }
    
    .preview-features li {
        background: #f3f4f6;
        padding: 8px 15px;
        border-radius: 6px;
        font-size: 0.9rem;
        color: #4b5563;
    }
    
    .tags-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }
    
    .tag {
        background: #e0f2fe;
        color: #0369a1;
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 0.85rem;
    }
    
    /* Download Modal Specific */
    .download-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
    }
    
    .option-card {
        background: #f9fafb;
        padding: 25px;
        border-radius: 10px;
        border: 1px solid #e5e7eb;
        text-align: center;
    }
    
    .option-card h3 {
        margin: 0 0 10px 0;
        font-size: 1.1rem;
        color: #1f2937;
    }
    
    .option-card p {
        margin: 0 0 20px 0;
        color: #6b7280;
        font-size: 0.9rem;
        line-height: 1.5;
    }
    
    .download-instructions {
        background: #f0f9ff;
        padding: 25px;
        border-radius: 10px;
        border: 1px solid #e0f2fe;
    }
    
    .download-instructions h3 {
        margin: 0 0 15px 0;
        color: #0369a1;
    }
    
    .download-instructions ol {
        margin: 0;
        padding-left: 20px;
        color: #4b5563;
    }
    
    .download-instructions li {
        margin-bottom: 8px;
    }
    
    /* Loading & Empty States */
    .loading-templates,
    .no-templates {
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px 20px;
    }
    
    .no-templates .empty-state-icon {
        font-size: 3rem;
        margin-bottom: 15px;
        opacity: 0.5;
    }
    
    .no-templates h3 {
        margin: 0 0 10px 0;
        color: #6b7280;
    }
    
    .no-templates p {
        color: #9ca3af;
        margin: 0;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
        .template-search {
            flex-direction: column;
        }
        
        .template-search select {
            width: 100%;
        }
        
        .templates-grid {
            grid-template-columns: 1fr;
        }
        
        .modal-content {
            width: 95%;
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .modal-footer {
            flex-direction: column;
        }
        
        .modal-footer .btn {
            width: 100%;
        }
    }
    
    /* Notification Styles */
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        z-index: 10001;
        transform: translateX(100%);
        opacity: 0;
        transition: transform 0.3s, opacity 0.3s;
        max-width: 350px;
    }
    
    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .notification.success {
        background: #10b981;
    }
    
    .notification.error {
        background: #ef4444;
    }
`;
document.head.appendChild(templateStyles);

// Initialize template manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('templates.html')) {
        window.templateManager = new TemplateManager();
    }
});
