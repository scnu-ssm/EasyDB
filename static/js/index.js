//读取下拉菜单到input中
$(document).ready(function () {
  $("#character li").click(function () {
    var x = $(this).text();
    $("#characterSet").val(x);
  });
  $("#character1 li").click(function () {
    var x = $(this).text();
    $("#characterSet1").val(x);
  });
  $("#sortRule li").click(function () {
    var y = $(this).text();
    $("#sortRuleSet").val(y);
  });
  $("#sortRule1 li").click(function () {
    var y = $(this).text();
    $("#sortRuleSet1").val(y);
   });
});


//为登录按钮添加监听事件
$(document).ready(function () {
  $("#btLogin").click(function () {
    //读取表单的数据
    var uname = $("#uname").val()
    var upwd = $("#upwd").val()
    //异步提交数据给后台API
    $.ajax({
      type:'post',
      async:true,
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      url:'http://www.chenrong.xyz/user/login',
      data:{"username":uname,"password":upwd},
      success:function (data,msg,xhr) {
        console.log('异步请求登录API成功：', data)
        if(data.code===200){
          $('#loginModal').modal('hide')
          $('#btnLogout').show()
          $('#btnLogin').hide()
          $('#btnRegister').hide()
          $('#btnUserManage').show()
          alert('登录'+data.status+'    欢迎'+data.data+'!')
          $('#welcomeText').html('欢迎'+data.data+'!')
        }else {
          alert(data.data)
        }
      },
      error: function(xhr, err){
        console.log('异步请求登录API失败：')
        console.log(xhr)
        console.log(err)
      }
    });
  });
});

//为注册按钮添加监听事件
$(document).ready(function () {
  $("#btRegister").click(function () {
    //读取表单的数据
    var uname = $("#registerUname").val()
    var upwd = $("#registerPwd").val()
    var upwd1 = $("#registerPwd1").val()
    var email = $("#email").val()
    var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;

    if(upwd!==upwd1 || upwd=="" || upwd1==""){
      alert("密码和再次输入密码为空或不匹配，请重新输入！")
    }else {
      if(!reg.test(email)){
        alert("邮箱格式错误，请重新输入！")

      }else {
        $.ajax({
          type:'post',
          async:true,
          xhrFields:{withCredentials: true},
          crossDomain:true,
          url:'http://www.chenrong.xyz/user/register',
          data:{"username":uname,"password":upwd,"email":email},
          success:function (data,msg,xhr) {
            console.log('异步请求注册API成功：', data)
            if(data.code===200){
              $('#registerModal').modal('hide')
              alert('注册'+data.status+'   '+data.data+'!')
            }else {
              alert(data.data)
            }
          },
          error: function(xhr, err){
            console.log('异步请求注册API失败：')
            console.log(xhr)
            console.log(err)
          }
        })
      }
    }
  })
});

//为获取邮箱验证码添加监听事件
$(document).ready(function () {
  $("#verification").click(function () {
    var uname = $("#verUserName").val()
    console.log(uname)
    $.ajax({
      type:'post',
      async:true,
      xhrFields:{withCredentials: true},
      crossDomain:true,
      url:'http://www.chenrong.xyz/user/generateCode',
      data:{"username":uname},
      success:function (data,msg,xhr) {
        console.log('异步请求生成邮件验证码API成功：', data)
        if(data.code===200){
          alert('验证码正在发送至'+data.data+'!')
        }else {
          alert(data.data)
        }
      },
      error: function(xhr, err){
        console.log('异步请求生成邮件验证码API失败：')
        console.log(xhr)
        console.log(err)
      }
    })

  })
});

//为忘记密码添加监听事件
$(document).ready(function () {
  $("#updatePasswordByCode").click(function () {
    var x = $("#code").val()
    var y = $("#restPassword").val()
    var z = $("#restPassword1").val()
    console.log(x,y,z)
    if(x==y&&x!==""||y!==""){
      $.ajax({
        type:'post',
        async:false,
        xhrFields:{withCredentials: true},
        crossDomain:true,
        url:'http://www.chenrong.xyz/user/UpdatePasswordByCode',
        data:{"code":x,"restPassword":y},
        success:function (data,msg,xhr) {
          console.log('异步请求登录API成功：', data)
          if(data.code===200){
            $('#forgetPasswordModal').modal('hide')
            alert(data.data+'!')
          }else {
            alert(data.data)
          }
        },
        error: function(xhr, err){
          console.log('异步请求登录API失败：')
          console.log(xhr)
          console.log(err)
        }
      })
    }else{
      alert("密码和再次输入密码为空或不匹配，请重新输入！")
    }
  })
});

