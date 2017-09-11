import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import _ from 'lodash';
import { Link } from 'react-router-dom';

import {
  fetchInvoices,
  fetchCustomers,
  fetchProducts
} from '../actions';

class InvoicesIndex extends React.Component {
  componentDidMount() {
    this.props.fetchInvoices();
    this.props.fetchCustomers();
    this.props.fetchProducts();
  }

  renderInvoices() {
    return _.map(this.props.invoices, invoice => {
      let customerName;
      if (invoice.customer_id != -1 && this.props.customers[invoice.customer_id]) {
        customerName = this.props.customers[invoice.customer_id].name;
      } else {
        customerName = 'Anonymous'
      }

      return (
        <li key={invoice.id} className="list-group-item">
          {`Invoice №${invoice.id}, for customer ${customerName}`}
        </li>
      )
    })
  }

  render () {
    return (
      <div className="container-fluid">
        <Link className="btn btn-primary float-right" to="/invoices/new">New invoice</Link>

        <div className="row">
          <div className="col-sm-12">
            <div className="center-block" style={{width: '80%'}}>

              <h3>Invoices</h3>
              <ul className="listGroup">
                {this.renderInvoices()}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    invoices: state.invoices,
    customers: state.customers
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchInvoices,
      fetchCustomers,
      fetchProducts
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(InvoicesIndex);
