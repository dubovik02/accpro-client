/**
 * Фабрика форм
 */
import Properties from '../../properties/Properties';

export default class FormsFactory {

  constructor() {
  }

  createSignUpForm(formName) {

    const form = document.createElement('form');
    form.classList.add('popup__form');
    form.setAttribute('name', formName);

    const formHtml = `<label for="email-field" class="popup__label">${Properties.lang.dict.popups.email}</label>
                    <input type="email" name="email" id="email-field" class="input popup__input" placeholder="${Properties.lang.dict.popups.enterEmail}" pattern="^[A-Za-z0-9](-|_)?(([A-Za-z0-9_]+-?)?)+[A-Za-z0-9]?@([A-Za-z0-9\-_]+\.)+[A-Za-z]{2,}" required>
                    <p class="popup__error-label popup__error-label-name"></p>

                    <label for="password-field" class="popup__label">${Properties.lang.dict.popups.password}</label>
                    <input type="password" name="password"  id="password-field" class="input popup__input" minlength="8" placeholder="${Properties.lang.dict.popups.enterPassword}" required>
                    <p class="popup__error-label popup__error-label-password"></p>

                    <label for="name-field" class="popup__label">${Properties.lang.dict.popups.name}</label>
                    <input type="text" name="name" id="name-field" class="input popup__input" placeholder="${Properties.lang.dict.popups.enterName}" minlength="2" maxlength="30" pattern="[A-ZА-ЯЁa-zа-яё]+(-[A-ZА-ЯЁa-zа-яё]+)?" required>
                    <p class="popup__error-label popup__error-label-password"></p>

                    <p class="popup__error-info"></p>

                    <button type="button" id="submit" class="button button_color_blue popup__button button__signup">${Properties.lang.dict.popups.signUp}</button>

                    <div class="popup__actions-container">
                      <p class="popup__text">${Properties.lang.dict.general.or}</p>
                      <a href="#" class="link popup__link popup__link_small popup-signup__login">${Properties.lang.dict.popups.signIn}</a>
                    </div>`;

    form.insertAdjacentHTML('afterbegin', formHtml);

    return form;

  }

  createSignInForm(formName) {

    const form = document.createElement('form');
    form.classList.add('popup__form');
    form.setAttribute('name', formName);

    const formHtml = `<label for="email-field-login" class="popup__label">${Properties.lang.dict.popups.email}</label>
                      <input type="email" name="email" id="email-field-login" class="input popup__input" placeholder="${Properties.lang.dict.popups.enterEmail}" pattern="^[A-Za-z0-9](-|_)?(([A-Za-z0-9_]+-?)?)+[A-Za-z0-9]?@([A-Za-z0-9\-_]+\.)+[A-Za-z]{2,}" required>
                      <p class="popup__error-label popup__error-label-name"></p>

                      <label for="password-field-login" class="popup__label">${Properties.lang.dict.popups.password}</label>
                      <input type="password" name="password" id="password-field-login" class="input popup__input" placeholder="${Properties.lang.dict.popups.enterPassword}" required>
                      <p class="popup__error-label popup__error-label-password"></p>

                      <p class="popup__error-info"></p>

                      <button type="button" id="submit" class="button button_color_blue popup__button popup__button-signin">${Properties.lang.dict.popups.signIn}</button>

                      <div class="popup__actions-container">
                        <p class="popup__text">${Properties.lang.dict.popups.forgotPassword}?</p>
                        <a href="#" class="link popup__link popup__link_small popup-signin__restore">${Properties.lang.dict.popups.restorePassword}</a>
                      </div>

                      <div class="popup__actions-container">
                        <p class="popup__text">${Properties.lang.dict.general.or}</p>
                        <a href="#" class="link popup__link popup__link_small popup-signin__signup">${Properties.lang.dict.popups.signUp}</a>
                      </div>`;

    form.insertAdjacentHTML('afterbegin', formHtml);

    return form;

  }

  createRestoreForm(formName) {

    const form = document.createElement('form');
    form.classList.add('popup__form');
    form.setAttribute('name', formName);

    const formHtml = `<label for="email-field-login" class="popup__label">${Properties.lang.dict.popups.email}</label>
                      <input type="email" name="email" id="email-field-login" class="input popup__input" placeholder="${Properties.lang.dict.popups.enterRegEmail}" pattern="^[A-Za-z0-9](-|_)?(([A-Za-z0-9_]+-?)?)+[A-Za-z0-9]?@([A-Za-z0-9\-_]+\.)+[A-Za-z]{2,}" required>
                      <p class="popup__error-label popup__error-label-name"></p>

                      <p class="popup__error-info"></p>

                      <button type="button" id="submit" class="button button_color_blue popup__button popup__button-signin">${Properties.lang.dict.popups.restore}</button>

                      <div class="popup__actions-container">
                        <p class="popup__text">${Properties.lang.dict.general.or}</p>
                        <a href="#" class="link popup__link popup__link_small popup-restore__signup">${Properties.lang.dict.popups.signUp}</a>
                      </div>`;

    form.insertAdjacentHTML('afterbegin', formHtml);

    return form;

  }

