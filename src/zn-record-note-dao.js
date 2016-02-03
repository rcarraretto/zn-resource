'use strict';

var Promise = require('bluebird');

var ZnRecordNoteDao = function(znNoteDao) {
	this.znNoteDao = znNoteDao;
};

ZnRecordNoteDao.prototype.add = function(request) {

	if (!request.workspaceId) {
		return Promise.reject('ZnRecordNote: no workspace id');
	}

	if (!request.recordId) {
		return Promise.reject('ZnRecordNote: no record id');
	}

	return this.znNoteDao.save(request);
};

module.exports = ZnRecordNoteDao;
