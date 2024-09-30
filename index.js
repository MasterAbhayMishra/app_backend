const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./models/Users');
const rateLimit = require('express-rate-limit');
const app = express();

// Create a rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
});

app.use(limiter);
// Middleware
// app.use(cors());
app.use(
  cors({
    origin:[ "http://localhost:5173", "https://idyllic-lokum-36921d.netlify.app"],// Allow requests from localhost:5173
    credentials: true, // Allow credentials
  })
);
app.use(express.json());

// Database connection
mongoose.connect(
  "mongodb+srv://abhayanshmishra1371:abhay03collage@collagemanagment.si3gi.mongodb.net/moviesapi"
);

// Routes

// GET ALL USER DATA
app.get('/', (req, res) => {
    UserModel.find({})
        .sort({ title: 1 })
        .then(users => res.json(users))
        .catch(err => res.status(500).json({ error: err.message }));
});

// GET SPECIFIC USER DATA
app.get('/getMovie/:id', (req, res) => {
    const id = req.params.id;
    UserModel.findById(id)
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

// CREATE A DOCUMENT IN COLLECTION
app.post("/createMovie", async (req, res) => {
    try {
        const newUser = await UserModel.create(req.body); // Create the user
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
//pagination
// Pagination Route with Total Count
app.post("/paginate", async (req, res) => {
    try {
        const page = parseInt(req.body.page) || 1;
        const sort = req.body.sort;
        const limit = 10;
        const skip = (page - 1) * limit;

        let sortOption = {};
        if (sort) {
            sortOption[sort] = 1; // Ascending order
        }

        const [movies, totalCount] = await Promise.all([
            UserModel.find().sort(sortOption).skip(skip).limit(limit),
            UserModel.countDocuments()
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).send({
            success: true,
            msg: "Movie Details",
            data: movies,
            totalPages: totalPages
        });
    } catch (error) {
        res.status(404).send({ success: false, msg: error.message });
    }
});

// UPDATE THE DOCUMENT
app.put('/UpdateMovie/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const updatedMovie = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedMovie) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(updatedMovie);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE THE DOCUMENT 
app.delete('/deleteMovie/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const deletedMovie = await UserModel.findByIdAndDelete(id);
        if (!deletedMovie) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(deletedMovie);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// RUN THE SERVER 
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
