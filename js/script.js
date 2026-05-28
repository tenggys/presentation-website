//Прокрутка на странице по клику
document.querySelectorAll('[data-target]').forEach(onScroll => {
    onScroll.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const target = document.getElementById(targetId);

        target.scrollIntoView( {
            behavior: 'smooth'
        });
    });
});