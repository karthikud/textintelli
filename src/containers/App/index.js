import React, { Component }       from 'react';
import { connect }                from 'react-redux';
import injectTapEventPlugin       from 'react-tap-event-plugin';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { HashRouter, Route }      from 'react-router-dom'
import * as OfflinePluginRuntime  from 'offline-plugin/runtime';


// global styles for entire app
import './styles/app.scss';

/* application containers */
import Header     from 'containers/Header';
import LeftNavBar from 'containers/LeftNavBar';
import Home       from 'containers/Home';

injectTapEventPlugin();

OfflinePluginRuntime.install();
const theme = createMuiTheme();

export class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <MuiThemeProvider theme={theme} >
        <div>
          <Header />
          <div className="container">
            <HashRouter>
              <div>
                <Route exact path="/" component={Home}/>
              </div>
            </HashRouter>
          </div>
          <LeftNavBar />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default connect(null)(App);