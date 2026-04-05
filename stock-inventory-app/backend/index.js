
const express = require('express')
const cors = require("cors")
const dbConnection = require('./db/connection')
const authRoutes = require('./routes/auth')
const categoryRoutes = require('./routes/Category')
const supplierRoutes = require('./routes/Supplier')
const productsRoutes = require('./routes/Products')
const usersRoutes = require('./routes/user')
const orderRoutes = require('./routes/order')


require('dotenv').config();


const app = express()
dbConnection()
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/auth',authRoutes)
app.use('/api/category',categoryRoutes)
app.use('/api/supplier',supplierRoutes)
app.use('/api/products',productsRoutes)
app.use('/api/users',usersRoutes)
app.use('/api/order',orderRoutes)


app.listen(port, () => {

  console.log(`Inventory app listening on port http://localhost:${port}`)
})