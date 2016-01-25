'use strict';

describe('ZnActivityDao', function() {

	var util = require('./zn-api-test-util.js');
	var ZnActivity = require('../src/zn-activity.js');
	var ZnActivityDao = require('../src/zn-activity-dao.js');

	var znActivityDao;
	var znNock;

	beforeEach(function() {
		var znApi = util.ZnApi();
		znActivityDao = new ZnActivityDao(znApi);
		znNock = util.ZnNock();
	});

	describe('get', function () {

		it('should request GET api and return instance of ZnActivity', function(done) {

			var apiResponse = {
				data: {
					id: 651
				},
				totalCount: 1
			};

			znNock.get('/activities/651').reply(200, apiResponse);

			znActivityDao.get(651)
				.then(function(response) {
					expect(response.id).toEqual(651);
					expect(response instanceof ZnActivity).toBe(true);
				})
				.catch(function(err) {
					fail(err);
				})
				.finally(function() {
					done();
				});
		});
	});
});
