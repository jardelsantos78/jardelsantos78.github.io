/**
 * Script Consolidado - Jardel Santos
 * Abrange: Index, Sobre, Serviços, Artigos e Páginas de Conteúdo
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MENU MOBILE (Universal) ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Fecha o menu ao clicar em um link (útil para links com âncoras #)
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
        const nextButton = document.getElementById('nextBtn');
        const prevButton = document.getElementById('prevBtn');
        const dotsContainer = document.getElementById('carouselDots');
        let currentSlideIndex = 0;

        // Limpeza e criação de dots
        if (dotsContainer) {
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
            const dots = document.querySelectorAll('.dot');
            dots.forEach(d => d.classList.remove('active'));
            if(dots[index]) dots[index].classList.add('active');
        }

        function moveToSlide(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            track.style.transform = `translateX(-${index * 100}%)`;
            currentSlideIndex = index;
            updateDots(index);
        }

        if (nextButton) nextButton.addEventListener('click', () => moveToSlide(currentSlideIndex + 1));
        if (prevButton) prevButton.addEventListener('click', () => moveToSlide(currentSlideIndex - 1));

        // Auto-play
        let autoPlay = setInterval(() => moveToSlide(currentSlideIndex + 1), 6000);
        track.addEventListener('mouseenter', () => clearInterval(autoPlay));
        track.addEventListener('mouseleave', () => {
            autoPlay = setInterval(() => moveToSlide(currentSlideIndex + 1), 6000);
        });
    }

    // --- 3. SCROLL DE CERTIFICAÇÕES E CARDS (Páginas Diversas) ---
    // Atua em .certifications-grid ou .article-grid se houver id certDots
    const grid = document.querySelector('.certifications-grid') || document.querySelector('.article-grid');
    const dotsNav = document.getElementById('certDots');

    if (grid && dotsNav) {
        const cards = grid.children;
        
        // Gera dots dinamicamente
        Array.from(cards).forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                const gap = 20;
                const scrollPos = i * (cards[0].offsetWidth + gap);
                grid.scrollTo({ left: scrollPos, behavior: 'smooth' });
            });
            dotsNav.appendChild(dot);
        });

        // Sincroniza dots com o scroll manual
        grid.addEventListener('scroll', () => {
            const gap = 20;
            const index = Math.round(grid.scrollLeft / (cards[0].offsetWidth + gap));
            const dots = dotsNav.querySelectorAll('.dot');
            dots.forEach((d, i) => d.classList.toggle('active', i === index));
        });
    }


document.addEventListener('DOMContentLoaded', () => {

    // --- 3. CARROSSEL DE CASOS DE SUCESSO (Versão Desktop + Mobile) ---
    const casesTrack = document.getElementById('casesTrack');
    const casesDotsContainer = document.getElementById('casesDots');

    if (casesTrack && casesDotsContainer) {
        const cards = Array.from(casesTrack.children);
        let currentIndex = 0;
        let isPaused = false;
        
        // Variáveis para Touch
        let touchStartX = 0;
        let touchEndX = 0;

        function getItemsPerView() {
            return window.innerWidth <= 992 ? 1 : 3;
        }

        function setupCasesDots() {
            casesDotsContainer.innerHTML = '';
            const itemsPerView = getItemsPerView();
            const totalSteps = cards.length - itemsPerView + 1;

            for (let i = 0; i < totalSteps; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateCasesCarousel();
                    isPaused = true;
                });
                casesDotsContainer.appendChild(dot);
            }
        }

        function updateCasesCarousel() {
            const isMobile = window.innerWidth <= 992;
            const cardWidth = cards[0].getBoundingClientRect().width;
            const gap = isMobile ? 0 : 20; 
            const moveAmount = (cardWidth + gap) * currentIndex;
            
            casesTrack.style.transform = `translateX(-${moveAmount}px)`;
            
            const dots = casesDotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        // Lógica de Swipe para Casos de Sucesso
        casesTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            isPaused = true;
        }, {passive: true});

        casesTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const threshold = 50;
            const itemsPerView = getItemsPerView();
            const totalSteps = cards.length - itemsPerView + 1;

            if (touchStartX - touchEndX > threshold) { // Deslize para esquerda
                if (currentIndex < totalSteps - 1) currentIndex++;
            } else if (touchEndX - touchStartX > threshold) { // Deslize para direita
                if (currentIndex > 0) currentIndex--;
            }
            updateCasesCarousel();
        }, {passive: true});

        let autoPlay = setInterval(() => {
            if (!isPaused) {
                const itemsPerView = getItemsPerView();
                const totalSteps = cards.length - itemsPerView + 1;
                currentIndex = (currentIndex + 1) % totalSteps;
                updateCasesCarousel();
            }
        }, 6000);

        casesTrack.addEventListener('mouseenter', () => isPaused = true);
        casesTrack.addEventListener('mouseleave', () => isPaused = false);

        window.addEventListener('resize', () => {
            currentIndex = 0;
            setupCasesDots();
            updateCasesCarousel();
        });

        setupCasesDots();
    }

    // --- 4. CARROSSEL DE CERTIFICAÇÕES (sobre.html / certificações) ---
    const certTrack = document.getElementById('certGrid');
    const certDotsContainer = document.getElementById('certDots');

    if (certTrack && certDotsContainer) {
        const certs = Array.from(certTrack.children);
        let certIndex = 0;
        let certPaused = false;
        let certAutoPlay;

        // Variáveis para Touch Certificações
        let certTouchStartX = 0;
        let certTouchEndX = 0;

        function setupCertDots() {
            certDotsContainer.innerHTML = '';
            if (window.innerWidth <= 992) {
                certs.forEach((_, i) => {
                    const dot = document.createElement('div');
                    dot.classList.add('dot');
                    if (i === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => {
                        certIndex = i;
                        updateCertCarousel();
                        certPaused = true;
                    });
                    certDotsContainer.appendChild(dot);
                });
            }
        }

        function updateCertCarousel() {
            if (window.innerWidth <= 992) {
                certTrack.style.transform = `translateX(-${certIndex * 100}%)`;
                const dots = certDotsContainer.querySelectorAll('.dot');
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === certIndex);
                });
            } else {
                certTrack.style.transform = 'none';
            }
        }

        // Lógica de Swipe para Certificações
        certTrack.addEventListener('touchstart', (e) => {
            certTouchStartX = e.changedTouches[0].screenX;
            certPaused = true;
        }, {passive: true});

        certTrack.addEventListener('touchend', (e) => {
            certTouchEndX = e.changedTouches[0].screenX;
            const threshold = 50;

            if (certTouchStartX - certTouchEndX > threshold) { // Deslize para esquerda
                if (certIndex < certs.length - 1) certIndex++;
            } else if (certTouchEndX - certTouchStartX > threshold) { // Deslize para direita
                if (certIndex > 0) certIndex--;
            }
            updateCertCarousel();
        }, {passive: true});

        function startCertAutoPlay() {
            clearInterval(certAutoPlay);
            certAutoPlay = setInterval(() => {
                if (!certPaused && window.innerWidth <= 992) {
                    certIndex = (certIndex + 1) % certs.length;
                    updateCertCarousel();
                }
            }, 4000);
        }

        certTrack.addEventListener('mouseenter', () => certPaused = true);
        certTrack.addEventListener('mouseleave', () => certPaused = false);

        window.addEventListener('resize', () => {
            certIndex = 0;
            setupCertDots();
            updateCertCarousel();
        });

        setupCertDots();
        startCertAutoPlay();
    }
});



