import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Routes 
import routes from "./routes/routes";

// Components
import Sidebar from "./components/sidebar/Sidebar";

function App() {
  return (
    <main>
      <div className="circle d-none d-md-block"/>
      <div className="container p-0">
        <Router>
          <Sidebar />
            <Switch>
              {routes.map((route, idx) => (
                <Route
                  path={route.path}
                  exact
                  component={route.component}
                  key={idx}
                />
              ))}
            </Switch>
        </Router>
      </div>
    </main>
  );
}

export default App;
