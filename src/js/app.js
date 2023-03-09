/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
document.addEventListener('DOMContentLoaded', () => {
    const addBtns = document.querySelectorAll('.add');

    for (const btn of addBtns) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const newTask = document.createElement('div');
            newTask.classList.add('task');

            const closeBtn = document.createElement('div');
            closeBtn.classList.add('close-btn');

            const newInput = document.createElement('input');
            newInput.setAttribute('placeholder', 'Enter the title for this card...');
            newInput.classList.add('input-text');

            newTask.appendChild(closeBtn);
            newTask.appendChild(newInput);

            newTask.addEventListener('mouseover', () => {
                closeBtn.classList.add('active');
                closeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.target.parentElement.remove();
                });
            });

            newTask.addEventListener('mouseout', () => {
                closeBtn.classList.remove('active');
            });

            const parent = document.querySelector(`.${e.target.parentElement.className.split(' ')[1]}`);
            let currentCard;
            if (parent) {
                currentCard = parent;
                currentCard.insertBefore(newTask, e.target);
            } else {
                currentCard = document.querySelector(`.${e.target.parentElement.parentElement.className.split(' ')[1]}`);
                currentCard.insertBefore(newTask, e.target.parentElement);
            }
        });
    }
});