//为退出按钮添加监听事件
$(document).ready(function () {
  $("#btnLogoutConfirm").click(function () {
    $.ajax({
      type:'post',
      async:true,
      xhrFields:{withCredentials: true},
      crossDomain:true,
      url:'http://www.chenrong.xyz/user/logout',
      success:function (data,msg,xhr) {
        console.log('异步请求注销API成功',data)
        if(data.code===200){
          $('#logoutModal').modal('hide')
          window.location.reload()
        }
      },
      error:function (xhr,err) {
        console.log('异步请求注册API失败：')
        console.log(xhr)
        console.log(err)
      }
    })
  })
})

//点击修改密码按钮隐藏个人中心模态框
$(document).ready(function () {
  $("#btnUpdatePassword").click(function () {
    $('#userModal').modal('hide')
  })
})

//个人中心的显示页面---待做
$(document).ready(function () {
  $("#pensonalCenter").click(function () {
    $.ajax({
      type:'get',
      async:true,
      xhrFields:{withCredentials: true},
      crossDomain:true,
      url:'http://www.chenrong.xyz/user/selectUserByUserId',
      success:function (data,msg,xhr) {
        console.log('异步请求查询用户API成功：', data)
        if(data.code===200){
          var result = data.data

          var x = result.username
          $("#userName").val(x);
          var y = result.email
          $("#uesrEmail").val(y);
        }
      },
      error: function(xhr, err){
        console.log('异步请求查询用户API失败：')
        console.log(xhr)
        console.log(err)
      }
    })
  })
})

//为修改密码添加监听事件
$(document).ready(function () {
  $("#updatePassword").click(function () {
    var upwd = $("#oldPassword").val()
    var restpwd = $("#newPassword").val()
    $.ajax({
      type:'post',
      async:true,
      xhrFields:{withCredentials: true},
      crossDomain:true,
      url:"http://www.chenrong.xyz/user/update",
      data:{"password":upwd,"restPassword":restpwd},
      success:function (data,msg,xhr) {
        console.log('异步请求用户密码修改API成功：', data)
        if(data.code===200){
          alert(data.data+'!')
          $('#updataPasswordModal').modal('hide')
        }else {
          alert(data.data)
        }
      },
      error: function(xhr, err){
        console.log('异步请求用户密码修改API失败：')
        console.log(xhr)
        console.log(err)
      }
    })
  })
})

