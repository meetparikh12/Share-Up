import React from 'react';
import {BrowserRouter as Router, Switch, Redirect, Route} from 'react-router-dom'
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import {ThemeProvider as MuiThemeProvider}  from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import jwt_decode from 'jwt-decode';
import { store } from './store/store';
import { SET_TOKEN_INFO, UNAUTHENTICATE_USER } from './actions/actionTypes';
import setFbToken from './utils/setFbToken';
import ProtectedRoute from './utils/ProtectedRoute';
import getAuthenticatedUserDetails from './utils/getAuthenticatedUserDetails';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#33c9dc',
      main: '#00bcd4',
      dark: '#008394',
      contrastText: '#fff'
    },
    secondary: {
      light: '#ff6333',
      main: '#ff3d00',
      dark: '#b22a00',
      contrastText: '#fff'
    }
  }
});
const token = localStorage.getItem('FBToken');
if(token){
  const decoded_token = jwt_decode(token);
  const {exp, user_id, email} = decoded_token;
  if(decoded_token.exp < Date.now()/1000){
    localStorage.removeItem('FBToken')
    store.dispatch({
      type: UNAUTHENTICATE_USER
    })
    setFbToken(false);
    window.location.href = '/login'
  }else {
    getAuthenticatedUserDetails(token);
    setFbToken(token);
    store.dispatch({
      type: SET_TOKEN_INFO,
      payload: {exp, user_id, email}
    })
  }
}
function App() {
  return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <Router>
            <Navbar/>
            <div className="container">
              <Switch>
                <ProtectedRoute exact path="/" component={Home}/>
                <Route path='/login' component={Login}/>
                <Route path='/register' component={Register}/>
                <Redirect to="/"/>
              </Switch>
            </div>
          </Router>
        </div>
      </MuiThemeProvider>
  );
}

export default App;
