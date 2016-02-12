'use strict';

describe('ZnForm', function() {

	var ZnFormBuilder = require('./zn-form-builder.js');

	var builder;

	beforeEach(function() {
		builder = new ZnFormBuilder();
	});

	describe('getEmailValidatedFields', function () {

		it('should return text-input fields with email validation', function() {

			var znForm = builder
							.fieldData(5, 'text-input')
							.fieldData({
								id: 6,
								type: 'text-input',
								settings: {
									validation: {
										emailAddress: true
									}
								}
							})
							.fieldData({
								id: 7,
								type: 'text-input',
								settings: {
									validation: {
										emailAddress: false,
										required: true
									}
								}
							})
							.fieldData({
								id: 9,
								type: 'text-input',
								settings: {
									validation: {
										emailAddress: true
									}
								}
							})
							.build();

			var emailValidatedFields = znForm.getEmailValidatedFields();

			expect(emailValidatedFields.length).to.equal(2);
			expect(emailValidatedFields[0].id).to.equal(6);
			expect(emailValidatedFields[1].id).to.equal(9);
		});
	});

	describe('getLinkedFormIds', function() {

		it('should get all linked form ids', function() {

			var znForm = builder
						.linkedField({ id: 1, linkedToForm: 5 })
						.build();

			var linkedFormIds = znForm.getLinkedFormIds();

			expect(linkedFormIds.length).to.equal(1);
			expect(linkedFormIds[0]).to.equal(5);
		});

		it('should get all linked form ids of a certain type', function() {

			var znForm = builder
						.belongsToForm({ id: 1, form: 5 })
						.hasOneForm({ id: 2, form: 6 })
						.hasManyForm({ id: 3, form: 7 })
						.build();

			var linkedFormIds = znForm.getLinkedFormIds('belongsTo');

			expect(linkedFormIds.length).to.equal(1);
			expect(linkedFormIds[0]).to.equal(5);
		});
	});
});
