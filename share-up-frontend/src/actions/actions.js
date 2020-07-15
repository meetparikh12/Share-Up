import {SET_TOKEN_INFO, GET_USER_DATA, GET_SCREAMS, MODIFY_LIKE, MODIFY_UNLIKE, DELETE_SCREAM, POST_SCREAM, GET_SINGLE_SCREAM, ADD_COMMENT_TO_SCREAM, MARK_NOTIFICATIONS_READ} from './actionTypes'

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
export const deleteScream = screamId => {
    return {
        type: DELETE_SCREAM,
        payload: screamId
    }
}

export const postScream = scream => {
    return {
        type: POST_SCREAM,
        payload: scream
    }
}

export const getSingleScream = scream => {
    return {
        type: GET_SINGLE_SCREAM,
        payload: scream
    }
}

export const addCommentToScream = comment => {
    return {
        type: ADD_COMMENT_TO_SCREAM,
        payload: comment
    }
}

export const markNotificationsRead = () => {
    return {
        type: MARK_NOTIFICATIONS_READ
    }
}