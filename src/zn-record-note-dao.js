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

ZnRecordNoteDao.prototype.get = function(request) {

	if (!request.workspaceId) {
		return Promise.reject('ZnRecordNote: no workspace id');
	}

	if (!request.recordId) {
		return Promise.reject('ZnRecordNote: no record id');
	}

	var checkIds = function(note) {

		if (note.workspace.id !== request.workspaceId) {
			return null;
		}

		if (note.record.id !== request.recordId) {
			return null;
		}

		return note;
	};

	return this.znNoteDao.get(request).then(checkIds);
};

module.exports = ZnRecordNoteDao;
