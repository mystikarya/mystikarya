document.addEventListener('DOMContentLoaded', () => {

    const sections = [
        document.querySelector('#rituali'),
        document.querySelector('#rituali2')
    ].filter(Boolean);

    const ritualItems =
        document.querySelectorAll('.rituale-item');


    /* =====================================================
       FADE IN SEZIONE
       ===================================================== */

    if (sections.length) {

        const sectionObserver = new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add('is-visible');

                        sectionObserver.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.55
            }
        );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }


    /* =====================================================
       RITUALI — TESTO ATTIVO (con isteresi)
       Ogni card è indipendente dalle altre: si attiva presto
       (30% visibile) e si disattiva solo quando è quasi del
       tutto fuori vista (5% visibile), cosi il fade-out non
       scatta più appena arriva la card successiva.
       ===================================================== */

    if (ritualItems.length) {

        const ENTER_RATIO = 0.3;
        const EXIT_RATIO = 0.05;

        const ritualObserver = new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.intersectionRatio >= ENTER_RATIO) {

                        entry.target.classList.add('is-active');

                    } else if (entry.intersectionRatio <= EXIT_RATIO) {

                        entry.target.classList.remove('is-active');
                    }

                });

            },
            {
                threshold: [0, EXIT_RATIO, 0.15, ENTER_RATIO, 0.55, 1]
            }
        );

        ritualItems.forEach((item) => {
            ritualObserver.observe(item);
        });
    }


    /* =====================================================
       PARALLAX PER CARD
       Ogni card ha il proprio sfondo (::before in CSS), quindi
       il parallax va calcolato per ciascuna singolarmente,
       non più su un unico sfondo condiviso di sezione.
       Stesso movimento morbido (lerp) di prima, pilotato via
       CSS custom property --parallax-y.
       ===================================================== */

    const prefersReducedMotion =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !ritualItems.length) {
        return;
    }

    const items = Array.from(ritualItems).map((item) => ({
        item,
        currentY: 0,
        targetY: 0
    }));

    let ticking = false;


    function updateTargets() {

        const viewportHeight =
            window.innerHeight;

        items.forEach((entry) => {

            const rect =
                entry.item.getBoundingClientRect();

            const progress =
                (viewportHeight - rect.top) /
                (viewportHeight + rect.height);

            entry.targetY =
                (progress - 0.5) * -50;

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

        items.forEach((entry) => {

            entry.currentY +=
                (entry.targetY - entry.currentY) * 0.06;

            entry.item.style.setProperty(
                '--parallax-y',
                `${entry.currentY}px`
            );

        });

        window.requestAnimationFrame(animate);
    }


    animate();
    updateTargets();

});