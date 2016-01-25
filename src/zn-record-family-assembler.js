'use strict';

var _ = require('lodash');

var assemble = function(primaryForm, recordsByForm) {

	var families = {};

	var primaryRecords = recordsByForm[primaryForm.id];

	_.forEach(primaryRecords, function(primaryRecord) {
		families[primaryRecord.id] = {};
		families[primaryRecord.id][primaryForm.id] = primaryRecord;
	});

	_.forEach(primaryForm.linkedForms, function(linkedForm) {

		var secondaryFormId = linkedForm.form.id;

		var secondaryRecords = recordsByForm[secondaryFormId];

		_.forEach(secondaryRecords, function(secondaryRecord) {

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

	return _.reduce(family, mapRecord, {});
};

var mapRecords = function(families, recordIteratee) {

	var mapFamilyRecords = function(familiesMapped, family, primaryRecordId) {

		familiesMapped[primaryRecordId] = _mapFamilyRecords(family, recordIteratee);

		return familiesMapped;
	};

	return _.reduce(families, mapFamilyRecords, {});
};

module.exports = {
	assemble: assemble,
	mapRecords: mapRecords
};
