/**
 * Фабрика форм
 */
export default class FormsFactory {

  constructor() {
  }

  createSignUpForm(formName) {

    const form = document.createElement('form');
    form.classList.add('popup__form');
    form.setAttribute('name', formName);

    const formHtml = `<label for="email-field" class="popup__label">Email</label>
                    <input type="email" name="email" id="email-field" class="input popup__input" placeholder="Введите email" pattern="^[A-Za-z0-9](-|_)?(([A-Za-z0-9_]+-?)?)+[A-Za-z0-9]?@([A-Za-z0-9\-_]+\.)+[A-Za-z]{2,}" required>
                    <p class="popup__error-label popup__error-label-name"></p>

                    <label for="password-field" class="popup__label">Пароль</label>
                    <input type="password" name="password"  id="password-field" class="input popup__input" minlength="8" placeholder="Введите пароль" required>
                    <p class="popup__error-label popup__error-label-password"></p>

                    <label for="name-field" class="popup__label">Имя</label>
                    <input type="text" name="name" id="name-field" class="input popup__input" placeholder="Введите свое имя" minlength="2" maxlength="30" pattern="[A-ZА-ЯЁa-zа-яё]+(-[A-ZА-ЯЁa-zа-яё]+)?" required>
                    <p class="popup__error-label popup__error-label-password"></p>

                    <p class="popup__error-info"></p>

                    <button type="button" id="submit" class="button button_color_blue popup__button button__signup">Зарегистрироваться</button>

                    <div class="popup__actions-container">
                      <p class="popup__text">или</p>
                      <a href="#" class="link popup__link popup__link_small popup-signup__login">Войти</a>
                    </div>`;

    form.insertAdjacentHTML('afterbegin', formHtml);

    return form;

  }

  createSignInForm(formName) {

    const form = document.createElement('form');
    form.classList.add('popup__form');
    form.setAttribute('name', formName);

    const formHtml = `<label for="email-field-login" class="popup__label">Email</label>
                      <input type="email" name="email" id="email-field-login" class="input popup__input" placeholder="Введите email" pattern="^[A-Za-z0-9](-|_)?(([A-Za-z0-9_]+-?)?)+[A-Za-z0-9]?@([A-Za-z0-9\-_]+\.)+[A-Za-z]{2,}" required>
                      <p class="popup__error-label popup__error-label-name"></p>

                      <label for="password-field-login" class="popup__label">Пароль</label>
                      <input type="password" name="password" id="password-field-login" class="input popup__input" placeholder="Введите пароль" required>
                      <p class="popup__error-label popup__error-label-password"></p>

                      <p class="popup__error-info"></p>

                      <button type="button" id="submit" class="button button_color_blue popup__button popup__button-signin">Войти</button>

                      <div class="popup__actions-container">
                        <p class="popup__text">или</p>
                        <a href="#" class="link popup__link popup__link_small popup-signin__signup">Зарегистрироваться</a>
                      </div>`;

    form.insertAdjacentHTML('afterbegin', formHtml);

    return form;

  }

  createSingleGridForm(formName, gridElement) {

    const form = document.createElement('form');
    form.classList.add('popup__form');
    form.setAttribute('name', formName);

    form.insertAdjacentElement('afterbegin', gridElement);

    const groupHtml = `<p class="popup__error-info"></p>
                      <button type="button" id="submit" class="button button_color_blue popup__button popup__button-open">Открыть</button>`;

    form.insertAdjacentHTML('beforeend', groupHtml);

    return form;

  }

  createInputTextForm(formName, labelText, inpType, inpName) {

    const form = document.createElement('form');
    form.classList.add('popup__form');
    form.setAttribute('name', formName);

    const formHtml = `<label for="input-text" class="popup__label">${labelText}</label>
                      <input type="${inpType}" name="${inpName}" id="input-text" class="input popup__input" placeholder="Введите значение" required>
                      <p class="popup__error-label"></p>

                      <p class="popup__error-info"></p>
                      <button type="button" id="submit" class="button button_color_blue popup__button popup__button-open">Применить</button>
                      `;

    form.insertAdjacentHTML('afterbegin', formHtml);

    return form;

  }

  createInputTextAreaForm(formName, labelText, inpName, rows) {

    const form = document.createElement('form');
    form.classList.add('popup__form');
    form.setAttribute('name', formName);

    const formHtml = `<label for="input-text" class="popup__label">${labelText}</label>
                      <textarea type="textarea" name="${inpName}" id="input-text" rows="${rows}" class="popup__input input input-textarea" placeholder="Введите значение" required>
                      </textarea>
                      <p class="popup__error-label"></p>

                      <p class="popup__error-info"></p>
                      <button type="button" id="submit" class="button button_color_blue popup__button popup__button-open">Применить</button>
                      `;

    form.insertAdjacentHTML('afterbegin', formHtml);

    return form;

  }

  createPropertiesForm(formName, shortDescElName, descriptionElName, tagsElName) {

    const form = document.createElement('form');
    form.classList.add('popup__form');
    form.setAttribute('name', formName);

    const formHtml = `<label for="input-text" class="popup__label">Название</label>
                      <input type="text" name="${shortDescElName}" id="input-text" class="input popup__input ${shortDescElName}" placeholder="Название" minlength="2" required>
                      <p class="popup__error-label"></p>

                      <label for="input-desc" class="popup__label">Описание</label>
                      <textarea type="textarea" name="${descriptionElName}" id="input-desc" class="popup__input input input-textarea input-textarea_high-height ${descriptionElName}" placeholder="Укажите содержание тетради: объекты, операции, ситуации. Другим пользователям будет легче найти и понять решение."></textarea>
                      <p class="popup__error-label"></p>

                      <label for="input-tags" class="popup__label">Тэги</label>
                      <input type="tags" name="${tagsElName}" id="input-tags" class="input popup__input ${tagsElName}" placeholder="#определите#тэги" pattern="(#[A-Za-zА-Яа-я0-9]{1,20}){1,5}">
                      <p class="popup__error-label"></p>

                      <p class="popup__error-info"></p>
                      <button type="button" id="submit" class="button button_color_blue popup__button popup__button-open">Применить</button>
                      `;

    form.insertAdjacentHTML('afterbegin', formHtml);

    return form;

  }

}