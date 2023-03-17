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

                document.querySelector(`.${key.toLowerCase()}`).children[1].append(newTask);
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
                        e.target.closest('.task-container').append(btn);
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
                currentCard.children[1].prepend(newTask);
            } else {
                currentCard = document.querySelector(`.${e.target.parentElement.parentElement.className.split(' ')[1]}`);
                currentCard.children[1].prepend(newTask);
            }

            const action = document.createElement('div');
            action.classList.add('action');
            action.innerHTML = '<button class="action-add" type="button">Add Card</button> <div class="action-close"></div>';
            e.target.insertAdjacentElement('beforebegin', action);
            btn.remove();
            action.firstChild.addEventListener('click', (e) => {
                e.preventDefault();
                e.target.closest('.task-container').append(btn);
                newInput.readOnly = true;
                newInput.classList.remove('edit');
                action.remove();
            });
            action.lastChild.addEventListener('click', (e) => {
                e.preventDefault();
                e.target.closest('.task-container').append(btn);
                newTask.remove();
                action.remove();
            });
        });
    }

    const cards = document.querySelectorAll('.task-container');
    for (const card of cards) {
        let actualElement;
        let shiftX;
        let shiftY;

        const onMouseMove = (e) => {
            actualElement.style.top = e.clientY - shiftY + 'px';
            actualElement.style.left = e.clientX - shiftX + 'px';

            actualElement.hidden = true;
            const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
            actualElement.hidden = false;

            const newEl = document.createElement('div');
            newEl.style.width = actualElement.offsetWidth - 28 + 'px';
            newEl.style.height = actualElement.offsetHeight - 25 + 'px';
            newEl.classList.add('shadow');

            if (elemBelow.classList.contains('content') && !elemBelow.hasChildNodes()) {
                elemBelow.append(newEl);
                elemBelow.classList.remove('drop');
            }
            if (elemBelow.classList.contains('input-text') && elemBelow.closest('.content').classList.contains('drop')) {
                elemBelow.closest('.task').insertAdjacentElement('beforebegin', newEl);
                elemBelow.closest('.task').insertAdjacentElement('afterend', newEl.cloneNode(true));
                elemBelow.closest('.content').classList.remove('drop');
            }
            if (document.querySelector('.shadow') && !elemBelow.closest('.content')) {
                document.querySelector('.shadow').closest('.content').classList.add('drop');
                document.querySelectorAll('.shadow').forEach((e) => e.remove());
            }
        };

        const onMouseUp = (e) => {
            e.target.style.cursor = 'default';
            actualElement.hidden = true;
            const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
            actualElement.hidden = false;
            if (elemBelow.classList.contains('task')) {
                elemBelow.closest('.content').insertBefore(actualElement, elemBelow);
                elemBelow.closest('.content').classList.add('drop');
                document.querySelectorAll('.shadow').forEach((e) => e.remove());
            } else if (elemBelow.classList.contains('input-text')) {
                elemBelow.closest('.content').insertBefore(actualElement, elemBelow.parentElement);
                elemBelow.closest('.content').classList.add('drop');
                document.querySelectorAll('.shadow').forEach((e) => e.remove());
            } else if (elemBelow.classList.contains('content')) {
                if (!elemBelow.cheldren) {
                    elemBelow.append(actualElement);
                    elemBelow.closest('.content').classList.add('drop');
                    document.querySelectorAll('.shadow').forEach((e) => e.remove());
                }
            } else if (elemBelow.classList.contains('shadow')) {
                elemBelow.insertAdjacentElement('afterend', actualElement);
                elemBelow.closest('.content').classList.add('drop');
                document.querySelectorAll('.shadow').forEach((e) => e.remove());
            }

            actualElement.classList.remove('dragged');
            actualElement = undefined;
            shiftX = undefined;
            shiftY = undefined;

            document.documentElement.removeEventListener('mouseup', onMouseUp);
            document.documentElement.removeEventListener('mousemove', onMouseMove);
        };
        card.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('task')) {
                if (e.target.children[1].classList.contains('edit') === false) {
                    e.target.style.cursor = 'grabbing';
                    e.preventDefault();

                    shiftX = e.clientX - e.target.getBoundingClientRect().left;
                    shiftY = e.clientY - e.target.getBoundingClientRect().top;

                    actualElement = e.target;
                    actualElement.classList.add('dragged');
                    document.documentElement.addEventListener('mouseup', onMouseUp);
                    document.documentElement.addEventListener('mousemove', onMouseMove);
                }
            } else if (e.target.classList.contains('input-text')) {
                if (e.target.classList.contains('edit') === false) {
                    e.preventDefault();
                    e.target.style.cursor = 'grabbing';
                    shiftX = e.clientX - e.target.parentElement.getBoundingClientRect().left;
                    shiftY = e.clientY - e.target.parentElement.getBoundingClientRect().top;

                    actualElement = e.target.parentElement;
                    actualElement.classList.add('dragged');
                    document.documentElement.addEventListener('mouseup', onMouseUp);
                    document.documentElement.addEventListener('mousemove', onMouseMove);
                } else {
                    e.target.style.cursor = 'text';
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
            if ([...task.children][1].closest('.task-container').className === card.className) {
                tasksInfo[[...card.children][0].textContent].push([...task.children][1].value);
            }
        }
    }
    localStorage.setItem('tasksInfo', JSON.stringify(tasksInfo));
});
