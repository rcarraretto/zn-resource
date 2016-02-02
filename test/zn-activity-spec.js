'use strict';

describe('ZnActivity', function() {

	var ZnActivity = require('../src/zn-activity.js');

	var instantiate = function(data) {
		return new ZnActivity(data);
	};

	describe('checkEvent', function () {

		var activity;

		describe('moveToFolder', function() {

			describe('when record was created', function() {

				beforeEach(function() {

					activity = instantiate({
						resource: "records",
						action: "create",
						changes: null,
						record: {
							id: 4567,
							form: {
								id: 5
							},
							folder: {
								id: 10
							}
						}
					});
				});

				it('should match, when folder matches', function() {

					var e = {
						type: 'moveToFolder',
						folderId: 10
					};

					expect(activity.checkEvent(e)).to.equal(true);
				});

				it('should not match, when folder does not match', function() {

					var e = {
						type: 'moveToFolder',
						folderId: 1
					};

					expect(activity.checkEvent(e)).to.equal(false);
				});
			});

			describe('when record was updated and folder changed', function() {

				beforeEach(function() {
					activity = instantiate({
						resource: "records",
						action: "update",
						changes: {
							from: {
								folder: {
									id: 9
								}
							},
							to: {
								folder: {
									id: 10
								}
							}
						},
						record: {
							id: 4567,
							form: {
								id: 5
							},
							folder: {
								id: 10
							}
						}
					});
				});

				it('should match, when target folder matches', function() {

					var e = {
						type: 'moveToFolder',
						folderId: 10
					};

					expect(activity.checkEvent(e)).to.equal(true);
				});

				it('should not match, when target folder does not match', function() {

					var e = {
						type: 'moveToFolder',
						folderId: 9
					};

					expect(activity.checkEvent(e)).to.equal(false);
				});
			});

			describe('when record was updated but folder did not change', function() {

				beforeEach(function() {
					activity = instantiate({
						resource: "records",
						action: "update",
						changes: {
							from: {
								field123: 'apples'
							},
							to: {
								field123: 'bananas'
							}
						},
						record: {
							id: 4567,
							form: {
								id: 5
							},
							folder: {
								id: 10
							}
						}
					});
				});

				it('should not match', function() {

					var e = {
						type: 'moveToFolder',
						folderId: 5
					};

					expect(activity.checkEvent(e)).to.equal(false);
				});

				it('should not match, even if the record is inside that folder', function() {

					var e = {
						type: 'moveToFolder',
						folderId: 10
					};

					expect(activity.checkEvent(e)).to.equal(false);
				});
			});
		});

		describe('when event type is invalid', function() {
			it('should throw Error', function() {
				activity = instantiate({});

				expect(function() {
					activity.checkEvent({
						type: 'something-invalid'
					});
				}).to.throw('Activity: checkEvent: Invalid type something-invalid');
			});
		});

		describe('when no event type is specified', function() {
			it('should throw Error', function() {
				activity = instantiate({});

				expect(function() {
					activity.checkEvent({});
				}).to.throw('Activity: checkEvent: Invalid type undefined');
			});
		});
	});
});
