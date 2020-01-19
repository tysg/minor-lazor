import * as React from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import * as Yup from 'yup';

import SimpleForm, { FormMetadataType } from 'src/components/SimpleForm';
import { PhotoData } from 'src/types/photos';
import { handleApiRequest } from 'src/utils/ui';
import { addPhoto } from '../operations';

type Props = RouteComponentProps;

const NewUserForm: React.FC<Props> = ({ history }) => {
  const dispatch = useDispatch();

  const values: Partial<PhotoData> = {
    id: 0,
    file_helper: ''
  };

  const formMetadata: FormMetadataType<PhotoData> = {};

  const validationSchema = Yup.object({
    file_helper: Yup.string().required()
  });

  return (
    <SimpleForm
      initialValues={values}
      formMetadata={formMetadata}
      validationSchema={validationSchema}
      onCancel={() => history.push('/photos')}
      onSubmit={(newValues: PhotoData) => {
        return handleApiRequest(dispatch, dispatch(addPhoto(newValues))).then((res) => {
          history.push(`${res.data.id}`);
          return false;
        });
      }}
    />
  );
};

export default withRouter(NewUserForm);
