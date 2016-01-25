'use strict';

var ZnForm = require('../src/zn-form.js');

var ZnFormBuilder = function() {
	this.data = {
		id: null,
		fields: [],
		linkedForms: [],
		folders: []
	};
};

ZnFormBuilder.prototype.id = function(id) {
	this.data.id = id;

	return this;
};

ZnFormBuilder.prototype.name = function(name) {
	this.data.name = name;

	return this;
};

ZnFormBuilder.prototype.fieldData = function(data) {
	this.data.fields.push(data);

	return this;
};

ZnFormBuilder.prototype.field = function(id, type, label) {
	var field = {
		id: id,
		type: type
	};

	if (label) {
		field.label = label;
	}

	this.data.fields.push(field);

	return this;
};

ZnFormBuilder.prototype.linkedField = function(data) {
	var field = {
		id: data.id,
		type: 'linked',
		settings: {
			properties: {
				linkedForm: data.linkedToForm
			}
		}
	};

	this.data.fields.push(field);

	var linkedForm = {
		form: {
			id: data.linkedToForm
		},
		type: data.type || 'belongsTo',
		keyField: {
			id: data.id
		}
	};

	this.data.linkedForms.push(linkedForm);

	return this;
};

ZnFormBuilder.prototype.belongsToForm = function(data) {

	data.type = 'belongsTo';

	return this.linkedForm(data);
};

ZnFormBuilder.prototype.hasOneForm = function(data) {

	data.type = 'hasOne';

	return this.linkedForm(data);
};

ZnFormBuilder.prototype.hasManyForm = function(data) {

	data.type = 'hasMany';

	return this.linkedForm(data);
};

ZnFormBuilder.prototype.linkedForm = function(data) {

	var linkedForm = {
		form: {
			id: data.form
		},
		keyField: {
			id: data.keyField
		},
		type: data.type
	};

	this.data.linkedForms.push(linkedForm);

	return this;
};

ZnFormBuilder.prototype.folder = function(id, name) {
	var folder = {
		id: id,
		name: name
	};

	this.data.folders.push(folder);

	return this;
};

ZnFormBuilder.prototype.build = function() {
	return new ZnForm(this.data);
};

module.exports = ZnFormBuilder;
