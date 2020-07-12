import {SET_TOKEN_INFO, GET_USER_DATA} from './actionTypes'

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