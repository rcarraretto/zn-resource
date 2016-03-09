'use strict';

describe('ZnMemberService', function() {

	var util = require('./zn-api-test-integration-util.js');

	var ZnMemberService = require('../src/zn-member-service.js');

	var znMemberService;
	var workspaceId;

	beforeEach(function() {
		var znApi = util.ZnApi();
		znMemberService = new ZnMemberService(znApi);

		workspaceId = process.env.ZN_WORKSPACE_ID;

		if (!workspaceId) {
			throw new Error(
				'Please set an environment variable named ZN_WORKSPACE_ID'
			);
		}
	});

	describe('get', function () {
		it('should get current user membership', function() {
			return znMemberService.get(workspaceId).then(console.log);
		});
	});

});
