import React, { Fragment } from 'react'
import { AppBar, Toolbar, Button, Tooltip, IconButton } from '@material-ui/core'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux';
import HomeIcon from '@material-ui/icons/Home'
import Notifications from '@material-ui/icons/Notifications'
import PostScream from './PostScream';

function Navbar({tokenDetails}) {

    return (
        <AppBar>
            <Toolbar className="nav-container">
                {!tokenDetails.user_id ? 
                (
                    <Fragment>
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                        <Button color="inherit" component={Link} to="/register">Register</Button>
                    </Fragment>
                ) : (
                    <Fragment>
                        <PostScream/>
                        <Tooltip title="Home" placement="top">
                            <Link to="/"><IconButton><HomeIcon/></IconButton></Link>
                        </Tooltip>
                        <Tooltip title="Notifications" placement="top">
                            <IconButton><Notifications/></IconButton>
                        </Tooltip>
                    </Fragment>
                    )}
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