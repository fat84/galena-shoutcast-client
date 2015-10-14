import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'galena-app/tests/helpers/start-app';
import PO from '../../page-object';

module('Acceptance | servers/index', {
	beforeEach: function() {
		this.application = startApp();
	},

	afterEach: function() {
		Ember.run(this.application, 'destroy');
	}
});

var serversData = [{
	id: 1,
	portBase: 8000,
	serverName: 'Server 1',
	isRunning: false,
	isSourceConnected: false
},
{
	id: 2,
	portBase: 9000,
	serverName: 'Server 2',
	isRunning: true,
	isSourceConnected: true
}];

var serverResponses = {
	servers: {
		code: 200,
		data: [{
			id: 1,
			portBase: 8000,
			serverName: 'Server 1',
			isRunning: false,
			isSourceConnected: false
		},
		{
			id: 2,
			portBase: 9000,
			serverName: 'Server 2',
			isRunning: true,
			isSourceConnected: true
		}]	
	},
	serverStartSuccess: {
		code: 200,
		data: {
			id: 1,
			serverName: 'Server 1',
			basePort: 8000,
			isRunning: true,
			isSourceConnected: false
		}
	},
	serverStopSucess: {
		code: 200,
		data: {
			id: 2,
			serverName: 'Server 2',
			basePort: 9000,
			isRunning: false,
			isSourceConnected: false
		}
	},
};

function setupAjaxResponse(requestUrl, type, response) {
	$.mockjax({
		url: requestUrl,
		status: response.code,
		'type': type,
		dataType: 'json',
		responseText: response.data
	});
}

var button = PO.customHelper(function(selector) {
	return {
		click: function() {
			return click(selector);
		},
		exists: function() {
			return $(selector).length > 0;
		}
	};
});

var page = PO.build({
	visit: PO.visitable('/servers'),
	title: PO.text('h1.page-title'),
	servers: PO.collection({
		itemScope: '.servers-list .server',
		item: {
			port: PO.text('td:nth-of-type(1)'),
			serverName: PO.text('td:nth-of-type(2)'),
			status: PO.text('td:nth-of-type(3)'),
			sourceStatus: PO.text('td:nth-of-type(4)'),

			btnRotateLogs: button('.btn-rotate-logs'),
			btnEdit: button('.btn-edit'),
			btnStart: button('.btn-start'),
			btnView: button('.btn-view'),
			btnStop: button('.btn-stop'),
			btnRemove: button('.btn-remove'),
		}
	})
});

test('Visiting /servers/index', function(assert) {

	setupAjaxResponse('/api/servers', 'GET', serverResponses.servers);

	page.visit();

	andThen(function() {
		assert.equal(currentURL(), '/servers');
		assert.equal(page.title(), 'Servers');
	});
});

test('Populate servers list', function(assert) {

	setupAjaxResponse('/api/servers', 'GET', serverResponses.servers);

	page.visit();

	andThen(function() { 
		assert.equal(page.servers().count(), 2); 

		assert.equal(page.servers(1).port(), '8000');
		assert.equal(page.servers(1).serverName(), 'Server 1');
		assert.equal(page.servers(1).status(), 'Stopped');
		assert.equal(page.servers(1).sourceStatus(), 'Disconnected');

		assert.equal(page.servers(2).port(), '9000');
		assert.equal(page.servers(2).serverName(), 'Server 2');
		assert.equal(page.servers(2).status(), 'Running');
		assert.equal(page.servers(2).sourceStatus(), 'Connected');
	});

});

test('Display buttons by server state', function(assert) {

	setupAjaxResponse('/api/servers', 'GET', serverResponses.servers);

	page.visit();

	andThen(function() {

		// Disconnected server
		assert.ok(!page.servers(1).btnRotateLogs().exists());
		assert.ok(page.servers(1).btnStart().exists());
		assert.ok(page.servers(1).btnEdit().exists());
		assert.ok(!page.servers(1).btnStop().exists());
		assert.ok(!page.servers(1).btnView().exists());
		assert.ok(page.servers(1).btnRemove().exists());

		// Connected server
		assert.ok(page.servers(2).btnRotateLogs().exists());
		assert.ok(!page.servers(2).btnStart().exists());
		assert.ok(!page.servers(2).btnEdit().exists());
		assert.ok(page.servers(2).btnStop().exists());
		assert.ok(page.servers(2).btnView().exists());
		assert.ok(page.servers(2).btnRemove().exists());
	});
});

test('Start server', function(assert) {

	setupAjaxResponse('/api/servers/1/start', 'POST', serverResponses.serverStartSuccess);
	setupAjaxResponse('/api/servers', 'GET', serverResponses.servers);

	page.visit();

	page.servers(1).btnStart().click();

	andThen(function() {
		assert.ok(page.servers(1).btnStop().exists());
		assert.ok(page.servers(1).btnView().exists());
		assert.ok(page.servers(1).btnRotateLogs().exists());
		assert.ok(!page.servers(1).btnStart().exists());
		assert.ok(!page.servers(1).btnEdit().exists());
		assert.equal(page.servers(1).status(), 'Running');
	});
});

test('Stop server', function(assert) {

	setupAjaxResponse('/api/servers/2/stop', 'POST', serverResponses.serverStopSucess);
	setupAjaxResponse('/api/servers', 'GET', serverResponses.servers);

	page.visit();

	page.servers(2).btnStop().click();

	andThen(function() {
		assert.equal(page.title(), 'Servers');
		assert.ok(!page.servers(2).btnStop().exists());
		assert.ok(!page.servers(2).btnView().exists());
		assert.ok(!page.servers(2).btnRotateLogs().exists());
		assert.ok(page.servers(2).btnStart().exists());
		assert.ok(page.servers(2).btnEdit().exists());
		assert.equal(page.servers(2).status(), 'Stopped');
	});
});

