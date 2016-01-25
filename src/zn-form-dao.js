'use strict';

var _ = require('lodash');

var ZnForm = require('./zn-form.js');

var ZnFormDao = function(znApi) {
	this.znApi = znApi;
	this.baseEndpoint = '/forms';
};

var instantiateZnForm = function(data) {
	return new ZnForm(data);
};

var instantiateZnForms = function(response) {

	response.data = _.map(response.data, instantiateZnForm);

	return response;
};

ZnFormDao.prototype.get = function(formId) {

	var endpoint = this.baseEndpoint + '/' + formId;

	return this.znApi.get(endpoint).then(instantiateZnForm);
};

ZnFormDao.prototype.query = function(params) {

	params.attributes = 'id,name';
	params.related = 'fields,folders';

	return this.znApi.query(this.baseEndpoint, params).then(instantiateZnForms);
};

module.exports = ZnFormDao;
