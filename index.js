var express = require("express");
var globalConf = require("./config");
var loader = require("./loader");

var app = new express();

app.use(express.static("./page/"));

// 每日一句
app.post("/editEveryDay", loader.get("/editEveryDay"));
app.get("/queryEveryDay", loader.get("/queryEveryDay"));
// 博客
app.post("/editBlog", loader.get("/editBlog"));
app.get("/queryBlogByPage", loader.get("/queryBlogByPage"));
// 翻页
app.get("/queryBlogCount", loader.get("/queryBlogCount"));
// 博客详情
app.get("/queryBlogById", loader.get("/queryBlogById"));
// 发表评论
app.get("/sendComment", loader.get("/sendComment"));
// 验证码
app.get("/queryRandomCode", loader.get("/queryRandomCode"));
// 获取评论
app.get("/queryCommentsByBlogId", loader.get("/queryCommentsByBlogId"));
// 获取评论总数
app.get("/queryCommentsTotalByBlogId", loader.get("/queryCommentsTotalByBlogId"));
// sitMap
app.get("/queryAllBlog", loader.get("/queryAllBlog"));
// 随即标签云
app.get("/queryAllTags", loader.get("/queryAllTags"));
// 最近热门
app.get("/queryBlogByViews", loader.get("/queryBlogByViews"));
// 最新评论
app.get("/queryNewComments", loader.get("/queryNewComments"));
// 标签筛选博客
app.get("/queryByTag", loader.get("/queryByTag"));
app.get("/queryByTagCount", loader.get("/queryByTagCount"));


app.listen(globalConf.port, function () {
    console.log("服务器已启动");
});
