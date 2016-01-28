'use strict';

var _ = require('lodash');
var ZnFactory = require('./src/zn-factory.js');
var ZnActivity = require('./src/zn-activity.js');

var onInvalidResource = function(resourceName) {
	throw new Error('ZnResource: invalid resource: ' + resourceName);
};

var getResourceClass = function(resourceName) {

	if (resourceName === 'activity') {
		return ZnActivity;
	}

	onInvalidResource(resourceName);
};

var instantiateResourceService = function(options) {

	if (!options.ZnHttp) {
		throw new Error('ZnResource: ZnHttp must be provided');
	}

	var znHttp = new options.ZnHttp();
	var factory = new ZnFactory(znHttp);

	if (options.resource === 'record') {
		return factory.ZnRecordService();
	}

	if (options.resource === 'activity') {
		return factory.ZnActivityDao();
	}

	onInvalidResource(options.resource);
};

var main = function(options) {

	if (_.isString(options)) {
		return getResourceClass(options);
	}

	return instantiateResourceService(options);
};

module.exports = main;
