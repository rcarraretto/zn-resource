'use strict';

var assign = require('lodash.assign');
var get = require('lodash.get');

var ZnActivity = function(data) {
	assign(this, data);
};

var eventCheckers = {
	moveToFolder: function(activity, e) {
		return activity._recordCreatedInFolder(e.folderId) || activity._recordFolderUpdated(e.folderId);
	}
};

ZnActivity.prototype.checkEvent = function(e) {

	var check = eventCheckers[e.type];

	if (!check) {
		throw new Error('Activity: checkEvent: Invalid type ' + e.type);
	}

	return check(this, e);
};

ZnActivity.prototype._recordCreated = function() {
	return this.resource === 'records' && this.action === 'create';
};

ZnActivity.prototype._recordUpdated = function() {
	return this.resource === 'records' && this.action === 'update';
};

ZnActivity.prototype._getFolderId = function() {
	return get(this, 'record.folder.id');
};

ZnActivity.prototype._changedToFolder = function() {
	return get(this, 'changes.to.folder.id');
};

ZnActivity.prototype._recordCreatedInFolder = function(folderId) {
	return this._recordCreated() && this._getFolderId() === folderId;
};

ZnActivity.prototype._recordFolderUpdated = function(folderId) {
	return this._recordUpdated() && this._changedToFolder() === folderId;
};

module.exports = ZnActivity;
