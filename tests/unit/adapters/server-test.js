import { moduleFor, test } from 'ember-qunit';
import startMirage from '../../helpers/setup-mirage-for-integration';

moduleFor('adapter:server', 'Unit | Adapter | server', {
	// Specify the other units that are required for this test.
	// needs: ['serializer:foo']
	integration: true,
	setup: function() {
		startMirage(this.container);
	}
});


test('it exists', function(assert) {
	var adapter = this.subject();
	assert.ok(adapter);
});


test('start server success', function(assert) {
	var adapter = this.subject();

	return adapter.serverStart(1).then((result) => {
		assert.ok(result);
		assert.deepEqual({
			id: 1,
			portBase: 8000,
			serverName: 'Server 1',
			isRunning: true,
			isSourceConnected: false
		}, result);
	});

});


test('start server error', function(assert) {
	var adapter = this.subject();

	return adapter.serverStart(3).then(() => {
		assert.ok(false);
	}, (error) => {
		assert.ok(error);
	});

});


test('stop server success', function(assert) {
	var adapter = this.subject();

	return adapter.serverStop(2).then((result) => {
		assert.ok(result);
		assert.deepEqual({
			id: 2,
			portBase: 8002,
			serverName: 'Server 2',
			isRunning: false,
			isSourceConnected: false
		}, result);
	});

});


test('stop server error', function(assert) {
	var adapter = this.subject();

	return adapter.serverStop(4).then(() => {
		assert.ok(false);
	}, (error) => {
		assert.ok(error);
	});

});

