import AccComponent from '../common/AccComponent';
import mailIco from '../../images/mail.png';
import gitIco from '../../images/github.png';
import monitorIco from '../../images/monitor.png';
import Properties from '../properties/Properties'

/**
 * Класс формирования подвала
 */

export default class FooterBuilder extends AccComponent {

    constructor(props : { [key: string]: any }) {
      super(props);
    }

    createDOM() {

        this._componentDOM = document.createElement('footer');
        this._componentDOM.classList.add('footer');

        const footerHtml = `<p class="footer__text">&copy;${new Date().getFullYear()} ${Properties.site.name}</p>

                            <a href="./index.html" class="link footer__link">
                              <img class="footer__ico" src="${monitorIco}"></img>
                              <p class="footer__text">${Properties.site.url}</p>
                            </a>

                            <a href="mailto:${Properties.site.email}" class="link footer__link">
                              <img class="footer__ico" src="${mailIco}"></img>
                              <p class="footer__text">${Properties.site.email}</p>
                            </a>`;

        this._componentDOM.insertAdjacentHTML('afterbegin', footerHtml);
    }
}
