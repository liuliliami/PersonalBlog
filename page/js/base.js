var randomTags = new Vue({
    el: "#random_tags",
    data: {
        tags: [],
    },
    computed: {
        randomColor: function () {
            return function () {
                var r = Math.random() * 255;
                var g = Math.random() * 255;
                var b = Math.random() * 255;
                return "rgb(" + r + ","  + g + "," + b + ")";
            }
        },
        randomSize: function () {
            return function () {
                var size = (Math.random() * 10 + 12) + "px";
                return size;
            }
        }
    },
    created: function () {
        axios({
            method: "get",
            url: "queryAllTags"
        }).then(function (resp) {
            console.log(resp.data.data);
            var randomResult = resp.data.data.sort(function () {
                return Math.random() - 0.5;
            });
            for (var i = 0; i < randomResult.length; i++) {
                var temp = {};
                temp.tag = randomResult[i].tag;
                temp.link = "/?tag=" + randomResult[i].tag;
                randomTags.tags.push(temp);
            }
        })
    }
});

var newHot = new Vue({
    el: "#new_hot",
    data: {
        titleList: []
    },
    computed: {

    },
    created: function () {
        axios({
            methods: "get",
            url: "/queryBlogByViews"
        }).then(function (resp) {
            for(var i = 0; i < resp.data.data.length; i ++){
                var temp = {};
                temp.title = resp.data.data[i].title;
                temp.link = "/blog_detail.html?blogId=" + resp.data.data[i].id;
                newHot.titleList.push(temp);
            }
        })
    }
});

var newComments = new Vue({
    el: "#new_comments",
    data: {
        commentList: []
    },
    computed: {

    },
    created: function () {
        axios({
            methods: "get",
            url: "/queryNewComments"
        }).then(function (resp) {
            for(var i = 0; i < resp.data.data.length; i ++){
                var temp = {};
                temp.name = resp.data.data[i].user_name;
                temp.date = resp.data.data[i].ctime;
                temp.comment = resp.data.data[i].comments;
                newComments.commentList.push(temp);
            }
        })
    }
});