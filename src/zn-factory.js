'use strict';

var ZnApi = require('./zn-api.js');
var ZnActivityDao = require('./zn-activity-dao.js');
var ZnFormDao = require('./zn-form-dao.js');
var ZnMemberService = require('./zn-member-service.js');
var ZnNoteDao = require('./zn-note-dao.js');
var ZnRecordDao = require('./zn-record-dao.js');
var ZnRecordService = require('./zn-record-service.js');

var ZnFactory = function(znHttp) {
	this.znHttp = znHttp;
	this.znApi = new ZnApi(znHttp);
};

ZnFactory.prototype.ZnActivityDao = function() {
	return new ZnActivityDao(this.znApi);
};

ZnFactory.prototype.ZnFormDao = function() {
	return new ZnFormDao(this.znApi);
};

ZnFactory.prototype.ZnRecordService = function() {
	var znRecordDao = new ZnRecordDao(this.znApi);
	var znNoteDao = new ZnNoteDao(this.znApi);
	return new ZnRecordService(znRecordDao, znNoteDao);
};

ZnFactory.prototype.ZnMemberService = function() {
	return ZnMemberService(this.znApi);
};

module.exports = ZnFactory;
