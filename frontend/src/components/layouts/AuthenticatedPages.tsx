import * as React from 'react';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

import HomeIndex from 'src/modules/HomeIndex';
import UserNew from 'src/modules/users/components/NewUserForm';
import AppMainLayout from './AppMainLayout';
import ErrorBoundary from './ErrorBoundary';

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
