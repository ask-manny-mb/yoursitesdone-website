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

// Contact form - FormSubmit.co (free, no signup)
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const form = this;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const formData = new FormData(form);
    formData.append('_subject', 'New Website Inquiry - ' + formData.get('business'));
    formData.append('_captcha', 'false');
    formData.append('_template', 'table');

    fetch('https://formsubmit.co/ajax/066d281035499cd4b28f68af25a44250', {
        method: 'POST',
        body: formData
    }).then(response => response.json()).then(data => {
        if (data.success) {
            form.innerHTML = '<p style="padding:40px;font-size:1.2rem;text-align:center;">✅ <strong>Got it!</strong> We\'ll send you your free website preview within 48 hours.</p>';
        } else {
            btn.textContent = originalText;
            btn.disabled = false;
            alert('Something went wrong. Please email us at hello@yoursitesdone.com');
        }
    }).catch(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        alert('Something went wrong. Please email us at hello@yoursitesdone.com');
    });
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
