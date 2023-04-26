'use strict';
const Tracker = require("../models.js").Tracker;

module.exports = function (app) {
  function populate(source,fields, obj = {}) {    
    fields.forEach(field => {
      if (source[field]) {
        obj[field] = source[field]
      }
    })
    return obj
  }
  app.route('/api/issues/:project')

    .get(async (req, res) => {
      let query = populate(req.query, ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'open', 'created_on', 'updated_on'])
      query.project = req.params.project
      let result = await Tracker.find(query)
      res.send(result)
    })

    .post(async (req, res) => {
      if (req.body.assigned_to == null) req.body.assigned_to = ""
      if (req.body.status_text == null) req.body.status_text = ""
      req.body.project = req.params.project
      let tracker = new Tracker(req.body)
      try {
        let t = await tracker.save()
        return res.json(t)
      } catch (e) {
        if (e.message.includes("required")) {         
          res.send({ error: 'required field(s) missing' })
        } else {
          res.send({ error: 'error' })
        }
      }
    })

    .put(async (req, res) => {
      const { _id } = req.body
      if (!_id) { return res.send({ error: 'missing _id' }) }
      let body = populate(req.body,['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'open'])
      if (!Object.keys(body).length) { return res.send({ error: 'no update field(s) sent', '_id': _id }) }
      try {
        let doc = await Tracker.findById(_id)
        if(doc == null) {return res.send({ error: 'could not update', '_id': _id }) }
        await doc.save({new:true})
        res.send({ result: 'successfully updated', '_id': _id }) 
      } catch (error) {        
        res.send({ error: 'could not update', '_id': _id }) 
      }    
    })

    .delete(async (req, res) => {
      const {_id} = req.body
      if (!_id) { return res.send({ error: 'missing _id' }) }
      try {
        let doc = await Tracker.findByIdAndDelete(_id)
        if(doc == null) {return res.send({ error: 'could not delete', '_id': _id })} 
        res.send({ result: 'successfully deleted', '_id': _id })
      } catch (error) {
        res.send({ error: 'could not delete', '_id': _id })
      }
    });
};