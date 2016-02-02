'use strict';

describe('znResource', function() {

	var znResource = require('../index.js');
	var ZnActivity = require('../src/zn-activity.js');

	var ZnHttp = function() {
	};

	describe('with string param', function () {

		it('should return resource class', function() {

			expect(znResource('activity')).to.equal(ZnActivity);
		});

		it('should throw error if resource does not exist', function() {

			expect(function() {
				znResource('something');
			})
			.to.throw('ZnResource: invalid resource: something');
		});
	});

	describe('with object param', function() {

		it('should throw error if ZnHttp is not provided', function() {

			expect(function() {
				znResource({ resource: 'record' });
			})
			.to.throw('ZnResource: ZnHttp must be provided');
		});

		it('should throw error if resource does not exist', function() {

			expect(function() {
				znResource({ ZnHttp: ZnHttp, resource: 'something' });
			})
			.to.throw('ZnResource: invalid resource: something');
		});
	});
});
