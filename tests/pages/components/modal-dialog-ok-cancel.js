import PageObject from '../../page-object';
import button from '../helpers/button';

let {
  text,
} = PageObject;

export default PageObject.component({
  title: text('.modal-title'),
  bodyText: text('.modal-body'),
  btnOk: button('.modal-btn-ok'),
  btnCancel: button('.modal-btn-cancel'),
});
