'use strict';

describe('ZnMemberService', function() {

	var util = require('./zn-api-test-util.js');

	var ZnMemberService = require('../src/zn-member-service.js');

	var znMemberService;
	var currentUser;
	var workspaceId;
	var znNock;

	beforeEach(function() {
		var znApi = util.ZnApi();
		znMemberService = ZnMemberService(znApi);

		znNock = util.ZnNock();

		currentUser = {
			id: 115
		};

		znNock.get('/users/me').reply(200, {
			data: currentUser
		});

		workspaceId = 70;

	});

	var setRole = function(roleName) {

		var roleId;

		switch(roleName) {
			case 'owner':
				roleId = 1;
				break;
			case 'admin':
				roleId = 2;
				break;
			default:
				roleId = 700;
		}

		var userAsMember = {
			role: {
				id: roleId
			}
		};

		znNock.get('/workspaces/70/members?user.id=115').reply(200, {
			data: [userAsMember]
		});
	};

	var setAsNonMember = function() {

		var znResponse = {
			status: 200,
			code: 2000,
			totalCount: 0,
			limit: 20,
			offset: 0
		};

		znNock.get('/workspaces/70/members?user.id=115').reply(200, znResponse);
	};

	describe('get (when current user is owner of workspace)', function () {

		it('should return membership data', function() {

			setRole('owner');

			return znMemberService.get(workspaceId).then(function(membership) {

				expect(membership).to.be.defined;
				expect(membership.isOwner).to.equal(true);
				expect(membership.isAdmin).to.equal(true);
				expect(membership.isMember).to.equal(true);
				expect(membership.userId).to.equal(115);
			});
		});
	});

	describe('get (when current user is admin of workspace)', function () {

		it('should return membership data', function() {

			setRole('admin');

			return znMemberService.get(workspaceId).then(function(membership) {

				expect(membership).to.be.defined;
				expect(membership.isOwner).to.equal(false);
				expect(membership.isAdmin).to.equal(true);
				expect(membership.isMember).to.equal(true);
				expect(membership.userId).to.equal(115);
			});
		});
	});

	describe('get (when current user is member of workspace, but not owner or admin)', function () {

		it('should return membership data', function() {

			setRole('something-else');

			return znMemberService.get(workspaceId).then(function(membership) {

				expect(membership).to.be.defined;
				expect(membership.isOwner).to.equal(false);
				expect(membership.isAdmin).to.equal(false);
				expect(membership.isMember).to.equal(true);
				expect(membership.userId).to.equal(115);
			});
		});
	});

	describe('get (when current user is not member of workspace', function () {

		it('should return null', function() {

			setAsNonMember();

			return znMemberService.get(workspaceId).then(function(membership) {

				expect(membership).to.be.defined;
				expect(membership.isOwner).to.equal(false);
				expect(membership.isAdmin).to.equal(false);
				expect(membership.isMember).to.equal(false);
				expect(membership.userId).to.equal(115);
			});
		});
	});
});
