const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); 

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const notes = JSON.parse(data);
            const newNote = {
                title: req.body.title,
                text: req.body.text,
                id: uuidv4(),
            };

            notes.push(newNote);

            fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (err) => {
                if (err) throw err;
                res.status(200).json(newNote);
            });
        }
    });
});

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            let notes = JSON.parse(data);
            notes = notes.filter((note) => note.id !== req.params.id);

            fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (err) => {
                if (err) throw err;
                res.status(200).end();
            });
        }
    });
});



app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});


app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
});