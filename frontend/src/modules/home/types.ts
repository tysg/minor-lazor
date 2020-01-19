import { EntityStore } from 'src/types';

// action names

export const START_TRAINING = 'home/START_TRAINING';

// action types

export interface StartTrainingAction {
  type: typeof START_TRAINING;
}

export type UsersActionTypes = StartTrainingAction;
