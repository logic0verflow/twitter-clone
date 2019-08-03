import React from 'react';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles, useTheme } from '@material-ui/styles';
import ArrowBack from '@material-ui/icons/ArrowBack';
import InsertPhoto from '@material-ui/icons/InsertPhoto';
import Gif from '@material-ui/icons/Gif';
import Poll from '@material-ui/icons/Poll';
import Mood from '@material-ui/icons/Mood';

const useStyles = makeStyles({
  dialog: {
    borderRadius: '50%',
  },
  content: {
    padding: 12,
  },
  paper: {
    borderRadius: 12,
  },
  next: {
    textTransform: 'none',
    padding: '0px 8px',
  },
});


function ComposeTweet() {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const paperProps = fullScreen ? {} : { className: classes.paper };
  return (
    <Dialog
      open
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      className={classes.dialog}
      PaperProps={paperProps}
    >
      <DialogContent className={classes.content}>
        <Grid container justify="space-between">
          <Grid item>
            <IconButton
              size="small"
              name="go-back"
            >
              <ArrowBack />
            </IconButton>
          </Grid>
          <Grid item>
            <Fab
              name="tweet-submit"
              variant="extended"
              size="small"
              color="primary"
            >
              <Typography className={classes.next}>
                Tweet
              </Typography>
            </Fab>
          </Grid>
        </Grid>

        <Divider />

        <Grid container>
          <Grid item xs={12}>
            <TextField fullWidth name="tweet-content" />
          </Grid>
        </Grid>

        <Grid container>
          <Grid item>
            <FormLabel htmlFor="add-image">
              <IconButton size="small" name="add-image" component="span">
                <InsertPhoto />
              </IconButton>
            </FormLabel>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="add-image"
              multiple
              type="file"
            />

          </Grid>
          <Grid item>
            <IconButton size="small" name="add-gif">
              <Gif />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton size="small" name="add-poll">
              <Poll />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton size="small" name="add-emoji">
              <Mood />
            </IconButton>
          </Grid>
        </Grid>

      </DialogContent>
    </Dialog>
  );
}

export default ComposeTweet;
