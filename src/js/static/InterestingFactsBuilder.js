/**
 * Генерирует вставку интересных фактов
 */

export default class InterestingFactsBuilder {

    _interestingFacts = [];

    constructor(factsArray) {
        this._interestingFacts = factsArray;
    }

    getInterestingFacts() {
        return this._interestingFacts;
    }

    setInterestingFacts(factsArray) {
        this._interestingFacts = factsArray;
    }


    /**
     * формирование одной секции "это интересно"
     * @param {string} factText текст интересного факта
     * @return DOM-секция interesting с factText
     */
    makeInterestingFactSection (factText) {

        const sectionInteresting = document.createElement('section');
        sectionInteresting.classList.add('interesting');

        const interestingContainer = document.createElement('div');
        interestingContainer.classList.add('interesting__container');

        const interestingHeader = document.createElement('p');
        interestingHeader.classList.add('interesting__header');
        interestingHeader.textContent = "Это интересно";

        const interestingText = document.createElement('p');
        interestingText.classList.add('interesting__fact-text');
        interestingText.textContent = factText;

        interestingContainer.appendChild(interestingHeader);
        interestingContainer.appendChild(interestingText);

        sectionInteresting.appendChild(interestingContainer);

        return sectionInteresting;

    }

    /**
     * Функция вставки секции "Это интересно" в DOM
     * @param rootSection - DOM-секция корневого элемент для секции "Это интересно"
     * @param section - секция "Это интересно" которая вставяется
     * @param sectionBefore - DOM-секция перед которой всталяется секция "Это интересно"
     */
    insertFactSection(rootSection, section, sectionBefore) {
        // вставляем элемент
        rootSection.insertBefore(section, sectionBefore);
    }

}