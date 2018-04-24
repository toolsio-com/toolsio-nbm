import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { InputField, SelectField, TextAreaField } from '../../../utils/FormFields'

// Localization 
import T from 'i18n-react'

// Datepicker 
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function Details({ id, step2, handleChangeDate, handleChange, handlePrevious, handleNext, errors}) {

  const paymentTermOptions = Array(99).fill().map((key, value) => 
    <option key={value} value={value}>{value}</option>
    )
  
  return (
    <div className="ui form"> 
      <div className="inline field"> 
        {id ? <h1 className="ui header">{T.translate("invoices.form.edit_invoice")}</h1> : 
          <h1 className="ui header">{T.translate("invoices.form.new_invoice")}
            <div className="sub header d-inline-block pl-1">{T.translate("invoices.form.invoice_details")}</div>
          </h1>
        }
      </div>
      <fieldset className="custom-fieldset">
        <legend className="custom-legend">{T.translate("invoices.form.select_payment_term_or_deadline")}</legend>

        <div  className={classnames("inline field", { error: !!errors.deadline })}>
          <label className="" htmlFor="date">{T.translate("sales.form.deadline")}</label>
          <DatePicker
            dateFormat="DD/MM/YYYY"
            selected={step2.deadline}
            onChange={handleChangeDate}
          />
          <span className="red">{errors.deadline}</span>
        </div>
        
        <div className="ui horizontal divider">Or</div>

        <SelectField
          label={T.translate("invoices.form.payment_term")}
          name="paymentTerm" 
          value={step2.paymentTerm ? step2.paymentTerm.toString() : ''} 
          onChange={handleChange} 
          placeholder="Name"
          error={errors.paymentTerm}
            formClass="inline field"

          options={[<option key="default" value="">{T.translate("invoices.form.select_days")}</option>,
            paymentTermOptions]}
        />
      </fieldset>  

      <InputField
        label={T.translate("invoices.form.interest_in_arrears")}
        name="interestInArrears" 
        value={step2.interestInArrears && step2.interestInArrears.toString()} 
        onChange={handleChange} 
        placeholder="0%"
        error={errors.interestInArrears}
          formClass="inline field"
      />
      
      { id &&
        <SelectField
          label={T.translate("invoices.form.status")}
          name="status"
          type="select"
          value={step2.status && step2.status} 
          onChange={handleChange} 
          error={errors.status}
          formClass="inline field"

          options={[
            <option key="default" value="new" disabled>NEW</option>,
            <option key="pending" value="pending">PENDING</option>,
            <option key="paid" value="paid">PAID</option>,
            <option key="overdue" value="overdue">OVERDUE</option>
            ]
          }
        />
      }

      <TextAreaField
        label={T.translate("invoices.form.description")}
        name="description" 
        value={step2.description} 
        onChange={handleChange} 
        placeholder={T.translate("invoices.form.description")}
        formClass="inline field"
      /> 

      <div className="inline field mt-5"> 
        <button className="ui button" onClick={handlePrevious}><i className="chevron left icon"></i>{T.translate("invoices.form.previous")}</button>
        <button className="ui primary button" onClick={handleNext}>{T.translate("invoices.form.next")}<i className="chevron right icon"></i></button>

        <Link to="/invoices" className="ui negative d-block mt-3">{T.translate("invoices.form.cancel")}</Link>
      </div>  
    </div> 
    )
}

