'use strict';

document.addEventListener('DOMContentLoaded', () => {
    let idElement;

    const messages = {
        emptyList: 'Your list is empty...',
        minLength: 'Enter at least 6 characters',
        taskEnter: 'Enter the content of the task!'
    }

    function showMessage(message) {
        document.querySelector('.app__message').textContent = message;
    }

    function addNewTask() {
        let input = document.querySelector('.app__input'),
            ulList = document.querySelector('.task__items'),
            liItem = document.createElement('li');
        liItem.classList.add('task__item');
        liItem.setAttribute('id', `item-${ulList.children.length + 1}`);
        liItem.innerHTML = `
            <p class="task__name">${input.value}</p>
            <div class="task__options">
                <button class="task__done"><i class="fas fa-check" aria-hidden="true"></i></button>
                <button class="task__edit"><i class="fas fa-pen" aria-hidden="true"></i></button>
                <button class="task__delete"><i class="fas fa-trash-alt" aria-hidden="true"></i></button>
            </div>
        `;
        if (checkInput(input)) {
            ulList.append(liItem);
            input.value = '';
        }
    }

    function checkInput(input) {
        input.value = input.value.replace(/^\s+/, '');

        if (input.value.length == 0) {
            showMessage();
            return false;
        } else if (input.value.length >= 1 && input.value.length <= 5) {
            showMessage(messages.minLength);
            return false;
        } else {
            showMessage();
            return true;
        }
    }

    function editTask(e) {
        let editElement = e.target.closest('li'),
            input = document.querySelector('.popup__input');
        idElement = editElement.getAttribute('id');

        input.value = editElement.firstElementChild.textContent;
        showPopup();
    }

    function confirmEditTask() {
        let input = document.querySelector('.popup__input'),
            editElement = document.getElementById(idElement);

        if (checkInput(input)) {
            editElement.firstElementChild.textContent = input.value;
            showPopup();
        }
    }

    function showPopup() {
        const popup = document.querySelector('.popup');
        if (!popup.classList.contains('show-popup')) {
            popup.classList.add('show-popup');
            disableElements('.app__input, .task__done, .app__btn, .task__edit, .task__delete');
        } else {
            popup.classList.remove('show-popup');
            disableElements('.app__input, .task__done, .app__btn, .task__edit, .task__delete');
        }
    }

    function disableElements(elements) {
        let disableElements = document.querySelectorAll(elements);

        disableElements.forEach(element => {
            if (!element.disabled) element.setAttribute('disabled', true);
            else element.removeAttribute('disabled');
        })
    }

    document.querySelectorAll('.input').forEach(input => input.addEventListener('input', () => checkInput(input)));

    document.querySelector('.app__btn').addEventListener('click', () => addNewTask());
    document.querySelector('.app').addEventListener('click', e => {
        e.target.classList.contains('fa-check') && e.target.closest('li').classList.toggle('completed');
        e.target.classList.contains('fa-pen') && editTask(e);
        e.target.classList.contains('fa-trash-alt') && e.target.closest('li').remove();
        document.querySelector('.task__items').children.length === 0 && showMessage(messages.emptyList);
        e.target.classList.contains('popup__confirm') && confirmEditTask();
        if (e.target.classList.contains('popup__cancel')) {
            showPopup();
            showMessage();
        }
    });

    document.addEventListener('keydown', e => {
        (e.key === 'Enter' && e.target.classList.contains('app__input')) && addNewTask();
        (e.key === 'Enter' && e.target.classList.contains('popup__input')) && confirmEditTask();
        (e.key === 'Escape' && document.querySelector('.popup').classList.contains('show-popup')) && showPopup();
    });
});