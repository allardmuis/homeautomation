import * as React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import { Devices } from './Devices';
import { Header } from './Header';
import { Rooms } from './Rooms';


const routeBaseName = process.env.NODE_ENV === 'production' ? '/test' : undefined;

class App extends React.Component {
  public render() {
    return (
      <Router basename={routeBaseName}>
        <>
          <Header />
          <div id="wrapper">
            <div className="container-fluid">
              <div className="row">
                <Route exact={true} path="/" component={Home} />
                <Route path="/devices" component={Devices} />
                <Route path="/rooms" component={Rooms} />
              </div>
            </div>
          </div>
        </>
    </Router>
    );
  }
}

const Home = () => <h2>Home</h2>;

import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons'
library.add(faEdit, faSave)

export default App;
