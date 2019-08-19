var everyDay = new Vue({
    el: "#every_day",
    data: {
        content: ""
    },
    computed: {
        getContent: function () {
            return this.content;
        }
    },
    created: function () {
        // axios 请求数据，给 content 赋值
        axios({
            method: "get",
            url: "/queryEveryDay",
        }).then(function (resp) {
            everyDay.content = resp.data.data[0].content;
        }).catch(function (resp) {
            console.log("请求失败")
        })
    }
});

var articleList = new Vue({
        el: "#article_list",
        data: {
            page: 1,
            pageSize: 5,
            count: 0,
            pageNumList: [],
            articleList: [
                {
                    title: "",
                    content: "",
                    date: "",
                    views: "",
                    tags: "",
                    id: "",
                    link: ""
                }
            ]
        },
        computed: {
            getPage: function () {
                return function (page, pageSize){
                    // // 获取参数，看参数中有没有 tag
                    var sertchUrlParams = location.search.indexOf("?") > -1 ? location.search.split("?")[1].split("&") : "";
                    var tag = "";
                    for (var i = 0; i < sertchUrlParams.length; i++) {
                        if (sertchUrlParams[i].split("=")[0] == "tag") {
                            try {
                                tag = sertchUrlParams[i].split("=")[1];
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    }
                    if (tag == ""){// 如果 tag = ""，直接查询全部 blog 并分页渲染
                        axios({
                            method: "get",
                            url: "/queryBlogByPage?page=" + (page - 1) + "&pageSize=" + pageSize,
                        }).then(function (resp) {
                            var result = resp.data.data;
                            var list = [];
                            for (var i = 0; i < result.length; i ++) {
                                var temp = {};
                                temp.title = result[i].title;
                                temp.content = result[i].content;
                                temp.date = result[i].ctime;
                                temp.views = result[i].views;
                                temp.tags = result[i].tags;
                                temp.id = result[i].id;
                                temp.link = "/blog_detail.html?blogId=" + result[i].id;
                                list.push(temp);
                            }
                            articleList.articleList = list;
                            articleList.page = page;
                        }).catch(function (resp) {
                            console.log("请求失败")
                        });
                        axios({
                            method: "get",
                            url: "/queryBlogCount"
                        }).then(function(resp) {
                            articleList.count = resp.data.data[0].count;
                            articleList.generatePageTool;
                        });
                    } else {// 如果 tag 不为空，说明点击了随即标签云的标签，按标签渲染 blog 并分页渲染
                        axios({
                            method: "get",
                            url: "/queryByTag?page=" + (page - 1) + "&pageSize=" + pageSize + "&tag=" + tag
                        }).then(function (resp) {
                            var result = resp.data.data;
                            var list = [];
                            for (var i = 0; i < result.length; i ++) {
                                var temp = {};
                                temp.title = result[i].title;
                                temp.content = result[i].content;
                                temp.date = result[i].ctime;
                                temp.views = result[i].views;
                                temp.tags = result[i].tags;
                                temp.id = result[i].id;
                                temp.link = "/blog_detail.html?blogId=" + result[i].id;
                                list.push(temp);
                            }
                            articleList.articleList = list;
                            articleList.page = page;
                        }).catch(function (resp) {
                            console.log("请求失败")
                        });
                        axios({
                            method: "get",
                            url: "/queryByTagCount"
                        }).then(function(resp) {
                            articleList.count = resp.data.data[0].count;
                            articleList.generatePageTool;
                        });
                    }
                }
            },
            // 生成页码的函数
            generatePageTool: function (){
                var nowPage = this.page;
                var pageSize = this.pageSize;
                var totalCount = this.count;
                var result = [];
                result.push({text:"首页", page: 1});
                // 添加当前页的第前两页
                if (nowPage > 2) {
                    result.push({text: nowPage - 2, page:nowPage - 2});
                }
                // 添加当前页的第前一页
                if (nowPage > 1) {
                    result.push({text: nowPage - 1, page:nowPage - 1});
                }
                result.push({text: nowPage, page:nowPage});
                // 添加当前页的第后一页
                if ( nowPage + 1 <= Math.ceil(totalCount / pageSize) ) {
                    result.push({text:nowPage + 1, page: nowPage + 1});
                }
                // 添加当前页的第后两页
                if ( nowPage + 2 <= Math.ceil(totalCount / pageSize) ) {
                    result.push({text:nowPage + 2, page: nowPage + 2});
                }
                result.push({text:"尾页", page: Math.ceil(totalCount / pageSize)});
                this.pageNumList = result;
                return result;
            },
            jumpTo: function() {
                return function (page) {
                    this.getPage(page, this.pageSize);
                }
            },
        },
        created: function () {
            this.getPage(this.page, this.pageSize);
        }
    });