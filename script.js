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

// Business Type "Other" toggle
const bizTypeSelect = document.querySelector('select[name="business_type"]');
const bizTypeOther = document.getElementById('businessTypeOther');
if (bizTypeSelect && bizTypeOther) {
    bizTypeSelect.addEventListener('change', function() {
        if (this.value === 'Other') {
            bizTypeOther.style.display = '';
            bizTypeOther.required = true;
            bizTypeOther.focus();
        } else {
            bizTypeOther.style.display = 'none';
            bizTypeOther.required = false;
            bizTypeOther.value = '';
        }
    });
}

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
        'Thanks for checking out YourSitesDone! Your custom website preview should be loading on your screen right now.\n\n' +
        '🎉 LOVE WHAT YOU SEE? Here\'s how to make it yours:\n\n' +
        '1. REVIEW your preview — click around, check it on your phone, show your team\n' +
        '2. CONFIRM your details — we\'ll verify your business info, phone, hours, and reviews\n' +
        '3. CHOOSE A PLAN — pick Starter ($29/mo) or Growth ($79/mo with review management)\n' +
        '4. GO LIVE — we connect your custom domain, finalize your content, and launch. Typical turnaround: 3-5 business days.\n\n' +
        '💡 WHAT\'S INCLUDED WHEN YOU GO LIVE:\n' +
        '• Your own custom domain (e.g. yourbusiness.com)\n' +
        '• Professional email setup\n' +
        '• Mobile-friendly design\n' +
        '• Google Business optimization\n' +
        '• Click-to-call buttons\n' +
        '• Hosting, maintenance & support\n\n' +
        'Questions? Just reply to this email or reach us at hello@yoursitesdone.com\n\n' +
        'Talk soon,\n' +
        'The YourSitesDone Team\n' +
        'yoursitesdone.com\n' +
        'Los Angeles, CA'
    );
    formData.append('_replyto', formData.get('email'));

    const businessName = formData.get('business') || '';

    // Submit form in background
    fetch('https://formsubmit.co/ajax/066d281035499cd4b28f68af25a44250', {
        method: 'POST',
        body: formData
    }).catch(() => {});

    // Check if we have a preview ready
    fetch('previews/index.json')
        .then(r => r.json())
        .then(index => {
            const key = businessName.toLowerCase().trim();
            const slug = index[key];
            if (slug) {
                form.innerHTML = '<div style="padding:40px;text-align:center;">' +
                    '<p style="font-size:2rem;margin-bottom:12px;">🎉</p>' +
                    '<p style="font-size:1.4rem;font-weight:700;margin-bottom:8px;">Your Website is Ready!</p>' +
                    '<p style="font-size:1rem;color:#555;margin-bottom:24px;">We already built a free preview for <strong>' + businessName + '</strong></p>' +
                    '<a href="previews/' + slug + '.html" style="display:inline-block;background:#2563eb;color:#fff;padding:16px 36px;border-radius:50px;font-size:1.1rem;font-weight:700;text-decoration:none;box-shadow:0 6px 20px rgba(37,99,235,0.3);transition:transform 0.2s;">View Your Website →</a>' +
                    '<p style="margin-top:16px;font-size:0.85rem;color:#888;">No strings attached — it\'s yours to preview for free</p>' +
                    '</div>';
            } else {
                form.innerHTML = '<p style="padding:40px;font-size:1.2rem;text-align:center;">✅ <strong>Got it!</strong> We\'re building your free website preview now. You\'ll hear from us within 48 hours!</p>';
            }
        })
        .catch(() => {
            form.innerHTML = '<p style="padding:40px;font-size:1.2rem;text-align:center;">✅ <strong>Got it!</strong> We\'ll send you your free website preview within 48 hours.</p>';
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
