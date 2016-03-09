'use strict';

describe('ZnMemberService', function() {

	var index = require('./index-test-integration.js');

	var znMemberService;
	var workspaceId;

	beforeEach(function() {
		znMemberService = index({resource: 'member'});

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
