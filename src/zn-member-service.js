'use strict';

var _get = require('lodash.get');

var ZnMemberService = function(znApi) {

	var get = function(workspaceId) {

		var _user;

		var setUser = function(user) {
			_user = user;
		};

		var getUser = function() {
			return znApi.get('/users/me').then(setUser);
		};

		var getUserMembership = function() {
			var endpoint = ['/workspaces', workspaceId, 'members'].join('/');
			endpoint += '?user.id=' + _user.id;
			return znApi.queryFirst(endpoint);
		};

		var resolveMembership = function(member) {
			var roleId = _get(member, 'role.id');
			return {
				isOwner: (roleId === 1),
				isAdmin: (roleId === 1) || (roleId === 2),
				isMember: Boolean(roleId),
				userId: _user.id
			};
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
