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

	describe('query', function () {

		it('should query', function() {

			var expectedUrl = '/forms' +
				'?workspace.id=40' +
				'&attributes=id%2Cname' +
				'&related=fields%2Cfolders';

			znNock.get(expectedUrl).reply(200, {
				data: [
					{ id: 5 },
					{ id: 6 }
				]
			});

			var request = {
				workspace: {
					id: 40
				}
			};

			return znFormDao.query(request).then(function(response) {

				expect(response.data).to.exist;
				expect(response.data.length).to.equal(2);

				expect(response.data[0].id).to.equal(5);
				expect(response.data[0] instanceof ZnForm).to.equal(true);

				expect(response.data[1].id).to.equal(6);
				expect(response.data[1] instanceof ZnForm).to.equal(true);
			});
		});
	});
});
