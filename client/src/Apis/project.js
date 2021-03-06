import sendRequest from './sendRequest';
// Project

export function projectDetails(projectId) {
	return sendRequest('GET', `/users/projectDetails/${projectId}`);
}

export function newProject(body) {
	return sendRequest('POST', '/users/newProject', body);
}

export function editProject(body) {
	return sendRequest('PATCH', '/users/editProject', body);
}

export function projectTimeline(projectId, page) {
	return sendRequest('GET', `/users/projectTimeline/${projectId}?page=${page}`);
}

export function closeOrReOpenProject(body) {
	return sendRequest('PATCH', '/users/closeOrReOpenProject', body);
}

export function deleteProject(projectId, teamId) {
	return sendRequest('DELETE', `/users/deleteProject?projectId=${projectId}&teamId=${teamId}`);
}
