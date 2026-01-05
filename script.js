// Optional carousel handlers (guarded by null checks)
const sections = document.querySelector('.sections');
const sectionItems = document.querySelectorAll('.section1');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

let currentIndex = 0;

function showSection(index) {
    if (!sections) return;
    const totalWidth = sections.clientWidth;
    sections.style.transform = `translateX(-${index * totalWidth}px)`;
}

if (prevButton && nextButton && sections && sectionItems.length) {
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : sectionItems.length - 1;
        showSection(currentIndex);
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex < sectionItems.length - 1) ? currentIndex + 1 : 0;
        showSection(currentIndex);
    });

    // Initial display
    showSection(currentIndex);
}

// Hero stats counter animation
function animateCounter(element, target, duration = 1500) {
    const start = 0;
    const startTime = performance.now();
    function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(progress * (target - start) + start);
        element.textContent = value.toString();
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

const statSpans = document.querySelectorAll('.hero-stats .stat span[data-count]');
if (statSpans.length) {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statSpans.forEach(span => {
                    const target = parseInt(span.getAttribute('data-count') || '0', 10);
                    animateCounter(span, target);
                });
                obs.disconnect();
            }
        });
    }, { threshold: 0.2 });

    const hero = document.querySelector('.hero');
    if (hero) observer.observe(hero);
}

