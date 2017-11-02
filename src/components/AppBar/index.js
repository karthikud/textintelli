/**
 * AppBar
 */

import React                   from 'react';
import { AppBar as MuiAppBar } from 'material-ui';

/* component styles */
import { styles } from './styles.scss';

export default function AppBar() {
  return (
    <div className={styles}>
      <MuiAppBar  className="app-bar" />
    </div>
  );
}