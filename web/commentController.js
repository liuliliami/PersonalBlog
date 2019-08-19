var blogDao = require("../dao/blogDao");
var tagsDao = require("../dao/tagsDao");
var tagBlogMappingDao = require("../dao/tagBlogMappingDao");
var commentDao = require("../dao/commentDao");
var timeUtil = require("../util/timeUtil");
var respUtil = require("../util/respUtil");
var captcha = require("svg-captcha");// 验证码
var url = require("url");

var path = new Map();

function sendComment(request, response) {
    var params = url.parse(request.url, true).query;
    commentDao.insertComment(params.blogId, parseInt(params.parent), params.parentName, params.userName, params.comments, params.email, timeUtil.getNow(), timeUtil.getNow(), function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "添加成功", null));
        response.end();
    });
}
path.set("/sendComment", sendComment);

// 验证码
function queryRandomCode (request, response) {
    var img = captcha.create({fontSize: 50, width: 100, height: 34});
    response.writeHead(200);
    response.write(respUtil.writeResult("success", "验证码请求成功", img));
    response.end();
}

path.set("/queryRandomCode", queryRandomCode);
// 获取评论
function queryCommentsByBlogId (request, response) {
    var parems = url.parse(request.url, true).query;
    commentDao.queryCommentsByBlogId(parems.blogId, function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "验证码请求成功", result));
        response.end();
    })
}
path.set("/queryCommentsByBlogId", queryCommentsByBlogId);
// 获取评论总数
function queryCommentsTotalByBlogId (request, response) {
    var parems = url.parse(request.url, true).query;
    commentDao.queryCommentsTotalByBlogId(parems.blogId, function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "请求成功", result));
        response.end();
    })
}
path.set("/queryCommentsTotalByBlogId", queryCommentsTotalByBlogId);
// 获取最新评论
function queryNewComments (request, response) {
    commentDao.queryNewComments(5, function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "请求成功", result));
        response.end();
    })
}
path.set("/queryNewComments", queryNewComments);


module.exports.path = path;