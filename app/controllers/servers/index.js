import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		serverStart: function(server) {
			this.adapter.serverStart(server.id).then((server) => {
				this.store.push('server', server);
			}, (error) => {
			});
		},
		serverStop: function(server) {
			this.adapter.serverStop(server.id).then((server) => {
				this.store.push('server', server);
			}, (error) => {
			});
		}
	}
});
