const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const cors = require("cors");
const bodyParser = require("body-parser");
const { ObjectId } = require("mongodb");
const { MongoClient, ServerApiVersion } = require('mongodb');

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const uri = "mongodb+srv://dbuser2:SngIjoqllE9VLVYn@cluster0.zqjqpp2.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    console.log('database connected successfully')
});

const propertyCollection = client.db('allProperties').collection('properties');
const specialCategoryCollection = client.db('allProperties').collection('specialCategories');
const areaCollection = client.db('allProperties').collection('areas');
const postCollection = client.db('allProperties').collection('posts');
const feedbackCollection = client.db('allProperties').collection('feedbacks');
const admin = client.db('allProperties').collection('admin');
const userCollection = client.db('allProperties').collection('users');
const applicationCollection = client.db('allProperties').collection('applications');


//posting the properties
app.post('/addProperty', (req, res) => {
    const entry = req.body;
    console.log(entry);
    entry.status = 'Available';
    propertyCollection.insertOne(entry)
        .then((result) => {
            res.send(result.insertedCount > 0)
        })
})

//posting the  specialCategory
app.post('/addSpecialCategory', (req, res) => {
    const category = req.body;
    specialCategoryCollection.insertOne(category)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
})

//posting the admin
app.post('/addAdmin', (req, res) => {
    const category = req.body;
    admin.insertOne(category)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
})

//posting the area
app.post('/addArea', (req, res) => {
    const category = req.body;
    areaCollection.insertOne(category)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
})

//posting the post
app.post('/addPost', (req, res) => {
    const post = req.body;
    post.status = 'Available';
    postCollection.insertOne(post)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
})

// add the new application 
app.post('/addApplication', (req, res) => {
    const application = req.body;
    application.status = null;
    applicationCollection.insertOne(application)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
})

//posting the feedback
app.post('/addFeedback', (req, res) => {
    const category = req.body;
    feedbackCollection.insertOne(category)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
})

//post the users
app.post('/users', (req, res) => {
    const entry = req.body;
    console.log(entry);
    userCollection.insertOne(entry)
        .then((result) => {
            res.send(result.insertedCount > 0)
        })
})

//getting the admin 
app.get("/admin", (req, res) => {
    admin.find({}).toArray((err, documents) => {
        res.send(documents);
        // console.log(err);
    });
});

app.get("/applications", (req, res) => {
    applicationCollection.find({}).toArray((err, documents) => {
        res.send(documents);
        // console.log(err);
    });
});

//getting the properties
app.get("/allProperties", (req, res) => {
    propertyCollection.find({}).toArray((err, documents) => {
        res.send(documents);
        // console.log(err);
    });
});


//getting special categories
app.get('/allSpecialCategory', (req, res) => {
    specialCategoryCollection.find({}).toArray((err, documents) => {
        res.send(documents);
        // console.log(err);
    })
})

//getting the areas
app.get("/areas", (req, res) => {
    areaCollection.find({}).toArray((err, documents) => {
        res.send(documents);
        // console.log(err);
    });
});

app.get("/posts", (req, res) => {
    postCollection.find({}).toArray((err, documents) => {
        res.send(documents);
        // console.log(err);
    });
});

app.put("/posts/:postId/change-status", (req, res) => {
    const postId = req.params.postId
    const applicationId = req.body.applicationId
    console.log('🚀 index-164-> {postId, applicationId} =>', { postId, applicationId });
    postCollection.updateOne({ _id: ObjectId(postId) }, { $set: { status: "Not Available" } }, function (err, doc) {
        if (err) console.log(err)
        console.log('Post updated successfully')
    });
    applicationCollection.updateOne({ _id: ObjectId(applicationId) }, { $set: { status: "Approved" } }, function (err, doc) {
        if (err) console.log(err)
        res.send(doc)
    });
});

app.get("/feedbacks", (req, res) => {
    feedbackCollection.find({}).toArray((err, documents) => {
        res.send(documents);
        // console.log(err);
    });
});

// read specific area from database
app.get('/specificArea', (req, res) => {
    let queryEmail = req.query.email;
    console.log(queryEmail)
    postCollection.find({ email: queryEmail })
        .toArray((err, areas) => {
            res.send(areas);
        })
})

//get user
app.get('/specificUser', (req, res) => {
    let queryEmail = req.query.email;
    console.log(queryEmail)
    userCollection.find({ email: queryEmail })
        .toArray((err, areas) => {
            res.send(areas);
        })
})

//get individual specialCategory from database
app.get('/specialCategory/:specialCategoryId', (req, res) => {
    specialCategoryCollection.find({ _id: ObjectId(req.params.specialCategoryId) })
        .toArray((err, data) => {
            res.send(data[0]);
        })
})

//get individual area from database
app.get('/area/:areaId', (req, res) => {
    areaCollection.find({ _id: ObjectId(req.params.areaId) })
        .toArray((err, data) => {
            res.send(data[0]);
        })
})

// delete specific area from database
app.delete("/deleteArea/:id", (req, res) => {
    areaCollection.deleteOne({ _id: ObjectId(req.params.id) })
        .then(result => {
            // console.log(result.deletedCount)
            res.send(result.deletedCount > 0);

        })
})

// delete specific post from database
app.delete("/deletePost/:id", (req, res) => {
    postCollection.deleteOne({ _id: ObjectId(req.params.id) })
        .then(result => {
            // console.log(result.deletedCount)
            res.send(result.deletedCount > 0);

        })
})

app.listen(port, () => console.log(`server running on port ${port}`))