import { SET_TOKEN_INFO } from '../actions/actionTypes';

const initialState = {
    tokenDetails : {}
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TOKEN_INFO:
            return {
                ...state,
                tokenDetails: action.payload
            }
    
        default: 
            return state
    }
}