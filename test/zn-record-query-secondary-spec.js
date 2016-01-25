'use strict';

describe('ZnRecordQuerySecondary', function() {

	var Promise = require('bluebird');

	var ZnFormBuilder = require('./zn-form-builder.js');
	var ZnRecordQuerySecondary = require('../src/zn-record-query-secondary.js');
	var ZnResourceQueryByAttributeValues = require('../src/zn-resource-query-by-attribute-values.js');

	var znRecordQuerySecondary;
	var znRecordQueryByAttributeValues;

	beforeEach(function() {
		znRecordQueryByAttributeValues = new ZnResourceQueryByAttributeValues();
		znRecordQuerySecondary = new ZnRecordQuerySecondary(znRecordQueryByAttributeValues);

		spyOn(znRecordQueryByAttributeValues, 'queryData');
	});

	describe('queryData', function() {

		it('should query secondary records (i.e. records of linked form related to primary records)', function(done) {

			var primaryForm = new ZnFormBuilder()
				.id(1)
				.hasOneForm({
					form: 2,
					keyField: 987
				})
				.hasOneForm({
					form: 3,
					keyField: 991
				})
				.build();

			var primaryRecordIds = [10, 11];

			var secondaryRecordsForm2 = [
				{
					id: 20
				},
				{
					id: 21
				}
			];

			var secondaryRecordsForm3 = [
				{
					id: 30
				},
				{
					id: 31
				}
			];

			znRecordQueryByAttributeValues.queryData
				.when({ formId: 2 }, 'field987', primaryRecordIds)
				.thenReturn(Promise.resolve(secondaryRecordsForm2));

			znRecordQueryByAttributeValues.queryData
				.when({ formId: 3 }, 'field991', primaryRecordIds)
				.thenReturn(Promise.resolve(secondaryRecordsForm3));

			var linkedForm = primaryForm.linkedForms[1];

			znRecordQuerySecondary.queryData(linkedForm, primaryRecordIds)
				.then(function(records) {
					expect(records).toEqual(secondaryRecordsForm3);
					done();
				});
		});
	});
});
