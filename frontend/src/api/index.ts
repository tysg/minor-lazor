import PhotosAPI from './photos';
import TrainingAPI from './training';
import UsersAPI from './users';

const api = {
  photos: new PhotosAPI(),
  training: new TrainingAPI(),
  users: new UsersAPI()
};

Object.freeze(api);

export default api;
