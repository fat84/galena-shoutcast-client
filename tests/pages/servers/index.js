import PageObject from '../../page-object';
import button from '../helpers/button';

let {
  visitable,
	text,
	collection,
} = PageObject;


export default PageObject.build({

	visit: visitable('/servers'),

	title: text('h1.page-title'),

	servers: collection({
		itemScope: '.servers-list .server',
		item: {
			port: text('td:nth-of-type(1)'),
			serverName: text('td:nth-of-type(2)'),
			status: text('td:nth-of-type(3)'),
			sourceStatus: text('td:nth-of-type(4)'),

			btnRotateLogs: button('.btn-rotate-logs'),
			btnEdit: button('.btn-edit'),
			btnStart: button('.btn-start'),
			btnView: button('.btn-view'),
			btnStop: button('.btn-stop'),
			btnRemove: button('.btn-remove'),
		}
	})
});


