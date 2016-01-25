'use strict';

var ZnResourceQueryByAttributeValues = require('./zn-resource-query-by-attribute-values.js');

var ZnRecordService = function(znRecordDao) {
	this.znRecordDao = znRecordDao;
};

ZnRecordService.prototype.get = function(request) {
	return this.znRecordDao.get(request);
};

ZnRecordService.prototype.query = function(request) {
	return this.znRecordDao.query(request);
};

ZnRecordService.prototype.save = function(request) {
	return this.znRecordDao.save(request);
};

ZnRecordService.prototype.findByFieldValue = function(request) {
	var service = new ZnResourceQueryByAttributeValues(this.znRecordDao);
	return service.findByFieldValue(request);
};

module.exports = ZnRecordService;
