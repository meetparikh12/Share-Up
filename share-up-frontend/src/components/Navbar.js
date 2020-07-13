import React from 'react'
import { AppBar, Toolbar, Button } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { store } from '../store/store'
import { UNAUTHENTICATE_USER } from '../actions/actionTypes'
import {connect} from 'react-redux';
import setFbToken from '../utils/setFbToken'

function Navbar({tokenDetails}) {

    const logoutHandler = () => {
        store.dispatch({
            type: UNAUTHENTICATE_USER
        })
        setFbToken(false);
        localStorage.removeItem('FBToken')
    } 
    return (
        <AppBar>
            <Toolbar className="nav-container">
                {tokenDetails.user_id && (<Button color="inherit" component={Link} to="/">Home</Button>)}
                {!tokenDetails.user_id && (<Button color="inherit" component={Link} to="/login">Login</Button>)}
                {!tokenDetails.user_id && (<Button color="inherit" component={Link} to="/register">Register</Button>)}
                {tokenDetails.user_id && (<Button color="inherit" onClick={logoutHandler} component={Link} to="/login">Logout</Button>)}
            </Toolbar>
        </AppBar>
    )
}

const mapStateToProps = state => {
    return {
        tokenDetails: state.user.tokenDetails
    }
}
export default connect(mapStateToProps, null)(Navbar);