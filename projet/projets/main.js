const filterSelect = document.getElementById('galleryFilter');
const photos = document.querySelectorAll('.sim-photo');
const lightbox = document.getElementById('simLightbox');
const lightboxMedia = document.getElementById('lightboxMedia');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

function applyGalleryFilter(value) {
    photos.forEach((photo) => {
        const category = photo.dataset.category || 'all';
        const visible = value === 'all' || value === category;
        photo.classList.toggle('is-hidden', !visible);
    });
}

function openLightbox(photo) {
    if (!lightbox || !lightboxMedia || !lightboxCaption) return;

    const caption = photo.dataset.caption || 'Photo du projet';
    lightboxCaption.textContent = caption;

    lightboxMedia.innerHTML = '';
    const fullSrc = photo.dataset.full;
    lightboxMedia.classList.toggle('has-image', Boolean(fullSrc));

    if (fullSrc) {
        const img = document.createElement('img');
        img.src = fullSrc;
        img.alt = caption;
        img.loading = 'lazy';
        img.decoding = 'async';
        lightboxMedia.appendChild(img);
    } else {
        const block = document.createElement('div');
        block.style.width = '100%';
        block.style.height = '100%';
        lightboxMedia.appendChild(block);
    }

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
}

function setupAccordion() {
    const accordion = document.querySelector('.sim-accordion');
    if (!accordion) return;

    const items = accordion.querySelectorAll('details');

    items.forEach((item) => {
        if (!item.querySelector('.sim-accordion__content')) {
            const summary = item.querySelector('summary');
            if (!summary) return;

            const contentWrap = document.createElement('div');
            contentWrap.className = 'sim-accordion__content';
            const inner = document.createElement('div');
            inner.className = 'sim-accordion__inner';

            while (summary.nextSibling) {
                inner.appendChild(summary.nextSibling);
            }

            contentWrap.appendChild(inner);
            item.appendChild(contentWrap);
        }
    });

    function openItem(item) {
        if (item.dataset.animating === '1') return;
        const content = item.querySelector('.sim-accordion__content');
        const inner = item.querySelector('.sim-accordion__inner');
        if (!content || !inner) return;

        item.dataset.animating = '1';
        item.setAttribute('open', '');
        content.style.opacity = '1';

        if (content.style.height === 'auto') {
            content.style.height = `${inner.scrollHeight}px`;
        }

        const targetHeight = inner.scrollHeight;
        requestAnimationFrame(() => {
            content.style.height = `${targetHeight}px`;
        });

        const onEnd = (event) => {
            if (event.propertyName !== 'height') return;
            content.style.height = 'auto';
            item.dataset.animating = '0';
            content.removeEventListener('transitionend', onEnd);
        };
        content.addEventListener('transitionend', onEnd);
    }

    function closeItem(item) {
        if (item.dataset.animating === '1') return;
        const content = item.querySelector('.sim-accordion__content');
        const inner = item.querySelector('.sim-accordion__inner');
        if (!content || !inner) return;

        item.dataset.animating = '1';
        const currentHeight = content.offsetHeight || inner.scrollHeight;
        content.style.height = `${currentHeight}px`;
        content.style.opacity = '1';

        requestAnimationFrame(() => {
            content.style.height = '0px';
            content.style.opacity = '0';
        });

        const onEnd = (event) => {
            if (event.propertyName !== 'height') return;
            item.removeAttribute('open');
            item.dataset.animating = '0';
            content.removeEventListener('transitionend', onEnd);
        };
        content.addEventListener('transitionend', onEnd);
    }

    items.forEach((item) => {
        const summary = item.querySelector('summary');
        const content = item.querySelector('.sim-accordion__content');
        const inner = item.querySelector('.sim-accordion__inner');
        if (!summary || !content || !inner) return;

        if (item.open) {
            content.style.height = 'auto';
            content.style.opacity = '1';
        } else {
            content.style.height = '0px';
            content.style.opacity = '0';
        }

        summary.addEventListener('click', (event) => {
            event.preventDefault();
            if (item.dataset.animating === '1') return;

            if (item.open) {
                closeItem(item);
            } else {
                items.forEach((other) => {
                    if (other !== item && other.open) {
                        closeItem(other);
                    }
                });
                openItem(item);
            }
        });
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

function setupMoodboardSlider() {
    const slider = document.getElementById('moodboardSlider');
    if (!slider) return;

    const slides = Array.from(slider.querySelectorAll('.sim-slide'));
    const dotsWrap = document.getElementById('moodboardDots');
    const prevBtn = document.getElementById('moodboardPrev');
    const nextBtn = document.getElementById('moodboardNext');
    if (!slides.length || !dotsWrap || !prevBtn || !nextBtn) return;

    let current = slides.findIndex((slide) => slide.classList.contains('is-active'));
    if (current < 0) current = 0;
    let timer = null;

    function render(index) {
        current = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            const active = i === current;
            slide.classList.toggle('is-active', active);
            slide.setAttribute('aria-hidden', active ? 'false' : 'true');
        });

        const dots = dotsWrap.querySelectorAll('.sim-slide-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('is-active', i === current);
            dot.setAttribute('aria-current', i === current ? 'true' : 'false');
        });
    }

    function goNext() {
        render(current + 1);
    }

    function goPrev() {
        render(current - 1);
    }

    function startAuto() {
        stopAuto();
        timer = window.setInterval(goNext, 4200);
    }

    function stopAuto() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'sim-slide-dot';
        dot.setAttribute('aria-label', `Aller a l'image ${i + 1}`);
        dot.addEventListener('click', () => {
            render(i);
            startAuto();
        });
        dotsWrap.appendChild(dot);
    });

    prevBtn.addEventListener('click', () => {
        goPrev();
        startAuto();
    });

    nextBtn.addEventListener('click', () => {
        goNext();
        startAuto();
    });

    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);
    slider.addEventListener('focusin', stopAuto);
    slider.addEventListener('focusout', startAuto);

    render(current);
    startAuto();
}

if (filterSelect) {
    filterSelect.addEventListener('change', (event) => {
        applyGalleryFilter(event.target.value);
    });
}

photos.forEach((photo) => {
    photo.addEventListener('click', () => openLightbox(photo));
});

if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

if (lightbox) {
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });
}

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox && lightbox.classList.contains('is-open')) {
        closeLightbox();
    }
});

setupAccordion();
setupMoodboardSlider();
setupCookieBanner();
