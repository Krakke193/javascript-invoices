import _ from 'lodash';

import { FETCH_CUSTOMERS } from '../actions/types';

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_CUSTOMERS:
      return _.mapKeys(action.payload.data, 'id');
    default:
      return state;
  }
}
