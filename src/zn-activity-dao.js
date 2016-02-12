'use strict';

var create = require('lodash.create');

var ZnActivity = require('./zn-activity.js');
var ZnResourceDao = require('./zn-resource-dao.js');

var ZnActivityDao = function(znApi) {
	ZnResourceDao.call(this, znApi);
	this.baseEndpoint = '/activities';
};

ZnActivityDao.prototype = create(ZnResourceDao.prototype);

ZnActivityDao.prototype._formatResource = function(resource) {
	return new ZnActivity(resource);
};

module.exports = ZnActivityDao;
