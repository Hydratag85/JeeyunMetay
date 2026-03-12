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
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
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

setupCookieBanner();
