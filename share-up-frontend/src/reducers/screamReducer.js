import {GET_SCREAMS, UNAUTHENTICATE_USER, DELETE_SCREAM, POST_SCREAM, GET_SINGLE_SCREAM, ADD_COMMENT_TO_SCREAM, LOADING_SCREAMS} from '../actions/actionTypes'

const initialState = {
    screams: [],
    currentScream: {},
    loadingScreams: false
}

export const screamReducer = (state=initialState, action) => {
    switch (action.type) {

        case LOADING_SCREAMS: 
            return {
                ...state,
                loadingScreams: true
            }
        case GET_SCREAMS:
            return {
                ...state,
                screams: action.payload,
                loadingScreams: false
            }
        case GET_SINGLE_SCREAM: 
            return {
                ...state,
                currentScream: action.payload
            }
        case ADD_COMMENT_TO_SCREAM:
            return {
                ...state,
                currentScream: {
                    ...state.currentScream,
                    comments: [action.payload, ...state.currentScream.comments]
                }
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