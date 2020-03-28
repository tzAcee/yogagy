var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data.db');

db.run(`CREATE TABLE IF NOT EXISTS dayTable(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day INTEGER UNIQUE,
    description TEXT,
    creationDate TEXT,
    uploadDate TEXT)
`);
db.run(`CREATE TABLE IF NOT EXISTS blobTable(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day INTEGER,
    video BLOB)
`);

exports.create_day = function create_day(req, res)
{
    db.run(`INSERT INTO dayTable(day,description, creationDate, uploadDate) VALUES(?, ?, ?, ?)
    `, [req.body.day, req.body.description, req.body.creationDate, req.body.uploadDate], function (err, s)
        {
            res.json();
    });
}

exports.set_blob = function set_blob(file)
{
    db.all(`SELECT * 
    FROM    dayTable`, function (err, row) {
            let max = 0;
            for (let i = 0; i < row.length; i++)
            {
                if (row.id > 0)
                    max = row.id;
            }
        db.run("INSERT INTO blobTable(video, day) VALUES(?, ?)", [file,max]);
    });

}

exports.get_days = function get_days(req, res)
{
    db.all("SELECT * from dayTable", function (err, row)
    {
        res.json(row);
    });

}

exports.get_dayById = function get_dayById(req, res)
{
    let return_json;
    db.run("SELECT * from dayTable WHERE day =?",req.body.day, function (err, row)
    {
        db.all('SELECT video from blobTable WHERE day =?', req.body.day, function (err, blobs)
        {
            return_json = { row, blobs };
            res.json(return_json);
        })
    })
}