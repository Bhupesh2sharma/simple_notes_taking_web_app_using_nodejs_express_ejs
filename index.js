const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', function(req, res) {
    fs.readdir('./files', function(err, files) {
        if (err) {
            console.error(err);
            return res.status(500).send('Server Error');
        }

        const tasks = files.map(file => {
            const filePath = path.join(__dirname, 'files', file);
            const content = fs.readFileSync(filePath, 'utf8');
            return { title: file.replace('.txt', ''), details: content };
        });

        res.render('index', { tasks: tasks });
    });
});

app.post('/create', function(req, res) {
    const fileName = req.body.title.split(' ').join('') + '.txt';
    const filePath = path.join(__dirname, 'files', fileName);
    fs.writeFile(filePath, req.body.details, function(err) {
        if (err) {
            console.error(err);
            return res.status(500).send('Server Error');
        }
        res.redirect('/');
    });
});

app.listen(3000, function() {
    console.log('Server is running on port 3000');
});
