const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Tracker = mongoose.model(
  "tracker",
  new Schema(
    {
      project:      { type: String, required: true, select: false },
      issue_title:  {type: String, required: true},
      issue_text:   {type: String, required: true},
      created_by:   {type: String, required: true},
      assigned_to:  {type: String},
      open:         {type: Boolean, default: true},
      status_text:  {type: String},
    },
    {
      timestamps: {
        createdAt: 'created_on',
        updatedAt: 'updated_on'
      },
      versionKey: false,
    }
  )
);

exports.Tracker = Tracker;