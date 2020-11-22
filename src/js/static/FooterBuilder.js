import AccComponent from '../common/AccComponent';
import logo from '../../images/logo.png';

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

        //const logo = '../../images/logo.png';

        const footerHtml = `<img class="logo logo_place_footer" src="${logo}" alt="логотип"></img>
                            <p class="footer__copyright">&copy;2020 Accounting-pro</p>
                            <p class="footer__email">
                              <a href="mailto:info@accounting-pro.ru" class="link menu-link menu-link_font_normal">
                                E-mail: info@accounting-pro.ru
                              </a>
                            </p>`;

        this._componentDOM.insertAdjacentHTML('afterbegin', footerHtml);
        //this._componentDOM.addChild(footerHtml);
    }
}

/* <footer class="footer">
    <img class="logo logo_place_header" src="images/brandbook/logo_4.png" alt="логотип"></img>
    <p class="footer__copyright">&copy;2020 Accounting-pro</p>
    <p class="footer__email">
        <a href="mailto:info@accounting-pro.ru" class="link menu-link menu-link_font_normal">E-mail: info@accounting-pro.ru</a>
    </p>
</footer> */
