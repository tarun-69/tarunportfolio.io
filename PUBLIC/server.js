// server.js

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

// Connect to MongoDB (make sure you have MongoDB server running)
mongoose.connect('mongodb://localhost:27017/portfolio', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Create a Contact schema
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
});

// Create a Contact model
const Contact = mongoose.model('Contact', contactSchema);

app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Create a new contact instance
    const newContact = new Contact({ name, email, message });

    // Save the contact instance to the database
    newContact.save((err) => {
        if (err) {
            console.error('Error saving contact:', err);
            res.json({ success: false, message: 'Error saving contact' });
        } else {
            res.json({ success: true, message: 'Form submitted successfully!' });
        }
    });
});

app.get('/contact', (req, res) => {
    // Retrieve all contacts from the database
    Contact.find({}, (err, contacts) => {
        if (err) {
            console.error('Error retrieving contacts:', err);
            res.json([]);
        } else {
            res.json(contacts);
        }
    });
});

// File Upload Section
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ message: 'File uploaded successfully' });
});

// Serve uploaded files as static content
app.use('/uploads', express.static('uploads'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
