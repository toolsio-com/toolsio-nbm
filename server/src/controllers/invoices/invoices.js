import Invoice from '../../models/invoice'

export default {
  
  find: (req, callback) => {
    
    Invoice.find({}).select('deadline status customer sale project').populate([{path: 'sale', select: 'name total'}, {path: 'project', select: 'name total' }, {path: 'customer', select: 'name'}]).exec(function(err, invoices) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, invoices)
    })
  },

  findById: (req, callback) => {

    let id = req.params.id

    Invoice.findById(id).populate([{path: 'sale', populate: { path: 'items' }}, {path: 'project', populate: { path: 'tasks' }}, {path: 'customer'}]).exec(function(err, invoice) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, invoice)
    })
  },

  create: (req, callback) => {  

    let body = req.body

    Invoice.create(body, function(err, invoice) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, invoice)
    })
  },

  findByIdAndUpdate: (req, callback) => {

    let id = req.params.id
    let body = req.body

    Invoice.findByIdAndUpdate(id, body, {new: true}, function(err, invoice) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, invoice)
    })
  },

  findByIdAndRemove: (req, callback) => {

    let id = req.params.id

    Invoice.findByIdAndRemove(id, function(err, invoice) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, null)
    })
  }
}