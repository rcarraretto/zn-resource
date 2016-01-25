'use strict';

var ZnResourceQueryFullscale = function(znResourceQuery) {
	this.znResourceQuery = znResourceQuery;
	this.limitPerQuery = 500;
};

ZnResourceQueryFullscale.prototype.queryData = function(request) {

	var resources = [];
	var znResourceQuery = this.znResourceQuery;
	var limitPerQuery = this.limitPerQuery;

	request.limit = limitPerQuery;
	request.page = 0;

	var addResources = function(response) {

		resources = resources.concat(response.data);

		var numberOfResourcesQueriedSoFar = (response.offset + 1) * limitPerQuery;

		var done = numberOfResourcesQueriedSoFar >= response.totalCount;

		return done;
	};

	var queryNextPage = function() {
		request.page++;
		return znResourceQuery.query(request).then(addResources);
	};

	var queryUntilDone = function() {

		var repeatUntilDone = function(done) {
			if (!done) {
				return queryUntilDone();
			}
		};

		return queryNextPage().then(repeatUntilDone);
	};

	var returnAllResources = function() {
		return resources;
	};

	return queryUntilDone().then(returnAllResources);
};

module.exports = ZnResourceQueryFullscale;
