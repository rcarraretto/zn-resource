'use strict';

describe('ZnActivityDao', function() {

	var znResource = require('../index.js');
	var ZnActivity = require('../src/zn-activity.js');

	var ZnHttp = function() {
	};

	describe('with string param', function () {

		it('should return resource class', function() {

			expect(znResource('activity')).toBe(ZnActivity);
		});

		it('should throw error if resource does not exist', function() {

			expect(function() {
				znResource('something');
			})
			.toThrowError('ZnResource: invalid resource: something');
		});
	});

	describe('with object param', function() {

		it('should throw error if ZnHttp is not provided', function() {

			expect(function() {
				znResource({ resource: 'record' });
			})
			.toThrowError('ZnResource: ZnHttp must be provided');
		});

		it('should throw error if resource does not exist', function() {

			expect(function() {
				znResource({ ZnHttp: ZnHttp, resource: 'something' });
			})
			.toThrowError('ZnResource: invalid resource: something');
		});
	});
});
