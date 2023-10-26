const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskTitle     : String,
  desc          : String,
  status        : Boolean,
}, 
  {
    timestamps: true, // This should be here
  });

const TestTask = mongoose.model('testTask', taskSchema);

module.exports = TestTask;