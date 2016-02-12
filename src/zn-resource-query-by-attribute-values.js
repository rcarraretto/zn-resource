'use strict';

var chunk = require('lodash.chunk');
var isEmpty = require('lodash.isEmpty');
var Promise = require('bluebird');

var ZnResourceQueryByAttributeValues = function(znResourceQuery) {
	this.znResourceQuery = znResourceQuery;
	this.limitPerQuery = 500;
};

ZnResourceQueryByAttributeValues.prototype.queryData = function(request, attribute, values) {

	var resources = [];
	var znResourceQuery = this.znResourceQuery;
	var chunks = chunk(values, this.limitPerQuery);

	request.limit = this.limitPerQuery;

	var addResources = function(response) {
		resources = resources.concat(response.data);
	};

	var queryChunks = function() {

		if (isEmpty(chunks)) {
			return Promise.resolve(resources);
		}

		request[attribute] = chunks.shift();

		return znResourceQuery.query(request)
			.then(addResources)
			.then(queryChunks);
	};

	return queryChunks();
};

ZnResourceQueryByAttributeValues.prototype.findByFieldValue = function(request) {

	var query = {
		formId: request.formId,
		limit: 1
	};

	query['field' + request.fieldId] = request.value;

	var returnFirstResource = function(response) {
		return response.data[0] || null;
	};

	return this.znResourceQuery.query(query).then(returnFirstResource);
};

module.exports = ZnResourceQueryByAttributeValues;
