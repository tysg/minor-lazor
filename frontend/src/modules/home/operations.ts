import api from 'src/api';
import { ApiResponse, ApiPromise, Operation } from 'src/types';

export function startTraining(): Operation<ApiResponse<{}>> {
  return async () => {
    const response = await api.training.startTraining();
    return response;
  };
}
