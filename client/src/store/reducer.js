import * as actionTypes from './actionTypes';

const initialState = {
	currentUser: null,
	loading: false,
	currentTeamId: null,
	forgetPasswordEmail: null
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.start:
			return {
				...state,
				loading: true
			};

		case actionTypes.errorOccured:
			return {
				...state,
				loading: false
			};

		case actionTypes.storeUserData:
			return {
				...state,
				loading: false,
				currentUser: action.payload.user
			};

		case actionTypes.updateUserData:
			return {
				...state,
				currentUser: action.payload.updatedUser
			};

		case actionTypes.newKey:
			const updatedUser = { ...state.currentUser };

			updatedUser.privateKey = action.payload.updatedKey;

			return {
				...state,
				currentUser: updatedUser
			};

		case actionTypes.saveCurrentTeam:
			const currentTeamId = action.payload.currentTeamId;
			return {
				...state,
				currentTeamId
			};

		case actionTypes.forgetPassword:
			const email = action.payload.email;
			return {
				...state,
				forgetPasswordEmail: email
			};
		default:
			return state;
	}
};

export default reducer;
