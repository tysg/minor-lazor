import * as React from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { Typography, Card, makeStyles } from '@material-ui/core';

type Props = RouteComponentProps;

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `40px 40px 40px 40px`
  },
  buttons: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}));

const HomeIndex: React.FC<Props> = () => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <Typography>Welcome to Facer!</Typography>
    </Card>
  );
};

export default withRouter(HomeIndex);
