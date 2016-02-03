'use strict';

describe('ZnRecordService', function() {

	var nock = require('nock');
	var util = require('./zn-api-test-util.js');

	var znRecordService;
	var znNock;

	beforeEach(function() {
		var znFactory = util.ZnFactory();
		znRecordService = znFactory.ZnRecordService();
		znNock = util.ZnNock();
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

			it('should', function() {

				var request = {
					formId: 7,
					fieldId: 123,
					value: 'apples'
				};

				var assert = function(resource) {
					expect(resource.id).to.equal(resources[0].id);
				};

				return znRecordService.findByFieldValue(request)
					.then(assert);
			});
		});
	});

	describe('addNote', function() {

		it('should POST', function() {

			var apiNote = {
				id: 88
			};

			znNock.post('/notes').reply(200, { data: apiNote });

			return znRecordService.addNote({
				workspaceId: 10,
				recordId: 580,
				body: 'Hello'
			}).should.eventually.eql(apiNote);
		});

	});

	describe('getNote', function() {

		it('should Get', function() {

			var apiNote = {
				id: 88,
				workspace: {
					id: 10
				},
				record: {
					id: 580
				}
			};

			znNock.get('/notes/88').reply(200, { data: apiNote });

			return znRecordService.getNote({
				workspaceId: 10,
				recordId: 580,
				id: 88
			}).should.eventually.eql(apiNote);
		});

	});
});
