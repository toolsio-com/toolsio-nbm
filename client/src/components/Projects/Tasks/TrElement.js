import React from 'react'
import classnames from 'classnames'
import { InputField, SelectField } from '../../../utils/FormFields'

// Localization 
import T from 'i18n-react'

export const AddElement = ({task, handleNewTaskChange, handleCreate}) => {
  return (
    <tr>
      <td className="add-task">
        <InputField
          name="name" 
          value={task.name} 
          onChange={handleNewTaskChange}  
          placeholder="Name"
          error={task.errors.message && task.errors.message.errors && task.errors.message.errors.name && task.errors.message.errors.name.message}
          formClass="ui small input"
        />
      </td>
      <td className="add-task">
        <SelectField
          name="paymentType"
          type="select"
          value={task.paymentType} 
          onChange={handleNewTaskChange}  
          error={task.errors.message && task.errors.message.errors && task.errors.message.errors.paymentType && task.errors.message.errors.paymentType.message}
          formClass="ui small input"
          options={[
            <option key="default" value="" disabled>{T.translate("projects.tasks.form.select_payment_type")}</option>,
            <option key="per hour" value="per hour">Per task</option>,
            <option key="per task" value="per task">Per hour</option>
            ]
          }
        />
      </td>
      <td className="add-task">
        <InputField
          name="hours" 
          value={task.hours} 
          onChange={handleNewTaskChange}  
          placeholder="0.00"
          error={task.errors.message && task.errors.message.errors && task.errors.message.errors.hours && task.errors.message.errors.hours.message}
          formClass="ui small input"
        />
      </td>
      <td className="add-task">
        <InputField
          name="price" 
          value={task.price} 
          onChange={handleNewTaskChange} 
          placeholder="0.00"
          error={task.errors.message && task.errors.message.errors && task.errors.message.errors.price && task.errors.message.errors.price.message}
          formClass="ui small input"
        />
      </td>
      <td className="add-task">
        <InputField
          name="vat" 
          value={task.vat} 
          onChange={handleNewTaskChange} 
          placeholder="0"
          error={task.errors.message && task.errors.message.errors && task.errors.message.errors.vat && task.errors.message.errors.vat.message}
          formClass="ui small input"
        />
      </td>
      <td className="add-task" width="120px">     
        <button disabled={task.isLoading} className="ui fluid small icon basic turquoise button" onClick={handleCreate}><i className="add circle icon icon" aria-hidden="true"></i>&nbsp;{T.translate("projects.tasks.form.add_task")}</button> 
      </td>
    </tr>
  )  
}


export const ShowEditElement = ({task, editTask, handleNewTaskChange, handleCreate, handleEdit, handleCancelEdit, handleUpdate, handleEditTaskChange, showConfirmationModal}) => {
  return (
    <tr key={task._id} id={task._id}>      
      <td className="show-task">{task.name}</td>
      <td className="show-task">{task.paymentType}</td>
      <td className="show-task">{task.hours}</td>
      <td className="show-task">{task.price}</td>
      <td className="show-task">{task.vat}</td>
      <td className="show-task" width="120px">
        <div className="show-task ui fluid small buttons">
          <button className="ui negative icon basic button" onClick={showConfirmationModal}><i className="delete icon"></i></button>
          <button className="ui positive icon basic button" onClick={handleEdit}><i className="edit icon"></i></button>
        </div>
      </td>
      <td className="edit-task">
        <InputField
          name="name" 
          value={editTask.name} 
          onChange={handleNewTaskChange}  
          placeholder="Name"
          error={editTask.errors.message && editTask.errors.message.errors && editTask.errors.message.errors.name && editTask.errors.message.errors.name.message}
          formClass="ui small input"
        />
      </td>
      <td className="edit-task">
        <SelectField
          name="paymentType"
          type="select"
          value={editTask.paymentType} 
          onChange={handleNewTaskChange}  
          error={editTask.errors.message && editTask.errors.message.errors && editTask.errors.message.errors.paymentType && editTask.errors.message.errors.paymentType.message}
          formClass="ui small input"
          options={[
            <option key="default" value="" disabled>{T.translate("projects.tasks.form.select_payment_type")}</option>,
            <option key="per hour" value="per hour">Per task</option>,
            <option key="per task" value="per task">Per hour</option>
            ]
          }
        />
      </td>
      <td className="edit-task">
        <InputField
          name="hours" 
          value={editTask.hours.toString()} 
          onChange={handleNewTaskChange}  
          placeholder="0.00"
          error={editTask.errors.message && editTask.errors.message.errors && editTask.errors.message.errors.hours && editTask.errors.message.errors.hours.message}
          formClass="ui small input"
        />
      </td>
      <td className="edit-task">
        <InputField
          name="price" 
          value={editTask.price.toString()} 
          onChange={handleNewTaskChange} 
          placeholder="0.00"
          error={editTask.errors.message && editTask.errors.message.errors && editTask.errors.message.errors.price && editTask.errors.message.errors.price.message}
          formClass="ui small input"
        />
      </td>
      <td className="edit-task">
        <InputField
          name="vat" 
          value={editTask.vat.toString()} 
          onChange={handleNewTaskChange} 
          placeholder="0"
          error={editTask.errors.message && editTask.errors.message.errors && editTask.errors.message.errors.vat && editTask.errors.message.errors.vat.message}
          formClass="ui small input"
        />
      </td>
      <td className="edit-task" width="120px">  
        <div className="edit-item ui fluid small buttons">
          <button className="ui basic icon button" onClick={handleCancelEdit}><i className="remove circle outline icon"></i></button>
          <button className="ui positive icon basic button" onClick={handleUpdate}><i className="check circle outline icon"></i></button>
        </div>
      </td>
    </tr>
  )  
}