const persianDate = require('persian-date');

const Todo = function Todo(id, title, tdate, done) {
    this.id = id;
    this.title = title;
    this.tdate = tdate;
    this.done = done;
};

Todo.prototype.getId = function () {
    return this.id
}

Todo.prototype.getTitle = function () {
    return this.title
}
Todo.prototype.getTdate = function () {
    return this.tdate
}
Todo.prototype.isDone = function () {
    return this.done
}

function getTodo(req) {
    var obj = req.body;
    var d = obj.tdate;
    if (d === undefined) {
        d = new persianDate(new Date()).format("YYYY/MM/DD");
    }
    return new Todo(null, obj.title, d, 0);
}
module.exports = {
    getTodo: getTodo
};
