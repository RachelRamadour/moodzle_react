import './App.css';
import React from 'react';

import HomeScreen from './components/HomeScreen';
import WeekScreen from './components/WeekScreen';
import SettingsScreen from './components/SettingsScreen';
import TodayScreen from './components/TodayScreen';


import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import YearScreen from './components/YearScreen';
import MonthScreen from './components/MonthScreen'

import {Provider} from 'react-redux';
import {createStore, combineReducers}  from 'redux';
import token from './reducers/token.reducer';
import pseudo from "./reducers/pseudo.reducer";

const store = createStore(combineReducers({token, pseudo}));


function App() {

  return (
<Provider store={store}>
<Router>
  <Switch>
    <Route path = "/" exact component={HomeScreen} />
    <Route path = "/today" component={TodayScreen} />
    <Route path = "/year" component={YearScreen} />
    <Route path = "/month" component={MonthScreen} />
    <Route path = "/week" component={WeekScreen} />
    <Route path = "/settings" component={SettingsScreen} />

  </Switch>
</Router>
</Provider>


 
  );
}

export default App;
