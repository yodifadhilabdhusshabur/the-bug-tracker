import sendRequest from './sendRequest';

// Bug
export function bugDetails(bugId) {
	return sendRequest('GET', `/users/bugDetails/${bugId}`);
}

export function newBug(body) {
	return sendRequest('POST', '/users/addBug', body);
}

export function editBug(body) {
	return sendRequest('PATCH', '/users/editBug', body);
}

export function fixBug(body) {
	return sendRequest('PATCH', '/users/fixBug', body);
}

export function reOpenBug(body) {
	return sendRequest('PATCH', '/users/bugReopen', body);
}
