const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://journeyman:Raihan1234@cluster0.e4yec41.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const userCollection = client.db("journeyman").collection("users");
    // const users = database.collection("users");
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    app.get("/", (req, res) => {
      res.send("Hello Journeyman");
    });

    // Add new User
    app.post("/users", async (req, res) => {
      const user = req.body;
      // Check if user already exist
      const allUsers = await userCollection.find().toArray();
      const userExist = allUsers.find((slUser) => slUser.email === user.email);
      if (userExist) {
        return res.send("User already exist");
      }
      // if user already not exist then store in mongodb
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // Get all users
    app.get("/users", async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    });

    // Update user
    app.patch("/users/:id", async (req, res) => {
      const id = req.params;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const userDetails = req.body;
      const updateDoc = {
        $set: {
          username: userDetails.username,
          address: userDetails.address,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
