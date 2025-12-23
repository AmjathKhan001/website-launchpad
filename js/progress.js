/**
 * WebsiteLaunchPad.com - Progress Tracking System
 * Handles progress analytics, milestone achievements, time tracking, and visualizations
 */

class ProgressTracker {
    constructor() {
        this.projects = JSON.parse(localStorage.getItem('projects')) || [];
        this.user = JSON.parse(localStorage.getItem('currentUser'));
        this.initializeCharts();
    }

    /**
     * Initialize chart.js instances if available
     */
    initializeCharts() {
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded. Progress charts will not be available.');
            return;
        }
        
        this.charts = {};
        this.initProgressChart();
        this.initTimeChart();
        this.initMilestoneChart();
    }

    /**
     * Calculate overall progress for a project
     * @param {Object} project - Project object
     * @returns {Object} Progress data
     */
    calculateProjectProgress(project) {
        if (!project) return { percentage: 0, completed: 0, total: 0 };
        
        const steps = [
            'domain', 'hosting', 'design', 'content', 'seo', 'launch'
        ];
        
        let completed = 0;
        steps.forEach(step => {
            if (project[step] && project[step].completed) {
                completed++;
            }
        });
        
        return {
            percentage: Math.round((completed / steps.length) * 100),
            completed: completed,
            total: steps.length,
            steps: steps.map(step => ({
                name: step,
                completed: project[step]?.completed || false,
                data: project[step] || {}
            }))
        };
    }

    /**
     * Calculate time spent on a project
     * @param {Object} project - Project object
     * @returns {Object} Time data
     */
    calculateTimeSpent(project) {
        if (!project || !project.createdAt) {
            return { totalHours: 0, daysActive: 0, averageDaily: 0 };
        }
        
        const created = new Date(project.createdAt);
        const now = new Date();
        const daysActive = Math.floor((now - created) / (1000 * 60 * 60 * 24));
        
        // Mock time tracking - in real app, this would come from time logs
        const baseHours = project.stepsCompleted || 0 * 2; // 2 hours per step
        const totalHours = Math.min(baseHours + (daysActive * 0.5), 40); // Cap at 40 hours
        
        return {
            totalHours: Math.round(totalHours),
            daysActive: daysActive,
            averageDaily: daysActive > 0 ? Math.round((totalHours / daysActive) * 10) / 10 : 0,
            estimatedCompletion: Math.max(0, 40 - totalHours)
        };
    }

    /**
     * Get milestone achievements for a project
     * @param {Object} project - Project object
     * @returns {Array} Milestones
     */
    getProjectMilestones(project) {
        const milestones = [
            {
                id: 'project_created',
                name: 'Project Started',
                description: 'Created your first project',
                icon: '🚀',
                completed: true,
                date: project.createdAt
            },
            {
                id: 'domain_setup',
                name: 'Domain Configured',
                description: 'Successfully set up your domain',
                icon: '🌐',
                completed: project.domain?.completed || false,
                date: project.domain?.completedDate
            },
            {
                id: 'hosting_setup',
                name: 'Hosting Ready',
                description: 'Configured hosting for your website',
                icon: '☁️',
                completed: project.hosting?.completed || false,
                date: project.hosting?.completedDate
            },
            {
                id: 'design_complete',
                name: 'Design Finalized',
                description: 'Completed website design',
                icon: '🎨',
                completed: project.design?.completed || false,
                date: project.design?.completedDate
            },
            {
                id: 'content_added',
                name: 'Content Uploaded',
                description: 'Added all website content',
                icon: '📝',
                completed: project.content?.completed || false,
                date: project.content?.completedDate
            },
            {
                id: 'seo_complete',
                name: 'SEO Optimized',
                description: 'Completed SEO optimization',
                icon: '📈',
                completed: project.seo?.completed || false,
                date: project.seo?.completedDate
            },
            {
                id: 'website_launched',
                name: 'Website Launched!',
                description: 'Successfully launched your website',
                icon: '🎉',
                completed: project.launch?.completed || false,
                date: project.launch?.completedDate
            }
        ];

        return milestones;
    }

    /**
     * Get overall user progress statistics
     * @returns {Object} User progress stats
     */
    getUserProgressStats() {
        const userProjects = this.projects.filter(p => p.userId === this.user?.id);
        const totalProjects = userProjects.length;
        
        let totalProgress = 0;
        let completedProjects = 0;
        let totalTimeSpent = 0;
        
        userProjects.forEach(project => {
            const progress = this.calculateProjectProgress(project);
            const time = this.calculateTimeSpent(project);
            
            totalProgress += progress.percentage;
            totalTimeSpent += time.totalHours;
            
            if (progress.percentage === 100) {
                completedProjects++;
            }
        });
        
        const averageProgress = totalProjects > 0 ? Math.round(totalProgress / totalProjects) : 0;
        const averageTime = totalProjects > 0 ? Math.round(totalTimeSpent / totalProjects) : 0;
        
        return {
            totalProjects,
            completedProjects,
            inProgressProjects: totalProjects - completedProjects,
            averageProgress,
            averageTime,
            totalTimeSpent: Math.round(totalTimeSpent),
            successRate: totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0
        };
    }

    /**
     * Initialize progress chart
     */
    initProgressChart() {
        const ctx = document.getElementById('progressChart');
        if (!ctx) return;
        
        const stats = this.getUserProgressStats();
        const userProjects = this.projects.filter(p => p.userId === this.user?.id);
        
        const projectNames = userProjects.map(p => p.name.substring(0, 15) + (p.name.length > 15 ? '...' : ''));
        const projectProgress = userProjects.map(p => this.calculateProjectProgress(p).percentage);
        
        this.charts.progress = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: projectNames,
                datasets: [{
                    label: 'Completion %',
                    data: projectProgress,
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.7)',
                        'rgba(16, 185, 129, 0.7)',
                        'rgba(245, 158, 11, 0.7)',
                        'rgba(239, 68, 68, 0.7)',
                        'rgba(139, 92, 246, 0.7)'
                    ],
                    borderColor: [
                        'rgb(59, 130, 246)',
                        'rgb(16, 185, 129)',
                        'rgb(245, 158, 11)',
                        'rgb(239, 68, 68)',
                        'rgb(139, 92, 246)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Progress: ${context.parsed.y}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Initialize time spent chart
     */
    initTimeChart() {
        const ctx = document.getElementById('timeChart');
        if (!ctx) return;
        
        const userProjects = this.projects.filter(p => p.userId === this.user?.id);
        const projectNames = userProjects.map(p => p.name.substring(0, 10) + (p.name.length > 10 ? '...' : ''));
        const timeData = userProjects.map(p => this.calculateTimeSpent(p).totalHours);
        
        this.charts.time = new Chart(ctx, {
            type: 'line',
            data: {
                labels: projectNames,
                datasets: [{
                    label: 'Hours Spent',
                    data: timeData,
                    fill: true,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    pointBackgroundColor: 'rgb(59, 130, 246)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Hours'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Projects'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Time: ${context.parsed.y} hours`;
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Initialize milestone chart
     */
    initMilestoneChart() {
        const ctx = document.getElementById('milestoneChart');
        if (!ctx) return;
        
        const userProjects = this.projects.filter(p => p.userId === this.user?.id);
        let milestoneCounts = {
            completed: 0,
            pending: 0
        };
        
        userProjects.forEach(project => {
            const milestones = this.getProjectMilestones(project);
            milestones.forEach(milestone => {
                if (milestone.completed) {
                    milestoneCounts.completed++;
                } else {
                    milestoneCounts.pending++;
                }
            });
        });
        
        this.charts.milestone = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Pending'],
                datasets: [{
                    data: [milestoneCounts.completed, milestoneCounts.pending],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.7)',
                        'rgba(209, 213, 219, 0.7)'
                    ],
                    borderColor: [
                        'rgb(16, 185, 129)',
                        'rgb(156, 163, 175)'
                    ],
                    borderWidth: 1,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Update project progress
     * @param {string} projectId - Project ID
     * @param {string} step - Step name
     * @param {Object} data - Step data
     */
    updateProjectProgress(projectId, step, data) {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        const projectIndex = projects.findIndex(p => p.id === projectId);
        
        if (projectIndex === -1) return false;
        
        // Update the step data
        projects[projectIndex][step] = {
            ...projects[projectIndex][step],
            ...data,
            completed: true,
            completedDate: new Date().toISOString()
        };
        
        // Count completed steps
        const steps = ['domain', 'hosting', 'design', 'content', 'seo', 'launch'];
        const completedSteps = steps.filter(stepName => 
            projects[projectIndex][stepName]?.completed
        ).length;
        
        projects[projectIndex].stepsCompleted = completedSteps;
        projects[projectIndex].lastUpdated = new Date().toISOString();
        
        // Update progress percentage
        projects[projectIndex].progress = Math.round((completedSteps / steps.length) * 100);
        
        // Save to localStorage
        localStorage.setItem('projects', JSON.stringify(projects));
        
        // Update charts if they exist
        if (this.charts.progress) {
            this.charts.progress.destroy();
            this.initProgressChart();
        }
        
        // Show achievement notification if this was the last step
        if (completedSteps === steps.length) {
            this.showAchievement('Website Launched!', '🎉', 'Congratulations! You have successfully launched your website!');
        }
        
        return true;
    }

    /**
     * Show achievement notification
     * @param {string} title - Achievement title
     * @param {string} icon - Achievement icon
     * @param {string} message - Achievement message
     */
    showAchievement(title, icon, message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${icon}</div>
            <div class="achievement-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="close-achievement">&times;</button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 15px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.5s ease-out;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        // Add close button event
        notification.querySelector('.close-achievement').addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.5s ease-out forwards';
            setTimeout(() => notification.remove(), 500);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.5s ease-out forwards';
                setTimeout(() => notification.remove(), 500);
            }
        }, 5000);
    }

    /**
     * Export progress data
     * @param {string} format - Export format (json, csv)
     * @returns {string} Exported data
     */
    exportProgressData(format = 'json') {
        const userProjects = this.projects.filter(p => p.userId === this.user?.id);
        const progressData = userProjects.map(project => ({
            project: project.name,
            progress: this.calculateProjectProgress(project).percentage,
            timeSpent: this.calculateTimeSpent(project).totalHours,
            milestones: this.getProjectMilestones(project),
            lastUpdated: project.lastUpdated
        }));
        
        if (format === 'csv') {
            // Simple CSV conversion
            const headers = ['Project', 'Progress %', 'Time Spent (hours)', 'Completed Milestones', 'Last Updated'];
            const rows = progressData.map(p => [
                `"${p.project}"`,
                p.progress,
                p.timeSpent,
                p.milestones.filter(m => m.completed).length,
                p.lastUpdated
            ]);
            
            return [headers, ...rows].map(row => row.join(',')).join('\n');
        }
        
        return JSON.stringify(progressData, null, 2);
    }
}

// Initialize progress tracker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.progressTracker = new ProgressTracker();
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .achievement-notification .achievement-icon {
        font-size: 2rem;
    }
    
    .achievement-notification .achievement-content h4 {
        margin: 0 0 5px 0;
        font-size: 1.1rem;
    }
    
    .achievement-notification .achievement-content p {
        margin: 0;
        font-size: 0.9rem;
        opacity: 0.9;
    }
    
    .achievement-notification .close-achievement {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        margin-left: 10px;
        opacity: 0.7;
        transition: opacity 0.2s;
    }
    
    .achievement-notification .close-achievement:hover {
        opacity: 1;
    }
`;
document.head.appendChild(style);
