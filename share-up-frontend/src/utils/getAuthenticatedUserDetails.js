import { getUserData } from "../actions/actions";
import axios from 'axios';
import { store } from "../store/store";

const getAuthenticatedUserDetails = (token) => {
    if(token){
        let config = {headers: {Authorization: ''}};
        
        if(token.startsWith('Bearer ')) {
            config.headers.Authorization = `${token}`
        } else {
            config.headers.Authorization = `Bearer ${token}`
        }

        axios.get('/user/details', config)
            .then(res => store.dispatch(getUserData(res.data)))
            .catch(err => console.log(err.response.data)); 
    }
}

export default getAuthenticatedUserDetails;