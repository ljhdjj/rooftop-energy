const path = require('path');
const express = require('express');
const serverless = require("serverless-http");
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const uri = "mongodb+srv://hong126001:2zzkOhmpmYIlL0k0@rooftop-energy-backend.1g8oy.mongodb.net/?retryWrites=true&w=majority&appName=rooftop-energy-backend";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const upload = multer();

// Route handler:
app.get('/test', async (req, res) => {
    console.log('start');
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        res.json({ message: "MongoDB connection successful!" });
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        res.status(500).json({ error: "Failed to connect to MongoDB" });
    } finally {
        await client.close();
    }
});

app.post('/submit', upload.none(), async (req, res) => {
    const formData = req.body;
    if (!formData.name || !formData.phone) {
        return res.status(400).json({ success: false, message: "Name and phone are required." });
    }

    try {
        await client.connect();
        const database = client.db("rooftop_energy");
        const collection = database.collection("leads");

        const result = await collection.insertOne(formData);
        console.log(`Document inserted with _id: ${result.insertedId}`);

        res.json({ success: true, message: "Lead stored successfully" });

    } catch (error) {
        console.error("Error storing lead:", error);
        res.status(500).json({ success: false, message: "Error storing lead." });
    } finally {
        await client.close();
    }
});

app.use(express.static(path.join(__dirname, '..', 'public')));

// Log routes after they are defined (BEST PRACTICE for development)
app._router.stack.forEach(route => {
    if (route.route) {
        console.log(`${route.route.methods} ${route.route.path}`);
    }
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

// Important:  Wrap your Express app with serverless-http
module.exports.handler = serverless(app);