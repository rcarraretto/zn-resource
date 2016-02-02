'use strict';

describe('ZnResourceQueryFullscale', function() {

	var util = require('./zn-api-test-util.js');

	var ZnResourceQueryFullscale = require('../src/zn-resource-query-fullscale.js');
	var ZnRecordDao = require('../src/zn-record-dao.js');

	var znResourceQueryFullscale;
	var znNock;

	beforeEach(function() {

		var znApi = util.ZnApi();
		var znRecordDao = new ZnRecordDao(znApi);
		znResourceQueryFullscale = new ZnResourceQueryFullscale(znRecordDao);

		znNock = util.ZnNock();
	});

	describe('queryData', function () {

		describe('when only one query is required', function() {

			it('should return all resources', function(done) {

				var request = {
					formId: 1
				};

				var apiResources = [
					{
						id: 1,
						field123: 'apples'
					},
					{
						id: 2,
						field123: 'bananas'
					}
				];

				var queryResponse = {
					data: apiResources,
					offset: 0,
					totalCount: 2
				};

				znNock.get('/forms/1/records?limit=2&page=1').reply(200, queryResponse);

				var expectedResources = [
					{
						id: 1,
						formId: 1,
						field123: 'apples'
					},
					{
						id: 2,
						formId: 1,
						field123: 'bananas'
					}
				];

				znResourceQueryFullscale.limitPerQuery = 2;

				znResourceQueryFullscale.queryData(request)
					.then(function(resources) {
						expect(resources).to.equal(expectedResources);
					})
					.catch(function(err) {
						fail(err);
					})
					.finally(function() {
						done();
					});
			});
		});

		describe('when multiple queries are required', function() {

			it('should return all resources', function(done) {

				var request = {
					formId: 1
				};

				var apiRecords1 = [
					{
						id: 1,
						field123: 'apples'
					},
					{
						id: 2,
						field123: 'bananas'
					}
				];

				var apiRecords2 = [
					{
						id: 3,
						field123: 'oranges'
					},
					{
						id: 4,
						field123: 'pineapples'
					}
				];

				var apiRecords3 = [
					{
						id: 5,
						field123: 'avocados'
					}
				];

				var queryResponse1 = {
					data: apiRecords1,
					offset: 0,
					totalCount: 5
				};

				var queryResponse2 = {
					data: apiRecords2,
					offset: 1,
					totalCount: 5
				};

				var queryResponse3 = {
					data: apiRecords3,
					offset: 2,
					totalCount: 5
				};

				znNock.get('/forms/1/records?limit=2&page=1').reply(200, queryResponse1);
				znNock.get('/forms/1/records?limit=2&page=2').reply(200, queryResponse2);
				znNock.get('/forms/1/records?limit=2&page=3').reply(200, queryResponse3);

				var expectedResources = [
					{
						id: 1,
						formId: 1,
						field123: 'apples'
					},
					{
						id: 2,
						formId: 1,
						field123: 'bananas'
					},
					{
						id: 3,
						formId: 1,
						field123: 'oranges'
					},
					{
						id: 4,
						formId: 1,
						field123: 'pineapples'
					},
					{
						id: 5,
						formId: 1,
						field123: 'avocados'
					}
				];

				znResourceQueryFullscale.limitPerQuery = 2;

				znResourceQueryFullscale.queryData(request)
					.then(function(resources) {
						expect(resources).to.equal(expectedResources);
					})
					.catch(function(err) {
						fail(err);
					})
					.finally(function() {
						done();
					});
			});
		});

		describe('when request has params', function() {

			it('should preserve them, except page and limit', function(done) {

				var request = {
					formId: 1,
					attribute: 'id',
					page: 20,
					limit: 250
				};

				var apiResponse = {
					data: [{id: 1}, {id: 7}],
					offset: 0,
					totalCount: 2
				};

				znNock.get('/forms/1/records?attribute=id&page=1&limit=2').reply(200, apiResponse);

				znResourceQueryFullscale.limitPerQuery = 2;

				znResourceQueryFullscale.queryData(request)
					.then(function(response) {
						expect(response.length).to.equal(2);
						expect(response[0].id).to.equal(apiResponse.data[0].id);
						expect(response[1].id).to.equal(apiResponse.data[1].id);
					})
					.catch(function(err) {
						fail(err);
					})
					.finally(function() {
						done();
					});
			});
		});

		it('should use 500 as default limit per query', function(done) {

			var request = {
				formId: 1
			};

			var apiResponse = {
				data: [{id: 1}, {id: 7}],
				totalCount: 0,
				offset: 0
			};

			znNock.get('/forms/1/records?limit=500&page=1').reply(200, apiResponse);

			znResourceQueryFullscale.queryData(request)
				.then(function(response) {
					expect(response.length).to.equal(2);
					expect(response[0].id).to.equal(apiResponse.data[0].id);
					expect(response[1].id).to.equal(apiResponse.data[1].id);
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
