'use strict';

describe('ZnApi', function() {

	var nock = require('nock');

	var ZnApi = require('../src/zn-api.js');
	var ZnHttp = require('../lib/zn-http.js');

	var znApi;

	var znHttpWorkaround = function() {
		var options = {
			headers: {}
		};
		ZnHttp(options).parseHeaders();
	};

	var setupTest = function() {
		znHttpWorkaround();
	};

	setupTest();

	beforeEach(function() {
		var znHttp = new ZnHttp();
		znApi = new ZnApi(znHttp);
	});

	describe('get', function () {

		it('should send GET request and return response data', function(done) {

			var expectedRecords = [
				{
					id: 1
				},
				{
					id: 3
				}
			];

			nock('https://api.zenginehq.com/v1')
				.get('/forms/123/records')
				.reply(200, {
					data: expectedRecords
				});

			znApi.get('/forms/123/records').then(function(records) {
				expect(records).to.equal(expectedRecords);
			})
			.catch(function(err) {
				fail(new Error(err));
			})
			.finally(function() {
				done();
			});
		});

		it('should assemble params, so array values are separated by |', function(done) {

			nock('https://api.zenginehq.com')
				.filteringPath(function(path){
					return '/';
				})
				.get('/')
				.reply(200, function(uri, requestBody) {
					uri = decodeURIComponent(uri);
					expect(uri).to.equal('/v1/forms/1/records?field100=1|2|3&field200=apples');
					return {};
				});

			var params = {
				field100: [1, 2, 3],
				field200: 'apples'
			};

			znApi.get('/forms/1/records', params)
				.catch(function(err) {
					fail(new Error(err));
				})
				.finally(function() {
					done();
				});
		});
	});

	describe('query', function () {

		it('should send GET request and return response', function(done) {

			var expectedResponse = {
				data: [
					{
						id: 1
					},
					{
						id: 3
					}
				],
				totalCount: 4,
				offset: 1
			};

			nock('https://api.zenginehq.com/v1')
				.get('/forms/123/records')
				.reply(200, expectedResponse);

			znApi.query('/forms/123/records').then(function(response) {
				expect(response).to.equal(expectedResponse);
			})
			.catch(function(err) {
				fail(new Error(err));
			})
			.finally(function() {
				done();
			});
		});

		it('should assemble params, so array values are separated by |', function(done) {

			nock('https://api.zenginehq.com')
				.filteringPath(function(path){
					return '/';
				})
				.get('/')
				.reply(200, function(uri, requestBody) {
					uri = decodeURIComponent(uri);
					expect(uri).to.equal('/v1/forms/1/records?field100=1|2|3&field200=apples');
					return {};
				});

			var params = {
				field100: [1, 2, 3],
				field200: 'apples'
			};

			znApi.query('/forms/1/records', params)
				.catch(function (err) {
					fail(new Error(err));
				})
				.finally(function() {
					done();
				});
		});

		it('should assemble params, so object values are flattened', function(done) {

			nock('https://api.zenginehq.com')
				.filteringPath(function(path){
					return '/';
				})
				.get('/')
				.reply(200, function(uri, requestBody) {
					uri = decodeURIComponent(uri);
					expect(uri).to.equal('/v1/forms/1/records?workspace.id=123');
					return {};
				});

			var params = {
				workspace: {
					id: 123
				}
			};

			znApi.query('/forms/1/records', params)
				.catch(function (err) {
					fail(new Error(err));
				})
				.finally(function() {
					done();
				});
		});

		describe('when no results were found (i.e. totalCount is 0)', function() {

			it("should set data as empty array and offset as 0, because zengine api doesn't", function(done) {

				nock('https://api.zenginehq.com')
					.filteringPath(function(path){
						return '/';
					})
					.get('/')
					.reply(200, {
						status: 404,
						code: 4004,
						userMessage: "Error viewing data",
						developerMessage: "No data was found",
						totalCount: 0
					});

				var expectedResponse = {
					status: 404,
					code: 4004,
					userMessage: "Error viewing data",
					developerMessage: "No data was found",
					totalCount: 0,
					offset: 0,
					data: []
				};

				znApi.query('/forms/1/records').then(function(response) {
					expect(response).to.equal(expectedResponse);
				})
				.catch(function(err) {
					fail(new Error(err));
				})
				.finally(function() {
					done();
				});
			});
		});

		describe('when totalCount is not set', function() {

			it('should not attempt to parse response (just for precaution)', function(done) {

				var expectedResponse = {
					status: 404,
					code: 777,
					developerMessage: "Some error we've never seen before",
				};

				nock('https://api.zenginehq.com')
					.filteringPath(function(path){
						return '/';
					})
					.get('/')
					.reply(200, expectedResponse);

				znApi.query('/forms/1/records').then(function(response) {
					expect(response).to.equal(expectedResponse);
				})
				.catch(function(err) {
					fail(new Error(err));
				})
				.finally(function() {
					done();
				});
			});
		});
	});

	describe('post', function () {

		it('should POST to api and return response data', function(done) {

			var record = {
				id: 1,
				field123: 'apples'
			};

			nock('https://api.zenginehq.com/v1')
				.post('/forms/123/records', record)
				.reply(200, {
					data: record
				});

			znApi.post('/forms/123/records', record).then(function(data) {
				expect(data).to.equal(record);
			})
			.catch(function(err) {
				fail(new Error(err));
			})
			.finally(function() {
				done();
			});
		});
	});

	describe('put', function () {

		it('should PUT to api and return response data', function(done) {

			var record = {
				id: 1,
				field123: 'apples'
			};

			nock('https://api.zenginehq.com/v1')
				.put('/forms/123/records/456', record)
				.reply(200, {
					data: record
				});

			znApi.put('/forms/123/records/456', record).then(function(data) {
				expect(data).to.equal(record);
			})
			.catch(function(err) {
				fail(new Error(err));
			})
			.finally(function() {
				done();
			});
		});
	});
});
