var sendComment = new Vue({
    el: "#send_comment",
    data: {
        randomCodeImg: "",
        randomCodeText: ""
    },
    computed: {
        changeRandomCode: function (){
            return function () {
                axios({
                    methods: "get",
                    url: "/queryRandomCode"
                }).then(function (resp) {
                    sendComment.randomCodeImg = resp.data.data.data;
                    sendComment.randomCodeText = resp.data.data.text;
                })
            }
        },
        sendComment: function () {
            return function () {
                var blogId = -1;// 关于界面的 blogId 固定为-1

                var parentDom = document.getElementById("comment_reply");
                var parentNameDom = document.getElementById("comment_reply_name");
                var nameDom = document.getElementById("comment_name");
                var emailDom = document.getElementById("comment_email");
                var contentDom = document.getElementById("comment_content");
                var randomCodeTextDom = document.getElementById("comment_code");

                var parent = parentDom.value;
                var parentName = parentNameDom.value;
                var userName = nameDom.value;
                var email = emailDom.value;
                var comments = contentDom.value;
                if (this.randomCodeText == randomCodeTextDom.value){
                    axios({
                        method: "get",
                        url: "/sendComment?blogId=" + blogId + "&parent=" + parent + "&userName=" + userName + "&email=" + email + "&comments=" + comments + "&parentName=" + parentName,
                    }).then(function (resp) {
                        console.log(resp);
                    });
                    parentDom.value = "";
                    nameDom.value = "";
                    emailDom.value = "";
                    contentDom.value = "";
                    randomCodeTextDom.value = "";
                    alert("评论成功")
                } else {
                    alert("验证码错误")
                }

            }
        }
    },
    created: function () {
        this.changeRandomCode();
    }
});

var blogComments = new Vue({
    el: "#blog_comments",
    data: {
        total: 0,
        comments: [],
        options: "",
    },
    computed: {
        reply: function () {
            return function (commentId, userName) {
                document.getElementById("comment_reply").value = commentId;
                document.getElementById("comment_reply_name").value = userName;
                // 点击回复按钮，执行reply，跳转到 send_comment 处
                location.href = "#send_comment";
            }
        }
    },
    created: function () {
        var blogId = -1;// 关于界面的 blogId 固定为-1
        axios({
            methods: "get",
            url: "/queryCommentsByBlogId?blogId=" + blogId
        }).then(function (resp) {
            console.log(resp.data.data);
            var commentsList = resp.data.data;
            blogComments.comments = commentsList;
            // 回复时渲染 options
            for(var i = 0; i < commentsList.length; i ++) {
                if (commentsList[i].parent > -1){// 如果时回复，则 parent 值大于 -1
                    blogComments.options = "回复@" + commentsList[i].parent_name;
                }
            }
        });
        axios({
            methods: "get",
            url: "/queryCommentsTotalByBlogId?blogId=" + blogId
        }).then(function (resp) {
            blogComments.total = resp.data.data[0].count;
        })
    }
});