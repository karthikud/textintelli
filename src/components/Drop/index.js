/**
 * Drop
 */

import React                   from 'react';

import superagent                   from 'superagent';
import { AppBar as MuiAppBar } from 'material-ui';
import Dropzone from 'react-dropzone'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { LinearProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';


import { withStyles } from 'material-ui/styles';
import List, {
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from 'material-ui/List';
import DeleteIcon from 'material-ui-icons/Delete';

/* component styles */
//import { styles } from './styles.scss';
const theme = createMuiTheme();

const styles = theme => ({
  list: {
    width: '100%',
    maxWidth: 360,
    background: theme.palette.background.paper,
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

let data = [];



class Drop extends React.Component {
  constructor() {
    super()
    this.state={
      results:[],
      role:'student',
	  searchterm:'',
	  loading:false,
      acceptedFiles:[]
    }
      

  }
    /*
  Function:handleCloseClick
  Parameters: event,index
  Usage:This fxn is used to remove file from filesPreview div
  if user clicks close icon adjacent to selected file
  */ 
  handleCloseClick(event,index){
    // console.log("filename",index);
    var acceptedFiles=this.state.acceptedFiles;
    acceptedFiles.splice(index,1);
    // console.log("files",filesToBeSent);
     data=[];
    this.setState({acceptedFiles});
    this.setState({results:data});
  }
  
  handleChange = searchterm => event => {
    this.setState({
      searchterm: event.target.value,
    });
  };
  
   handleSubmit(event){
   this.setState({loading:true});
     var req = superagent.post('/upload');
	 var clearFiles = [];
	 var  files = this.state.acceptedFiles;
	 console.log('Accepted files: ', files);
        files.forEach(file => {
            req.attach('docs', file);
        });
		req.accept('application/json');
		req.field('searchterm',this.state.searchterm);
        req.end((err, res) => {
                console.log(res.body.search);
			this.setState({results:res.body.search});
			    this.setState({
      acceptedFiles:clearFiles
    });
  this.setState({loading:false});
	this.setState({searchterm:''});
            });
  };

  onDrop(files) {

         console.log('Accepted files: ', files);
    this.setState({
      acceptedFiles:files
    });
	//




      // console.log('Rejected files: ', rejectedFiles);
  }

  render() {
        const { classes } = this.props;
		let search = null;
    let loading = null;
    let table = null;
		let button = null;
    if (this.state.loading) {
	loading = <LinearProgress color="accent" />;
	
	}
  if(this.state.searchterm){
button = <Button raised onClick={this.handleSubmit.bind(this)} color="primary"  >Analyze
      </Button>
  }
  if(this.state.results.length > 0 ){
table = <Grid item xs={12}>
           
      <Paper className={classes.paper}>
      
    <Table className={classes.table}>
    
        <TableHead>
          <TableRow>
            <TableCell><Typography type="title"  color="inherit">
            Filename
          </Typography></TableCell>
            <TableCell><Typography type="title"  color="inherit">
            Paragragh
          </Typography> </TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.results.map(n => {
            return (
              <TableRow key={n.id}>
                <TableCell>{n.filename}</TableCell>
                <TableCell><Typography  color="inherit" paragraph>
            {n.data}
          </Typography></TableCell>

              </TableRow>
            );
          })}

        </TableBody>
      </Table>
    </Paper>
        </Grid>

  }
	

        const filesToProcess = this.state.acceptedFiles;

    

        if (this.state.acceptedFiles.length > 0) {
      search = <div><TextField
          id="full-width"
          label=""
		  value={this.state.searchterm}
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="search"
          helperText=""
		  onChange={this.handleChange('searchterm')}
          fullWidth
          margin="normal"
        />
            {button}
        </div>;
    } 
    return (
      <div>
       <Grid container alignItems={'center'} spacing={24}>

        <Grid item xs={12} sm={6}>
          
          <Dropzone onDrop={this.onDrop.bind(this)}>
            <p>Drop files, or click to select files to upload.</p>
          </Dropzone>
        </Grid>
        <Grid item xs={12} sm={6}>
          
                    <h2>Dropped files</h2>
            <List className={styles.list}>
             
             {
              this.state.acceptedFiles.map(f => <div>
                <ListItem button><ListItemText
primary={f.name}
/>
<ListItemSecondaryAction>
<IconButton  onClick={(event) => this.handleCloseClick(event,f)} aria-label="Delete">
<DeleteIcon />
</IconButton>
</ListItemSecondaryAction></ListItem>
</div>
)



             }

              </List>
{search}



        </Grid>
               <Grid item xs={12}>
        
        {loading}

       </Grid>
 {table}

      </Grid>
</div>



    );
  }
}

export default withStyles(styles)(Drop);

