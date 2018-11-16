import * as React from 'react';
import { BrowserRouter as Router, match as matchType, NavLink, Route } from "react-router-dom";
import './App.css';
import { Devices } from './Devices';
import { Header } from './Header';

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
              </div>
            </div>
          </div>
        </>
    </Router>
    );
  }
}

const Home = () => <h2>Home</h2>;
const Topic = ({ match }: { match: matchType<{id: string}> }) => <h3>Requested Param: {match.params.id}</h3>;
export const Topics = ({ match }: { match: matchType }) => (
  <div>
    <h2>Topics</h2>

    <ul>
      <li>
        <NavLink to={`${match.url}/components`}>Components</NavLink>
      </li>
      <li>
        <NavLink to={`${match.url}/props-v-state`}>Props v. State</NavLink>
      </li>
    </ul>

    <Route path={`${match.path}/:id`} component={Topic} />
    <Route
      exact={true}
      path={match.path}
      // tslint:disable-next-line
      render={() => <h3>Please select a topic.</h3>}
    />
  </div>
);

import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons'
library.add(faEdit, faSave)


export default App;
