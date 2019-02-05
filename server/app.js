const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const db = require('./queries');
const path = require('path');
const _ = require('lodash');


const port = process.env.PORT || config.port;

const app = express();
app.listen(port);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'client')));

const validationMiddleware = function Middleware(req, res, next) {
    if (_.isEmpty(req.body.title)) {
        return res.status(422).send("عنوان نمی تواند خالی باشد");
    }
    return next();
};

app.get('/', (req, res, next) => {
    res.sendFile(path.join(
        __dirname, '..', 'client', 'views', 'index.html'));
});

app.get('/todos', db.getAllTodos)

app.get('/todos/:id', db.getSingleTodo)

app.post('/todos', [validationMiddleware, db.createTodo])

app.put('/todos/:id', db.updateTodo);

app.delete('/todos/:id', db.removeTodo)

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.code || 500)
            .json({
                status: 'error',
                message: err
            });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500)
        .json({
            status: 'error',
            message: err.message
        });
});
