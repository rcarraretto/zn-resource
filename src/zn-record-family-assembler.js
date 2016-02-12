'use strict';

var forEach = require('lodash.forEach');
var reduce = require('lodash.reduce');

var assemble = function(primaryForm, recordsByForm) {

	var families = {};

	var primaryRecords = recordsByForm[primaryForm.id];

	forEach(primaryRecords, function(primaryRecord) {
		families[primaryRecord.id] = {};
		families[primaryRecord.id][primaryForm.id] = primaryRecord;
	});

	forEach(primaryForm.linkedForms, function(linkedForm) {

		var secondaryFormId = linkedForm.form.id;

		var secondaryRecords = recordsByForm[secondaryFormId];

		forEach(secondaryRecords, function(secondaryRecord) {

			var linkedField = 'field' + linkedForm.keyField.id;

			var primaryRecordId = secondaryRecord[linkedField].id;

			families[primaryRecordId][secondaryFormId] = secondaryRecord;
		});
	});

	return families;
};

var _mapFamilyRecords = function(family, recordIteratee) {

	var mapRecord = function(familyMapped, record, formId) {

		formId = parseInt(formId);

		familyMapped[formId] = recordIteratee(record, formId);

		return familyMapped;
	};

	return reduce(family, mapRecord, {});
};

var mapRecords = function(families, recordIteratee) {

	var mapFamilyRecords = function(familiesMapped, family, primaryRecordId) {

		familiesMapped[primaryRecordId] = _mapFamilyRecords(family, recordIteratee);

		return familiesMapped;
	};

	return reduce(families, mapFamilyRecords, {});
};

module.exports = {
	assemble: assemble,
	mapRecords: mapRecords
};
