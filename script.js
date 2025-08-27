// ===== DOM Content Loaded Event =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize image view functionality
    const imageViewModal = document.getElementById('imageViewModal');
    if (imageViewModal) {
        imageViewModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            const imageUrl = button.getAttribute('data-image');
            const title = button.getAttribute('data-title');
            
            const modalTitle = this.querySelector('.project-view-title');
            const modalImage = this.querySelector('.project-view-image');
            
            modalTitle.textContent = title;
            modalImage.src = imageUrl;
            modalImage.alt = title;
        });
    }

    // Initialize all functionality
    initThemeToggle();
    initSmoothScrolling();
    initNavbarScroll();
    initFormValidation();
    initScrollAnimations();
    initTypingEffect();
    initProjectCards();
});

// ===== Theme Toggle Functionality =====
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', currentTheme);
    updateThemeIcon(icon, currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(icon, newTheme);
        
        // Add animation class
        themeToggle.style.transform = 'translateY(-50%) rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'translateY(-50%) rotate(0deg)';
        }, 400);
    });
}

function updateThemeIcon(icon, theme) {
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// ===== Smooth Scrolling =====
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile navbar if open
                const navbar = document.querySelector('.navbar-collapse');
                if (navbar.classList.contains('show')) {
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    navbarToggler.click();
                }
            }
        });
    });
}

// ===== Navbar Scroll Effect =====
function initNavbarScroll() {
    const navbar = document.querySelector('.custom-navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.background = '#00356B';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 53, 107, 0.3)';
        } else {
            navbar.style.background = '#00356B';
            navbar.style.boxShadow = 'none';
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
        
        // Update active nav link
        updateActiveNavLink();
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
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
}

// ===== Form Validation =====
function initFormValidation() {
    const form = document.getElementById('contactForm');
    const successAlert = document.getElementById('successAlert');
    const errorAlert = document.getElementById('errorAlert');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Hide previous alerts
        successAlert.classList.add('d-none');
        errorAlert.classList.add('d-none');
        
        // Validate form
        if (validateForm()) {
            // Show success message
            successAlert.classList.remove('d-none');
            
            // Store form data in localStorage (bonus feature)
            storeFormData();
            
            // Reset form after short delay
            setTimeout(() => {
                form.reset();
                form.classList.remove('was-validated');
                successAlert.classList.add('d-none');
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
                modal.hide();
            }, 2000);
            
        } else {
            // Show error message
            errorAlert.classList.remove('d-none');
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
}

function validateForm() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    form.classList.add('was-validated');
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Check if field is empty
    if (!value) {
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
        }
    }
    
    // Name validation (only letters and spaces)
    if ((field.id === 'firstName' || field.id === 'lastName') && value) {
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(value)) {
            isValid = false;
        }
    }
    
    // Update field classes
    field.classList.remove('is-valid', 'is-invalid');
    if (isValid) {
        field.classList.add('is-valid');
    } else {
        field.classList.add('is-invalid');
    }
    
    return isValid;
}

function storeFormData() {
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };
    
    // Get existing submissions or create new array
    let submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    
    // Add new submission
    submissions.push(formData);
    
    // Keep only last 10 submissions
    if (submissions.length > 10) {
        submissions = submissions.slice(-10);
    }
    
    // Store back to localStorage
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
    
    console.log('Form data stored successfully!');
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.project-card, .about-content, .contact-item, .skill-item');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// ===== Typing Effect =====
function initTypingEffect() {
    const typedTextElement = document.querySelector('.typed-text');
    const texts = [
        'IT Student & Developer',
        'Mobile App Developer',
        'Web Developer',
        'Problem Solver',
        'Tech Enthusiast'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseDelay = 2000;
    
    function typeText() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typedTextElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let delay = isDeleting ? deletingSpeed : typingSpeed;
        
        if (!isDeleting && charIndex === currentText.length) {
            delay = pauseDelay;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }
        
        setTimeout(typeText, delay);
    }
    
    // Start typing effect
    setTimeout(typeText, 1000);
}

// ===== Project Cards Interaction =====
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ===== Utility Functions =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== Statistics Counter Animation =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 200;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + (counter.textContent.includes('+') ? '+' : '') + (counter.textContent.includes('%') ? '%' : '');
                setTimeout(updateCounter, 10);
            } else {
                counter.textContent = target + (counter.textContent.includes('+') ? '+' : '') + (counter.textContent.includes('%') ? '%' : '');
            }
        };
        
        updateCounter();
    });
}

// ===== Initialize Counter Animation on Scroll =====
const counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }
});

// ===== Modal Enhancement =====
document.addEventListener('DOMContentLoaded', function() {
    const contactModal = document.getElementById('contactModal');
    
    contactModal.addEventListener('shown.bs.modal', function() {
        document.getElementById('firstName').focus();
    });
    
    contactModal.addEventListener('hidden.bs.modal', function() {
        const form = document.getElementById('contactForm');
        form.reset();
        form.classList.remove('was-validated');
        
        // Hide alerts
        document.getElementById('successAlert').classList.add('d-none');
        document.getElementById('errorAlert').classList.add('d-none');
        
        // Remove validation classes
        form.querySelectorAll('.is-valid, .is-invalid').forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });
    });
});

// ===== Performance Optimization =====
// Lazy load animations
const debouncedScroll = debounce(function() {
    updateActiveNavLink();
}, 10);

window.addEventListener('scroll', debouncedScroll);

// ===== Error Handling =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// ===== Console Welcome Message =====
console.log('%c👋 Welcome to Mark\'s Portfolio!', 'color: #6c5ce7; font-size: 20px; font-weight: bold;');
console.log('%cDeveloped with ❤️ using Bootstrap, CSS3, and JavaScript', 'color: #636e72; font-size: 14px;');
console.log('%cFeel free to explore the code and reach out if you have any questions!', 'color: #00b894; font-size: 12px;');