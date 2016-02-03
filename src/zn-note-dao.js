'use strict';

var ZnNoteDao = function(znApi) {
	this.znApi = znApi;
};

ZnNoteDao.prototype.save = function(request) {

	var apiRequest = {
		workspace: {
			id: request.workspaceId
		},
		record: {
			id: request.recordId
		},
		body: request.body
	};

	return this.znApi.post('/notes', apiRequest);
};

module.exports = ZnNoteDao;
