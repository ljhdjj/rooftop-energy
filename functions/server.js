// functions/test.js (Netlify Function for /test route)
const { MongoClient, ServerApiVersion } = require('mongodb');

exports.handler = async (event, context) => {
  const uri = process.env.MONGODB_URI; // Store connection string in Netlify environment variables

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "MongoDB connection successful!" }),
    };
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to connect to MongoDB" }),
    };
  } finally {
    await client.close();
  }
};


// functions/submit.js (Netlify Function for /submit route)
const { MongoClient, ServerApiVersion } = require('mongodb');

exports.handler = async (event, context) => {
  const uri = process.env.MONGODB_URI; // Store connection string in Netlify environment variables
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });


  const formData = JSON.parse(event.body); // Parse the request body

  if (!formData.name || !formData.phone) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: "Name and phone are required." }),
    };
  }

  try {
    await client.connect();
    const database = client.db("rooftop_energy");
    const collection = database.collection("leads");

    const result = await collection.insertOne(formData);
    console.log(`Document inserted with _id: ${result.insertedId}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Lead stored successfully" }),
    };
  } catch (error) {
    console.error("Error storing lead:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Error storing lead." }),
    };
  } finally {
    await client.close();
  }
};

