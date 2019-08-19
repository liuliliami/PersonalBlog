var blogDao = require("../dao/blogDao");
var tagsDao = require("../dao/tagsDao");
var tagBlogMappingDao = require("../dao/tagBlogMappingDao");
var sitmapDao = require("../dao/sitmapDao");
var timeUtil = require("../util/timeUtil");
var respUtil = require("../util/respUtil");
var url = require("url");

var path = new Map();

function queryAllTags (request, response) {
    tagsDao.queryAllTags(function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success","查询成功", result));
        response.end();
    })
}
path.set("/queryAllTags", queryAllTags);

function queryByTag (request, response) {
    var params = url.parse(request.url, true).query;
    tagsDao.queryTag(params.tag, function (result) {// 先找到 tag 名对应的 tagId
        if (result == null || result.length == 0){
            response.writeHead(200);
            response.write(respUtil.writeResult("success","查询成功", result));
            response.end();
        } else {
            // 根据 tagId 查对应博客的 blogId 数组
            tagBlogMappingDao.queryBlogIdByTag(result[0].id, parseInt(params.page), parseInt(params.pageSize), function (result) {
                var blogList = [];
                for (var i = 0; i < result.length; i ++){
                    blogDao.queryBlogById(parseInt(result[i].blog_id), function (result) {// 根据 blogId 查博客
                        blogList.push(result[0]);
                    })
                }
                isGetAllBlog(blogList, result.length, response);

            })
        }
    })
}
// 判断是否拿到了所有的博客
function isGetAllBlog (blogList, len, response) {
    if (blogList.length < len) {
        setTimeout(function () {
            isGetAllBlog(blogList, len, response)
        }, 10)
    } else {
        for (var i = 0; i < blogList.length; i ++) {
            // 过滤掉图片和标签
            blogList[i].content = blogList[i].content.replace(/<img[\w\W]*">/, "[图片]");
            blogList[i].content = blogList[i].content.replace(/<[\w\W]{1,5}>/g, "");
            // result[i].content = result[i].content.substring(0, 300);
        }
        response.writeHead(200);
        response.write(respUtil.writeResult("success","查询成功", blogList));
        response.end();
    }
}
path.set("/queryByTag", queryByTag);

function queryByTagCount (request, response) {
    var params = url.parse(request.url, true).query;
    tagsDao.queryTag(params.tag, function (result) {// 先找到 tag 名对应的 tagId
        tagBlogMappingDao.queryByTagCount(result[0], function (result) {//
            response.writeHead(200);
            response.write(respUtil.writeResult("success","查询成功", result));
            response.end();
        })
    })
}
path.set("/queryByTagCount", queryByTagCount);
module.exports.path = path;