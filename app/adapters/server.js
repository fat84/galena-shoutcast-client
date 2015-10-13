import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({

	serverStart: function(serverId) {

		return this.ajax(this.buildURL('server', serverId)+'/start', 'POST', {}).then((result) => {
			console.log(result);
			console.log(result);
			console.log(result);
			console.log(result);
			console.log(result);
			console.log(result);
			console.log(result);
			console.log(result);
			return result;
		});

	},
	
});
