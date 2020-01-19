import PhotosAPI from './photos';
import UsersAPI from './users';

const api = {
  photos: new PhotosAPI(),
  users: new UsersAPI()
};

Object.freeze(api);

export default api;
