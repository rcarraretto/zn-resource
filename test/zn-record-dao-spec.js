'use strict';

describe('ZnRecordDao', function() {

	var util = require('./zn-api-test-util.js');

	var ZnRecordDao = require('../src/zn-record-dao.js');

	var znRecordDao;
	var znNock;

	beforeEach(function() {

		var znApi = util.ZnApi();
		znRecordDao = new ZnRecordDao(znApi);

		znNock = util.ZnNock();
	});

	describe('get', function () {

		it('should call GET api and return formatted record', function(done) {

			var apiResponse = {
				data: {
					id: 651,
					field1: 'apples'
				},
				totalCount: 1
			};

			znNock.get('/forms/7/records/651').reply(200, apiResponse);

			var request = {
				id: 651,
				formId: 7
			};

			znRecordDao.get(request)
				.then(function(response) {
					expect(response).to.equal({
						id: 651,
						formId: 7,
						field1: 'apples'
					});
				})
				.catch(function(err) {
					fail(err);
				})
				.finally(function() {
					done();
				});
		});
	});

	describe('query', function () {

		it('should call GET api and return formatted records', function(done) {

			var apiResponse = {
				data: [
					{
						id: 1
					},
					{
						id: 3
					}
				],
				totalCount: 2
			};

			znNock.get('/forms/123/records?field123=apples').reply(200, apiResponse);

			var request = {
				formId: 123,
				field123: 'apples'
			};

			znRecordDao.query(request)
				.then(function(response) {
					expect(response.totalCount).to.equal(2);
					expect(response.data[0]).to.equal({
						id: 1,
						formId: 123
					});
					expect(response.data[1]).to.equal({
						id: 3,
						formId: 123
					});
				})
				.catch(function(err) {
					fail(err);
				})
				.finally(function() {
					done();
				});
		});
	});

	describe('save', function() {

		describe('without id', function() {

			it('should create record and return formatted saved record', function(done) {

				var record = {
					formId: 123,
					field123: 'apples'
				};

				var recordRequest = {
					field123: 'apples'
				};

				var savedRecord = {
					id: 1,
					saved: true
				};

				var apiResponse = {
					data: savedRecord
				};

				znNock.post('/forms/123/records', recordRequest).reply(200, apiResponse);

				znRecordDao.save(record)
					.then(function(response) {
						expect(response).to.equal({
							id: 1,
							formId: 123,
							saved: true
						});
					})
					.catch(function(err) {
						fail(err);
					})
					.finally(function() {

						done();
					});
			});
		});

		describe('with id', function() {

			it('should update record and return formatted saved record', function(done) {

				var record = {
					id: 7,
					formId: 123,
					field123: 'apples'
				};

				var recordRequest = {
					id: 7,
					field123: 'apples'
				};

				var savedRecord = {
					id: 7,
					saved: true
				};

				var apiResponse = {
					data: savedRecord
				};

				znNock.put('/forms/123/records/7', recordRequest).reply(200, apiResponse);

				znRecordDao.save(record)
					.then(function(response) {
						expect(response).to.equal({
							id: 7,
							formId: 123,
							saved: true
						});
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
});
