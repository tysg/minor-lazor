import * as React from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { Typography, Card, makeStyles, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/SchoolOutlined';
import { handleApiRequest } from 'src/utils/ui';
import { startTraining } from '../operations';

type Props = RouteComponentProps;

const useStyles = makeStyles((theme) => ({
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
  },
  icon: {
    marginRight: theme.spacing(1)
  }
}));

const HomeIndex: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const onClick = () => handleApiRequest(dispatch, dispatch(startTraining())).then((res) => {
    return false;
  });

  return (
    <Card className={classes.root}>
      <Typography>Welcome to Facer!</Typography>
      <br />
      <Button color='primary' size='medium' variant='outlined' onClick={onClick}>
        <AddIcon color='primary' className={classes.icon} />
        <Typography>Start Training</Typography>
      </Button>
    </Card>
  );
};

export default withRouter(HomeIndex);
