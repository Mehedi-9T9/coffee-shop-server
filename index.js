

const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// Midleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('coffee shop server running')
})




// const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cd4uzfy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const uri = "mongodb+srv://<username>:<password>@cluster0.cd4uzfy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


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
        const database = client.db("coffeeDB");
        const coffeeCollection = database.collection("coffee");

        app.get('/addcoffee', async (req, res) => {
            const cursor = coffeeCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        // saves database

        app.post('/addcoffee', async (req, res) => {
            // console.log('url hiting');
            const addCoffeeData = req.body;
            // console.log(addCoffeeData);
            const result = await coffeeCollection.insertOne(addCoffeeData)
            res.send(result)
        })
        // updates apis
        app.get('/addcoffee/:id', async (req, res) => {
            const id = req.params.id
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.findOne(query)
            res.send(result)
        })

        app.put('/addcoffee/:id', async (req, res) => {
            const id = req.params.id
            const coffee = req.body
            console.log(coffee, id);
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateCoffee = {
                $set: {
                    name: coffee.name,
                    supplier: coffee.upplier,
                    chef: coffee.chef,
                    taste: coffee.taste,
                    category: coffee.category,
                    details: coffee.details,
                    photo: coffee.photo
                },
            };
            const result = await coffeeCollection.updateOne(filter, updateCoffee, options);
            res.send(result)
        })

        //delete apis
        app.delete('/addcoffee/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.deleteOne(query);
            res.send(result)
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




app.listen(port, () => {
    console.log(`The running port: ${port}`);
})