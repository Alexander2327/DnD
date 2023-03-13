/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable prefer-template */
/* eslint-disable max-len */
document.addEventListener('DOMContentLoaded', () => {
    const json = localStorage.getItem('tasksInfo');
    let tasksInfo;

    try {
        tasksInfo = JSON.parse(json);
    } catch (error) {
        console.log(error);
    }

    const addBtns = document.querySelectorAll('.add');

    if (tasksInfo) {
        Object.keys(tasksInfo).forEach((key) => {
            for (const task of tasksInfo[key]) {
                const newTask = document.createElement('div');
                newTask.classList.add('task');

                const closeBtn = document.createElement('div');
                closeBtn.classList.add('close-btn');

                const newInput = document.createElement('textarea');
                newInput.setAttribute('cols', '23');
                newInput.classList.add('input-text');
                newInput.textContent = task;

                newTask.appendChild(closeBtn);
                newTask.appendChild(newInput);

                newTask.addEventListener('mousemove', () => {
                    closeBtn.classList.add('active');
                    closeBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.target.parentElement.remove();
                    });
                });
                newTask.addEventListener('mouseout', () => {
                    closeBtn.classList.remove('active');
                });

                document.querySelector(`.${key.toLowerCase()}`).insertBefore(newTask, document.querySelector(`.${key.toLowerCase()}`).lastElementChild);
            }
        });
    }

    for (const btn of addBtns) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const newTask = document.createElement('div');
            newTask.classList.add('task');

            const closeBtn = document.createElement('div');
            closeBtn.classList.add('close-btn');

            const newInput = document.createElement('textarea');
            newInput.setAttribute('placeholder', 'Enter the title for this card...');
            newInput.setAttribute('rows', '2');
            newInput.setAttribute('cols', '23');
            newInput.classList.add('input-text');
            newInput.classList.add('edit');

            newTask.appendChild(closeBtn);
            newTask.appendChild(newInput);

            newTask.addEventListener('mousemove', () => {
                closeBtn.classList.add('active');
                closeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const action = document.querySelector('.action');
                    if (action) {
                        action.remove();
                        e.target.parentElement.insertAdjacentElement('afterend', btn);
                    }
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
            btn.remove();

            const action = document.createElement('div');
            action.classList.add('action');
            action.innerHTML = '<button class="action-add" type="button">Add Card</button> <div class="action-close"></div>';
            action.firstChild.addEventListener('click', (e) => {
                e.preventDefault();
                e.target.parentElement.insertAdjacentElement('beforebegin', btn);
                newInput.readOnly = true;
                newInput.classList.remove('edit');
                action.remove();
            });
            action.lastChild.addEventListener('click', (e) => {
                e.preventDefault();
                e.target.parentElement.insertAdjacentElement('beforebegin', btn);
                newTask.remove();
                action.remove();
            });
            newTask.insertAdjacentElement('afterend', action);
        });
    }

    const cards = document.querySelectorAll('.task-container');
    for (const card of cards) {
        let actualElement;
        let shiftX;
        let shiftY;

        const onMouseMove = (e) => {
            // actualElement.style.top = e.clientY - shiftY + 'px';
            // actualElement.style.left = e.clientX - shiftX + 'px';

            actualElement.style.top = e.clientY + 'px';
            actualElement.style.left = e.clientX + 'px';
        };

        const onMouseUp = (e) => {
            const mouseUpItem = e.target;
            console.log(e.target.parentElement);
            if (mouseUpItem.classList.contains('task')) {
                mouseUpItem.parentElement.insertBefore(actualElement, mouseUpItem);
            } else if (mouseUpItem.classList.contains('input-text')) {
                mouseUpItem.parentElement.parentElement.insertBefore(actualElement, mouseUpItem.parentElement);
            } else if (mouseUpItem.classList.contains('task-container')) {
                mouseUpItem.insertBefore(actualElement, [...mouseUpItem.children][1]);
            } else if (mouseUpItem.classList.contains('add')) {
                mouseUpItem.parentElement.insertBefore(actualElement, mouseUpItem);
            }

            actualElement.classList.remove('dragged');
            actualElement = undefined;
            shiftX = undefined;
            shiftY = undefined;

            document.documentElement.removeEventListener('mouseup', onMouseUp);
            document.documentElement.removeEventListener('mousemove', onMouseMove);
        };
        card.addEventListener('mousedown', (e) => {
            console.log(e.target);
            if (e.target.classList.contains('task')) {
                if (e.target.children[1].classList.contains('edit') === false) {
                    e.preventDefault();

                    shiftX = e.clientX - e.target.getBoundingClientRect().left;
                    shiftY = e.clientY - e.target.getBoundingClientRect().top;

                    actualElement = e.target;
                    actualElement.classList.add('dragged');
                    console.log(actualElement);
                    document.documentElement.addEventListener('mouseup', onMouseUp);
                    document.documentElement.addEventListener('mousemove', onMouseMove);
                }
            } else if (e.target.classList.contains('input-text')) {
                if (e.target.classList.contains('edit') === false) {
                    e.preventDefault();
                    shiftX = e.clientX - e.target.parentElement.getBoundingClientRect().left;
                    shiftY = e.clientY - e.target.parentElement.getBoundingClientRect().top;

                    actualElement = e.target.parentElement;
                    actualElement.classList.add('dragged');
                    console.log(actualElement);
                    document.documentElement.addEventListener('mouseup', onMouseUp);
                    document.documentElement.addEventListener('mousemove', onMouseMove);
                }
            }
        });
    }
});

window.addEventListener('beforeunload', () => {
    const tasksInfo = {};
    const cards = document.querySelectorAll('.task-container');
    const tasks = Array.from(document.querySelectorAll('.task'));
    for (const card of cards) {
        tasksInfo[[...card.children][0].textContent] = [];
        for (const task of tasks) {
            if ([...task.children][1].parentElement.parentElement.className === card.className) {
                tasksInfo[[...card.children][0].textContent].push([...task.children][1].value);
            }
        }
    }
    localStorage.setItem('tasksInfo', JSON.stringify(tasksInfo));
});
