import _ from 'lodash';

import {
  FETCH_INVOICES,
  CREATE_INVOICE,
  UPDATE_INVOICE,
  ADD_PRODUCT_TO_INVOICE,
  MODIFY_INVOICE_PRODUCT_QUANTITY
} from '../actions/types';

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_INVOICES:
      return _.mapKeys(action.payload.data, 'id');
    case CREATE_INVOICE:
    case UPDATE_INVOICE:
      const data = action.payload;
      return {
        ...state,
        [data.id]: data
      };
    default:
      return state;
  }
}
