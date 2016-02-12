'use strict';

var reduce = require('lodash.reduce');
var isArray = require('lodash.isArray');
var isObject = require('lodash.isObject');
var forEach = require('lodash.forEach');

var ZnApi = function(znHttp) {
	this.znHttp = znHttp;
};

var assembleParams = function(params) {

	return reduce(params, function(assembled, paramValue, paramKey) {

		if (isArray(paramValue)) {

			paramValue = paramValue.join('|');
			assembled[paramKey] = paramValue;

			return assembled;
		}

		if (isObject(paramValue)) {

			forEach(paramValue, function(value, key) {
				assembled[paramKey + '.' + key] = value;
			});

			return assembled;
		}

		assembled[paramKey] = paramValue;

		return assembled;

	}, {});
};

ZnApi.prototype.get = function(endpoint, params) {

	var returnData = function(body) {
		return body.data;
	};

	return this.query(endpoint, params).then(returnData);
};

ZnApi.prototype.query = function(endpoint, params) {

	var options = {
		params: assembleParams(params)
	};

	var returnParsedResponse = function(response) {
		var body = response.getBody();

		if (body.totalCount === 0) {
			body.offset = body.offset || 0;
			body.data = body.data || [];
		}

		return body;
	};

	return this.znHttp
		.get(endpoint, options)
		.then(returnParsedResponse);
};

var returnResponseData = function(response) {
	return response.getBody().data;
};

ZnApi.prototype.post = function(endpoint, data) {
	return this.znHttp
		.post(endpoint, data)
		.then(returnResponseData);
};

ZnApi.prototype.put = function(endpoint, data) {
	return this.znHttp
		.put(endpoint, data)
		.then(returnResponseData);
};

module.exports = ZnApi;
