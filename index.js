const express = require('express')
var bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;


const password = 'kE4.xpV4U.3gHya'



const uri = "mongodb+srv://organicUser:kE4.xpV4U.3gHya@cluster0.sglfr.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})



client.connect(err => {
    const productCollection = client.db("organicdb").collection("products");

    app.get('/products', (req, res) => {
        productCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        productCollection.insertOne(product)
            .then(result => {
                console.log('data added successfully')
                res.send('success')
            })
    })

    app.delete('/delete/:id', (req, res) => {
        productCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                console.log(result)
            })
    })

    app.get('/product/:id', (req, res) => {
        productCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0])
            })

    })

    app.patch('/update/:id', (req, res) => {
        productCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: { price: req.body.price, quantity: req.body.quantity }
            })
            .then(result => {
                res.send(result.modifiedCount > 0)
            })
    })
});


app.listen(3000);