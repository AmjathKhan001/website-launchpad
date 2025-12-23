// Global functionality for all pages
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileMenuBtn.innerHTML = nav.classList.contains('active') ? '✕' : '☰';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                nav.classList.remove('active');
                mobileMenuBtn.innerHTML = '☰';
            }
        });
    }
    
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode);
            themeToggle.innerHTML = isDarkMode ? '☀️' : '🌙';
        });
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme === 'true') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '☀️';
        }
    }
    
    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    const searchBtn = document.querySelector('.search-box button');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });
        
        function performSearch() {
            const query = searchInput.value.trim();
            if (query) {
                // Show loading
                searchBtn.innerHTML = '<div class="loading"></div>';
                
                // Simulate search (in real app, this would be an API call)
                setTimeout(() => {
                    searchBtn.innerHTML = 'Search';
                    
                    // Store search in localStorage for recent searches
                    const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
                    searches.unshift({
                        query: query,
                        timestamp: new Date().toISOString()
                    });
                    localStorage.setItem('recentSearches', JSON.stringify(searches.slice(0, 5)));
                    
                    // Show message (in real app, redirect to search results)
                    showToast(`Searching for "${query}"... (This is a demo)`);
                }, 500);
            }
        }
    }
    
    // Toast notification function
    window.showToast = function(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };
    
    // Update copyright year
    const copyright = document.querySelector('.copyright');
    if (copyright) {
        const year = new Date().getFullYear();
        copyright.innerHTML = copyright.innerHTML.replace('2023', year);
    }
    
    // Tool usage tracking
    const toolTitle = document.querySelector('.tool-header h1');
    if (toolTitle) {
        const toolName = toolTitle.textContent;
        const toolsUsed = JSON.parse(localStorage.getItem('toolsUsed') || '[]');
        
        // Add to recently used if not already there
        if (!toolsUsed.includes(toolName)) {
            toolsUsed.unshift(toolName);
            localStorage.setItem('toolsUsed', JSON.stringify(toolsUsed.slice(0, 10)));
        }
    }
});

// Function to format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to copy text to clipboard
function copyToClipboard(text, elementId) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!');
        if (elementId) {
            const element = document.getElementById(elementId);
            element.style.borderColor = 'var(--success)';
            setTimeout(() => element.style.borderColor = '', 1000);
        }
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
}

// Loan Calculator specific functions
if (typeof window.calculateLoanPayment === 'undefined') {
    window.calculateLoanPayment = function() {
        const principal = parseFloat(document.getElementById('loan-amount')?.value);
        const annualRate = parseFloat(document.getElementById('interest-rate')?.value);
        const years = parseFloat(document.getElementById('loan-term')?.value);
        const paymentDisplay = document.getElementById('monthly-payment');
        const resultBox = document.getElementById('result-box');
        
        if (!paymentDisplay || !resultBox) return;

        if (isNaN(principal) || isNaN(annualRate) || isNaN(years) || 
            principal <= 0 || annualRate < 0 || years <= 0) {
            paymentDisplay.textContent = 'Invalid Input';
            resultBox.style.borderLeftColor = 'var(--danger)';
            showToast('Please enter valid numbers', 'error');
            return;
        }
        
        resultBox.style.borderLeftColor = 'var(--success)';

        const monthlyRate = (annualRate / 100) / 12;
        const numberOfPayments = years * 12;
        let monthlyPayment;

        if (monthlyRate === 0) {
            monthlyPayment = principal / numberOfPayments;
        } else {
            const numerator = monthlyRate * Math.pow((1 + monthlyRate), numberOfPayments);
            const denominator = Math.pow((1 + monthlyRate), numberOfPayments) - 1;
            monthlyPayment = principal * (numerator / denominator);
        }

        // Calculate total payment and interest
        const totalPayment = monthlyPayment * numberOfPayments;
        const totalInterest = totalPayment - principal;

        // Update display with more information
        paymentDisplay.innerHTML = `$${monthlyPayment.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}<br>
                                   <small>Total: $${totalPayment.toFixed(2)} | Interest: $${totalInterest.toFixed(2)}</small>`;
    };
}

// Text Case Converter specific functions
if (typeof window.convertTextCase === 'undefined') {
    window.convertTextCase = function() {
        const inputText = document.getElementById('input-text')?.value;
        const caseType = document.getElementById('case-type')?.value;
        const outputTextarea = document.getElementById('output-text');
        
        if (!inputText || !caseType || !outputTextarea) return;

        function toTitleCase(str) {
            return str.toLowerCase().split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
        }
        
        function toSentenceCase(str) {
            return str.toLowerCase().replace(/(^\s*\w|[.?!]\s*\w)/g, c => c.toUpperCase());
        }
        
        function toToggleCase(str) {
            return str.split('').map((char, index) => 
                char.match(/[a-z]/i) ? (index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()) : char
            ).join('');
        }

        let outputText;
        switch(caseType) {
            case 'uppercase':
                outputText = inputText.toUpperCase();
                break;
            case 'lowercase':
                outputText = inputText.toLowerCase();
                break;
            case 'titlecase':
                outputText = toTitleCase(inputText);
                break;
            case 'sentencecase':
                outputText = toSentenceCase(inputText);
                break;
            case 'togglecase':
                outputText = toToggleCase(inputText);
                break;
            default:
                outputText = inputText;
        }

        outputTextarea.value = outputText;
        
        // Update character count
        const charCount = document.getElementById('char-count');
        const wordCount = document.getElementById('word-count');
        
        if (charCount) {
            charCount.textContent = outputText.length;
        }
        if (wordCount) {
            wordCount.textContent = outputText.trim() === '' ? 0 : outputText.trim().split(/\s+/).length;
        }
    };
}