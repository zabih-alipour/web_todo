const promise = require('bluebird');
const todo = require('./todo');
const config = require('config');


const options = {
    // Initialization Options
    promiseLib: promise
};

const pgp = require('pg-promise')(options);
const connectionString = process.env.DATABASE_URL || config.DATABASE_URL;
const db = pgp(connectionString);

// add query functions
function getAllTodos(req, res, next) {
    const status = req.query.status;
    const date = req.query.date;
    let query = 'select * from todo_tb ';

    const param = {};
    if ((date !== undefined && date !== '') || (status !== undefined && status !== '')) {
        query = query + ' where ';
        if (date !== undefined && date !== '') {
            query = query + ' tdate between  ${date1} and ${date2} ';
            var dates = date.split(',');
            param.date1 = dates[0];
            param.date2 = dates.length === 1 ? dates[0] : dates[1];
        }

        if (status !== undefined && status !== '') {
            if (Object.keys(param).length > 0) {
                query = query + ' and  ';
            }
            query = query + ' done in (${done})  ';
            param.done = status;
        }
    }
    db.any(query + 'order by id asc', param)
        .then(function (data) {
            res.status(200)
                .json({
                    data: data
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function getSingleTodo(req, res, next) {
    const todoID = parseInt(req.params.id);
    if (todoID === undefined ||
        todoID === "" ||
        isNaN(todoID) ||
        typeof (todoID) !== "number") {
        res.status(200)
            .json({
                status: 'Fail',
                error: 'شناسه اجباری میباشد'
            });
    } else {
        db.one('select * from todo_tb where id = $1', todoID)
            .then(function (data) {
                res.status(200)
                    .json({
                        status: 'success',
                        data: data,
                        message: 'Retrieved ONE todo'
                    });
            })
            .catch(function (err) {
                return next(err);
            });
    }
}

function createTodo(req, res, next) {
    db.none('insert into todo_tb(title, tdate, done)' +
            'values(${title}, ${tdate}, ${done})', todo.getTodo(req))
        .then(function () {
            res.status(200)
                .json({
                    message: req.body.title + ' با موفقیت ذخیره شد.'
                });
        })
        .catch(function (err) {
            return next(err);
        });
}

function updateTodo(req, res, next) {
    var todoID = parseInt(req.params.id);
    if (todoID === undefined ||
        todoID === "" ||
        isNaN(todoID) ||
        typeof (todoID) !== "number") {
        res.status(200)
            .json({
                status: 'Fail',
                message: 'شناسه اجباری میباشد'
            });
    } else {
        db.one('select * from todo_tb where id = $1', todoID)
            .then(function (data) {
                var title = req.body.title || data.title;
                var tdate = req.body.tdate || data.tdate;
                var done = req.body.done || data.done;
                db.none('update todo_tb set title=$1, tdate = $2, done = $3 where id= $4', [title, tdate, done, data.id])
                    .then(function () {
                        res.status(200)
                            .json({
                                message: title + ' با موفقیت ذخیره شد.'
                            });
                    })
                    .catch(function (err) {
                        return next(err);
                    });
            })
            .catch(function (err) {
                return next(err);
            });
    }
}

function removeTodo(req, res, next) {
    var todoID = parseInt(req.params.id);
    if (todoID === undefined ||
        todoID === "" ||
        isNaN(todoID) ||
        typeof (todoID) !== "number") {
        res.status(200)
            .json({
                status: 'Fail',
                message: 'شناسه اجباری میباشد'
            });
    } else {
        db.none('DELETE FROM todo_tb where id=($1)', [todoID])
            .then(function () {
                res.status(200)
                    .json({
                        message: 'رکورد مورد نظر با موفقیت حذف شد.'
                    });
            })
            .catch(function (err) {
                return next(err);
            });

    }
}

module.exports = {
    getAllTodos: getAllTodos,
    getSingleTodo: getSingleTodo,
    createTodo: createTodo,
    updateTodo: updateTodo,
    removeTodo: removeTodo
};
