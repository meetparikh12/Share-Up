import {GET_SCREAMS, UNAUTHENTICATE_USER} from '../actions/actionTypes'

const initialState = {
    screams: []
}

export const screamReducer = (state=initialState, action) => {
    switch (action.type) {
        case GET_SCREAMS:
            return {
                ...state,
                screams: action.payload
            }
        case UNAUTHENTICATE_USER: 
            return initialState
        default: 
            return state
    }
}