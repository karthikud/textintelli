import React, { Component } from 'react';
import AppGrid                 from 'containers/AppGrid';

/* component styles */
import { styles } from './styles.scss';

export default class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles}>
      <AppGrid/>
      

      </div>
    );
  }
}
