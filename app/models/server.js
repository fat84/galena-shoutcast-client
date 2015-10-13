import DS from 'ember-data';

var attr = DS.attr;

export default DS.Model.extend({
	portBase: attr('number'),
	serverName: attr('string'),
	isRunning: attr('boolean'),
  isSourceConnected: attr('boolean')
});
