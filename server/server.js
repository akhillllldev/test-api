const express = require('express');
const path = require('path');
const app = express();
const multer = require('multer');

var fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        cb(null, true);
        console.log(file);
    }
});

function readFiles(dirname) {
    fs.readdir(dirname, function(err, filenames) {
        if (err) {
            return;
        }
        filenames.forEach(function(filename) {
            fs.readFile(dirname + '\\' + filename, 'utf-8', function(
                err,
                content
            ) {
                if (err) {
                    console.log(err);
                    return;
                }
                if (content.length < 0) {
                    fs.unlinkSync(dirname + '\\' + filename);
                } else {
                    return;
                }
            });
        });
    });
}

app.post('/', upload.single('file'), (err, req, res, next) => {
    const file = req.file;
    if (err) {
        return console.log(err);
    }
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
    }
    readFiles('./uploads');
    res.send(file);
});

app.listen(3000, console.log('Running on PORT 3000'));
