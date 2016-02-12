'use strict';

var assign = require('lodash.assign');
var forEach = require('lodash.foreach');
var map = require('lodash.map');
var filter = require('lodash.filter');

var ZnForm = function(data) {
	assign(this, data);
	this.fields = this.fields || [];
};

ZnForm.prototype.getEmailValidatedFields = function() {

	var emailValidatedFields = [];

	forEach(this.fields, function(field) {
		if (field.type === 'text-input') {
			if (field.settings.validation.emailAddress) {
				emailValidatedFields.push(field);
			}
		}
	});

	return emailValidatedFields;
};

ZnForm.prototype.getRequiredFields = function() {

	var filter = function(field) {
		return field.settings.validation.required;
	};

	return this.filterFields(filter);
};

ZnForm.prototype.getFieldsOfTypes = function(eligibleTypes) {

	var isEligible = function(field) {
		return eligibleTypes.indexOf(field.type) !== -1;
	};

	return this.filterFields(isEligible);
};

ZnForm.prototype.hasFieldWithId = function(id) {

	var withId = function(field) {
		return field.id === parseInt(id);
	};

	return this.filterFields(withId).length > 0;
};

ZnForm.prototype.filterFields = function(filter) {
	var fields = [];

	if (this.fields) {
		fields = this.fields.filter(filter);
	}

	return fields;
};

ZnForm.prototype.hasLinkedFieldTo = function(dstFormId) {

	for (var i = 0; i < this.fields.length; i++) {
		var field = this.fields[i];

		if (field.type === 'linked' && field.settings.properties.linkedForm === dstFormId) {
			return true;
		}
	}

	return false;
};

ZnForm.prototype.getLinkedFormIds = function(linkType) {

	var targetLinkedForms = this.filterLinkedFormsByLinkType(linkType);

	return map(targetLinkedForms, function(linkedForm) {
		return linkedForm.form.id;
	});
};

ZnForm.prototype.filterLinkedFormsByLinkType = function(linkType) {

	if (!linkType) {
		return this.linkedForms;
	}

	return filter(this.linkedForms, function(linkedForm) {
		return linkedForm.type === linkType;
	});
};

module.exports = ZnForm;
