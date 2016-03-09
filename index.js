'use strict';

var isString = require('lodash.isstring');
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

	if (options.resource === 'member') {
		return factory.ZnMemberService();
	}

	onInvalidResource(options.resource);
};

var main = function(options) {

	if (isString(options)) {
		return getResourceClass(options);
	}

	return instantiateResourceService(options);
};

module.exports = main;
