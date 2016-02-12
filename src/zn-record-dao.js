'use strict';

var map = require('lodash.map');
var merge = require('lodash.merge');

var ZnRecordDao = function(znApi) {
	this.znApi = znApi;
};

var getEndpoint = function(formId, recordId) {

	var endpoint = ['/forms', formId, 'records'].join('/');

	if (recordId) {
		endpoint += '/' + recordId;
	}

	return endpoint;
};

var _formatRecord = function(record, formId) {
	record.formId = formId;
	return record;
};

var _formatRecords = function(response, formId) {

	response.data = map(response.data, function(record) {
		return _formatRecord(record, formId);
	});

	return response;
};

ZnRecordDao.prototype.get = function(request) {

	var formId = request.formId;

	var endpoint = getEndpoint(formId, request.id);

	var formatRecord = function(response) {
		return _formatRecord(response, formId);
	};

	return this.znApi.get(endpoint).then(formatRecord);
};

ZnRecordDao.prototype.query = function(request) {

	var formId = request.formId;

	var endpoint = getEndpoint(formId);

	var formatRecords = function(response) {
		return _formatRecords(response, formId);
	};

	var params = merge({}, request);
	delete params.formId;

	return this.znApi.query(endpoint, params).then(formatRecords);
};

ZnRecordDao.prototype.save = function(record) {

	var formId = record.formId;
	delete record.formId;

	var endpoint = getEndpoint(formId, record.id);

	var formatRecord = function(record) {
		return _formatRecord(record, formId);
	};

	if (!record.id) {
		return this.znApi.post(endpoint, record).then(formatRecord);
	} else {
		return this.znApi.put(endpoint, record).then(formatRecord);
	}
};

module.exports = ZnRecordDao;
