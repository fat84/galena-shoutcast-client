import { moduleFor, test } from 'ember-qunit';

moduleFor('adapter:server', 'Unit | Adapter | server', {
	// Specify the other units that are required for this test.
	// needs: ['serializer:foo']
});

var serverResponses = {
	serverStartSuccess: {
		code: 200,
		data: {
			id: 1,
			serverName: 'Test',
			basePort: 8000,
			isRunning: true,
			isSourceConnected: false
		}
	},
	serverStopSucess: {
		code: 200,
		data: {
			id: 1,
			serverName: 'Test',
			basePort: 8000,
			isRunning: false,
			isSourceConnected: false
		}
	},
	serverStartError: {
		code: 400,
		data: {
			errors: [{ message: "Can't start the server" }]
		}
	},
	serverStopError: {
		code: 400,
		data: {
			errors: [{ message: "Can't stop the server" }]
		}
	},
};

function setupAjaxResponse(requestUrl, type, response) {
	$.mockjax.clear();
	$.mockjax({
		url: requestUrl,
		status: response.code,
		'type': type,
		dataType: 'json',
		responseText: response.data
	});
}

// Replace this with your real tests.
test('it exists', function(assert) {
	var adapter = this.subject();
	assert.ok(adapter);
});


test('start server success', function(assert) {
	var adapter = this.subject();

	setupAjaxResponse('/api/servers/1/start', 'POST', serverResponses.serverStartSuccess);

	return adapter.serverStart(1).then((result) => {
		assert.ok(result);
		assert.deepEqual(result, serverResponses.serverStartSuccess.data);
	});

});

test('start server error', function(assert) {
	var adapter = this.subject();

	setupAjaxResponse('/api/servers/1/start', 'POST', serverResponses.serverStartError);

	var serverId = 1;

	return adapter.serverStart(serverId).then(() => {
		assert.ok(false);
	}, (error) => {
		assert.ok(error);
		assert.deepEqual(error.errors, serverResponses.serverStartError.data.errors);
	});

});


test('stop server success', function(assert) {
	var adapter = this.subject();

	setupAjaxResponse('/api/servers/1/stop', 'POST', serverResponses.serverStopSucess);

	return adapter.serverStop(1).then((result) => {
		assert.ok(result);
		assert.deepEqual(serverResponses.serverStopSucess.data, result);
	});

});


test('stop server error', function(assert) {
	var adapter = this.subject();

	setupAjaxResponse('/api/servers/1/stop', 'POST', serverResponses.serverStopError);

	return adapter.serverStop(1).then(() => {
		assert.ok(false);
	}, (error) => {
		assert.ok(error);
		assert.deepEqual(error.errors, serverResponses.serverStopError.data.errors);
	});

});

