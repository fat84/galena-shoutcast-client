import Mirage from 'ember-cli-mirage';

export default function() {

  this.namespace = 'api';	

	function serversList() {
		return [{
			// Server stopped (Can start)
			id: 1,
			portBase: 8000,
			serverName: 'Server 1',
			isRunning: false,
			isSourceConnected: false
		},
		{
			// Server running (Can stop)
			id: 2,
			portBase: 8002,
			serverName: 'Server 2',
			isRunning: true,
			isSourceConnected: true
		},
		{
			// Server stopped (Fails on start)
			id: 3,
			portBase: 8004,
			serverName: 'Server 3',
			isRunning: false,
			isSourceConnected: false
		},
		{
			// Server running (Fails on stop)
			id: 4,
			portBase: 8006,
			serverName: 'Server 4',
			isRunning: true,
			isSourceConnected: true
		}];
	}

	this.get('/servers', function() {
		return serversList();
	});

	this.post('/servers/:id/start', function(db, request) {
		var id = parseInt(request.params.id);

		var servers = serversList();
		var server = servers[id-1];

		switch(id) {
			case 1:
				server.isRunning = true;
				return server;
			case 2:
			case 4:
				return new Mirage.Response(400, {}, { errors: [{ message: "Already running." }] });
			case 3:
				return new Mirage.Response(400, {}, { errors: [{ message: "Can't start the server." }] });
			default:
				return servers[id+1];
		}

	});

	this.post('/servers/:id/stop', function(db, request) {
		var id = parseInt(request.params.id);

		var servers = serversList();
		var server = servers[id-1];

		switch(id) {
			case 1:
			case 3:
				return new Mirage.Response(400, {}, { errors: [{ message: "Already stopped." }] });
			case 2:
				server.isRunning = false;
				server.isSourceConnected = false;
				return server;
			case 4:
				return new Mirage.Response(400, {}, { errors: [{ message: "Can't stop the server." }] });
			default:
				return servers[id+1];
		}
	});
}

