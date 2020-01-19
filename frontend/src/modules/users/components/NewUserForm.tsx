import * as React from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import * as Yup from 'yup';

import SimpleForm, { FormMetadataType } from 'src/components/SimpleForm';
import { UserData } from 'src/types/users';
import { handleApiRequest } from 'src/utils/ui';
import { addUser } from '../operations';

type Props = RouteComponentProps;

const NewUserForm: React.FC<Props> = ({ history }) => {
  const dispatch = useDispatch();

  const values: Partial<UserData> = {
    id: 0,
    full_name: '',
    email: '',
    file_helper: ''
  };

  const formMetadata: FormMetadataType<UserData> = {
    full_name: { label: 'Name', required: true, options: null, xs: 12, sm: 12 },
    email: { label: 'Email', required: true, options: null, xs: 12, sm: 12 }
  };

  const validationSchema = Yup.object({
    full_name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Enter a valid email')
      .required('Email is required'),
    file_helper: Yup.string().required()
  });

  return (
    <SimpleForm
      initialValues={values}
      formMetadata={formMetadata}
      validationSchema={validationSchema}
      onCancel={() => history.push('/users')}
      onSubmit={(newValues: UserData) => {
        return handleApiRequest(dispatch, dispatch(addUser(newValues))).then((res) => {
          history.push(`${res.data.id}`);
          return false;
        });
      }}
    />
  );
};

export default withRouter(NewUserForm);
