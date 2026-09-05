document.addEventListener('DOMContentLoaded', () => {

    const sections =
        document.querySelectorAll('.section-cartomanzia, .section-corso');

    const revealItems =
        document.querySelectorAll('.section-corso .corso-fade, .section-corso .corso-button');

    if (!sections.length && !revealItems.length) {
        return;
    }


    /* =====================================================
       FADE IN SEZIONE
       ===================================================== */

    if (sections.length) {

        const fadeObserver = new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add('is-visible');

                        fadeObserver.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.15
            }
        );

        sections.forEach((section) => {
            fadeObserver.observe(section);
        });
    }


    const prefersReducedMotion =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {

        // niente animazioni: mostra subito il testo del corso, statico
        revealItems.forEach((item) => {
            item.style.opacity = '1';
            item.style.transform = 'none';
        });

        return;
    }


    /* =====================================================
       PARALLAX BACKGROUND
       Movimento morbido (lerp) come prima, ma pilotato via
       CSS custom property (--parallax-y) letta dal ::before
       in CSS, invece che sul transform di un <img> dedicato.
       ===================================================== */

    const parallaxItems = Array.from(sections).map((section) => ({
        section,
        currentY: 0,
        targetY: 0
    }));

    let ticking = false;


    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }


    function updateTargets() {

        const viewportHeight =
            window.innerHeight;

        parallaxItems.forEach((entry) => {

            const rect =
                entry.section.getBoundingClientRect();

            const progress =
                (viewportHeight - rect.top) /
                (viewportHeight + rect.height);

            entry.targetY =
                (progress - 0.5) * -50;

        });


        /* =================================================
           REVEAL TESTO CORSO, LEGATO ALLO SCROLL
           Ogni riga si rivela (fade + zoom-in) man mano che
           entra in vista: nessun timer, solo posizione reale
           di scroll. Essendo le righe impilate in verticale,
           si susseguono naturalmente una dopo l'altra.
           =================================================== */

        const revealStart = viewportHeight * 1.05;
        const revealEnd = viewportHeight * 0.25;

        revealItems.forEach((item) => {

            const rect =
                item.getBoundingClientRect();

            let progress =
                (revealStart - rect.top) / (revealStart - revealEnd);

            progress = Math.min(1, Math.max(0, progress));

            const eased = easeOutCubic(progress);

            item.style.opacity = eased;
            item.style.transform = `scale(${0.85 + 0.15 * eased})`;

        });


        ticking = false;
    }


    window.addEventListener(
        'scroll',
        () => {

            if (!ticking) {

                window.requestAnimationFrame(
                    updateTargets
                );

                ticking = true;
            }

        },
        {
            passive: true
        }
    );


    function animate() {

        parallaxItems.forEach((entry) => {

            entry.currentY +=
                (entry.targetY - entry.currentY) * 0.06;

            entry.section.style.setProperty(
                '--parallax-y',
                `${entry.currentY}px`
            );

        });

        window.requestAnimationFrame(animate);
    }


    if (sections.length) {
        animate();
    }

    updateTargets();

});