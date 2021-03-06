import axios from 'axios';

const sendRequest = (type, url, body, sendToken = true) => {
	const userToken = localStorage.getItem('token');
	const req =
		type === 'GET'
			? axios.get
			: type === 'POST' ? axios.post : type === 'PATCH' ? axios.patch : type === 'DELETE' ? axios.delete : null;

	let config;

	if (sendToken) {
		config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` } };
	} else {
		config = null;
	}

	return type === 'GET' || type === 'DELETE' ? req(url, config) : req(url, body, config);
};

export default sendRequest;
