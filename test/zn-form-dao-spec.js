'use strict';

describe('ZnFormDao', function() {

	var Promise = require('bluebird');

	var ZnApi = require('../src/zn-api.js');
	var ZnFormDao = require('../src/zn-form-dao.js');

	var znFormDao;
	var znApi;

	beforeEach(function() {
		znApi = new ZnApi();
		znFormDao = new ZnFormDao(znApi);
	});

	describe('get', function () {

		it('should call api and return instance of ZnForm', function(done) {

			var expectedForm = {
				id: 123
			};

			spyOn(znApi, 'get').and.returnValue(Promise.resolve(expectedForm));

			znFormDao.get(123).then(function(form) {

				expect(form.id).toEqual(expectedForm.id);

				// i.e. should be instance of ZnForm
				expect(form.getRequiredFields()).toEqual([]);

				done();
			});
		});
	});
});
