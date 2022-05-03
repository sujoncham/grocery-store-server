const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zxfur.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const stockCollection = client.db("stockManagement").collection("grocery");
        const deliveredCollection = client.db("stockManagement").collection("deliver");

        //auth
        app.post('/login', (req, res)=>{
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, {
                expiresIn: '1d'
            });
            res.send({accessToken});
        })
    
            // get data from server 
        app.get('/inventory', async (req, res)=>{
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = stockCollection.find(query);
            let stocks;
            if(page || size){
                stocks = await cursor.skip(page*size).limit(size).toArray();
            } else{
                stocks = await cursor.toArray();
            }
            
            res.send(stocks);
        });

            // showing product by id 
        app.get('/inventory/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const stock = await stockCollection.findOne(query);
            res.send(stock);
        });

        // stock post 
        app.post('/inventory', async (req, res)=>{
            const newStock = req.body;
            const result = await stockCollection.insertOne(newStock);
            res.send(result);
        });

        //delete item stock
        app.delete('/inventory/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await stockCollection.deleteOne(query);
            res.send(result);
        });

        //update stock info
        app.put('/inventory/:id', async (req, res)=>{
            const id = req.params.id;
            const updateStock = req.body;
            const filterStock = {_id:ObjectId(id)};
            const optStock = {upsert:true};
            const stockDoc = {
                $set: {
                    title:updateStock.title,
                    price:updateStock.price,
                    stock:updateStock.stock,
                    dealer:updateStock.dealer,
                    img:updateStock.img,
                    descrip:updateStock.descrip,
                }
            };
            const result = await stockCollection.updateOne(filterStock, stockDoc, optStock);
            res.send(result);
        });

        // delivered collection api 
        app.post('/deliver', async (req, res)=>{
            const deliver = req.body;
            const result = await deliveredCollection.insertOne(deliver);
            res.send(result);
        });

        //deliver detail with email and product info
        app.get('/deliver', async (req, res)=>{
            const query = {};
            const cursor = deliveredCollection.find(query);
            const delivers = await cursor.toArray();
            res.send(delivers)
        })

        //pagination product count
        app.get('/productcount', async(req, res)=>{
            const query ={};
            const cursor = stockCollection.find(query);
            const count = await cursor.count();
            res.send({count})
        })

     



    } 
    finally{

    }
} 
run().catch(console.dir);


app.listen(port, ()=>{
    console.log("My port is", port);
})