// ChenRong
$(document).ready(function () {

  // 访问首页默认ajax请求连接的查询接口,刷新页面时也会访问
  $.ajax({
    type: 'get',
    async: true,
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true,
    url: 'http://www.chenrong.xyz/connectInfo/selectByUserId',
    success: function (result) {
      if(result.code == 200) {
        var arr = result.data;
        for (var i in arr) {
          var sub = arr[i];
          // 连接的html
          var connect =
            "<div class='panel panel-info'>" +
            "<div class='panel-heading' data-connectId=" + sub.connectId + ">" +
            "<h4 class='panel-title'>" +
            sub.connectName +
            "</h4>" +
            "<p>" +
            "<button type='button' class='btn btn-default btn-xs' data-toggle='modal' data-target='#newDatabaseModal'>" +
            "<span class='glyphicon glyphicon-plus'></span>  新建数据库" +
            "</button>" +
            "<button type='button' class='btn btn-default btn-xs btn-update' data-toggle='modal' data-target='#updateConnectModal' style='margin-left: 1%'>" +
            "<span class='glyphicon glyphicon-pencil'></span>  编辑连接" +
            "</button>" +
            "<button type='button' class='btn btn-default btn-xs btn-delete' data-toggle='modal' data-target='#deleteConnectModal' style='margin-left: 1%'>" +
            "<span class='glyphicon glyphicon-minus'></span>  删除连接" +
            "</button>" +
            // 定义折叠，关联collapse_i折叠内容
            "<button type='button' class='btn btn-default btn-xs btn-open' data-toggle='collapse' data-parent='#accordion' href='#collapse_" + i + "' style='margin-left: 1%'>" +
            "<span id='openAndClose' class='glyphicon glyphicon-th-list'></span>  展开" +
            "</button>" +
            "</p>" +
            // 定义的折叠板
            "<div id='collapse_" + i + "' class='panel-collapse collapse'>" +
            "<div class='panel-body'>" +
            "<ul class='list-group'>" +
            "<li class='list-group-item'>database1" +
            "<button type='button' class='btn btn-info btn-xs pull-right'>" +
            "<span class='glyphicon glyphicon-th-large'>&nbsp;打开</span>" +
            "</button>" +
            "<a class='pull-right'>&nbsp;&nbsp;</a>" +
            "<button type='button' class='btn btn-info btn-xs pull-right' data-toggle='modal' data-target='#deleteDatabaseModal'>" +
            "<span class='glyphicon glyphicon-minus'>&nbsp;删除数据库</span>" +
            "</button>" +
            "<a class='pull-right'>&nbsp;&nbsp;</a>" +
            "<button type='button' class='btn btn-info btn-xs pull-right' data-toggle='modal' data-target='#updateDatabaseModal'>" +
            "<span class='glyphicon glyphicon-pencil'>&nbsp;编辑数据库</span>" +
            "</button>" +
            "</li>" +
            "</ul>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>"
          $("#accordion").append(connect);
        }
      }else{
          alert(result.data);
      }
    },
    error: function () {
      alert("请求查询连接接口失败");
    }
  });

  // 新建连接
  $("#connectSave").click(function () {
          var connectName = $("#connectName").val();
          var connectIP = $("#connectIP").val();
          var connectPort = $("#connectPort").val();
          var connectUsername = $("#connectUsername").val();
          var passwd = $("#connectPassword").val();
          var repeatPasswd = $("#connectRepeatPassword").val();
          // 缺少是否保存
          var isSave = 0;
          $('#newConnectModal').modal('hide');
          if(passwd != repeatPasswd){
                 alert("两次输入的密码不一致");
          }else{
               $.ajax({
                  type: 'post',
                  async: true,
                  xhrFields: {
                   withCredentials: true
                  },
                  crossDomain: true,
                  url: "http://www.chenrong.xyz/connectInfo/insert",
                  data: {"connectName":connectName, "host":connectIP, "port":connectPort, "username":connectUsername, "password":passwd, "isSave":isSave},
                  success: function (result) {
                        if(result.code == 200){
                          var connectInfo = result.data;
                          var connectId = connectInfo.connectId;
                          var connect =
                            "<div class='panel panel-info'>" +
                            "<div class='panel-heading' data-connectId=" + connectId + ">" +
                            "<h4 class='panel-title'>" +
                            connectName +
                            "</h4>" +
                            "<p>" +
                            "<button type='button' class='btn btn-default btn-xs' data-toggle='modal' data-target='#newDatabaseModal'>" +
                            "<span class='glyphicon glyphicon-plus'></span>  新建数据库" +
                            "</button>" +
                            "<button type='button' class='btn btn-default btn-xs btn-update' data-toggle='modal' data-target='#updateConnectModal' style='margin-left: 1%'>" +
                            "<span class='glyphicon glyphicon-pencil'></span>  编辑连接" +
                            "</button>" +
                            "<button type='button' class='btn btn-default btn-xs btn-delete' data-toggle='modal' data-target='#deleteConnectModal' style='margin-left: 1%'>" +
                            "<span class='glyphicon glyphicon-minus'></span>  删除连接" +
                            "</button>" +
                            // 定义折叠，关联collapse_i折叠内容
                            "<button type='button' class='btn btn-default btn-xs btn-open' data-toggle='collapse' data-parent='#accordion' href='#collapse_" + connectId + "' style='margin-left: 1%'>" +
                            "<span id='openAndClose' class='glyphicon glyphicon-th-list'></span>  展开" +
                            "</button>" +
                            "</p>" +
                            // 定义的折叠板
                            "<div id='collapse_" + connectId + "' class='panel-collapse collapse'>" +
                            "<div class='panel-body'>" +
                            "<ul class='list-group'>" +
                            "<li class='list-group-item'>database1" +
                            "<button type='button' class='btn btn-info btn-xs pull-right'>" +
                            "<span class='glyphicon glyphicon-th-large'>&nbsp;打开</span>" +
                            "</button>" +
                            "<a class='pull-right'>&nbsp;&nbsp;</a>" +
                            "<button type='button' class='btn btn-info btn-xs pull-right' data-toggle='modal' data-target='#deleteDatabaseModal'>" +
                            "<span class='glyphicon glyphicon-minus'>&nbsp;删除数据库</span>" +
                            "</button>" +
                            "<a class='pull-right'>&nbsp;&nbsp;</a>" +
                            "<button type='button' class='btn btn-info btn-xs pull-right' data-toggle='modal' data-target='#updateDatabaseModal'>" +
                            "<span class='glyphicon glyphicon-pencil'>&nbsp;编辑数据库</span>" +
                            "</button>" +
                            "</li>" +
                            "</ul>" +
                            "</div>" +
                            "</div>" +
                            "</div>" +
                            "</div>";
                          $("#accordion").append(connect);
                        }else{
                            alert(result.data);
                        }
                  },
                  error: function () {
                    console.log("请求新建连接的接口失败");
                  }
               });
          }
  });

  // 删除连接
  $("#deleteConnect").on("click", function () {
       var connectId = $("#hideInput").attr("value");
       $.ajax({
           type:'post',
           async: true,
           xhrFields: {
             withCredentials: true
           },
           crossDomain: true,
           url: "http://www.chenrong.xyz/connectInfo/delete",
           data: {"connectId":connectId},
           success: function (result) {
                if(result.code == 200) {
                  console.log("删除连接成功");
                  var set = $(".panel-heading");
                  // 删除连接的html
                  for (var i = 0; i < set.length; i++) {
                    var sub = set[i];
                    if (connectId == $(sub).attr("data-connectId")) {
                      $(sub).parent().remove();
                    }
                  }
                }else{
                  console.log("删除连接失败");
                }
           },
           error: function () {
                console.log("删除连接失败");
           }
       });
       $("#deleteConnectModal").modal('hide');
  });

  // 更新连接
  $("#updateSave").on("click", function () {
    var connectId = $("#updateInput").attr("value");
    var connectName = $("#updateConnectName").val();
    var host = $("#updateConnectIP").val();
    var port = $("#updateConnectPort").val();
    var username = $("#updateConnectUsername").val();
    var password = $("#updateConnectPassword").val();
    // 漏做保存按钮
    var isSave = 0;
    $.ajax({
      type: 'post',
      async: true,
      xhrFields: {
         withCredentials: true
      },
      crossDomain: true,
      url: "http://www.chenrong.xyz/connectInfo/update",
      data: {"connectId":connectId, "connectName":connectName, "host":host, "port":port, "username":username, "password":password, "isSave":isSave},
      success: function (result) {
             if(result.code == 200){
                 console.log("更新连接成功");
                 var set = $(".panel-heading");
                 // 删除连接的html
                 for (var i = 0; i < set.length; i++) {
                   var sub = set[i];
                   if (connectId == $(sub).attr("data-connectId")) {
                      var arr = $(sub).children();
                      $(arr[0]).html(connectName);
                   }
                 }
             }else{
                 console.log("更新连接失败");
             }
      },
      error: function () {
        console.log("更新连接失败");
      }
    });
    $("#updateConnectModal").modal('hide');
  });

  // 定义删除连接按钮的点击事件
  $(document).on("click", ".btn-delete", function () {
     var father = $(this).parent().parent();
     var connectId = father.attr("data-connectId");
     $("#hideInput").attr("value", connectId);
  });

  // 定义更新连接按钮的点击事件
  $(document).on("click", ".btn-update", function () {
    var father = $(this).parent().parent();
    var connectId = father.attr("data-connectId");
    $("#updateInput").attr("value", connectId);
  });

  // 定义展开数据库按钮的点击事情
  $(document).on("click", ".btn-open", function () {
       var father = $(this).parent().parent();
       var collapse =
      "<div id='collapse_0' class='panel-collapse collapse'>" +
         "<div class='panel-body'>" +
             "<ul class='list-group'>" +
                 "<li class='list-group-item'>database1" +
                     "<button type='button' class='btn btn-info btn-xs pull-right'>" +
                     "<span class='glyphicon glyphicon-th-large'>&nbsp;打开</span>" +
                     "</button>" +
                     "<a class='pull-right'>&nbsp;&nbsp;</a>" +
                     "<button type='button' class='btn btn-info btn-xs pull-right' data-toggle='modal' data-target='#deleteDatabaseModal'>" +
                     "<span class='glyphicon glyphicon-minus'>&nbsp;删除数据库</span>" +
                     "</button>" +
                     "<a class='pull-right'>&nbsp;&nbsp;</a>" +
                     "<button type='button' class='btn btn-info btn-xs pull-right' data-toggle='modal' data-target='#updateDatabaseModal'>" +
                     "<span class='glyphicon glyphicon-pencil'>&nbsp;编辑数据库</span>" +
                     "</button>" +
                 "</li>" +
             "</ul>" +
         "</div>" +
      "</div>";
      father.append(collapse);
  });

});
