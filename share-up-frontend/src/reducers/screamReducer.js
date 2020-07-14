import {GET_SCREAMS, UNAUTHENTICATE_USER, DELETE_SCREAM, POST_SCREAM, GET_SINGLE_SCREAM} from '../actions/actionTypes'

const initialState = {
    screams: [],
    currentScream: {}
}

export const screamReducer = (state=initialState, action) => {
    switch (action.type) {
        case GET_SCREAMS:
            return {
                ...state,
                screams: action.payload
            }
        case GET_SINGLE_SCREAM: 
            return {
                ...state,
                currentScream: action.payload
            }
        case POST_SCREAM:
            return {
                ...state,
                screams: [action.payload, ...state.screams]
            }
        case DELETE_SCREAM: 
            return {
                ...state,
                screams: state.screams.filter(scream=> scream.screamId !== action.payload)
            }
        case UNAUTHENTICATE_USER: 
            return initialState

        default: 
            return state
    }
}