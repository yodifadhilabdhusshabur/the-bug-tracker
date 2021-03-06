import sendRequest from './sendRequest';

// Teams
export function newTeam(body) {
	return sendRequest('POST', '/teams/newTeam', body);
}

export function addMembers(body) {
	return sendRequest('POST', '/teams/addMembers', body);
}

export function teamDetails(teamId) {
	return sendRequest('GET', `/teams/getTeam/${teamId}`);
}

export function teamNotifications(teamId, page) {
	return sendRequest('GET', `/teams/teamNotifications/${teamId}?page=${page}`);
}

export function kickMember(body) {
	return sendRequest('PATCH', '/teams/kickMember', body);
}

export function deleteTeam(teamId) {
	return sendRequest('DELETE', `/teams/deleteTeam/${teamId}`);
}
