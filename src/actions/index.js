import axios from 'axios';

import {
  FETCH_INVOICES,
  FETCH_CUSTOMERS,
  FETCH_PRODUCTS,
  CREATE_INVOICE,
  UPDATE_INVOICE,
  ADD_PRODUCT_TO_INVOICE,
  DELETE_PRODUCT_FROM_INVOICE,
  MODIFY_INVOICE_PRODUCT_QUANTITY
} from './types';

const ROOT_URL = 'http://localhost:8000/api';

export function fetchInvoices() {
  const request = axios.get(`${ROOT_URL}/invoices`);

  return {
    type: FETCH_INVOICES,
    payload: request
  }
}

export function createInvoice(values, callback) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/invoices`, values)
      .then(({ data }) => {
        callback(data);
        dispatch({
          type: CREATE_INVOICE,
          payload: data
        })
      })
  }
}

export function updateInvoice(values) {
  return (dispatch) => {
    axios.put(`http://localhost:8000/api/invoices/${values.invoiceId}`, values)
      .then(({ data }) => {
        dispatch({
          type: UPDATE_INVOICE,
          payload: data
        })
      });
  }
}



export function fetchCustomers() {
  const request = axios.get(`${ROOT_URL}/customers`);

  return {
    type: FETCH_CUSTOMERS,
    payload: request
  }
}

export function fetchProducts() {
  const request = axios.get(`${ROOT_URL}/products`);

  return {
    type: FETCH_PRODUCTS,
    payload: request
  }
}



export function addProductToInvoice(invoiceId, newProductValues, callback) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/invoices/${invoiceId}/items`, newProductValues)
      .then(({ data }) => {
        callback(data);
        dispatch({
          type: ADD_PRODUCT_TO_INVOICE,
          payload: data
        })
      })
  }
}

export function deleteProductFromInvoice(invoiceId, product_id) {
  return (dispatch) => {
    axios.delete(`${ROOT_URL}/invoices/${invoiceId}/items/${product_id}`)
      .then(({ data }) => {
        dispatch({
          type: DELETE_PRODUCT_FROM_INVOICE,
          payload: data
        });
      });
  }
}

export function modifyInvoiceProductQuantity(invoiceId, serverId, product_id, quantity) {
  const values = {
    product_id,
    quantity
  }
  return (dispatch) => {
    axios.put(`${ROOT_URL}/invoices/${invoiceId}/items/${serverId}`, values)
      .then(({ data }) => {
        dispatch({
          type: MODIFY_INVOICE_PRODUCT_QUANTITY,
          payload: data
        });
      });
  }
}
