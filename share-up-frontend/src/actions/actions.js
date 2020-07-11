import {SET_TOKEN_INFO} from './actionTypes'

export const setTokenDetails = tokenInfo => {
    return {
        type: SET_TOKEN_INFO,
        payload: tokenInfo
    }
}