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

var button = PO.customHelper(function(selector) {
	return {
		click: PO.clickable(selector),
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

function mockGetServersAjaxRequest(response) {
	$.mockjax({
		url: '/api/servers',
		dataType: 'json',
		responseText: response
	});
}

test('Visiting /servers/index', function(assert) {

	mockGetServersAjaxRequest(serversData);

	page.visit();

	andThen(function() {
		assert.equal(currentURL(), '/servers');
		assert.equal(page.title(), 'Servers');
	});
});

test('Populate servers list', function(assert) {

	mockGetServersAjaxRequest(serversData);

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

	mockGetServersAjaxRequest(serversData);

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


