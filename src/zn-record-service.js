'use strict';

var ZnRecordNoteDao = require('./zn-record-note-dao.js');
var ZnResourceQueryByAttributeValues = require('./zn-resource-query-by-attribute-values.js');

var ZnRecordService = function(znRecordDao, znNoteDao) {
	this.znRecordDao = znRecordDao;
	this.znNoteDao = znNoteDao;
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

ZnRecordService.prototype.addNote = function(request) {
	var service = new ZnRecordNoteDao(this.znNoteDao);
	return service.add(request);
};

ZnRecordService.prototype.getNote = function(request) {
	var service = new ZnRecordNoteDao(this.znNoteDao);
	return service.get(request);
};

module.exports = ZnRecordService;
