'use strict';

var nock = require('nock');

var ZnApi = require('../src/zn-api.js');
var ZnHttp = require('../lib/zn-http.js');

module.exports = {
	ZnApi: function() {
		var options = {
			headers: {}
		};
		ZnHttp(options).parseHeaders();

		var znHttp = new ZnHttp();

		return new ZnApi(znHttp);
	},
	ZnNock: function() {
		return nock('https://api.zenginehq.com/v1');
	}
};
