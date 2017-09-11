import { combineReducers } from 'redux';

import InvoicesReducer from './invoices-reducer';
import CustomersReducer from './customers-reducer';
import ProductsReducer from './products-reducer';

const rootReducer = combineReducers({
  invoices: InvoicesReducer,
  customers: CustomersReducer,
  products: ProductsReducer
});

export default rootReducer;
