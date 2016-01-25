'use strict';

describe('ZnRecordService', function() {

	var nock = require('nock');
	var util = require('./zn-api-test-util.js');

	var ZnRecordDao = require('../src/zn-record-dao.js');
	var ZnRecordService = require('../src/zn-record-service.js');

	var znRecordDao;
	var znRecordService;

	beforeEach(function() {

		var znApi = util.ZnApi();
		znRecordDao = new ZnRecordDao(znApi);
		znRecordService = new ZnRecordService(znRecordDao);
	});

	describe('GET requests', function() {

		var resources;

		beforeEach(function() {

			resources = [
				{ id: 1 },
				{ id: 2 }
			];

			nock('https://api.zenginehq.com')
				.filteringPath(function(path){
					return '/';
				})
				.get('/')
				.reply(200, function(uri, requestBody) {
					return {
						data: resources
					};
				});
		});

		describe('findByFieldValue', function() {

			it('should', function(done) {

				var request = {
					formId: 7,
					fieldId: 123,
					value: 'apples'
				};

				var assert = function(resource) {
					expect(resource.id).toEqual(resources[0].id);
				};

				znRecordService.findByFieldValue(request)
					.then(assert)
					.catch(function(err) {
						fail(err);
					})
					.finally(function() {
						done();
					});
			});
		});
	});
});
