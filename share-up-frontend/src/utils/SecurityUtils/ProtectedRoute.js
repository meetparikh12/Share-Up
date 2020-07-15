import React from 'react';
import {connect} from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

function ProtectedRoute({component: Component, tokenDetails ,...otherProps}) {
    return <Route {...otherProps} render={
                (props) => {
                    if(tokenDetails.user_id)
                        return <Component {...props} />
                    else {
                        return <Redirect to="/login"/>
                    }
                }
            }/>
}

const mapStateToProps = state => {
    return {
        tokenDetails: state.user.tokenDetails
    }
}
export default connect(mapStateToProps, null)(ProtectedRoute);