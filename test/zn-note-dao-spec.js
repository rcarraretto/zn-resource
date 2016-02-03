'use strict';

describe('ZnNoteDao', function() {

	var util = require('./zn-api-test-util.js');
	var ZnNoteDao = require('../src/zn-note-dao.js');

	var znNoteDao;
	var znNock;

	beforeEach(function() {
		var znApi = util.ZnApi();
		znNoteDao = new ZnNoteDao(znApi);
		znNock = util.ZnNock();
	});

	describe('save (when record note)', function () {

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

			return znNoteDao.save(request)
				.then(function(response) {
					expect(response.id).to.equal(651);
				});
		});
	});
});
