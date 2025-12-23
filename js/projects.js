// website-launchpad/js/projects.js
// Project Management System

class ProjectManager {
    constructor() {
        this.auth = window.auth || new AuthSystem();
    }

    // Create a new project
    createProject(projectData) {
        const user = this.auth.getCurrentUser();
        
        if (!user) {
            return { success: false, message: 'You must be logged in to create a project' };
        }

        if (!projectData.name || !projectData.type) {
            return { success: false, message: 'Project name and type are required' };
        }

        // Initialize projects array if it doesn't exist
        if (!user.projects) {
            user.projects = [];
        }

        // Create new project
        const newProject = {
            id: Date.now(),
            name: projectData.name,
            type: projectData.type,
            description: projectData.description || '',
            goal: projectData.goal || 'general',
            technology: projectData.technology || ['html', 'css'],
            progress: 0,
            completedTasks: 0,
            totalTasks: 10,
            status: 'planning',
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            tasks: this.getDefaultTasks(projectData.type)
        };

        // Add to user's projects
        user.projects.push(newProject);

        // Update user in localStorage
        this.updateUser(user);

        return { 
            success: true, 
            message: 'Project created successfully!',
            project: newProject
        };
    }

    // Get default tasks based on project type
    getDefaultTasks(projectType) {
        const baseTasks = [
            { id: 1, title: 'Define project goals', completed: false, category: 'planning' },
            { id: 2, title: 'Choose domain name', completed: false, category: 'planning' },
            { id: 3, title: 'Design homepage layout', completed: false, category: 'design' },
            { id: 4, title: 'Create color scheme', completed: false, category: 'design' },
            { id: 5, title: 'Setup HTML structure', completed: false, category: 'development' },
            { id: 6, title: 'Add CSS styling', completed: false, category: 'development' },
            { id: 7, title: 'Make responsive design', completed: false, category: 'development' },
            { id: 8, title: 'Test on different browsers', completed: false, category: 'testing' },
            { id: 9, title: 'Optimize for performance', completed: false, category: 'testing' },
            { id: 10, title: 'Launch website', completed: false, category: 'launch' }
        ];

        return baseTasks;
    }

    // Get all projects for current user
    getProjects() {
        const user = this.auth.getCurrentUser();
        return user ? user.projects || [] : [];
    }

    // Get project by ID
    getProject(projectId) {
        const user = this.auth.getCurrentUser();
        if (!user || !user.projects) return null;
        
        return user.projects.find(p => p.id == projectId);
    }

    // Update project
    updateProject(projectId, updates) {
        const user = this.auth.getCurrentUser();
        if (!user || !user.projects) {
            return { success: false, message: 'User not found' };
        }

        const projectIndex = user.projects.findIndex(p => p.id == projectId);
        if (projectIndex === -1) {
            return { success: false, message: 'Project not found' };
        }

        // Update project
        user.projects[projectIndex] = {
            ...user.projects[projectIndex],
            ...updates,
            lastUpdated: new Date().toISOString()
        };

        // Recalculate progress if tasks were updated
        if (updates.tasks) {
            const completedTasks = updates.tasks.filter(t => t.completed).length;
            user.projects[projectIndex].completedTasks = completedTasks;
            user.projects[projectIndex].progress = Math.round((completedTasks / updates.tasks.length) * 100);
        }

        // Update user
        this.updateUser(user);

        return { 
            success: true, 
            message: 'Project updated successfully',
            project: user.projects[projectIndex]
        };
    }

    // Delete project
    deleteProject(projectId) {
        const user = this.auth.getCurrentUser();
        if (!user || !user.projects) {
            return { success: false, message: 'User not found' };
        }

        const initialLength = user.projects.length;
        user.projects = user.projects.filter(p => p.id != projectId);

        if (user.projects.length < initialLength) {
            this.updateUser(user);
            return { success: true, message: 'Project deleted successfully' };
        } else {
            return { success: false, message: 'Project not found' };
        }
    }

    // Update user in localStorage
    updateUser(updatedUser) {
        const users = this.auth.getUsers();
        const userIndex = users.findIndex(u => u.id === updatedUser.id);
        
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem('websiteLaunchpad_users', JSON.stringify(users));
            localStorage.setItem('websiteLaunchpad_currentUser', JSON.stringify(updatedUser));
        }
    }

    // Get project statistics
    getStats() {
        const projects = this.getProjects();
        const totalProjects = projects.length;
        const activeProjects = projects.filter(p => p.progress < 100).length;
        const completedTasks = projects.reduce((sum, p) => sum + (p.completedTasks || 0), 0);
        const totalProgress = projects.reduce((sum, p) => sum + (p.progress || 0), 0);
        const avgProgress = totalProjects > 0 ? Math.round(totalProgress / totalProjects) : 0;

        return {
            totalProjects,
            activeProjects,
            completedTasks,
            avgProgress
        };
    }
}

// Initialize project manager
const projectManager = new ProjectManager();

// Export for use in other files
if (typeof window !== 'undefined') {
    window.projectManager = projectManager;
}
