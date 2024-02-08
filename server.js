process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION!!! Shutting Down...');
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!!!');
  console.log(err);
  process.exit(1);
});



const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './starter/config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
mongoose.connect(DB, {}).then(() => {
  console.log('DB connection successful');
});

const app = require('./app');
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server Started on port ${port}`);
});

