import * as React from 'react';
import { useSelector } from 'react-redux';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

import AppMainLayout from './AppMainLayout';
import ErrorBoundary from './ErrorBoundary';
import HomeIndex from './../../modules/HomeIndex';
import UserNew from './../../modules/NewUserForm';

type Props = RouteComponentProps;

const AuthenticatedPages: React.FC<Props> = (props) => {
  const homeIndexRoute = <Route exact path='/' component={HomeIndex} />;
  const userNewRoute = <Route exact path='/users' component={UserNew} />;
  const catchAllRoute = <Route path='/' render={() => <div>404 Page Not Found</div>} />;

  return (
    <AppMainLayout>
      <ErrorBoundary style={{}}>
        <Switch>
          {homeIndexRoute}
          {userNewRoute}
          {catchAllRoute}
        </Switch>
      </ErrorBoundary>
    </AppMainLayout>
  );
};

export default withRouter(AuthenticatedPages);
