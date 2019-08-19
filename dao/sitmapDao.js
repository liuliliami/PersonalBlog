var dbutil = require("./DBUtil");

function queryAllBlog (success) {
    var querySql = "select * from blog";
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

module.exports.queryAllBlog = queryAllBlog;