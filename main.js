let currentIndex = 0;

function moveSlider(direction) {
    const slider = document.getElementById('slider');
    const cards = document.querySelectorAll('.project-card');
    
    if (cards.length === 0) return; // Sécurité si aucune carte n'est trouvée

    const totalCards = cards.length;
    const visibleCards = 2;
    const maxIndex = Math.max(0, totalCards - visibleCards);

    // 1. Calcul dynamique de la largeur (Carte + Espace de 25px)
    // offsetWidth mesure la largeur réelle de la carte peu importe l'écran
    const gap = 25; 
    const step = cards[0].offsetWidth + gap;

    // 2. Mise à jour de l'index
    currentIndex += direction;

    // 3. Boucle infinie
    if (currentIndex > maxIndex) {
        currentIndex = 0;
    } else if (currentIndex < 0) {
        currentIndex = maxIndex;
    }

    // 4. Application du mouvement fluide
    const offset = -currentIndex * step;
    slider.style.transform = `translateX(${offset}px)`;
}

function updateTimelineProgress() {
    const timeline = document.getElementById('timeline');
    if (!timeline) return;
    const futureBox = timeline.querySelector('.future-box');
    if (!futureBox) return;

    const timelineRect = timeline.getBoundingClientRect();
    const futureRect = futureBox.getBoundingClientRect();
    const timelineTop = window.scrollY + timelineRect.top;
    const futureTop = window.scrollY + futureRect.top;
    const maxLineHeight = Math.max(0, futureTop - timelineTop);

    // Point de lecture du scroll (un peu sous le haut de l'ecran)
    const scrollProbe = window.scrollY + (window.innerHeight * 0.75);
    const rawProgress = (scrollProbe - timelineTop) / (maxLineHeight || 1);
    const progress = Math.max(0, Math.min(1, rawProgress));

    const lineHeight = maxLineHeight * progress;
    timeline.style.setProperty('--line-height', `${lineHeight.toFixed(2)}px`);
}

function revealTimelineItems() {
    const items = document.querySelectorAll('.timeline .container');
    const triggerY = window.innerHeight * 0.85;

    items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        if (rect.top <= triggerY) {
            item.classList.add('is-visible');
        }
    });
}

function updateTimelineOnScroll() {
    updateTimelineProgress();
    revealTimelineItems();
    revealSkillCards();
}

function setupSkills() {
    const cards = document.querySelectorAll('.skill-card');
    cards.forEach((card) => {
        const level = card.dataset.level || '0';
        card.style.setProperty('--skill-level', `${level}%`);
    });

    const filters = document.querySelectorAll('.skills-filter');
    filters.forEach((btn) => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter || 'all';

            filters.forEach((item) => item.classList.remove('is-active'));
            btn.classList.add('is-active');

            cards.forEach((card) => {
                const domain = card.dataset.domain || '';
                const visible = filter === 'all' || domain === filter;
                card.classList.toggle('is-hidden', !visible);
                if (visible) {
                    card.classList.remove('is-visible');
                }
            });

            revealSkillCards();
        });
    });
}

function setupTimelineLinks() {
    const cards = document.querySelectorAll('.timeline .texte-box[data-url], .timeline .future-box[data-url]');

    cards.forEach((card) => {
        const url = card.dataset.url;
        if (!url) return;

        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'link');
        card.setAttribute('aria-label', 'Ouvrir le lien associe');

        card.addEventListener('click', () => {
            window.open(url, '_blank', 'noopener,noreferrer');
        });

        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        });
    });
}

function revealSkillCards() {
    const cards = document.querySelectorAll('.skill-card:not(.is-hidden)');
    const triggerY = window.innerHeight * 0.9;

    cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        if (rect.top <= triggerY) {
            card.classList.add('is-visible');
        }
    });
}

function setupCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    const acceptBtn = document.getElementById('cookieAcceptBtn');
    const refuseBtn = document.getElementById('cookieRefuseBtn');
    if (!banner || !acceptBtn || !refuseBtn) return;

    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
        banner.classList.add('is-visible');
    }

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookie-consent', 'accepted');
        banner.classList.remove('is-visible');
    });

    refuseBtn.addEventListener('click', () => {
        localStorage.setItem('cookie-consent', 'refused');
        banner.classList.remove('is-visible');
    });
}

function setupTopLinks() {
    const topLinks = document.querySelectorAll('a[href="#top"]');
    topLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

setupSkills();
setupTimelineLinks();
setupCookieBanner();
setupTopLinks();
updateTimelineOnScroll();
window.addEventListener('scroll', updateTimelineOnScroll);
window.addEventListener('resize', updateTimelineOnScroll);
window.addEventListener('load', updateTimelineOnScroll);
