import { SET_TOKEN_INFO, GET_USER_DATA, UNAUTHENTICATE_USER, MODIFY_LIKE, MODIFY_UNLIKE, STATIC_USER_PROFILE, MARK_NOTIFICATIONS_READ, LOADING_STATIC_USER_PROFILE, LOADING_AUTHENTICATE_USER_DETAILS } from '../actions/actionTypes';

const initialState = {
    tokenDetails : {},
    credentials: {},
    likes: [],
    notifications: [],
    loadingUserDetails: false,
    loadingStaticUserProfile: false,
    staticUserProfile: {}
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

        case LOADING_AUTHENTICATE_USER_DETAILS:
            return {
                ...state,
                loadingUserDetails: true
            }

        case STATIC_USER_PROFILE: 
            return {
                ...state,
                staticUserProfile: action.payload,
                loadingStaticUserProfile: false
            }

        case LOADING_STATIC_USER_PROFILE:
            return {
                ...state,
                loadingStaticUserProfile: true
            }

        case MODIFY_LIKE: 
            return {
                ...state,
                likes: [{
                    username: state.credentials.username,
                    screamId: action.payload
                },...state.likes]
            }

        case MODIFY_UNLIKE:
            return {
                ...state,
                likes: state.likes.filter(like=> like.screamId !== action.payload)
            }

        case MARK_NOTIFICATIONS_READ:
            state.notifications.forEach((notif=> notif.read = true))
            return {
                ...state
            }

        case UNAUTHENTICATE_USER:
            return initialState

        default: 
            return state
    }
}