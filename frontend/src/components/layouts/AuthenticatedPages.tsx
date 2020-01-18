import * as React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

import AppMainLayout from './AppMainLayout';
import ErrorBoundary from './ErrorBoundary';

type Props = RouteComponentProps;

const AuthenticatedPages: React.FC<Props> = (props) => {
  const homeIndexRoute = <Route exact path='/' render={() => <Redirect to='/' />} />;
  const catchAllRoute = <Route path='/' render={() => <div>404 Page Not Found</div>} />;

  return (
    <AppMainLayout>
      <ErrorBoundary style={{}}>
        <Switch>
          {homeIndexRoute}
          {catchAllRoute}
        </Switch>
      </ErrorBoundary>
    </AppMainLayout>
  );
};

export default withRouter(AuthenticatedPages);
