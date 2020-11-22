import SectionBuilder from "./SectionBuilder";
import Properties from '../../properties/Properties';

export default class NewsBuilder extends SectionBuilder {

  constructor(props) {
    props.sectionTitle = 'Новости';
    props.sectionSubtitle = `Что нового и примечательного за последние ${Properties.newsList.newsPeriod} дней?`;
    props.sectionClassName = 'news';
    super(props);
  }

  createDOM() {
    super.createDOM();
  }

}