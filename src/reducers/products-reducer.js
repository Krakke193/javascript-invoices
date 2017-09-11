import _ from 'lodash';

import { FETCH_PRODUCTS, ADD_PRODUCT_QUANTITY } from '../actions/types';

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_PRODUCTS:
      return _.mapKeys(action.payload.data, 'id');
    case ADD_PRODUCT_QUANTITY:
      const toModify = state[action.payload.id];
      toModify.quantity = action.payload.quantity;
      return {...state, toModify};
    default:
      return state;
  }
}
