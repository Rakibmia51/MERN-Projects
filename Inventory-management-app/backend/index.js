const express = require('express')
const dbConnection = require('./db/connectin')
require('dotenv').config()
const cors = require('cors')
const authRoutes = require('./routes/auth')
const usersRoutes = require('./routes/users')


const app = express()
const port = process.env.PORT || 5000
dbConnection()
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)

app.get('/', (req, res) => {
  res.send('Inventory Management app server is runing')
})

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`)
})
