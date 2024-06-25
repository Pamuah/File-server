require('./config/db')
const app = require('express')();
const port=3000;

const bodyParser = require('express').json;
const UserRouter =require('./api/user');


app.use(bodyParser());
app.use('/user', UserRouter)



  app.listen(port, () => {
    console.log('Server is running on port 3000');
  });
  
