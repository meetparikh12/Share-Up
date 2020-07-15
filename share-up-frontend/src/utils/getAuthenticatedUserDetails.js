import { getUserData } from "../actions/actions";
import axios from 'axios';
import { store } from "../store/store";
import { LOADING_AUTHENTICATE_USER_DETAILS } from "../actions/actionTypes";

const getAuthenticatedUserDetails = (token) => {
    if(token){
        let config = {headers: {Authorization: ''}};
        
        if(token.startsWith('Bearer ')) {
            config.headers.Authorization = `${token}`
        } else {
            config.headers.Authorization = `Bearer ${token}`
        }
        store.dispatch({
            type: LOADING_AUTHENTICATE_USER_DETAILS,
            payload: true
        })

        axios.get('/user/details', config)
            .then(res => store.dispatch(getUserData(res.data)))
            .catch(err => console.log(err)); 
    }
}

export default getAuthenticatedUserDetails;