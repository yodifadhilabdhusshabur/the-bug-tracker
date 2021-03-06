import sendRequest from './sendRequest';

// Auth
export function signup(body) {
	return sendRequest('POST', '/auth/signup', body, false);
}

export function signin(body) {
	return sendRequest('POST', '/auth/signIn', body, false);
}

export function forgetPassword(body) {
	return sendRequest('POST', '/auth/forgetPassword', body, false);
}

export function receivePasswordRecoveryCode(body) {
	return sendRequest('POST', '/auth/receivePasswordRecoveryCode', body, false);
}

export function changePassword(body) {
	return sendRequest('POST', '/auth/changePassword', body, false);
}
