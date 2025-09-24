// Theme Management
class ThemeManager {
    constructor() {
        this.themeToggleBtn = document.getElementById('theme-toggle');
        this.themeIcon = this.themeToggleBtn?.querySelector('.theme-icon');
        this.currentTheme = this.getInitialTheme();
        
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        this.updateIcon();
        this.bindEvents();
    }
    
    getInitialTheme() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('pca-theme');
        if (savedTheme) {
            return savedTheme;
        }
        
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        
        return 'light';
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-color-scheme', theme);
        this.currentTheme = theme;
        localStorage.setItem('pca-theme', theme);
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        
        // Add rotation animation
        if (this.themeToggleBtn) {
            this.themeToggleBtn.classList.add('rotating');
            setTimeout(() => {
                this.themeToggleBtn.classList.remove('rotating');
            }, 300);
        }
        
        this.applyTheme(newTheme);
        this.updateIcon();
        
        // Show notification
        const message = newTheme === 'dark' ? 
            'Modo escuro ativado 🌙' : 
            'Modo claro ativado ☀️';
        showNotification(message, 'info');
    }
    
    updateIcon() {
        if (this.themeIcon) {
            this.themeIcon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
        }
    }
    
    bindEvents() {
        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
        }
        
        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                const savedTheme = localStorage.getItem('pca-theme');
                if (!savedTheme) {
                    const newTheme = e.matches ? 'dark' : 'light';
                    this.applyTheme(newTheme);
                    this.updateIcon();
                }
            });
        }
    }
}

// Data for the application
const comparisonData = [
    {
        aspecto: "Prazo para apresentação do DFD",
        antigo: "Até 1º dia útil de julho",
        novo: "Até último dia útil de agosto",
        impact: "medium"
    },
    {
        aspecto: "Prazo para consolidação dos DFDs",
        antigo: "Até último dia útil de agosto",
        novo: "Até último dia útil de setembro",
        impact: "medium"
    },
    {
        aspecto: "Prazo para aprovação do PCA",
        antigo: "Até último dia útil de setembro",
        novo: "Até último dia útil de outubro",
        impact: "medium"
    },
    {
        aspecto: "Prazo para publicação do PCA",
        antigo: "Até 15 de outubro",
        novo: "Até 14 de novembro",
        impact: "high"
    },
    {
        aspecto: "Conteúdo obrigatório no DFD",
        antigo: "13 itens obrigatórios (incluindo sustentabilidade)",
        novo: "10 itens obrigatórios (removeu sustentabilidade)",
        impact: "high"
    },
    {
        aspecto: "Fluxo de aprovação",
        antigo: "Autoridade administrativa → Autoridade competente (facultativo)",
        novo: "Autoridade administrativa → Autoridade competente (obrigatório)",
        impact: "high"
    },
    {
        aspecto: "Órgão responsável por casos omissos",
        antigo: "UGCM",
        novo: "CMSC/Manaus",
        impact: "low"
    }
];

// Initialize theme manager
let themeManager;

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme manager first
    themeManager = new ThemeManager();
    
    // Initialize other functionality
    initializeNavigation();
    initializeDFDSteps();
    initializeFAQ();
    populateComparisonTable();
    initializeDownloadButton();
    addScrollAnimations();
    addNotificationStyles();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Highlight active navigation item on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const headerHeight = document.querySelector('.header').offsetHeight;
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// DFD Steps expansion functionality
function initializeDFDSteps() {
    const stepCards = document.querySelectorAll('.step-card');
    
    stepCards.forEach(card => {
        const header = card.querySelector('.step-header');
        const expandBtn = card.querySelector('.expand-btn');
        const details = card.querySelector('.step-details');
        
        header.addEventListener('click', function() {
            const isExpanded = details.classList.contains('show');
            
            // Close all other step details
            document.querySelectorAll('.step-details').forEach(detail => {
                detail.classList.remove('show');
            });
            
            document.querySelectorAll('.expand-btn').forEach(btn => {
                btn.textContent = '+';
                btn.style.transform = 'rotate(0deg)';
            });
            
            // Toggle current step
            if (!isExpanded) {
                details.classList.add('show');
                expandBtn.textContent = '−';
                expandBtn.style.transform = 'rotate(180deg)';
                
                // Scroll to step if needed
                setTimeout(() => {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const cardTop = card.offsetTop - headerHeight - 20;
                    
                    if (window.pageYOffset > cardTop || window.pageYOffset < cardTop - 100) {
                        window.scrollTo({
                            top: cardTop,
                            behavior: 'smooth'
                        });
                    }
                }, 300);
            }
        });
    });
}

