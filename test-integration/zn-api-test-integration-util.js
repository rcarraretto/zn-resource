'use strict';

var ZnHttp = require('../lib/zn-http.js');

var ZnApi = require('../src/zn-api.js');
var ZnFactory = require('../src/zn-factory.js');

var instantiateZnHttp = function() {

	var accessToken = process.env.ZN_ACCESS_TOKEN;

	if (!accessToken) {
		throw new Error('Please set an environment variable named ZN_ACCESS_TOKEN');
	}

	var options = {
		headers: {
			authorization: 'Bearer ' + accessToken
		}
	};
	ZnHttp(options).parseHeaders();

	return new ZnHttp();
};

var instantiateZnApi = function() {

	var znHttp = instantiateZnHttp();

	return new ZnApi(znHttp);
};

var instantiateZnFactory = function() {

	var znHttp = instantiateZnHttp();

	return new ZnFactory(znHttp);
};

module.exports = {
	ZnFactory: instantiateZnFactory,
	ZnApi: instantiateZnApi
};
