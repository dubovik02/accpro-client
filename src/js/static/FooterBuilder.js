import AccComponent from '../common/AccComponent';
import mailIco from '../../images/mail.png';
import gitIco from '../../images/github.png';
import monitorIco from '../../images/monitor.png';
import Properties from '../properties/Properties'

/**
 * Класс формирования подвала
 */

export default class FooterBuilder extends AccComponent {

    /**
     * Контруктор
     */
    constructor(props) {
      super(props);
    }

    createDOM() {

        this._componentDOM = document.createElement('footer');
        this._componentDOM.classList.add('footer');

        const footerHtml = `<p class="footer__text">&copy;${new Date().getFullYear()} ${Properties.site.name}</p>

                            <div class="footer__container">

                              <a href="./index.html" class="link footer__link">
                                <img class="footer__ico" src="${monitorIco}"></img>
                                <p class="footer__text">${Properties.site.url}</p>
                              </a>

                              <a href="mailto:info@accounting-pro.ru" class="link footer__link">
                                <img class="footer__ico" src="${mailIco}"></img>
                                <p class="footer__text">${Properties.site.email}</p>
                              </a>

                              <a href="https://github.com" class="link footer__link" target="_blank">
                                <img class="footer__ico" src="${gitIco}"></img>
                                <p class="footer__text">Мы на GitHub</p>
                              </a>

                            </div>`;

        this._componentDOM.insertAdjacentHTML('afterbegin', footerHtml);
    }
}
