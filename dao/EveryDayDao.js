var dbutil = require("./DBUtil");

function insertEveryDay(content, ctime, success) {
    var insertSql = "insert into every_day (`content`, `ctime`) values (?, ?)";
    var params = [content, ctime];
    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(insertSql, params, function (error, result) {
        if (error == null) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

function queryEveryDay(success) {
    // 根据 id 倒叙查询 every_day 并且只取一个，即取出最新的一条每日一句
    var querySql = "select * from every_day order by id desc limit 1;";
    var params = [];
    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql, params, function (error, result) {
        if (error == null) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}
module.exports.insertEveryDay = insertEveryDay;
module.exports.queryEveryDay = queryEveryDay;