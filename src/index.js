const express = require('express');
const cors = require('cors');
const appRouter = require('./routes');
require('dotenv').config();
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/', appRouter)

let port = process.env.PORT;
app.listen(port, () => console.log('SAS(Sample Auth Server) is running on port ' + port));