// FAQ Accordion functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        question.addEventListener('click', function() {
            const isOpen = answer.classList.contains('show');
            
            // Close all other FAQ items
            document.querySelectorAll('.faq-answer').forEach(ans => {
                ans.classList.remove('show');
            });
            
            document.querySelectorAll('.faq-toggle').forEach(tog => {
                tog.textContent = '+';
                tog.style.transform = 'rotate(0deg)';
            });
            
            // Toggle current FAQ item
            if (!isOpen) {
                answer.classList.add('show');
                toggle.textContent = '−';
                toggle.style.transform = 'rotate(180deg)';
            }
        });
    });
}

// Populate comparison table
function populateComparisonTable() {
    const tbody = document.getElementById('comparison-tbody');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    comparisonData.forEach(item => {
        const row = document.createElement('tr');
        
        const impactClass = `impact-${item.impact}`;
        const impactText = getImpactText(item.impact);
        
        row.innerHTML = `
            <td><strong>${item.aspecto}</strong></td>
            <td>${item.antigo}</td>
            <td><strong>${item.novo}</strong></td>
            <td><span class="${impactClass}">${impactText}</span></td>
        `;
        
        tbody.appendChild(row);
    });
}

// Get impact text based on level
function getImpactText(impact) {
    switch(impact) {
        case 'high':
            return 'Alto';
        case 'medium':
            return 'Médio';
        case 'low':
            return 'Baixo';
        default:
            return 'Médio';
    }
}

