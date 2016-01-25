'use strict';

describe('ZnResourceQueryByAttributeValues', function() {

	var util = require('./zn-api-test-util.js');

	var ZnResourceQueryByAttributeValues = require('../src/zn-resource-query-by-attribute-values.js');
	var ZnRecordDao = require('../src/zn-record-dao.js');

	var znResourceQueryByAttributeValues;
	var znNock;

	beforeEach(function() {

		var znApi = util.ZnApi();
		var znRecordDao = new ZnRecordDao(znApi);
		znResourceQueryByAttributeValues = new ZnResourceQueryByAttributeValues(znRecordDao);

		znNock = util.ZnNock();
	});

	describe('queryData', function () {

		describe('when only one query is required', function() {

			it('should return all resources', function(done) {

				var apiResources = [
					{
						id: 1,
						field123: {
							id: 10
						}
					},
					{
						id: 2,
						field123: {
							id: 15
						}
					}
				];

				var queryResponse = {
					data: apiResources
				};

				znNock.get('/forms/1/records?limit=2&field123=10%7C15').reply(200, queryResponse);

				var request = {
					formId: 1
				};
				var attribute = 'field123';
				var values = [10, 15];

				znResourceQueryByAttributeValues.limitPerQuery = 2;

				znResourceQueryByAttributeValues.queryData(request, attribute, values)
					.then(function(resources) {
						expect(resources.length).toEqual(2);
						expect(resources[0].id).toEqual(apiResources[0].id);
						expect(resources[1].id).toEqual(apiResources[1].id);
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

				var apiRecords1 = [
					{
						id: 1,
						field123: {
							id: 10
						}
					},
					{
						id: 2,
						field123: {
							id: 300
						}
					}
				];

				var apiRecords2 = [
					{
						id: 3,
						field123: {
							id: 14
						}
					},
					{
						id: 4,
						field123: {
							id: 19
						}
					}
				];

				var apiRecords3 = [
					{
						id: 5,
						field123: {
							id: 8
						}
					}
				];

				var queryResponse1 = {
					data: apiRecords1
				};

				var queryResponse2 = {
					data: apiRecords2
				};

				var queryResponse3 = {
					data: apiRecords3
				};

				znNock.get('/forms/1/records?limit=2&field123=10%7C300').reply(200, queryResponse1);
				znNock.get('/forms/1/records?limit=2&field123=14%7C19').reply(200, queryResponse2);
				znNock.get('/forms/1/records?limit=2&field123=8').reply(200, queryResponse3);

				var expectedResources = [
					{
						id: 1,
						field123: {
							id: 10
						}
					},
					{
						id: 2,
						field123: {
							id: 300
						}
					},
					{
						id: 3,
						field123: {
							id: 14
						}
					},
					{
						id: 4,
						field123: {
							id: 19
						}
					},
					{
						id: 5,
						field123: {
							id: 8
						}
					}
				];

				var request = {
					formId: 1
				};
				var attribute = 'field123';
				var values = [10, 300, 14, 19, 8];

				znResourceQueryByAttributeValues.limitPerQuery = 2;

				znResourceQueryByAttributeValues.queryData(request, attribute, values)
					.then(function(resources) {
						expect(resources.length).toEqual(5);
						expect(resources[0].id).toEqual(expectedResources[0].id);
						expect(resources[1].id).toEqual(expectedResources[1].id);
						expect(resources[2].id).toEqual(expectedResources[2].id);
						expect(resources[3].id).toEqual(expectedResources[3].id);
						expect(resources[4].id).toEqual(expectedResources[4].id);
					})
					.catch(function(err) {
						fail(err);
					})
					.finally(function() {
						done();
					});
			});
		});

		it('should query in groups of 500 values by default, since the url has a size limit', function(done) {

			var expectedResponse = {
				data: []
			};

			znNock.get('/forms/1/records?limit=500&field123=1%7C3').reply(200, expectedResponse);

			var request = {
				formId: 1
			};
			var attribute = 'field123';
			var values = [1, 3];

			znResourceQueryByAttributeValues.queryData(request, attribute, values)
				.catch(function(err) {
					fail(err);
				})
				.finally(function() {
					done();
				});
		});

		describe('when values is empty array', function() {

			it('should return resolved promise with empty resources', function(done) {

				var request = {};
				var attribute = 'field123';
				var values = [];

				znResourceQueryByAttributeValues.queryData(request, attribute, values)
					.then(function(resources) {
						expect(resources).toEqual([]);
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

	describe('findByFieldValue', function() {

		it('should return first resource', function(done) {

				var apiResource = {
					id: 1,
					field123: 'apples'
				};

				var queryResponse = {
					data: [apiResource]
				};

				znNock.get('/forms/1/records?limit=1&field123=apples').reply(200, queryResponse);

				var request = {
					formId: 1,
					fieldId: 123,
					value: 'apples'
				};

				znResourceQueryByAttributeValues.findByFieldValue(request)
					.then(function(resource) {
						expect(resource.id).toEqual(apiResource.id);
						expect(resource.field123).toEqual(apiResource.field123);
					})
					.catch(function(err) {
						fail(err);
					})
					.finally(function() {
						done();
					});
		});

		it('should return null when resource is not found', function(done) {

				var queryResponse = {
					status: 404,
					totalCount: 0
				};

				znNock.get('/forms/1/records?limit=1&field123=apples').reply(200, queryResponse);

				var request = {
					formId: 1,
					fieldId: 123,
					value: 'apples'
				};

				znResourceQueryByAttributeValues.findByFieldValue(request)
					.then(function(resource) {
						expect(resource).toBeNull();
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
