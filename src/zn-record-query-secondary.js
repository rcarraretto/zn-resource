'use strict';

var ZnRecordQuerySecondary = function(znRecordQueryByAttributeValues) {
	this.znRecordQueryByAttributeValues = znRecordQueryByAttributeValues;
};

ZnRecordQuerySecondary.prototype.queryData = function(linkedForm, primaryRecordIds) {

	var secondaryFormId = linkedForm.form.id;

	var request = {
		formId: secondaryFormId
	};

	var linkedFieldAttribute = 'field' + linkedForm.keyField.id;

	return this.znRecordQueryByAttributeValues
		.queryData(request, linkedFieldAttribute, primaryRecordIds);
};

module.exports = ZnRecordQuerySecondary;
