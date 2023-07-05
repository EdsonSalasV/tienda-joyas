const express = require('express')
const app = express()
const router = require('./routes/routes')
/* const {  } = require('./consultas') */

const PORT = process.env.PORT || 3000;

app.use('/', router);


app.listen(PORT, () =>{
  console.log(`server on ${PORT}`)
})

/* app.get('/medicamentos', async (req, res) => {
  res.json()
}) */





