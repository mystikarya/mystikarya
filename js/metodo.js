document.addEventListener('DOMContentLoaded', () => {

    const metodoSlides = document.querySelectorAll('.metodo-slide');
    const metodoPrev = document.querySelector('.metodo-prev');
    const metodoNext = document.querySelector('.metodo-next');
    const metodoCurrent = document.querySelector('.metodo-current');

    let metodoIndex = 0;


    function showMetodoSlide(index) {

        if (!metodoSlides.length) {
            return;
        }

        metodoSlides[metodoIndex].classList.remove('active');

        metodoIndex =
            (index + metodoSlides.length) %
            metodoSlides.length;

        metodoSlides[metodoIndex].classList.add('active');

        if (metodoCurrent) {
            metodoCurrent.textContent =
                String(metodoIndex + 1).padStart(2, '0');
        }
    }


    /* ---------------------------------------------------------
       FRECCIA AVANTI
       --------------------------------------------------------- */

    if (metodoNext) {

        metodoNext.addEventListener('click', () => {
            showMetodoSlide(metodoIndex + 1);
        });

    }


    /* ---------------------------------------------------------
       FRECCIA INDIETRO
       --------------------------------------------------------- */

    if (metodoPrev) {

        metodoPrev.addEventListener('click', () => {
            showMetodoSlide(metodoIndex - 1);
        });

    }


    /* ---------------------------------------------------------
       SWIPE MOBILE
       --------------------------------------------------------- */

    let touchStartX = 0;
    let touchEndX = 0;

    const metodoSlider =
        document.querySelector('.metodo-slider');

    if (metodoSlider) {

        metodoSlider.addEventListener(
            'touchstart',
            (event) => {

                touchStartX =
                    event.changedTouches[0].screenX;

            },
            { passive: true }
        );


        metodoSlider.addEventListener(
            'touchend',
            (event) => {

                touchEndX =
                    event.changedTouches[0].screenX;

                const distance =
                    touchStartX - touchEndX;

                if (Math.abs(distance) < 50) {
                    return;
                }

                if (distance > 0) {
                    showMetodoSlide(metodoIndex + 1);
                } else {
                    showMetodoSlide(metodoIndex - 1);
                }

            },
            { passive: true }
        );

    }


    /* ---------------------------------------------------------
       TASTIERA
       --------------------------------------------------------- */

    document.addEventListener('keydown', (event) => {

        if (event.key === 'ArrowRight') {
            showMetodoSlide(metodoIndex + 1);
        }

        if (event.key === 'ArrowLeft') {
            showMetodoSlide(metodoIndex - 1);
        }

    });

});