'use strict';

var Promise = require('bluebird');

var ZnResourceDao = function(znApi) {
	this.znApi = znApi;
};

ZnResourceDao.prototype._formatResource = function(resource) {
	return resource;
};

ZnResourceDao.prototype.get = function(resourceId) {

	var get = function() {
		var url = this.getEndpoint(resourceId);
		return this.znApi.get(url);
	};

	return Promise.bind(this)
			.then(get)
			.then(this._formatResource);
};

ZnResourceDao.prototype.getEndpoint = function(resourceId) {
	return [this.baseEndpoint, resourceId].join('/');
};

module.exports = ZnResourceDao;
