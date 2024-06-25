require('dotenv').config();
const mongoose = require('mongoose');

console.log('MONGODB_URI:', process.env.MONGODB_URI); 

mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log('Connected to the database');
  })
  .catch((err) => console.log(err));