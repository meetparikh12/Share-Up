import { SET_TOKEN_INFO, GET_USER_DATA, UNAUTHENTICATE_USER } from '../actions/actionTypes';

const initialState = {
    tokenDetails : {},
    userData: {}
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
                userData: action.payload
            }
        case UNAUTHENTICATE_USER:
            return initialState
        default: 
            return state
    }
}