import React, { Component } from 'react' 
import SaleForm from '../../containers/SaleForm'

class Create extends Component {

  render() {
    return (
      <div>
        <h1>Create new Sale</h1>
        <SaleForm />
      </div>
    )
  }
}

export default Create