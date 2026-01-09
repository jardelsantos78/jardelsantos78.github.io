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


// --- CARROSSEL DE CASOS DE SUCESSO (Versão Desktop + Mobile) ---
const casesTrack = document.getElementById('casesTrack');
const casesDotsContainer = document.getElementById('casesDots');

if (casesTrack && casesDotsContainer) {
    const cards = Array.from(casesTrack.children);
    let currentIndex = 0;
    let isPaused = false;

    function getItemsPerView() {
        return window.innerWidth <= 992 ? 1 : 3; // 1 no mobile, 3 no desktop
    }

    function setupCasesDots() {
        casesDotsContainer.innerHTML = '';
        const itemsPerView = getItemsPerView();
        // Calcula quantos "pousos" o carrossel tem
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
		
		// No mobile o gap deve ser 0 para centralizar perfeitamente
		const gap = isMobile ? 0 : 20; 
		
		// Cálculo do deslocamento
		const moveAmount = (cardWidth + gap) * currentIndex;
		
		casesTrack.style.transform = `translateX(-${moveAmount}px)`;
		
		// Atualiza os dots (mantendo o estado ativo maior)
		const dots = casesDotsContainer.querySelectorAll('.dot');
		dots.forEach((dot, i) => {
			dot.classList.toggle('active', i === currentIndex);
		});
	}

    // Auto-play unificado
    let autoPlay = setInterval(() => {
        if (!isPaused) {
            const itemsPerView = getItemsPerView();
            const totalSteps = cards.length - itemsPerView + 1;
            currentIndex = (currentIndex + 1) % totalSteps;
            updateCasesCarousel();
        }
    }, 6000);

    // Pausar ao interagir (Mouse ou Touch)
    casesTrack.addEventListener('mouseenter', () => isPaused = true);
    casesTrack.addEventListener('mouseleave', () => isPaused = false);
    casesTrack.addEventListener('touchstart', () => isPaused = true);

    window.addEventListener('resize', () => {
        currentIndex = 0; // Reseta ao mudar tela para evitar erros de cálculo
        setupCasesDots();
        updateCasesCarousel();
    });

    // Inicialização
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

        function getCertItemsPerView() {
            return window.innerWidth <= 992 ? 1 : 3; // 1 no mobile, 3 no desktop (ajuste conforme seu grid)
        }

        function setupCertDots() {
            certDotsContainer.innerHTML = '';
            // No mobile, criamos um ponto para cada certificado
            if (window.innerWidth <= 992) {
                certs.forEach((_, i) => {
                    const dot = document.createElement('div');
                    dot.classList.add('dot');
                    if (i === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => {
                        certIndex = i;
                        updateCertCarousel();
                        certPaused = true; // Pausa ao interagir manualmente
                    });
                    certDotsContainer.appendChild(dot);
                });
            }
        }

        function updateCertCarousel() {
            if (window.innerWidth <= 992) {
                // No mobile, move 100% (um card por vez)
                certTrack.style.transform = `translateX(-${certIndex * 100}%)`;
                
                // Atualiza dots
                const dots = certDotsContainer.querySelectorAll('.dot');
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === certIndex);
                });
            } else {
                // No desktop, remove o transform para manter o grid padrão
                certTrack.style.transform = 'none';
            }
        }

        // Função de Auto-play para Certificações
        function startCertAutoPlay() {
            clearInterval(certAutoPlay);
            certAutoPlay = setInterval(() => {
                if (!certPaused && window.innerWidth <= 992) {
                    certIndex = (certIndex + 1) % certs.length;
                    updateCertCarousel();
                }
            }, 4000); // Passa a cada 4 segundos
        }

        // Eventos para pausar (Mouse e Touch)
        certTrack.addEventListener('touchstart', () => certPaused = true);
        certTrack.addEventListener('mouseenter', () => certPaused = true);
        certTrack.addEventListener('mouseleave', () => certPaused = false);

        window.addEventListener('resize', () => {
            certIndex = 0;
            setupCertDots();
            updateCertCarousel();
        });

        // Inicialização
        setupCertDots();
        startCertAutoPlay();
    }

});

