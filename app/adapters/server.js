import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({

	serverStart: function(serverId) {

		return this.ajax(this.buildURL('server', serverId)+'/start', 'POST', {}).then((server) => {
			return server;
		});

	},
	

	serverStop: function(serverId) {

		return this.ajax(this.buildURL('server', serverId)+'/stop', 'POST', {}).then((server) => {
			return server;
		});

	},

	
});
