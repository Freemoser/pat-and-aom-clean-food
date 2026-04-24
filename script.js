// Main restaurant website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const defaultFallbackImage = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
    const applyFallback = (img) => {
        if (img.dataset.fallbackApplied === '1') return;
        img.dataset.fallbackApplied = '1';
        img.src = img.dataset.fallback || defaultFallbackImage;
    };

    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', () => applyFallback(img));

        // If the image is already broken by the time this runs
        if (img.complete && img.naturalWidth === 0) {
            applyFallback(img);
        }
    });

    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu after click
                navMenu.classList.remove('active');
            }
        });
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Form validation for contact (if contact form exists)
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const name = document.querySelector('#name').value.trim();
            const email = document.querySelector('#email').value.trim();
            const message = document.querySelector('#message').value.trim();
            
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Here you would normally send the form data to a server
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
