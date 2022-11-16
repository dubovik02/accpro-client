import ServiceBuilder from "../ServiceBuilder";

export default class LibraryBuilder extends ServiceBuilder {

  constructor(props) {
    props.serviceName = 'Библиотека решений';
    props.serviceDescription = 'Последние публикации';
    super(props);
  }

  createDOM() {
    super.createDOM();
  }

}