// Subtle tilt/parallax effect on hero image
const heroImage = document.querySelector('.hero-image img');
const supportsReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (heroImage && !supportsReducedMotion) {
    const container = heroImage.closest('.hero-image');
    if (container) {
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            heroImage.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02)`;
            heroImage.style.transition = 'transform .06s ease-out';
        });
        container.addEventListener('mouseleave', () => {
            heroImage.style.transform = 'none';
            heroImage.style.transition = 'transform .25s ease';
        });
    }
}

// Tabs behavior in hero
const tabServices = document.getElementById('tab-services');
const tabCareers = document.getElementById('tab-careers');
const panelServices = document.getElementById('panel-services');
const panelCareers = document.getElementById('panel-careers');

function activateTab(target) {
    if (!tabServices || !tabCareers || !panelServices || !panelCareers) return;
    const isServices = target === 'services';
    tabServices.classList.toggle('active', isServices);
    tabCareers.classList.toggle('active', !isServices);
    tabServices.setAttribute('aria-selected', String(isServices));
    tabCareers.setAttribute('aria-selected', String(!isServices));
    panelServices.classList.toggle('active', isServices);
    panelCareers.classList.toggle('active', !isServices);
}

if (tabServices && tabCareers) {
    tabServices.addEventListener('click', () => activateTab('services'));
    tabCareers.addEventListener('click', () => activateTab('careers'));
}

// Search action (basic behavior)
const heroSearch = document.querySelector('.hero-search');
if (heroSearch) {
    const input = heroSearch.querySelector('input');
    const button = heroSearch.querySelector('button');
    const go = () => {
        if (!input) return;
        const q = (input.value || '').trim().toLowerCase();
        if (!q) return;
        if (q.includes('track')) {
            window.location.href = 'services.html#tracking';
        } else if (q.includes('career') || q.includes('job')) {
            window.location.href = 'careers.html';
        } else {
            window.location.href = 'services.html';
        }
    };
    if (button) button.addEventListener('click', go);
    if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
}

// Accordion for logistics-pro page
const isLogisticsPro = document.body.classList.contains('logistics-pro-page');
if (isLogisticsPro) {
    const accordion = document.getElementById('faq-accordion');
    if (accordion) {
        const items = accordion.querySelectorAll('.accordion-item');
        items.forEach((btn) => {
            btn.addEventListener('click', () => {
                const expanded = btn.getAttribute('aria-expanded') === 'true';
                // close all
                items.forEach(b => b.setAttribute('aria-expanded', 'false'));
                accordion.querySelectorAll('.accordion-panel').forEach(p => p.hidden = true);
                // open current if it was closed
                if (!expanded) {
                    btn.setAttribute('aria-expanded', 'true');
                    const panel = btn.nextElementSibling;
                    if (panel && panel.classList.contains('accordion-panel')) panel.hidden = false;
                }
            });
        });
    }

    // Simple testimonial carousel
    const slides = document.querySelectorAll('.pro-carousel .pro-slide');
    const prev = document.querySelector('.pro-carousel .pro-prev');
    const next = document.querySelector('.pro-carousel .pro-next');
    let currentSlide = 0;
    const showSlide = (i) => {
        if (!slides.length) return;
        slides.forEach(s => s.classList.remove('active'));
        slides[i].classList.add('active');
    };
    if (slides.length) showSlide(currentSlide);
    const goPrev = () => { currentSlide = (currentSlide - 1 + slides.length) % slides.length; showSlide(currentSlide); };
    const goNext = () => { currentSlide = (currentSlide + 1) % slides.length; showSlide(currentSlide); };
    if (prev) prev.addEventListener('click', goPrev);
    if (next) next.addEventListener('click', goNext);
    // auto-advance
    if (slides.length) setInterval(goNext, 5000);

    // Tracking form behavior
    const trackInput = document.getElementById('track-id');
    const trackBtn = document.getElementById('track-submit');
    const trackResult = document.getElementById('track-result');
    const doTrack = () => {
        if (!trackInput || !trackResult) return;
        const id = (trackInput.value || '').trim();
        if (!id) { trackResult.textContent = 'Please enter a Tracking ID.'; return; }
        // Demo behavior: simple pattern and status mock
        const ok = /^SB-?\d{6}$/i.test(id);
        if (!ok) { trackResult.textContent = 'Invalid ID format. Example: SB-123456'; return; }
        trackResult.textContent = 'Fetching status...';
        setTimeout(() => {
            const statuses = ['Picked up from origin hub', 'In transit to destination', 'Out for delivery', 'Delivered - ePOD available'];
            const status = statuses[Math.floor(Math.random()*statuses.length)];
            trackResult.textContent = `Status for ${id}: ${status}`;
        }, 700);
    };
    if (trackBtn) trackBtn.addEventListener('click', doTrack);
    if (trackInput) trackInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doTrack(); });
}

// Milestones page behavior (scoped)
const isMilestones = document.body.classList.contains('milestones-page');
if (isMilestones) {
    const idInput = document.getElementById('ms-id');
    const submitBtn = document.getElementById('ms-submit');
    const errorEl = document.getElementById('ms-error');
    const cardEl = document.getElementById('ms-card');
    const titleEl = document.getElementById('ms-order-title');
    const subEl = document.getElementById('ms-order-sub');
    const statusEl = document.getElementById('ms-status');
    const timelineEl = document.getElementById('ms-timeline');

    const sampleMilestones = (id) => {
        const now = new Date();
        const minus = (h) => new Date(now.getTime() - h*60*60*1000);
        const fmt = (d) => d.toLocaleString();
        const steps = [
            { title: 'Order Confirmed', meta: fmt(minus(36)), icon: 'fa-receipt' },
            { title: 'Picked up from origin', meta: fmt(minus(28)), icon: 'fa-box' },
            { title: 'In transit', meta: fmt(minus(12)), icon: 'fa-road' },
            { title: 'Arrived at destination hub', meta: fmt(minus(4)), icon: 'fa-warehouse' },
            { title: 'Out for delivery', meta: fmt(minus(1)), icon: 'fa-truck-fast' },
        ];
        const delivered = /\d$/.test(id) && parseInt(id.slice(-1),10) % 3 === 0;
        if (delivered) steps.push({ title: 'Delivered - ePOD available', meta: fmt(now), icon: 'fa-clipboard-check' });
        return { steps, status: delivered ? 'Delivered' : 'In Transit', sla: delivered ? 'Closed' : 'On-time' };
    };

    const render = (id) => {
        errorEl.textContent = '';
        const ok = /^SB-?\d{6}$/i.test(id);
        if (!ok) { errorEl.textContent = 'Invalid ID format. Example: SB-123456'; return; }
        const data = sampleMilestones(id);
        titleEl.textContent = `Order ${id.toUpperCase()}`;
        subEl.textContent = `SLA: ${data.sla}`;
        statusEl.textContent = data.status;
        timelineEl.innerHTML = '';
        data.steps.forEach(s => {
            const li = document.createElement('li');
            const dot = document.createElement('span'); dot.className = 'ms-dot';
            const wrap = document.createElement('div');
            const t = document.createElement('div'); t.className = 'ms-title'; t.textContent = s.title;
            const m = document.createElement('div'); m.className = 'ms-meta'; m.textContent = s.meta;
            wrap.appendChild(t); wrap.appendChild(m);
            li.appendChild(dot); li.appendChild(wrap);
            timelineEl.appendChild(li);
        });
        cardEl.hidden = false;
    };

    const go = () => { if (idInput) render((idInput.value || '').trim()); };
    if (submitBtn) submitBtn.addEventListener('click', go);
    if (idInput) idInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
}

// Mobile menu functionality
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navMenu = document.getElementById('nav-menu');

if (mobileMenuBtn && navMenu) {
    // Check if this is the index page
    const isIndexPage = document.body.classList.contains('index-page');
    
    if (isIndexPage) {
        // Side navigation for index page
        const overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        document.body.appendChild(overlay);

        const toggleMenu = () => {
            navMenu.classList.toggle('active');
            overlay.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        };

        const closeMenu = () => {
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        };

        mobileMenuBtn.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', closeMenu);

        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    } else {
        // Full screen navigation for other pages
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });

        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}