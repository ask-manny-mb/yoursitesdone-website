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

    var selPlan = window._selectedPlan || '';
    var starterStyle = selPlan === 'starter'
        ? 'display:inline-block;background:#f97316;color:#fff;padding:14px 32px;border-radius:50px;font-size:1.05rem;font-weight:700;text-decoration:none;box-shadow:0 4px 16px rgba(249,115,22,0.3);'
        : 'display:inline-block;background:transparent;color:#f97316;border:2px solid #f97316;padding:12px 28px;border-radius:50px;font-size:0.95rem;font-weight:700;text-decoration:none;';
    var growthStyle = selPlan === 'growth'
        ? 'display:inline-block;background:#f97316;color:#fff;padding:14px 32px;border-radius:50px;font-size:1.05rem;font-weight:700;text-decoration:none;box-shadow:0 4px 16px rgba(249,115,22,0.3);'
        : 'display:inline-block;background:transparent;color:#f97316;border:2px solid #f97316;padding:12px 28px;border-radius:50px;font-size:0.95rem;font-weight:700;text-decoration:none;';
    var buyHeading = selPlan
        ? 'Almost there! Complete your ' + (selPlan === 'starter' ? 'Starter' : 'Growth') + ' subscription:'
        : 'Ready to make it yours? Pick a plan:';
    var buyButtons = '<div style="margin-top:24px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.1);">' +
        '<p style="font-size:0.95rem;color:rgba(255,255,255,0.7);margin-bottom:16px;">' + buyHeading + '</p>' +
        '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">' +
        '<a href="https://buy.stripe.com/4gMdR17aVe194H5esw5Ne04" target="_blank" style="' + starterStyle + '">Starter — $29/mo</a>' +
        '<a href="https://buy.stripe.com/7sYaEP2UFbT15L97045Ne05" target="_blank" style="' + growthStyle + '">Growth — $79/mo</a>' +
        '</div>' +
        '<p style="margin-top:12px;font-size:0.8rem;color:rgba(255,255,255,0.4);">$0 setup for founding clients · No contracts · Cancel anytime</p>' +
        '</div>';

    // Check if we have a preview ready
    fetch('previews/index.json')
        .then(r => r.json())
        .then(index => {
            const key = businessName.toLowerCase().trim();
            const slug = index[key];
            if (slug) {
                form.innerHTML = '<div style="padding:40px;text-align:center;">' +
                    '<p style="font-size:2rem;margin-bottom:12px;">🎉</p>' +
                    '<p style="font-size:1.4rem;font-weight:700;margin-bottom:8px;color:#fff;">Your Website is Ready!</p>' +
                    '<p style="font-size:1rem;color:rgba(255,255,255,0.7);margin-bottom:24px;">We already built a free preview for <strong style="color:#fff;">' + businessName + '</strong></p>' +
                    '<a href="previews/' + slug + '.html" style="display:inline-block;background:#22c55e;color:#fff;padding:16px 36px;border-radius:50px;font-size:1.1rem;font-weight:700;text-decoration:none;box-shadow:0 6px 20px rgba(34,197,94,0.3);">View Your Website →</a>' +
                    '<p style="margin-top:12px;font-size:0.85rem;color:rgba(255,255,255,0.5);">No strings attached — it\'s yours to preview for free</p>' +
                    buyButtons +
                    '</div>';
            } else {
                form.innerHTML = '<div style="padding:40px;text-align:center;">' +
                    '<p style="font-size:2rem;margin-bottom:12px;">✅</p>' +
                    '<p style="font-size:1.2rem;font-weight:700;color:#fff;margin-bottom:8px;">Got it! We\'re building your website now.</p>' +
                    '<p style="font-size:1rem;color:rgba(255,255,255,0.7);margin-bottom:4px;">You\'ll receive an email with your custom preview link within 48 hours.</p>' +
                    buyButtons +
                    '</div>';
            }
        })
        .catch(() => {
            form.innerHTML = '<div style="padding:40px;text-align:center;">' +
                '<p style="font-size:2rem;margin-bottom:12px;">✅</p>' +
                '<p style="font-size:1.2rem;font-weight:700;color:#fff;margin-bottom:8px;">Got it! We\'ll send you your free website preview within 48 hours.</p>' +
                buyButtons +
                '</div>';
        });
});

// Plan-aware scroll — update form messaging when clicking pricing buttons
document.querySelectorAll('a[data-plan]').forEach(a => {
    a.addEventListener('click', function(e) {
        e.preventDefault();
        const plan = this.getAttribute('data-plan');
        const banner = document.getElementById('planBanner');
        const bannerText = document.getElementById('planBannerText');
        const heading = document.getElementById('formHeading');
        const sub = document.getElementById('formSubheading');

        if (plan === 'starter') {
            banner.style.display = 'block';
            bannerText.innerHTML = '🎉 Great choice — Starter Plan ($29/mo)';
            heading.textContent = "Let's Build Your Website";
            sub.textContent = "Fill out the basics below and we'll create a custom preview of your new site. Takes 30 seconds.";
        } else if (plan === 'growth') {
            banner.style.display = 'block';
            bannerText.innerHTML = '⚡ Great choice — Growth Plan ($79/mo)';
            heading.textContent = "Let's Build Your Website";
            sub.textContent = "Fill out the basics below and we'll create a custom preview of your new site. The more detail you add, the better it looks.";
        }

        // Store selected plan for after form submission
        window._selectedPlan = plan;

        document.querySelector('#contact').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Smooth scroll for anchor links (non-plan links)
document.querySelectorAll('a[href^="#"]:not([data-plan])').forEach(a => {
    a.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
