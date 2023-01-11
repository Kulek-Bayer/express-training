const PORT = 4200;
const FILE_PATH = './db.json';

const fs = require('fs');
const express = require('express');
// npm install body-parser
const bodyParser = require('body-parser');

// we can load json files like that - but it's global - once per runtime.
const mockData = require('./db.json');

const app = express();

// make app use bodyParser.json() in order to be able to read req.body
app.use(bodyParser.json());
// this is not really necessary here
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', (req, res) => {
    res.send("This is my test express app!");
});

app.get('/data', (req, res) => {
    res.send(mockData);
});

app.post('/data', (req, res) => {
    const data = req.body;
    console.log(data);
    res.send('OK');
});



function getFile() {
    // load file from disc - it's gonna be a raw version, just a long string or buffer
    const rawFile = fs.readFileSync(FILE_PATH);
    // parse rawFile to actuall JavaScript object
    const objectFromFile = JSON.parse(rawFile);
    // return it
    return objectFromFile

    // Or you could write it like that
    // return JSON.parse(fs.readFileSync(FILE_PATH))
}

function saveFile(objectToBeSaved) {
    // make object a string
    const rawFile = JSON.stringify(objectToBeSaved, null, 4); // second argument not necessary, third one "4" defines indentation for save file

    // write string to file
    // DANGER - this kind of save OVERRIDES the whole content of the file
    fs.writeFileSync(FILE_PATH, rawFile);

    return;

    // Or you could write it like that
    // return fs.writeFileSync(FILE_PATH, JSON.stringify(objectToBeSaved, null, 4));
}


app.get('/data-save', (req, res) => {
    const file = getFile();
    res.json(file);
});

app.post('/data-save', (req, res) => {
    // get object that was send by the user/frontend/whatever
    const newEntry = req.body;

    // get file
    const file = getFile();

    // modify file
    file.data.push(newEntry);

    // save file
    saveFile(file);

    res.send('OK');
});

app.listen(PORT, () => {
    console.log('Hello world!');
});