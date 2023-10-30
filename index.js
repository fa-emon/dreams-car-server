const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const cors = require('cors')
const port = process.env.PORT || 5000;

// middleware 
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zdzdyrx.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const brandsCollection = client.db('dreamsCar').collection('allBrands');
        const ordersCollection = client.db('dreamsCar').collection('allOrders');


        // get all the brands..
        app.get('/allBrand', async (req, res) => {
            const result = await brandsCollection.find().toArray();
            res.send(result);
        })

        // get specific brands model by brandNames..
        app.get('/allBrand/:brand', async (req, res) => {
            const brandName = req.params.brand;
            const query = { brand: brandName };
            // const brandWiseCar = brandsCollection.filter(allCar => allCar.brand === brandName)
            const result = await brandsCollection.find(query).toArray();
            console.log(result)
            res.send(result);
        })

        // get specific car details..
        app.get('/allBrand/brand/:id', async(req, res) => {
            const id = req.params.id;
            const query = { brand_id: id };
            const result = await brandsCollection.findOne(query);
            res.send(result);
        })


        //Orders related api
        app.get('/orders', async(req, res) => {
            const result = await ordersCollection.find().toArray();
            res.send(result);
        })

        app.post('/orders', async(req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.log);

app.get('/', (req, res) => {
    res.send('Dreams Car!')
})

app.listen(port, () => {
    console.log(`your server is running on port ${port}`)
})