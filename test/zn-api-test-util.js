'use strict';

var nock = require('nock');

var ZnHttp = require('../lib/zn-http.js');

var ZnApi = require('../src/zn-api.js');
var ZnFactory = require('../src/zn-factory.js');

var instantiateZnHttp = function() {

	var options = {
		headers: {}
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

var nockOnZengineApi = function() {
	return nock('https://api.zenginehq.com/v1');
};

module.exports = {
	ZnFactory: instantiateZnFactory,
	ZnApi: instantiateZnApi,
	ZnNock: nockOnZengineApi
};
