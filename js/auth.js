// website-launchpad/js/auth.js
// Simple Authentication System using localStorage

class AuthSystem {
    constructor() {
        this.usersKey = 'websiteLaunchpad_users';
        this.currentUserKey = 'websiteLaunchpad_currentUser';
        this.initialize();
    }

    // Initialize the authentication system
    initialize() {
        // Check if users exist in localStorage, if not, create default
        if (!localStorage.getItem(this.usersKey)) {
            const defaultUsers = [
                {
                    id: 1,
                    firstName: 'Demo',
                    lastName: 'User',
                    email: 'demo@websitelaunchpad.com',
                    password: 'demo123',
                    websiteGoal: 'portfolio',
                    createdAt: new Date().toISOString(),
                    projects: []
                }
            ];
            localStorage.setItem(this.usersKey, JSON.stringify(defaultUsers));
        }
    }

    // Get all users
    getUsers() {
        const users = localStorage.getItem(this.usersKey);
        return users ? JSON.parse(users) : [];
    }

    // Save users to localStorage
    saveUsers(users) {
        localStorage.setItem(this.usersKey, JSON.stringify(users));
    }

    // Register a new user
    register(userData) {
        // Validate input
        if (!userData.email || !userData.password) {
            return { success: false, message: 'Email and password are required' };
        }

        if (userData.password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters' };
        }

        if (userData.password !== userData.confirmPassword) {
            return { success: false, message: 'Passwords do not match' };
        }

        // Check if user already exists
        const users = this.getUsers();
        const existingUser = users.find(user => user.email === userData.email);
        
        if (existingUser) {
            return { success: false, message: 'User with this email already exists' };
        }

        // Create new user
        const newUser = {
            id: users.length + 1,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password, // In real app, this should be hashed
            websiteGoal: userData.websiteGoal,
            createdAt: new Date().toISOString(),
            projects: [],
            subscription: 'free'
        };

        // Save user
        users.push(newUser);
        this.saveUsers(users);

        // Automatically log in the new user
        this.setCurrentUser(newUser);

        return { 
            success: true, 
            message: 'Account created successfully!',
            user: newUser
        };
    }

    // Login user
    login(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return { success: false, message: 'Invalid email or password' };
        }

        // Set current user
        this.setCurrentUser(user);

        return { 
            success: true, 
            message: 'Login successful!',
            user: user
        };
    }

    // Logout user
    logout() {
        localStorage.removeItem(this.currentUserKey);
        return { success: true, message: 'Logged out successfully' };
    }

    // Get current user
    getCurrentUser() {
        const user = localStorage.getItem(this.currentUserKey);
        return user ? JSON.parse(user) : null;
    }

    // Set current user
    setCurrentUser(user) {
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    }

    // Show message to user
    showMessage(message, type = 'info') {
        const messageContainer = document.getElementById('messageContainer');
        
        if (!messageContainer) return;

        const alertClass = type === 'error' ? 'alert-error' : 
                          type === 'success' ? 'alert-success' : 'alert-info';

        messageContainer.innerHTML = `
            <div class="alert ${alertClass}">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                ${message}
            </div>
        `;
        messageContainer.style.display = 'block';

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageContainer.style.display = 'none';
            }, 5000);
        }
    }

    // Redirect to dashboard after successful login/register
    redirectToDashboard() {
        window.location.href = 'dashboard.html';
    }

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Create global auth instance
const auth = new AuthSystem();

// DOM Ready Function
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on login page
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            
            // Simple validation
            if (!email || !password) {
                auth.showMessage('Please fill in all fields', 'error');
                return;
            }
            
            if (!auth.isValidEmail(email)) {
                auth.showMessage('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
            submitBtn.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                const result = auth.login(email, password);
                
                if (result.success) {
                    auth.showMessage(result.message, 'success');
                    // Redirect after a short delay
                    setTimeout(() => {
                        auth.redirectToDashboard();
                    }, 1000);
                } else {
                    auth.showMessage(result.message, 'error');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            }, 1000);
        });
    }

    // Check if we're on register page
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const userData = {
                firstName: document.getElementById('firstName').value.trim(),
                lastName: document.getElementById('lastName').value.trim(),
                email: document.getElementById('email').value.trim(),
                password: document.getElementById('password').value,
                confirmPassword: document.getElementById('confirmPassword').value,
                websiteGoal: document.getElementById('websiteGoal').value
            };
            
            // Validate required fields
            const requiredFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'websiteGoal'];
            for (const field of requiredFields) {
                if (!userData[field]) {
                    auth.showMessage(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`, 'error');
                    return;
                }
            }
            
            if (!auth.isValidEmail(userData.email)) {
                auth.showMessage('Please enter a valid email address', 'error');
                return;
            }
            
            // Check terms acceptance
            if (!document.getElementById('terms').checked) {
                auth.showMessage('You must accept the Terms of Service to continue', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            submitBtn.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                const result = auth.register(userData);
                
                if (result.success) {
                    auth.showMessage(result.message, 'success');
                    // Redirect after a short delay
                    setTimeout(() => {
                        auth.redirectToDashboard();
                    }, 1500);
                } else {
                    auth.showMessage(result.message, 'error');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            }, 1000);
        });
    }

    // Check if user is already logged in (for login/register pages)
    // If user is already logged in, redirect to dashboard
    if (window.location.pathname.includes('login.html') || 
        window.location.pathname.includes('register.html')) {
        if (auth.isLoggedIn()) {
            window.location.href = 'dashboard.html';
        }
    }

    // Add password visibility toggle (bonus feature)
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        const parent = input.parentElement;
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
        toggleBtn.style.cssText = `
            position: absolute;
            right: 10px;
            top: 35px;
            background: none;
            border: none;
            color: var(--gray-text);
            cursor: pointer;
        `;
        toggleBtn.addEventListener('click', function() {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
        
        parent.style.position = 'relative';
        parent.appendChild(toggleBtn);
    });
});
