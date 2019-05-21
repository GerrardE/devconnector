import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from  'react-redux';
import store from './store';
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import Landing from './components/layouts/Landing';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import Register from './components/auth/Register';
import './App.css';
import { clearCurrentProfile } from './actions/profileActions';
import PrivateRoute from './components/common/PrivateRoute';
import CreateProfile from './components/create-profile/CreateProfile';

// Check for token
if(localStorage.jwtToken) {
  // set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and expiration
  const decoded = jwt_decode(localStorage.jwtToken);

  // Set current user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now()/1000;
  if(decoded.exp < currentTime) {
    // Logout User
    store.dispatch(logoutUser());
    // TODO: Clear current profile
    store.dispatch(clearCurrentProfile());
    // Redirect to Login
    window.location.href='/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <Router>
          <div className="App">
          <Navbar />
          {/* remember to include 'exact' */}
            <Route exact path="/" component={ Landing } />
            <div className="container">
              <Route exact path="/register" component={ Register }/>
              <Route exact path="/login" component={ Login }/>
              <Switch>
                <PrivateRoute exact path="/dashboard" component={ Dashboard }/>
              </Switch>
              <Switch>
                <CreateProfile exact path="/create-profile" component={ CreateProfile }/>
              </Switch>
            </div>
          <Footer />
        </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
