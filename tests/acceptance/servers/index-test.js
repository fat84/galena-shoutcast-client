import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'galena-shoutcast-client/tests/helpers/start-app';
import page from '../../pages/servers/index';

module('Acceptance | servers/index', {
	beforeEach: function() {
		this.application = startApp();
	},

	afterEach: function() {
		Ember.run(this.application, 'destroy');
	}
});

test('Visiting /servers/index', function(assert) {

	page.visit();

	andThen(function() {
		assert.equal(currentURL(), '/servers');
		assert.equal(page.title(), 'Servers');
	});
});

test('Populate servers list', function(assert) {

	page.visit();

	andThen(function() { 
		assert.equal(page.servers().count(), 4); 

		// First server
		assert.equal(page.servers(1).port(), '8000');
		assert.equal(page.servers(1).serverName(), 'Server 1');
		assert.equal(page.servers(1).status(), 'Stopped');
		assert.equal(page.servers(1).sourceStatus(), 'Disconnected');

		// Second server
		assert.equal(page.servers(2).port(), '8002');
		assert.equal(page.servers(2).serverName(), 'Server 2');
		assert.equal(page.servers(2).status(), 'Running');
		assert.equal(page.servers(2).sourceStatus(), 'Connected');
	});

});

test('Display buttons by server state', function(assert) {
 
	page.visit();

	andThen(function() {

		// Disconnected server
		assert.ok(page.servers(1).btnRotateLogs().isHidden());
		assert.ok(page.servers(1).btnStart().isVisible());
		assert.ok(page.servers(1).btnEdit().isVisible());
		assert.ok(page.servers(1).btnStop().isHidden());
		assert.ok(page.servers(1).btnView().isHidden());
		assert.ok(page.servers(1).btnRemove().isVisible());
		// Connected server
		assert.ok(page.servers(2).btnRotateLogs().isVisible());
		assert.ok(page.servers(2).btnStart().isHidden());
		assert.ok(page.servers(2).btnEdit().isHidden());
		assert.ok(page.servers(2).btnStop().isVisible());
		assert.ok(page.servers(2).btnView().isVisible());
		assert.ok(page.servers(2).btnRemove().isVisible());
	});
});

test('Start server', function(assert) {

	page.visit();

	page.servers(1).btnStart().click();

	andThen(function() {
		assert.equal(page.servers(1).status(), 'Running');
	});
});

test('Stop server', function(assert) {

	page.visit();

	page.servers(2).btnStop().click();

	andThen(function() {
		assert.equal(page.title(), 'Servers');
		assert.equal(page.servers(2).status(), 'Stopped');
	});
});

test('Delete server - Ok', function(assert) {

	page.visit();
	var firstServerPort;

	page.servers(1).btnRemove().click();

	andThen(function() {
		firstServerPort= page.servers(1).port();
		assert.ok(page.deleteDialog().btnOk().isVisible());
		assert.ok(page.deleteDialog().btnCancel().isVisible());
	});

	page.deleteDialog().btnOk().click();

	andThen(function() {
		assert.notEqual(page.servers(1).port(), firstServerPort);
	});

});

test('Delete server - Cancel', function(assert) {

	page.visit();
	var firstServerPort;

	page.servers(1).btnRemove().click();

	andThen(function() {
		firstServerPort= page.servers(1).port();
		assert.ok(page.deleteDialog().btnOk().isVisible());
		assert.ok(page.deleteDialog().btnCancel().isVisible());
	});

	page.deleteDialog().btnCancel().click();

	andThen(function() {
		assert.equal(page.servers(1).port(), firstServerPort);
	});

});


