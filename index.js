require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const task = require('./models/testTask');

const PORT = 8080

const app = express();
app.use(cors());

mongoose.connect(process.env.DATABASE_CON, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// mongoose.connect('mongodb://localhost/testTaskBck', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
app.use(express.json());

app.post('/api/tasks', async (req, res) => {
    try {
      var taskReq = req.body;
      var addTask = new task({...taskReq, status : false})
      addTask.save().then(() => {
        return res.send('Task saved successfully!');
      }).catch((err) => {
        return res.send(`'Error saving Task:', ${err}`);
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/tasks', async (req, res) => {
    console.log('GET=>Tasks')
    try {
      const tasks = await task.find();
            
      const taskData = tasks.map(el =>{
        return el
      });
      
      res.json(taskData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.put('/api/tasks/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    const updatedData = req.body;
  
    try {
      // Use the TestTask model to find the task by its unique _id
      const result = await task.findByIdAndUpdate(taskId, updatedData, { new: true });

      if (!result) {
        return res.status(404).json({ error: 'Task not found' });
      }

      return res.json({ message: 'Task updated successfully', updatedData: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error', devErr: error });
    }
  });

  app.delete('/api/tasks/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
  
    try {
      // Use the TestTask model to find and remove the task by its unique _id
      task.findByIdAndRemove(taskId)
      .then((removedTask) => {
        if (!removedTask) {
          return res.status(404).json({ error: 'Task not found' });
        }
        return res.json({ message: 'Task removed successfully', removedTask });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error', devErr: error });
    }
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });