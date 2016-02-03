'use strict';

describe('ZnRecordNoteDao', function() {

	var util = require('./zn-api-test-util.js');
	var ZnNoteDao = require('../src/zn-note-dao.js');
	var ZnRecordNoteDao = require('../src/zn-record-note-dao.js');

	var znNoteDao;
	var znRecordNoteDao;
	var znNock;

	beforeEach(function() {
		var znApi = util.ZnApi();
		znNoteDao = new ZnNoteDao(znApi);
		znRecordNoteDao = new ZnRecordNoteDao(znNoteDao);
		znNock = util.ZnNock();
	});

	describe('add', function () {

		it('should send POST request to api and return response data', function() {

			var request = {
				workspaceId: 10,
				recordId: 580,
				body: 'Hello'
			};

			var expectedApiRequest = {
				workspace: {
					id: 10
				},
				record: {
					id: 580
				},
				body: 'Hello'
			};

			var apiResponse = {
				data: {
					id: 651
				},
				totalCount: 1
			};

			znNock.post('/notes', expectedApiRequest)
				.reply(200, apiResponse);

			return znRecordNoteDao.add(request)
				.then(function(response) {
					expect(response.id).to.equal(651);
				});
		});

		it('should reject if workspace id is not provided', function() {

			var request = {
				recordId: 580
			};

			var expectedMessage = 'ZnRecordNote: no workspace id';

			return znRecordNoteDao.add(request).should.be.rejectedWith(expectedMessage);
		});

		it('should reject if record id is not provided', function() {

			var request = {
				workspaceId: 10
			};

			var expectedMessage = 'ZnRecordNote: no record id';

			return znRecordNoteDao.add(request).should.be.rejectedWith(expectedMessage);
		});
	});

	describe('get', function() {

		it('should send GET request to api and return response data', function() {

			var request = {
				workspaceId: 10,
				recordId: 580,
				id: 651
			};

			var apiResponse = {
				data: {
					id: 651,
					workspace: {
						id: 10
					},
					record: {
						id: 580
					}
				},
				totalCount: 1
			};

			znNock.get('/notes/651')
				.reply(200, apiResponse);

			return znRecordNoteDao.get(request)
				.then(function(response) {
					expect(response.id).to.equal(651);
				});
		});

		it('should reject if workspace id is not provided', function() {

			var request = {
				recordId: 580
			};

			var expectedMessage = 'ZnRecordNote: no workspace id';

			return znRecordNoteDao.get(request).should.be.rejectedWith(expectedMessage);
		});

		it('should reject if record id is not provided', function() {

			var request = {
				workspaceId: 10
			};

			var expectedMessage = 'ZnRecordNote: no record id';

			return znRecordNoteDao.get(request).should.be.rejectedWith(expectedMessage);
		});

		it('should return null if workspace id does not match', function() {

			var request = {
				workspaceId: 999,
				recordId: 580,
				id: 651
			};

			var apiResponse = {
				data: {
					id: 651,
					workspace: {
						id: 10
					},
					record: {
						id: 580
					}
				},
				totalCount: 1
			};

			znNock.get('/notes/651')
				.reply(200, apiResponse);

			return znRecordNoteDao.get(request)
				.then(function(response) {
					expect(response).to.be.null;
				});
		});

		it('should return null if record id does not match', function() {

			var request = {
				workspaceId: 10,
				recordId: 1,
				id: 651
			};

			var apiResponse = {
				data: {
					id: 651,
					workspace: {
						id: 10
					},
					record: {
						id: 580
					}
				},
				totalCount: 1
			};

			znNock.get('/notes/651')
				.reply(200, apiResponse);

			return znRecordNoteDao.get(request)
				.then(function(response) {
					expect(response).to.be.null;
				});
		});
	});
});
