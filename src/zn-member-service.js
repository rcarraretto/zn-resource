'use strict';

var ZnMemberService = function(znApi) {

	var get = function(workspaceId) {

		var getUser = function() {
			return znApi.get('/users/me');
		};

		var getUserMembership = function(user) {
			var endpoint = ['/workspaces', workspaceId, 'members'].join('/');
			endpoint += '?user.id=' + user.id;
			return znApi.queryFirst(endpoint);
		};

		var resolveMembership = function(member) {
			var roleId;
			if (member) {
				roleId = member.role.id;
			} else {
				roleId = 0;
			}
			var membership = {};
			membership.isOwner = (roleId === 1);
			membership.isAdmin = (roleId === 2) || membership.isOwner;
			membership.isMember = Boolean(roleId);
			return membership;
		};

		return getUser()
				.then(getUserMembership)
				.then(resolveMembership);
	};

	return {
		get: get
	};
};

module.exports = ZnMemberService;
