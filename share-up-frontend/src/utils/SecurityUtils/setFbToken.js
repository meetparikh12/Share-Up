import axios from 'axios';

const setFbToken = token => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = "Bearer " + token;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
}

export default setFbToken;