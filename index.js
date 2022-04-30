const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

// DB_USER=grocerywareHouse
// DB_PASS=WuNOE2DBHKd3exPo

app.get('/', (req, res)=>{
    res.send("Grocery ware house running");
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zxfur.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const stockCollection = client.db("stockManagement").collection("grocery");
    
            // get data from server 
        app.get('/inventory', async (req, res)=>{
            const query = {};
            const cursor = stockCollection.find(query);
            const stock = await cursor.toArray();
            res.send(stock);
        });

            // showing product by id 
        app.get('/inventory/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const stock = await stockCollection.findOne(query);
            res.send(stock);
        })

        // stock post 
        app.post('/inventory', async (req, res)=>{
            const newStock = req.body;
            const result = await stockCollection.insertOne(newStock);
            res.send(result);
        })



    } 
    finally{

    }
} 
run().catch(console.dir);


app.listen(port, ()=>{
    console.log("My port is", port);
})