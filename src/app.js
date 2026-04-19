require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDatabase = require('./config/database');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

connectDatabase();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
