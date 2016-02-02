'use strict';

describe('ZnFormDao', function() {

	var util = require('./zn-api-test-util.js');

	var ZnForm = require('../src/zn-form.js');
	var ZnFormDao = require('../src/zn-form-dao.js');

	var znFormDao;
	var znNock;

	beforeEach(function() {
		var znApi = util.ZnApi();
		znFormDao = new ZnFormDao(znApi);

		znNock = util.ZnNock();
	});

	describe('get', function () {

		it('should call api and return instance of ZnForm', function() {

			var expectedForm = {
				id: 123
			};

			znNock.get('/forms/123').reply(200, {
				data: expectedForm
			});

			return znFormDao.get(123).then(function(form) {

				expect(form.id).to.equal(expectedForm.id);

				expect(form instanceof ZnForm).to.equal(true);
			});
		});
	});
});
