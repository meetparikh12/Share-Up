import {SET_TOKEN_INFO, GET_USER_DATA, GET_SCREAMS, MODIFY_LIKE, MODIFY_UNLIKE} from './actionTypes'

export const setTokenDetails = tokenInfo => {
    return {
        type: SET_TOKEN_INFO,
        payload: tokenInfo
    }
}

export const getUserData = userData => {
    return {
        type: GET_USER_DATA,
        payload: userData
    }
}

export const getScreams = screams => {
    return {
        type: GET_SCREAMS,
        payload: screams
    }
}

export const modifyLikesForUser = screamId => {
    return {
        type: MODIFY_LIKE,
        payload: screamId
    }
}
export const modifyUnlikeForUser = screamId => {
    return {
        type: MODIFY_UNLIKE,
        payload: screamId
    }
}