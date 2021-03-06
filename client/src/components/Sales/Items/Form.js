import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Validation } from "../../../utils";
import { addFlashMessage } from "../../../actions/flashMessageActions";
// Semantic UI JS
import { Form as FormElement, Table, Modal } from "semantic-ui-react";
import AddItemTr from "./AddItemTr";
import ShowEditItemTr from "./ShowEditItemTr";
import { graphql, compose } from "react-apollo";
import { GET_SALE_QUERY } from "../../../graphql/sales";
import {
  CREATE_ITEM_MUTATION,
  UPDATE_ITEM_MUTATION,
  DELETE_ITEM_MUTATION
} from "../../../graphql/items";

import GetCurrencySymbol from "../../../utils/currency";

// Localization
import T from "i18n-react";

import $ from "jquery";

class Form extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      itemToBeDeleated: {},
      newItem: {
        saleId: this.props.saleId,
        name: "",
        unit: "",
        quantity: "",
        unitPrice: "",
        total: "",
        errors: {},
        isLoading: false
      },
      editItem: {
        id: null,
        saleId: this.props.saleId,
        name: "",
        unit: "",
        quantity: "",
        unitPrice: "",
        total: "",
        errors: {},
        isLoading: false
      },
      openConfirmationModal: false
    };
  }

  /**
  UNSAFE_componentWillMount() {
    this.setItemsTotal(this.props.items);
  }

  UNSAFE_componentWillReceiveProps = nextProps => {
    if (nextProps.items) {
      this.setItemsTotal(nextProps.items);
    }
  };

  setItemsTotal(items) {
    this.setState({
      itemsTotal: items
        .map(a => a.total)
        .reduce((a, b) => a + b, 0)
        .toFixed(2)
    });
  } */

  handleNewItemChange = (name, value) => {
    if (this.state.newItem.errors[name]) {
      let errors = Object.assign({}, this.state.newItem.errors);
      delete errors[name];

      let updatedItem = Object.assign({}, this.state.newItem);
      updatedItem[name] = value;
      updatedItem.errors = errors;

      this.setState({
        newItem: updatedItem
      });
    } else {
      let updatedItem = Object.assign({}, this.state.newItem);
      updatedItem.saleId = this.props.saleId;
      updatedItem[name] = value;

      this.setState({
        newItem: updatedItem
      });
    }
  };

  handleNewItemBlur = e => {
    if (!this.state.newItem.errors[e.target.name]) {
      let updatedItem = Object.assign({}, this.state.newItem);

      const { quantity, unitPrice } = this.state.newItem;

      if (unitPrice !== "" && quantity !== "") {
        updatedItem["total"] = parseFloat(
          (parseFloat(quantity) * parseFloat(unitPrice)).toFixed(2)
        );
      }

      if (unitPrice !== "" && quantity === "") {
        updatedItem["total"] = parseFloat(unitPrice);
      }

      if (unitPrice === "" && quantity === "") {
        updatedItem["total"] = "";
      }

      this.setState({
        newItem: updatedItem
      });
    }
  };

  isValidNewItem() {
    const { errors, isValid } = Validation.validateItemInput(
      this.state.newItem
    );

    if (!isValid) {
      let updatedItem = Object.assign({}, this.state.newItem);
      updatedItem.errors = errors;
      this.setState({
        newItem: updatedItem
      });
    }

    return isValid;
  }

  handleCreate(event) {
    event.preventDefault();

    // Validation
    if (this.isValidNewItem()) {
      const {
        saleId,
        name,
        unit,
        quantity: quantity,
        unitPrice,
        total
      } = this.state.newItem;

      this.props
        .createItemMutation({
          variables: {
            saleId,
            name,
            unit,
            quantity: parseFloat(quantity),
            unitPrice: parseFloat(unitPrice),
            total
          },
          update: (store, { data: { createItem } }) => {
            const { success, item } = createItem;

            if (!success) {
              return;
            }

            // Read the data from our cache for this query.
            const data = store.readQuery({
              query: GET_SALE_QUERY,
              variables: {
                id: saleId
              }
            });

            // Add our Task from the mutation to the end.
            data.getSale.items.push(item);

            // Write our data back to the cache.
            store.writeQuery({ query: GET_SALE_QUERY, data });
          }
        })
        .then(res => {
          const { success, item, errors } = res.data.createItem;

          if (success) {
            let updatedItem = Object.assign({}, this.state.newItem);
            updatedItem.saleId = null;
            updatedItem.name = "";
            updatedItem.unit = "";
            updatedItem.quantity = "";
            updatedItem.unitPrice = "";
            updatedItem.total = "";
            updatedItem.isLoading = false;
            this.setState({
              newItem: updatedItem
            });

            this.props.addFlashMessage({
              type: "success",
              text: T.translate("sales.items.form.flash.success_add", {
                name: item.name
              })
            });
          } else {
            let errorsList = {};
            errors.map(error => (errorsList[error.path] = error.message));

            let updatedItem = Object.assign({}, this.state.newItem);
            updatedItem.errors = errorsList;
            updatedItem.isLoading = false;

            this.setState({ newItem: updatedItem });
          }
        })
        .catch(err => {
          let updatedItem = Object.assign({}, this.state.newItem);
          updatedItem.errors = err;
          updatedItem.isLoading = false;

          this.setState({ newItem: updatedItem });
        });
    }
  }

  handleEditItemChange = (name, value, item) => {
    if (this.state.editItem.errors[name]) {
      let errors = Object.assign({}, this.state.editItem.errors);
      delete errors[name];

      let updatedItem = Object.assign({}, this.state.editItem);
      updatedItem.id = item.id;
      updatedItem.saleId = item.saleId;
      updatedItem[name] = value;

      this.setState({
        editItem: updatedItem,
        errors
      });
    } else {
      let updatedItem = Object.assign({}, this.state.editItem);
      updatedItem.id = item.id;
      updatedItem.saleId = item.saleId;
      updatedItem[name] = value;

      this.setState({
        editItem: updatedItem
      });
    }
  };

  handleEditItemBlur = e => {
    if (!this.state.editItem.errors[e.target.name]) {
      let updatedItem = Object.assign({}, this.state.editItem);

      const { quantity, unitPrice } = this.state.editItem;

      if (unitPrice !== "" && quantity !== "") {
        updatedItem["total"] = parseFloat(
          (parseFloat(quantity) * parseFloat(unitPrice)).toFixed(2)
        );
      }

      if (unitPrice !== "" && quantity === "") {
        updatedItem["total"] = parseFloat(unitPrice);
      }

      if (unitPrice === "" && quantity === "") {
        updatedItem["total"] = "";
      }

      this.setState({
        editItem: updatedItem
      });
    }
  };

  handleEdit(item, event) {
    event.preventDefault();

    //Hide show tr and show edit tr
    $("#" + item.id + " td.show-item").hide();
    $("#" + item.id + " td.edit-item").show();

    let updatedItem = Object.assign({}, this.state.editItem);
    updatedItem.id = item.id;
    updatedItem.saleId = item.saleId;
    updatedItem.name = item.name;
    updatedItem.unit = item.unit;
    updatedItem.quantity = item.quantity;
    updatedItem.unitPrice = item.unitPrice;
    updatedItem.total = item.total;
    this.setState({
      editItem: updatedItem
    });
  }

  handleCancelEdit(item, event) {
    event.preventDefault();

    // Hide edit tr and show show tr
    $("#" + item.id + " td.edit-item").hide();
    $("#" + item.id + " td.show-item").show();
  }

  isValidEditItem() {
    const { errors, isValid } = Validation.validateItemInput(
      this.state.editItem
    );

    if (!isValid) {
      let updatedItem = Object.assign({}, this.state.editItem);
      updatedItem.errors = errors;
      this.setState({
        editItem: updatedItem
      });
    }

    return isValid;
  }

  handleUpdate(event) {
    event.preventDefault();

    // Validation
    if (this.isValidEditItem()) {
      const {
        id,
        saleId,
        name,
        unit,
        quantity,
        unitPrice,
        total
      } = this.state.editItem;

      this.props
        .updateItemMutation({
          variables: {
            id,
            saleId,
            name,
            unit,
            quantity: parseFloat(quantity),
            unitPrice: parseFloat(unitPrice),
            total
          },
          update: (store, { data: { updateItem } }) => {
            const { success, item } = updateItem;

            if (!success) {
              return;
            }

            // Read the data from our cache for this query.
            const data = store.readQuery({
              query: GET_SALE_QUERY,
              variables: {
                id: saleId
              }
            });

            // Add our Item from the mutation to the end.
            let updatedItems = data.getSale.items.map(item2 => {
              if (item2.id === item.id) {
                return { ...item, __typename: "Item" };
              }
              return item2;
            });
            data.getSale.items = updatedItems;

            // Write our data back to the cache.
            store.writeQuery({
              query: GET_SALE_QUERY,
              variables: {
                id: saleId
              },
              data
            });
          }
        })
        .then(res => {
          const { success, item, errors } = res.data.updateItem;

          if (success) {
            let updatedItem = Object.assign({}, this.state.editItem);
            updatedItem.saleId = null;
            updatedItem.name = "";
            updatedItem.unit = "";
            updatedItem.quantity = "";
            updatedItem.unitPrice = "";
            updatedItem.total = "";
            updatedItem.isLoading = false;
            this.setState({
              editItem: updatedItem
            });

            this.props.addFlashMessage({
              type: "success",
              text: T.translate("sales.items.form.flash.success_update", {
                name: name
              })
            });

            // Hide edit tr and show show tr
            $("#" + item.id + " td.edit-item").hide();
            $("#" + item.id + " td.show-item").show();
          } else {
            let errorsList = {};
            errors.map(error => (errorsList[error.path] = error.message));

            let updatedItem = Object.assign({}, this.state.editItem);
            updatedItem.errors = errorsList;
            updatedItem.isLoading = false;

            this.setState({ editItem: updatedItem });
          }
        })
        .catch(err => {
          let updatedItem = Object.assign({}, this.state.editItem);
          updatedItem.errors = err;
          updatedItem.isLoading = false;

          this.setState({ editItem: updatedItem });
        });
    }
  }

  toggleConfirmationModal = (item, event) => {
    if (event) {
      event.preventDefault();
    }

    this.setState(state => ({
      openConfirmationModal: !state.openConfirmationModal,
      itemToBeDeleated: item
    }));
  };

  handleDelete(item, event) {
    event.preventDefault();

    const { id, name } = item;
    const { saleId } = this.props;

    this.props
      .deleteItemMutation({
        variables: { id },
        update: (store, { data: { deleteItem } }) => {
          const { success } = deleteItem;

          if (!success) {
            return;
          }

          // Read the data from our cache for this query.
          const data = store.readQuery({
            query: GET_SALE_QUERY,
            variables: {
              id: saleId
            }
          });

          // Delete item to be deleted from items.
          let itemToBeDeleated = data.getSale.items.filter(
            item => item.id === id
          );

          let indexOfItemToBeDeleted = data.getSale.items.indexOf(
            itemToBeDeleated[0]
          );

          data.getSale.items.splice(indexOfItemToBeDeleted, 1);

          // Write our data back to the cache.
          store.writeQuery({ query: GET_SALE_QUERY, data });
        }
      })
      .then(res => {
        const { success, errors } = res.data.deleteItem;

        if (success) {
          this.props.addFlashMessage({
            type: "success",
            text: T.translate("sales.items.form.flash.success_delete", {
              name: name
            })
          });

          this.setState({
            itemToBeDeleated: {},
            openConfirmationModal: !this.state.openConfirmationModal
          });
        } else {
          let errorsList = {};
          errors.map(error => (errorsList[error.path] = error.message));

          this.setState({ errors: errorsList, isLoading: false });
        }
      })
      .catch(err => {
        this.props.addFlashMessage({
          type: "error",
          text: T.translate("sales.items.form.flash.error_delete", {
            name: name
          })
        });

        this.setState({
          errors: err,
          isLoading: false,
          openConfirmationModal: !this.state.openConfirmationModal
        });
      });
  }

  render() {
    const {
      newItem,
      editItem,
      openConfirmationModal,
      itemToBeDeleated
    } = this.state;

    const { items } = this.props;

    const itemsTotal = items
      .map(a => a.total)
      .reduce((a, b) => a + b, 0)
      .toFixed(2);

    const itemsList = items.map(item => (
      <ShowEditItemTr
        key={item.id}
        item={item}
        editItem={editItem}
        handleCancelEdit={this.handleCancelEdit.bind(this, item)}
        handleEditItemChange={this.handleEditItemChange}
        handleEditItemBlur={this.handleEditItemBlur.bind(this)}
        handleUpdate={this.handleUpdate.bind(this)}
        handleEdit={this.handleEdit.bind(this, item)}
        toggleConfirmationModal={this.toggleConfirmationModal.bind(this, item)}
      />
    ));

    return [
      <FormElement
        size="small"
        key="form"
        loading={newItem.isLoading || editItem.isRequired}
      >
        <Table basic="very" className="items">
          <thead>
            <tr>
              <th>{T.translate("sales.items.form.name")}</th>
              <th>{T.translate("sales.items.form.unit")}</th>
              <th>{T.translate("sales.items.form.quantity")}</th>
              <th>{T.translate("sales.items.form.unit_price")}</th>
              <th>{T.translate("sales.items.form.total")}</th>
              <th className="center aligned">
                {T.translate("sales.items.form.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length !== 0 && itemsList}

            <AddItemTr
              item={newItem}
              handleNewItemChange={this.handleNewItemChange}
              handleNewItemBlur={this.handleNewItemBlur.bind(this)}
              handleCreate={this.handleCreate.bind(this)}
            />

            <tr>
              <td colSpan="3" />
              <td>
                <strong>{T.translate("sales.items.form.total")}</strong>
              </td>
              <td>
                <strong>
                  <GetCurrencySymbol />
                  {itemsTotal}
                </strong>
              </td>
              <td />
            </tr>
          </tbody>
        </Table>
      </FormElement>,
      <Modal
        key="modal"
        size="small"
        className="items"
        open={openConfirmationModal}
      >
        <Modal.Header>
          {T.translate("sales.items.form.confirmation_header")}
        </Modal.Header>
        <Modal.Content>
          <p className="red">
            {T.translate("sales.items.form.confirmation_msg")}
          </p>
        </Modal.Content>
        <Modal.Actions>
          <button className="ui button" onClick={this.toggleConfirmationModal}>
            {T.translate("sales.items.cancel")}
          </button>
          <button
            className="ui negative button"
            onClick={this.handleDelete.bind(this, itemToBeDeleated)}
          >
            {T.translate("sales.items.delete")}
          </button>
        </Modal.Actions>
      </Modal>
    ];
  }
}

Form.propTypes = {
  items: PropTypes.array.isRequired,
  saleId: PropTypes.number.isRequired,
  addFlashMessage: PropTypes.func.isRequired
};

const Mutations = compose(
  graphql(CREATE_ITEM_MUTATION, {
    name: "createItemMutation"
  }),
  graphql(UPDATE_ITEM_MUTATION, {
    name: "updateItemMutation"
  }),
  graphql(DELETE_ITEM_MUTATION, {
    name: "deleteItemMutation"
  })
)(Form);

export default connect(null, { addFlashMessage })(Mutations);
