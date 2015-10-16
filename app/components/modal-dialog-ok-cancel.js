import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		ok: function() {
			this.set('showDialog', false);
			this.sendAction('ok');
		},
		cancel: function() {
			this.set('showDialog', false);
		}
	}
});
