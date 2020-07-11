import React from 'react'
import { AppBar, Toolbar, Button } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { store } from '../store/store'
import { SET_TOKEN_INFO } from '../actions/actionTypes'
import {connect} from 'react-redux';

function Navbar({tokenDetails}) {

    const logoutHandler = () => {
        store.dispatch({
            type: SET_TOKEN_INFO,
            payload: {}
        })
        localStorage.removeItem('FBToken')
    } 
    return (
        <AppBar>
            <Toolbar className="nav-container">
                <Button color="inherit" component={Link} to="/">Home</Button>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/register">Register</Button>
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