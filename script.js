const sections = document.querySelector('.sections');
const sectionItems = document.querySelectorAll('.section1');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

let currentIndex = 0;

function showSection(index) {
    const totalWidth = sections.clientWidth;
    sections.style.transform = `translateX(-${index * totalWidth}px)`;
}

prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : sectionItems.length - 1;
    showSection(currentIndex);
});

nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex < sectionItems.length - 1) ? currentIndex + 1 : 0;
    showSection(currentIndex);
});

// Initial display
showSection(currentIndex);
