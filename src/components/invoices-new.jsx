import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';

import {
  fetchInvoices,
  fetchCustomers,
  fetchProducts,
  createInvoice,
  updateInvoice,
  deleteProductFromInvoice,
  addProductToInvoice,
  modifyInvoiceProductQuantity
} from '../actions';

class InvoicesNew extends React.Component {
  constructor() {
    super();
    this.onCustomerSelected = this.onCustomerSelected.bind(this);
    this.onProductSelected = this.onProductSelected.bind(this);
    this.onDiscountChanged = this.onDiscountChanged.bind(this);
    this.state = {
      customer: {},
      products: [],
      discount: '',
      total: '',
      invoiceId: -1
    };
  }

  componentDidMount() {
    const { customers, products } = this.props;

    if (_.isEmpty(customers)) { this.props.fetchCustomers(); }
    if (_.isEmpty(products)) { this.props.fetchProducts(); }

    const newInvoiceValues = {
      discount: this.state.discount || 0,
      total: this.state.total || 0,
      customer_id: -1
    };

    // Create a new invoice to work with and retrieve the invoice's id
    this.props.createInvoice(newInvoiceValues, (data) => {
      this.setState({
        ...this.state,
        invoiceId: data.id
      });
    });
  }

  onCustomerSelected(customer) {
    this.setState({
      ...this.state,
      customer
    });

    this.updateInvoice();
  }

  onProductSelected(inputList) {
    const newProducts = [ ...inputList ];
    const oldProducts = [ ...this.state.products ];

    // if no such product in component's state -- this is newly added product
    // vice versa to find out what product was deleted
    const newProduct = newProducts.find(newPr => oldProducts.indexOf(newPr) === -1);
    const deletedProduct = oldProducts.find(oldPr => newProducts.indexOf(oldPr) === -1);

    if (newProduct) {
      // if there was an insertion -- notify the server

      const newProductValues = {
        product_id: newProduct.value,
        quantity: newProduct.quantity
      };

      this.props.addProductToInvoice(this.state.invoiceId, newProductValues, (data) => {
        newProduct.serverId = data.id;
        oldProducts.push(newProduct);
        this.updateStateRespectTotal({
          ...this.state,
          products: oldProducts
        });
      });
    }

    if (deletedProduct) {
      this.props.deleteProductFromInvoice(this.state.invoiceId, deletedProduct.serverId);
      oldProducts.splice(
        oldProducts.indexOf(oldProducts.find(oldPr => oldPr.serverId === deletedProduct.serverId)),
        1
      );
      this.updateStateRespectTotal({
        ...this.state,
        products: oldProducts
      });
    }
  }

  onDiscountChanged(event) {
    this.updateStateRespectTotal({
      ...this.state,
      discount: event.target.value.replace(/[^0-9]/,''),
    });
  }

  updateInvoice() {
    const updateInvoiceValues = {
      discount: this.state.discount || 0,
      total: this.state.total || 0,
      customer_id: this.state.customer.value,
      invoiceId: this.state.invoiceId
    }

    // Updating current invoice with the new values
    this.props.updateInvoice(updateInvoiceValues);
  }

  updateStateRespectTotal(newState) {
    // Updating component's state and money total amount in one setState() call

    const totalPrice = newState.products.reduce((price, product) => {
      return price += product.price * product.quantity;
    }, 0);
    const percentage = (totalPrice * newState.discount) / 100;
    const total = totalPrice - percentage;

    this.setState({
      ...newState,
      total
    });
  }

  renderProductQuantity() {
    return this.state.products.map(product => {

      // listener function
      const onChange = (event) => {
        // copy products in the state to avoid mutation
        const products = [ ...this.state.products ];

        // find a product to edit
        const productToModify = products.find(
          stateProduct => stateProduct.value === product.value
        );

        const quantity = event.target.value.replace(/[^0-9]/,'');
        productToModify.quantity = quantity;

        // Notify server about product change
        this.props.modifyInvoiceProductQuantity(
          this.state.invoiceId,
          productToModify.serverId,
          productToModify.value,
          quantity
        );

        this.updateStateRespectTotal({
          ...this.state,
          products,
        });
      }

      // In order to make component 'controlled' find current product in component's
      // state and set it's value to input field
      const quantity = this.state.products.find(item => item.value == product.value).quantity;

      return (
        <div key={product.value}>
          <label htmlFor={product.value}>Items of {product.label}, {product.price} each</label>
          <input
            value={quantity}
            name={product.value}
            type="text"
            onChange={onChange}/>
        </div>
      )
    })
  }

  render() {
    const { customers, products } = this.props;
    const itemChosen = this.state.products.length > 0;

    // Select component requires specific format of data
    const customersForSelect = _.reduce(customers, (array, customer) => {
      array.push({
        value: customer.id,
        label: `${customer.name}, ${customer.phone}`
      });
      return array;
    }, []);
    const productsForSelect = _.reduce(products, (array, product) => {
      array.push({
        value: product.id,
        label: `${product.name}`,
        price: product.price,
        quantity: 0
      });
      return array;
    }, []);

    // when state has changed and component is ready to re-render notify the server
    // about the actual data
    this.updateInvoice();

    console.log('%cCOMPONENT STATE:', 'background: red; color: white');
    console.log(this.state);

    return (
      <div className="container-fluid">
        <Link className="btn btn-primary float-right" to="/">Back to list</Link>

        <div className="row">
          <div className="col-sm-12">
            <div className="center-block" style={{width: '80%'}}>
              <form>
                <div className="form-group">
                  <h3>New invoice</h3>
                </div>

                <div className="form-group">
                  <label className="col-sm-2 control-label">Select a customer</label>
                  <div className="col-sm-10">
                    <Select
                      name="select-customers"
                      value={this.state.customer}
                      options={customersForSelect}
                      onChange={this.onCustomerSelected}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="col-sm-2 control-label">Select products</label>
                  <div className="col-sm-10">
                    <Select
                      name="select-products"
                      options={productsForSelect}
                      value={this.state.products}
                      multi
                      onChange={this.onProductSelected}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="col-sm-2"></div>
                  <div className="col-sm-10">
                    {itemChosen && this.renderProductQuantity()}
                  </div>
                </div>

                <div className="form-group">
                  <label className="col-sm-2 control-label" htmlFor="discount">Discount</label>
                  <div className="col-sm-10">
                    <input
                      name="discount"
                      type="text"
                      maxLength="2"
                      value={this.state.discount}
                      onChange={this.onDiscountChanged}
                    />
                    <span>%</span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="col-sm-2 control-label"><strong>Total:</strong></label>
                  <label className="col-sm-10">{this.state.total} USD</label>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    customers: state.customers,
    products: state.products
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchInvoices,
      fetchCustomers,
      fetchProducts,
      createInvoice,
      updateInvoice,
      deleteProductFromInvoice,
      addProductToInvoice,
      modifyInvoiceProductQuantity
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(InvoicesNew);
