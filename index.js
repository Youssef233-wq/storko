const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Authentication middleware
const authenticate = (req, res, next) => {
  const password = req.query.password;
  const deleteRoute = req.path.startsWith('/admin/delete/');
  if (deleteRoute || password === 'admin233@') {
    next();
  } else {
    res.status(404).send('Not Found');
  }
};

// Serve the upload form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submissions
app.post('/upload', upload.single('photo'), (req, res) => {
  // Get form data
  const name = req.body.name;
  const number = req.body.number;
  const email = req.body.email;
  const photo = req.file.filename;

  // Save data to file
  const order = { name, number, email, photo };
  fs.appendFile('orders.txt', JSON.stringify(order) + '\n', (err) => {
    if (err) throw err;
    console.log('Order saved to file');
  });

  res.send('Order submitted successfully');
});

// Serve the admin panel
app.get('/admin', authenticate, (req, res) => {
  // Read orders from file
  fs.readFile('orders.txt', (err, data) => {
    if (err) throw err;
    const orders = data.toString().split('\n');
    orders.pop();

    // Render orders as HTML
    let html = '<h1>Admin Panel</h1>';
    orders.forEach((order) => {
      const { name, number, email, photo } = JSON.parse(order);
      const photoPath = '/uploads/' + photo;
      html += `<div><img src="${photoPath}"><br>Name: ${name}<br>Number: ${number}<br>Email: ${email}<br><a href="/admin/delete/${photo}">Delete</a></div>`;
    });
    res.send(html);
  });
});

// Handle order deletion
app.get('/admin/delete/:photo', authenticate, (req, res) => {
  const photo = req.params.photo;

  // Remove order from file
  fs.readFile('orders.txt', (err, data) => {
    if (err) throw err;
    const orders = data.toString().split('\n');
    orders.pop();
    const filtered = orders.filter((order) => !order.includes(photo));
    fs.writeFile('orders.txt', filtered.join('\n'), (err) => {
      if (err) throw err;
      console.log(`Order ${photo} deleted`);
    });
  });

  res.redirect('/admin');
});

// Serve the upload form
app.get('/up', (req, res) => {
  res.sendFile(__dirname + '/upload.html');
});

// Serve static files
app.use('/uploads', express.static('uploads'));

// Start the server
const port = process.env.PORT | 3000;
app.listen(port, () => {
  console.log('Server started on port 3000');
});
