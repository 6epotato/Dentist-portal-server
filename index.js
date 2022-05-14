const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { json } = require('express/lib/response');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000


// connecting middleware
app.use(cors())
app.use(express.json())

// connect database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.edmxj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try {
        await client.connect()
        const serviceCollection = client.db('doctors_portal').collection('services');
        const bookingCollection = client.db('doctors_portal').collection('bookings');

        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query)
            const service = await cursor.toArray();
            res.send(service);

        })

        /**
   * API Naming Convention
   * app.get('/booking') // get all bookings in this collection. or get more than one or by filter
   * app.get('/booking/:id') // get a specific booking 
   * app.post('/booking') // add a new booking
   * app.patch('/booking/:id) //
   * app.delete('/booking/:id) //
  */
        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const query = { treatment: booking.treatment, date: booking.date, patient: booking.patient };
            const exist = await bookingCollection.findOne(query)
            if (exist) {
                return res.send({ success: false, booking: exist })
            }
            const result = await bookingCollection.insertOne(booking);
            return res.send({ success: true, result });

        })


    }
    finally {

    }

}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hey Doc !')
})

app.listen(port, () => {
    console.log(` listening on port ${port}`)
})