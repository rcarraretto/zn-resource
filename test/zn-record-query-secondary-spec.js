'use strict';

describe('ZnRecordQuerySecondary', function() {

	var util = require('./zn-api-test-util.js');

	var ZnFormBuilder = require('./zn-form-builder.js');
	var ZnRecordDao = require('../src/zn-record-dao.js');
	var ZnRecordQuerySecondary = require('../src/zn-record-query-secondary.js');
	var ZnResourceQueryByAttributeValues = require('../src/zn-resource-query-by-attribute-values.js');

	var znRecordQuerySecondary;
	var znNock;

	beforeEach(function() {
		var znApi = util.ZnApi();

		var znRecordDao = new ZnRecordDao(znApi);
		var znRecordQueryByAttributeValues = new ZnResourceQueryByAttributeValues(znRecordDao);
		znRecordQuerySecondary = new ZnRecordQuerySecondary(znRecordQueryByAttributeValues);

		znNock = util.ZnNock();
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

			var secondaryRecordsForm3 = [
				{
					id: 30
				},
				{
					id: 31
				}
			];

			znNock.get('/forms/3/records?limit=500&field991=10%7C11').reply(200, {
				data: secondaryRecordsForm3
			});

			var linkedForm = primaryForm.linkedForms[1];

			znRecordQuerySecondary.queryData(linkedForm, primaryRecordIds)
				.then(function(records) {
					expect(records.length).toEqual(2);
					expect(records[0].id).toEqual(30);
					expect(records[1].id).toEqual(31);
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
