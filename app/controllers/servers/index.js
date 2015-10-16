import Ember from 'ember';

export default Ember.Controller.extend({

	deleteDialog: {
		show: false,
		server: null		
	},

	actions: {

		serverStart: function(server) {
			this.adapter.serverStart(server.id).then((server) => {
				this.store.push('server', server);
			}, () => {
			});
		},

		serverStop: function(server) {
			this.adapter.serverStop(server.id).then((server) => {
				this.store.push('server', server);
			}, () => {
			});
		},

		serverRemove: function(server) {
			this.set('deleteDialog.server', server);
			this.set('deleteDialog.show', true);
		},

		deleteOk: function() {
			var server = this.get('deleteDialog.server');
			server.destroyRecord();
		}
	}
});
