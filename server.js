const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;


app.use(cors({
    origin: 'http://localhost:8080'
})); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); 

// MongoDB Connection URI (encoded password)
const uri = "mongodb+srv://<ljhdjj>:" + encodeURIComponent("<8nnPL%Byfibt3K()") + "@<Test>.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Route handler:
app.post('/submit', (req, res) => {
    const formData = req.body;

    if (!formData.name ||!formData.phone) {
        return res.status(400).json({ success: false, message: "Name and phone/email are required." });
    }

    async function run() {
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
    }

    run().catch(console.dir);
});

app.use(express.static(path.join(__dirname, '.'))); 

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});