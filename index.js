const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

// DB_USER=grocerywareHouse
// DB_PASS=WuNOE2DBHKd3exPo

app.get('/', (req, res)=>{
    res.send("Grocery ware house running");
})


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://grocerywareHouse:<password>@cluster0.zxfur.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  console.log("mongodb connected")
  // perform actions on the collection object
  client.close();
});


app.listen(port, ()=>{
    console.log("My port is", port);
})