import { gql, useMutation } from '@apollo/client';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles, useTheme } from '@material-ui/styles';
import { Formik } from 'formik';
import React, { ReactElement } from 'react';
import * as Yup from 'yup';
import { User } from '../generated/graphql';
import { useSessionContext } from './session/Session';
import { AppTheme } from './Theme';

const useStyles = makeStyles({
  dialog: {
    borderRadius: '50%',
  },
  form: {
    padding: 30,
  },
  bold: {
    fontWeight: 800,
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

function TextInput(props: TextFieldProps) {
  return (
    <TextField
      {...props}
      variant="filled"
      fullWidth
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
}

type NewAccount = {
  username: String;
  password: String;
  confirmPassword: String;
};

const SIGN_UP = gql`
  mutation Signup($username: String!, $password: String!) {
    createUser(createUserInput: { username: $username, password: $password }) {
      username
      id
    }
    login(username: $username, password: $password)
  }
`;

type SignUp = {
  createUser: User;
  login: string;
};

export function CreateAccount(): ReactElement {
  const classes = useStyles();
  const theme = useTheme<AppTheme>();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const paperProps = fullScreen ? {} : { className: classes.paper };

  const { setAccessToken, setUser } = useSessionContext();
  const [createUser, { error }] = useMutation<SignUp>(SIGN_UP);

  const onSubmitHandler = async (values: NewAccount) => {
    const { username, password } = values;
    try {
      const { data, errors } = await createUser({
        variables: {
          username,
          password,
        },
      });
      if (errors !== undefined || data === undefined || data === null) {
        throw new Error('Failed to create new User');
      }
      setUser(data.createUser);
      setAccessToken(data.login);
    } catch (ee) {
      console.error(ee);
    }
  };

  const initialValues: NewAccount = {
    username: '',
    password: '',
    confirmPassword: '',
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmitHandler}
      validationSchema={Yup.object().shape({
        username: Yup.string().min(1).max(30).required('REQUIRED'),
        password: Yup.string()
          .matches(/^[a-zA-Z0-9]{3,30}$/)
          .required('Required'),
        confirmPassword: Yup.string()
          .matches(/^[a-zA-Z0-9]{3,30}$/)
          .required('Required'),
      })}
    >
      {(props) => {
        const { values, errors, touched, isValid } = props;
        const { handleChange, handleBlur, handleSubmit, submitForm } = props;
        const { password, confirmPassword } = values;
        return (
          <form onSubmit={handleSubmit}>
            <Dialog
              open
              fullWidth
              maxWidth="sm"
              fullScreen={fullScreen}
              className={classes.dialog}
              PaperProps={paperProps}
            >
              <DialogContent className={classes.content}>
                <Grid
                  container
                  spacing={4}
                  direction="column"
                  alignItems="stretch"
                  className={classes.form}
                >
                  <Grid item>
                    <Typography className={classes.bold} variant="h6">
                      Create your account
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography className={classes.bold} variant="h6">
                      {error}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <TextInput
                      type="text"
                      name="username"
                      label="Username"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(errors.username && touched.username)}
                      helperText={errors.username || ''}
                    />
                  </Grid>
                  <Grid item>
                    <TextInput
                      type="password"
                      name="password"
                      label="Password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(errors.password && touched.password)}
                      helperText={errors.password || ''}
                    />
                  </Grid>
                  <Grid item>
                    <TextInput
                      type="password"
                      name="confirmPassword"
                      label="Confirm Password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(
                        touched.confirmPassword &&
                          (password !== confirmPassword || errors.confirmPassword),
                      )}
                      helperText={errors.confirmPassword || ''}
                    />
                  </Grid>
                </Grid>
                <Grid container justify="center">
                  <Grid item>
                    <Fab
                      name="submit"
                      variant="extended"
                      size="small"
                      color="primary"
                      type="button"
                      onClick={submitForm}
                      disabled={!isValid || password !== confirmPassword}
                    >
                      <Typography className={classes.next}>Submit</Typography>
                    </Fab>
                  </Grid>
                </Grid>
              </DialogContent>
            </Dialog>
          </form>
        );
      }}
    </Formik>
  );
}
