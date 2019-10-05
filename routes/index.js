let express = require('express');
let createError = require('http-errors');
let handlebars = require('hbs');
let fs = require('fs');
let path = require('path');
let exec = require('child_process').exec;
let router = express.Router();

const isWin = process.platform === "win32";

handlebars.registerHelper('breaklines', function (text) {
    text = handlebars.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new handlebars.SafeString(text);
});

const CRITERIA = JSON.parse(fs.readFileSync("criteria.json"));
const STUDENTS = getDirectories("students");
const MARKS_FILE = "marks-Q4.txt"

function getDirectories(path) {
    let result = fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + '/' + file).isDirectory();
    });
    result.sort();
    return result;
}

function getFiles(path, ext) {
    let result = fs.readdirSync(path).filter(function (file) {
        return file.endsWith(ext);
    });
    result.sort();
    return result;
}

/* GET home page. */
router.get('/', function (req, res, next) {
    if (STUDENTS.length === 0) {
        next(createError(400, "No student files loaded"));
        return;
    }

    let id = req.query.id;
    if (id === undefined) {
        for (let i = 0; i < STUDENTS.length; i++) {
            if (fs.readFileSync(path.join(__dirname, "..", "students", STUDENTS[i], MARKS_FILE)).includes("?/")) {
                id = STUDENTS[i];
                break;
            }
        }
        if (id === undefined) {
            id = STUDENTS[0];
        }
    }

    if (!STUDENTS.includes(id)) {
        next(createError(400, "Student Not Found"));
        return;
    }

    let prevStudent = undefined;
    let nextStudent = undefined;
    let index = STUDENTS.indexOf(id);
    if (index > 0) {
        prevStudent = STUDENTS[index - 1];
    }
    if (index < STUDENTS.length - 1) {
        nextStudent = STUDENTS[index + 1];
    }

    let javaFiles = getFiles(path.join(__dirname, "..", "students", id), ".java");
    let pdfFiles = getFiles(path.join(__dirname, "..", "students", id), ".pdf");
    let allContent = [];

    for (let i = 0; i < javaFiles.length; i++) {
        let content = fs.readFileSync(path.join(__dirname, "..", "students", id, javaFiles[i]));
        allContent.push({"name": javaFiles[i], "content": content});
    }

    for (let i = 0; i < pdfFiles.length; i++) {
        allContent.push({"name": pdfFiles[i]});
    }

    let existingMarkFile = fs.readFileSync(path.join(__dirname, "..", "students", id, MARKS_FILE))
    let marked = !existingMarkFile.includes("?/");
    res.render('main', {
        title: 'Marking ' + id, id: id, criteria: CRITERIA, files: allContent, marked: marked,
        nextStudent: nextStudent, prevStudent: prevStudent
    });
});

router.post('/save', function (req, res, next) {
    let id = req.body["id"];
    let feedback = req.body["feedback"];

    fs.writeFileSync(path.join(__dirname, "..", "students", id, MARKS_FILE), feedback);
    res.send(true);
});

router.post('/open', function (req, res, next) {
    let cmd = "";
    if (isWin) {
        cmd = 'explorer students\\' + req.body["dir"];
    } else {
        cmd = 'open students/' + req.body["dir"];
    }
    let child = exec(cmd,
        (error, stdout, stderr) => {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
                res.send(false);
            } else {
                res.send(true);
            }
        });
});

module.exports = router;
