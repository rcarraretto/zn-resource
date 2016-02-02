'use strict';

describe('znRecordFamilyAssembler', function() {

	var ZnFormBuilder = require('./zn-form-builder.js');

	var znRecordFamilyAssembler = require('../src/zn-record-family-assembler.js');

	describe('assemble', function () {

		it('should index data by primary record id and form id', function() {

			var primaryForm = new ZnFormBuilder()
				.id(1)
				.hasOneForm({
					form: 3,
					keyField: 45
				})
				.hasOneForm({
					form: 7,
					keyField: 90
				})
				.build();

			var recordsByForm = {
				1: [
					{
						id: 100,
						name: 'John'
					},
					{
						id: 101,
						name: 'Paul'
					}
				],
				3: [
					{
						id: 300,
						'field45': {
							id: 100
						},
						name: 'Go to the beach'
					},
					{
						id: 301,
						'field45': {
							id: 101
						},
						name: 'Rock climbing'
					},
				],
				7: [
					{
						id: 701,
						'field90': {
							id: 101
						},
						name: 'Internship at Apple Computer'
					}
				]
			};

			var expectedAssembled = {
				100: {
					1: {
						id: 100,
						name: 'John'
					},
					3: {
						id: 300,
						'field45': {
							id: 100
						},
						name: 'Go to the beach'
					}
				},
				101: {
					1: {
						id: 101,
						name: 'Paul'
					},
					3: {
						id: 301,
						'field45': {
							id: 101
						},
						name: 'Rock climbing'
					},
					7: {
						id: 701,
						'field90': {
							id: 101
						},
						name: 'Internship at Apple Computer'
					}
				}
			};

			var assembled = znRecordFamilyAssembler.assemble(primaryForm, recordsByForm);

			expect(assembled).toEqual(expectedAssembled);
		});
	});

	describe('mapRecords', function () {

		it('should execute iteratee for each record of a record family', function() {

			var record100_1 = {
				name: 'John'
			};

			var record100_1_projection = {
				name: 'John (projection)'
			};

			var record100_3 = {
				name: 'Go to the beach'
			};

			var record100_3_projection = {
				name: 'Go to the beach (projection)'
			};

			var record101_1 = {
				name: 'Paul'
			};

			var record101_1_projection = {
				name: 'Paul (projection)'
			};

			var record101_7 = {
				name: 'Internship at Apple Computer'
			};

			var record101_7_projection = {
				name: 'Internship at Apple Computer (projection)'
			};

			var recordFamily = {
				100: {
					1: record100_1,
					3: record100_3
				},
				101: {
					1: record101_1,
					7: record101_7
				}
			};

			var expectedRecordFamilyProjected = {
				100: {
					1: record100_1_projection,
					3: record100_3_projection
				},
				101: {
					1: record101_1_projection,
					7: record101_7_projection
				}
			};

			var iteratee = function(record, formId) {
				if (record === record100_1 && formId === 1) {
					return record100_1_projection;
				}
				if (record === record100_3 && formId === 3) {
					return record100_3_projection;
				}
				if (record === record101_1 && formId === 1) {
					return record101_1_projection;
				}
				if (record === record101_7 && formId === 7) {
					return record101_7_projection;
				}
			};

			var recordFamilyProjected = znRecordFamilyAssembler.mapRecords(recordFamily, iteratee);

			expect(recordFamilyProjected).toEqual(expectedRecordFamilyProjected);
		});
	});

});
