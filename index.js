'use strict';

var ZnFactory = require('./src/zn-factory.js');

var instantiateResourceService = function(options) {

	var znHttp = new options.ZnHttp();
	var factory = new ZnFactory(znHttp);

	if (options.resource === 'record') {
		return factory.ZnRecordService();
	}

	if (options.resource === 'activity') {
		return factory.ZnActivityDao();
	}

	throw new Error('ZnResource: invalid resource: ' + options.resource);
};

module.exports = instantiateResourceService;
