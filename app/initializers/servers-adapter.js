export function initialize(container, application) {
  application.inject('controller:servers.index', 'adapter', 'adapter:server');
  application.inject('controller:servers.index', 'store', 'service:store');
}

export default {
  name: 'servers-adapter',
  initialize: initialize
};
