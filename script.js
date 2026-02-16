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
    formData.append('_subject', 'New Form Request - ' + formData.get('business'));
    formData.append('_captcha', 'false');
    formData.append('_template', 'table');
    formData.append('_autoresponse', 
        'Hi ' + formData.get('name') + '! 👋\n\n' +
        'Thanks for reaching out to YourSitesDone! We received your request and we\'re excited to get started.\n\n' +
        '📋 HERE\'S WHAT HAPPENS NEXT:\n\n' +
        '1. Our team reviews your business details (usually within a few hours)\n' +
        '2. We research your industry, competitors, and local market\n' +
        '3. We design a custom, mobile-friendly website tailored to your business\n' +
        '4. You\'ll receive an email with a live preview link — completely free to review\n\n' +
        '⏰ TIMELINE: Your free website preview will be ready within 48 hours.\n\n' +
        '💡 NO COMMITMENT: You\'re under zero obligation. If you love it, we\'ll talk about making it yours. If not, no hard feelings.\n\n' +
        'Questions in the meantime? Just reply to this email or reach us at hello@yoursitesdone.com\n\n' +
        'Talk soon,\n' +
        'The YourSitesDone Team\n' +
        'yoursitesdone.com\n' +
        'Los Angeles, CA'
    );
    formData.append('_replyto', formData.get('email'));

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
