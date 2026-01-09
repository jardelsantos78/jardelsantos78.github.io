/**
 * Script Consolidado e Otimizado - Jardel Santos
 * Inclui: Menu Mobile, Carrossel de Destaques, Casos de Sucesso e Certificações
 * Funcionalidades: Auto-play, Pausa na interação e Suporte a Touch (Swipe)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MENU MOBILE (Universal) ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // --- 2. CARROSSEL DE DESTAQUES (index.html) ---
    const track = document.getElementById('carouselTrack');
    if (track) {
        const slides = Array.from(track.children);
        const dotsContainer = document.getElementById('carouselDots');
        const nextButton = document.getElementById('nextBtn');
        const prevButton = document.getElementById('prevBtn');
        let currentSlideIndex = 0;
        let autoPlayInterval;
        let touchStartX = 0;
        let touchEndX = 0;

        function setupDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => moveToSlide(index));
                dotsContainer.appendChild(dot);
            });
        }

        function updateDots(index) {
            const dots = dotsContainer?.querySelectorAll('.dot');
            dots?.forEach((d, i) => d.classList.toggle('active', i === index));
        }

        function moveToSlide(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            track.style.transform = `translateX(-${index * 100}%)`;
            currentSlideIndex = index;
            updateDots(index);
        }

        function startAutoPlay() {
            stopAutoPlay();
            autoPlayInterval = setInterval(() => moveToSlide(currentSlideIndex + 1), 6000);
        }

        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        // Lógica de Swipe (Dedo)
        track.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        }, {passive: true});

        track.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            const threshold = 50;
            if (touchStartX - touchEndX > threshold) moveToSlide(currentSlideIndex + 1);
            else if (touchEndX - touchStartX > threshold) moveToSlide(currentSlideIndex - 1);
            startAutoPlay();
        }, {passive: true});

        if (nextButton) nextButton.addEventListener('click', () => { moveToSlide(currentSlideIndex + 1); startAutoPlay(); });
        if (prevButton) prevButton.addEventListener('click', () => { moveToSlide(currentSlideIndex - 1); startAutoPlay(); });
        
        track.addEventListener('mouseenter', stopAutoPlay);
        track.addEventListener('mouseleave', startAutoPlay);

        setupDots();
        startAutoPlay();
    }

    // --- 3. CARROSSEL DE CASOS DE SUCESSO ---
    const casesTrack = document.getElementById('casesTrack');
    const casesDotsContainer = document.getElementById('casesDots');

    if (casesTrack && casesDotsContainer) {
        const cards = Array.from(casesTrack.children);
        let currentIndex = 0;
        let isPaused = false;
        let tStartX = 0;
        let tEndX = 0;

        const getItemsPerView = () => window.innerWidth <= 992 ? 1 : 3;

        function setupCasesDots() {
            casesDotsContainer.innerHTML = '';
            const totalSteps = cards.length - getItemsPerView() + 1;
            for (let i = 0; i < totalSteps; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => { currentIndex = i; updateCasesCarousel(); isPaused = true; });
                casesDotsContainer.appendChild(dot);
            }
        }

        function updateCasesCarousel() {
            const isMobile = window.innerWidth <= 992;
            const cardWidth = cards[0].getBoundingClientRect().width;
            const gap = isMobile ? 0 : 20; 
            casesTrack.style.transform = `translateX(-${(cardWidth + gap) * currentIndex}px)`;
            const dots = casesDotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        }

        // Swipe para Casos de Sucesso
        casesTrack.addEventListener('touchstart', e => { tStartX = e.changedTouches[0].screenX; isPaused = true; }, {passive: true});
        casesTrack.addEventListener('touchend', e => {
            tEndX = e.changedTouches[0].screenX;
            const steps = cards.length - getItemsPerView() + 1;
            if (tStartX - tEndX > 50 && currentIndex < steps - 1) currentIndex++;
            else if (tEndX - tStartX > 50 && currentIndex > 0) currentIndex--;
            updateCasesCarousel();
        }, {passive: true});

        setInterval(() => {
            if (!isPaused) {
                currentIndex = (currentIndex + 1) % (cards.length - getItemsPerView() + 1);
                updateCasesCarousel();
            }
        }, 6000);

        casesTrack.addEventListener('mouseenter', () => isPaused = true);
        casesTrack.addEventListener('mouseleave', () => isPaused = false);
        window.addEventListener('resize', () => { currentIndex = 0; setupCasesDots(); updateCasesCarousel(); });
        setupCasesDots();
    }

    // --- 4. CARROSSEL DE CERTIFICAÇÕES (sobre.html) ---
    const certTrack = document.getElementById('certGrid');
    const certDotsNav = document.getElementById('certDots');

    if (certTrack && certDotsNav) {
        const certs = Array.from(certTrack.children);
        let certIndex = 0;
        let certPaused = false;
        let cTouchStartX = 0;
        let cTouchEndX = 0;

        function setupCertDots() {
            certDotsNav.innerHTML = '';
            if (window.innerWidth <= 992) {
                certs.forEach((_, i) => {
                    const dot = document.createElement('div');
                    dot.classList.add('dot');
                    if (i === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => { certIndex = i; updateCertCarousel(); certPaused = true; });
                    certDotsNav.appendChild(dot);
                });
            }
        }

        function updateCertCarousel() {
            if (window.innerWidth <= 992) {
                certTrack.style.transform = `translateX(-${certIndex * 100}%)`;
                const dots = certDotsNav.querySelectorAll('.dot');
                dots.forEach((dot, i) => dot.classList.toggle('active', i === certIndex));
            } else {
                certTrack.style.transform = 'none';
            }
        }

        // Swipe para Certificações
        certTrack.addEventListener('touchstart', e => { cTouchStartX = e.changedTouches[0].screenX; certPaused = true; }, {passive: true});
        certTrack.addEventListener('touchend', e => {
            cTouchEndX = e.changedTouches[0].screenX;
            if (cTouchStartX - cTouchEndX > 50 && certIndex < certs.length - 1) certIndex++;
            else if (cTouchEndX - cTouchStartX > 50 && certIndex > 0) certIndex--;
            updateCertCarousel();
        }, {passive: true});

        setInterval(() => {
            if (!certPaused && window.innerWidth <= 992) {
                certIndex = (certIndex + 1) % certs.length;
                updateCertCarousel();
            }
        }, 4000);

        certTrack.addEventListener('mouseenter', () => certPaused = true);
        certTrack.addEventListener('mouseleave', () => certPaused = false);
        window.addEventListener('resize', () => { certIndex = 0; setupCertDots(); updateCertCarousel(); });
        setupCertDots();
    }
});