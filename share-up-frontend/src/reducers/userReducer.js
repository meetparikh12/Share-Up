import { SET_TOKEN_INFO, GET_USER_DATA, UNAUTHENTICATE_USER } from '../actions/actionTypes';

const initialState = {
    tokenDetails : {},
    credentials: {},
    likes: [],
    notifications: [],
    loadingUserDetails: true
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TOKEN_INFO:
            return {
                ...state,
                tokenDetails: action.payload
            }
    
        case GET_USER_DATA:
            return {
                ...state,
                credentials: action.payload.credentials,
                likes: action.payload.likes,
                notifications: action.payload.notifications,
                loadingUserDetails: false
            }
        case UNAUTHENTICATE_USER:
            return initialState
        default: 
            return state
    }
}