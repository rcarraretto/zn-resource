'use strict';

var index = require('../index.js');
var ZnHttp = require('../lib/zn-http.js');

var callIndexWithZnHttp = function(options) {

	var accessToken = process.env.ZN_ACCESS_TOKEN;

	if (!accessToken) {
		throw new Error('Please set an environment variable named ZN_ACCESS_TOKEN');
	}

	var httpRequest = {
		headers: {
			authorization: 'Bearer ' + accessToken
		}
	};
	ZnHttp(httpRequest).parseHeaders();

	options.ZnHttp = ZnHttp;

	return index(options);
};

module.exports = callIndexWithZnHttp;
