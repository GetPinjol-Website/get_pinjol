import routes from './scripts/routes/routes.js';
import Navbar from './components/navbar.jsx';
import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        {routes.map(route => route)}
      </Switch>
    </Router>
  );
}

export default App;