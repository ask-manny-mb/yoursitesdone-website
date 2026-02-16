// Mobile nav toggle
document.querySelector('.mobile-toggle').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('open');
});

// Close mobile nav on link click
document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => document.querySelector('.nav-links').classList.remove('open'));
});

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    });
});

// Contact form - mailto fallback
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const fd = new FormData(this);
    const name = fd.get('name');
    const business = fd.get('business');
    const email = fd.get('email');
    const phone = fd.get('phone');
    const message = fd.get('message');
    const body = `Name: ${name}%0ABusiness: ${business}%0AEmail: ${email}%0APhone: ${phone}%0AMessage: ${message}`;
    window.location.href = `mailto:info@yoursitesdone.com?subject=New Website Inquiry - ${business}&body=${body}`;
    
    // Show confirmation
    this.innerHTML = '<p style="padding:40px;font-size:1.2rem;">✅ Opening your email client... If it doesn\'t open, email us at <a href="mailto:info@yoursitesdone.com" style="color:#e8722a;text-decoration:underline;">info@yoursitesdone.com</a></p>';
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
