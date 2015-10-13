import { moduleFor, test } from 'ember-qunit';

moduleFor('adapter:server', 'Unit | Adapter | server', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
});


function mockServerStartAjaxRequest(serverId, resultCode, response) {
	$.mockjax({
		url: '/api/servers/1/start',
	  status: resultCode,
		type: 'POST',
		dataType: 'json',
		responseText: response
	});
}

// Replace this with your real tests.
test('it exists', function(assert) {
  var adapter = this.subject();
  assert.ok(adapter);
});

test('start server', function(assert) {
	var adapter = this.subject();

	mockServerStartAjaxRequest(1, 200, {
		id: 1,
		serverName: 'Test',
		basePort: 8000,
		isRunning: true,
		isSourceConnected: false
	});

	var serverId = 1;
	
	adapter.serverStart(serverId).then((result) => {
		assert.ok(result);
	});
});
