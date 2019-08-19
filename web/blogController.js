var blogDao = require("../dao/blogDao");
var tagsDao = require("../dao/tagsDao");
var tagBlogMappingDao = require("../dao/tagBlogMappingDao");
var sitmapDao = require("../dao/sitmapDao");
var timeUtil = require("../util/timeUtil");
var respUtil = require("../util/respUtil");
var url = require("url");

var path = new Map();

function editBlog(request, response) {
    var params = url.parse(request.url, true).query;
    var tags = params.tags.replace(/ /g, "").replace("，", ",");// 去掉 tags 中的空格，并把中文逗号换成英文逗号
    request.on("data", function (data) {// index.js app.post 的数据在 data 中
        blogDao.insertBlog(params.title, data.toString().trim(), 0, tags, timeUtil.getNow(), timeUtil.getNow(), function (result) {
            response.writeHead(200);
            response.write(respUtil.writeResult("success","添加成功", null));
            response.end();
            // result.insertId 获取本次插入内容的 id，本次插入的内容是 blog 内容，所以 result.insertId 代表 blogId
            var blogId = result.insertId;
            var tagList = tags.split(",");// 获取上面插入的标签数组
            for (var i = 0; i < tagList.length; i ++){
                if (tagList[i] == ""){
                    continue;
                }
                queryTag(tagList[i], blogId);
            }
        });
    })
}

function queryTag(tag, blogId){
    tagsDao.queryTag(tag, function (result) {
        if (result == null || result.length == 0){
            insertTag(tag, blogId);
        } else {
            // 注意这里的 result.id 和下面的 result.insertId 都是 tagId 的实参
            // 如果查询的标签存在于数据库中，tagId 就是 result.id
            // 如果查询的标签不在数据库中，tagId 就是 result.insertId
            insertTagBlogMapping(result.id, blogId);
        }
    });
}

function insertTag (tag, blogId){// 创建标签插入数据库，并插入标签-文章映射
    tagsDao.insertTag(tag, timeUtil.getNow(), timeUtil.getNow(), function (result) {
        // result.insertId 获取本次插入内容的 id，本次插入的内容是 tag，所以 result.insertId 代表 tagId
        insertTagBlogMapping(result.insertId, blogId);
    })
}

function insertTagBlogMapping (tagId, blogId){
    tagBlogMappingDao.insertTagBlogMapping(tagId, blogId, timeUtil.getNow(), timeUtil.getNow(), function (result){});
}
path.set("/editBlog", editBlog);


function queryBlogByPage (request, response) {
    var params = url.parse(request.url, true).query;
    blogDao.queryBlogByPage(parseInt(params.page), parseInt(params.pageSize), function (result) {
        for (var i = 0; i < result.length; i ++) {
            // 过滤掉图片和标签
            result[i].content = result[i].content.replace(/<img[\w\W]*">/, "[图片]");
            result[i].content = result[i].content.replace(/<[\w\W]{1,5}>/g, "");
            // result[i].content = result[i].content.substring(0, 300);
        }
        response.writeHead(200);
        response.write(respUtil.writeResult("success","查询成功", result));
        response.end();
    })
}
path.set("/queryBlogByPage", queryBlogByPage);

function queryBlogCount (request, response) {
    blogDao.queryBlogCount(function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success","查询成功", result));
        response.end();
    })
}
path.set("/queryBlogCount", queryBlogCount);

function queryBlogById (request, response) {
    var params = url.parse(request.url, true).query;
    var blogId = parseInt(params.blogId);
    blogDao.queryBlogById(blogId, function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success","查询成功", result));
        response.end();
        blogDao.addViews(blogId, function (result) {});
    })
}
path.set("/queryBlogById", queryBlogById);
// sitMap
function queryAllBlog (request, response) {
    sitmapDao.queryAllBlog(function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success","查询成功", result));
        response.end();
    })
}
path.set("/queryAllBlog", queryAllBlog);
// 最近热门
function queryBlogByViews (request, response) {
    blogDao.queryBlogByViews(5, function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success","查询成功", result));
        response.end();
    })
}
path.set("/queryBlogByViews", queryBlogByViews);


module.exports.path = path;