  createNewPasswordForm(formName) {
    const form = document.createElement('form');
    form.classList.add('popup__form');
    form.setAttribute('name', formName);

    const formHtml = `<label for="password-field" class="popup__label">${Properties.lang.dict.popups.newPassword}</label>
                    <input type="password" name="password"  id="password-field" class="input popup__input" minlength="8" placeholder="${Properties.lang.dict.popups.enterNewPassword}" required>
                    <p class="popup__error-label popup__error-label-password"></p>

                    <p class="popup__error-info"></p>

                    <button type="button" id="submit" class="button button_color_blue popup__button button__signup">${Properties.lang.dict.popups.changePassword}</button>`;

    form.insertAdjacentHTML('afterbegin', formHtml);

    return form;
  }

  createSingleGridForm(formName, gridElement) {

    const form = document.createElement('form');
    form.classList.add('popup__form');
    form.setAttribute('name', formName);

    form.insertAdjacentElement('afterbegin', gridElement);

    const groupHtml = `<p class="popup__error-info"></p>
                      <button type="button" id="submit" class="button button_color_blue popup__button popup__button-open">${Properties.lang.dict.popups.open}</button>`;

    form.insertAdjacentHTML('beforeend', groupHtml);

    return form;

  }

  createInputTextForm(formName, labelText, inpType, inpName) {

    const form = document.createElement('form');
    form.classList.add('popup__form');
    form.setAttribute('name', formName);

    const formHtml = `<label for="input-text" class="popup__label">${labelText}</label>
                      <input type="${inpType}" name="${inpName}" id="input-text" class="input popup__input" placeholder="${Properties.lang.dict.popups.inputValue}" required>
                      <p class="popup__error-label"></p>

                      <p class="popup__error-info"></p>
                      <button type="button" id="submit" class="button button_color_blue popup__button popup__button-open">${Properties.lang.dict.popups.apply}</button>
                      `;

    form.insertAdjacentHTML('afterbegin', formHtml);

    return form;

  }

  createInputTextAreaForm(formName, labelText, inpName, rows) {

    const form = document.createElement('form');
    form.classList.add('popup__form');
    form.setAttribute('name', formName);

    const formHtml = `<label for="input-text" class="popup__label">${labelText}</label>
                      <textarea type="textarea" name="${inpName}" id="input-text" rows="${rows}" class="popup__input input input-textarea" placeholder="${Properties.lang.dict.popups.inputValue}" required>
                      </textarea>
                      <p class="popup__error-label"></p>

                      <p class="popup__error-info"></p>
                      <button type="button" id="submit" class="button button_color_blue popup__button popup__button-open">${Properties.lang.dict.popups.apply}</button>
                      `;

    form.insertAdjacentHTML('afterbegin', formHtml);

    return form;

  }

  createPropertiesForm(formName, shortDescElName, descriptionElName, tagsElName) {

    const form = document.createElement('form');
    form.classList.add('popup__form');
    form.setAttribute('name', formName);

    const formHtml = `<label for="input-text" class="popup__label">${Properties.lang.dict.notebook.name}</label>
                      <input type="text" name="${shortDescElName}" id="input-text" class="input popup__input ${shortDescElName}" placeholder="${Properties.lang.dict.notebook.name}" minlength="2" required>
                      <p class="popup__error-label"></p>

                      <label for="input-desc" class="popup__label">${Properties.lang.dict.notebook.description}</label>
                      <textarea type="textarea" name="${descriptionElName}" id="input-desc" class="popup__input input input-textarea input-textarea_high-height ${descriptionElName}" placeholder="${Properties.lang.dict.popups.notebookDescNote}"></textarea>
                      <p class="popup__error-label"></p>

                      <label for="input-tags" class="popup__label">${Properties.lang.dict.notebook.hashtags}</label>
                      <input type="tags" name="${tagsElName}" id="input-tags" class="input popup__input ${tagsElName}" placeholder="${Properties.lang.dict.popups.tagsNote}" pattern="(#[A-Za-zА-Яа-я0-9]{2,20}){1,5}">
                      <p class="popup__error-label"></p>

                      <p class="popup__error-info"></p>
                      <button type="button" id="submit" class="button button_color_blue popup__button popup__button-open">${Properties.lang.dict.popups.apply}</button>
                      `;

    form.insertAdjacentHTML('afterbegin', formHtml);

    return form;

  }

}