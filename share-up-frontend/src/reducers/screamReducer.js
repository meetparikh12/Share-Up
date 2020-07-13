import {GET_SCREAMS} from '../actions/actionTypes'

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
        default: 
            return state
    }
}