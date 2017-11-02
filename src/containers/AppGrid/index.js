import React, { Component }   from 'react';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';
import AppBar                 from 'components/AppBar';
import Drop                 from 'components/Drop';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';

/* actions */
import * as uiActionCreators from 'core/actions/actions-ui';

/* component styles */
//import { styles } from './styles.scss';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 30,
  },
   table: {
    minWidth: 700,
  },
  paper: {
    padding: 16,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});




function AppGrid(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <Grid container alignItems={'center'} spacing={24}>
        <Grid item xs={12}>
          <Paper className={classes.paper}><Drop /></Paper>
        </Grid>


      </Grid>
    </div>
  );
}

AppGrid.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppGrid);