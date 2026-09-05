document.addEventListener('DOMContentLoaded', () => {

    /* =====================================================
       REVEAL ON SCROLL
       Ogni elemento .corso-fade appare (fade + zoom-in) la
       prima volta che entra in viewport. Uso IntersectionObserver
       invece di un calcolo continuo sul pixel di scroll: è lo
       stesso meccanismo, collaudato, già usato nel resto del
       sito (niente rischio di restare bloccati a metà opacità).
       ===================================================== */

    const revealEls = document.querySelectorAll('.corso-fade');

    if (revealEls.length) {

        const revealObserver = new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add('is-visible');

                        revealObserver.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.2,
                rootMargin: '0px 0px -60px 0px'
            }
        );

        revealEls.forEach((el) => {
            revealObserver.observe(el);
        });
    }


    /* =====================================================
       PARALLAX HERO
       Stesso identico sistema (lerp + CSS custom property)
       già usato altrove nel sito.
       ===================================================== */

    const hero = document.querySelector('.cp-hero');

    if (!hero) {
        return;
    }

    const prefersReducedMotion =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        return;
    }

    let currentY = 0;
    let targetY = 0;
    let ticking = false;


    function updateTarget() {

        const rect = hero.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        const progress =
            (viewportHeight - rect.top) / (viewportHeight + rect.height);

        targetY = (progress - 0.5) * -50;

        ticking = false;
    }


    window.addEventListener(
        'scroll',
        () => {

            if (!ticking) {
                window.requestAnimationFrame(updateTarget);
                ticking = true;
            }

        },
        { passive: true }
    );


    function animate() {

        currentY += (targetY - currentY) * 0.06;

        hero.style.setProperty('--parallax-y', `${currentY}px`);

        window.requestAnimationFrame(animate);
    }


    animate();
    updateTarget();

});