// Download button functionality
function initializeDownloadButton() {
    const downloadBtn = document.getElementById('download-decree');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            showNotification('Download do Decreto nº 6.239/2025 iniciado!', 'success');
            
            // Simulate download - in real scenario, this would be a file download
            setTimeout(() => {
                showNotification('Para obter o decreto completo, entre em contato com a Prefeitura de Manaus.', 'info');
            }, 2000);
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--color-surface);
        border: 1px solid var(--color-card-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: var(--space-12);
        padding: var(--space-16);
    `;
    
    const icon = notification.querySelector('.notification-icon');
    icon.style.cssText = `
        font-size: 1.2rem;
        flex-shrink: 0;
    `;
    
    const message_elem = notification.querySelector('.notification-message');
    message_elem.style.cssText = `
        flex-grow: 1;
        color: var(--color-text);
        font-size: var(--font-size-sm);
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: var(--font-size-lg);
        cursor: pointer;
        color: var(--color-text-secondary);
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-sm);
        transition: background var(--duration-fast) var(--ease-standard);
    `;
    
    closeBtn.addEventListener('mouseenter', function() {
        this.style.background = 'var(--color-secondary)';
    });
    
    closeBtn.addEventListener('mouseleave', function() {
        this.style.background = 'none';
    });
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success':
            return '✅';
        case 'error':
            return '❌';
        case 'warning':
            return '⚠️';
        case 'info':
        default:
            return 'ℹ️';
    }
}

// Add scroll animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.card, .phase-card, .despesa-card, .faq-item');
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });
}

// Add CSS animations for notifications
function addNotificationStyles() {
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100%);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Utility functions for enhanced user experience
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Enhanced scroll handling with debounce
const handleScroll = debounce(() => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const headerHeight = document.querySelector('.header').offsetHeight;
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 50;
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}, 100);

window.addEventListener('scroll', handleScroll);

// Keyboard navigation enhancement
document.addEventListener('keydown', function(e) {
    // ESC key closes open FAQ items and step details
    if (e.key === 'Escape') {
        document.querySelectorAll('.faq-answer.show').forEach(answer => {
            answer.classList.remove('show');
        });
        
        document.querySelectorAll('.step-details.show').forEach(detail => {
            detail.classList.remove('show');
        });
        
        document.querySelectorAll('.faq-toggle, .expand-btn').forEach(btn => {
            btn.textContent = '+';
            btn.style.transform = 'rotate(0deg)';
        });
    }
    
    // Ctrl/Cmd + D toggles theme
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        if (themeManager) {
            themeManager.toggleTheme();
        }
    }
});

// Error handling for missing elements
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
});

// Print functionality
function printPage() {
    // Expand all sections before printing
    document.querySelectorAll('.step-details').forEach(detail => {
        detail.classList.add('show');
    });
    
    document.querySelectorAll('.faq-answer').forEach(answer => {
        answer.classList.add('show');
    });
    
    window.print();
}

// Add print button functionality if needed
const printBtn = document.getElementById('print-btn');
if (printBtn) {
    printBtn.addEventListener('click', printPage);
}

// Accessibility improvements
function improveAccessibility() {
    // Add ARIA labels to interactive elements
    document.querySelectorAll('.expand-btn').forEach((btn, index) => {
        btn.setAttribute('aria-label', `Expandir detalhes da etapa ${index + 1}`);
        btn.setAttribute('aria-expanded', 'false');
    });
    
    document.querySelectorAll('.faq-question').forEach((question, index) => {
        question.setAttribute('aria-expanded', 'false');
        question.setAttribute('aria-controls', `faq-answer-${index}`);
    });
    
    document.querySelectorAll('.faq-answer').forEach((answer, index) => {
        answer.setAttribute('id', `faq-answer-${index}`);
    });
}

// Initialize accessibility improvements
improveAccessibility();

// Mobile menu toggle (if needed for smaller screens)
function initializeMobileMenu() {
    const header = document.querySelector('.header');
    const nav = document.querySelector('.nav-menu');
    
    // Add mobile menu button if screen is small
    if (window.innerWidth <= 768) {
        let mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (!mobileMenuBtn) {
            mobileMenuBtn = document.createElement('button');
            mobileMenuBtn.className = 'mobile-menu-btn';
            mobileMenuBtn.innerHTML = '☰';
            mobileMenuBtn.style.cssText = `
                display: block;
                background: none;
                border: none;
                color: var(--color-btn-primary-text);
                font-size: var(--font-size-xl);
                cursor: pointer;
                padding: var(--space-8);
                border-radius: var(--radius-sm);
                transition: background var(--duration-fast) var(--ease-standard);
            `;
            
            // Insert before theme toggle
            const themeContainer = header.querySelector('.theme-toggle-container');
            if (themeContainer) {
                themeContainer.parentNode.insertBefore(mobileMenuBtn, themeContainer);
            } else {
                header.querySelector('.header-content').appendChild(mobileMenuBtn);
            }
            
            mobileMenuBtn.addEventListener('click', function() {
                nav.classList.toggle('mobile-open');
                this.textContent = nav.classList.contains('mobile-open') ? '×' : '☰';
                
                // Add mobile styles to nav if opened
                if (nav.classList.contains('mobile-open')) {
                    nav.style.cssText = `
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: var(--color-primary);
                        flex-direction: column;
                        padding: var(--space-16);
                        box-shadow: var(--shadow-lg);
                        border-radius: 0 0 var(--radius-lg) var(--radius-lg);
                    `;
                } else {
                    nav.style.cssText = '';
                }
            });
            
            mobileMenuBtn.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(255, 255, 255, 0.1)';
            });
            
            mobileMenuBtn.addEventListener('mouseleave', function() {
                this.style.background = 'none';
            });
        }
    }
}

// Initialize mobile menu on load and resize
window.addEventListener('load', initializeMobileMenu);
window.addEventListener('resize', debounce(initializeMobileMenu, 300));

// Export functions for potential external use
window.PCASite = {
    showNotification,
    printPage,
    toggleTheme: () => themeManager?.toggleTheme(),
    getCurrentTheme: () => themeManager?.currentTheme,
    scrollToSection: function(sectionId) {
        const section = document.querySelector(`#${sectionId}`);
        if (section) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            window.scrollTo({
                top: section.offsetTop - headerHeight - 20,
                behavior: 'smooth'
            });
        }
    }
};