//                       .::::.         |-------------|
//                     .::::::::.       ( I want you! )
//                    :::::::::::      _|-------------|
//                 ..:::::::::::'   _-`
//              '::::::::::::'
//                .::::::::::
//           '::::::::::::::..
//                ..::::::::::::.
//              ``::::::::::::::::
//               ::::``:::::::::'        .:::.
//              ::::'   ':::::'       .::::::::.
//            .::::'      ::::     .:::::::'::::.
//           .:::'       :::::  .:::::::::' ':::::.
//          .::'        :::::.:::::::::'      ':::::.
//         .::'         ::::::::::::::'         ``::::.
//     ...:::           ::::::::::::'              ``::.
//    ````':.          ':::::::::'                  ::::..
//                       '.:::::'                    ':'````..
//   ————————————————————————————————————————————————————————————
//                   女神保佑   代码无BUG
//

// 定义服务器的protocol、host, 统一使用basePath作为前缀，不然请求url多了，修改要炸
var protocol = "http://";
var host = "www.chenrong.xyz";
var basePath = protocol + host;

//taixiong
$(document).ready(function () {
  //为登录按钮添加监听事件
  $("#btLogin").click(function () {
    //读取表单的数据
    var uname = $("#uname").val();
    var upwd = $("#upwd").val();
    //异步提交数据给后台API
    if(uname===''||upwd===''){
      alert('用户名和密码不能为空！');
    }else {
      $.ajax({
        type:'post',
        async:true,
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        url:basePath+"/user/login",
        data:{"username":uname,"password":upwd},
        success:function (data,msg,xhr) {
          console.log('异步请求登录API成功：', data);
          if(data.code===200){
            $('#loginModal').modal('hide');
            window.location.reload();
            alert('登录'+data.status+'    欢迎'+data.data+'!')
          }else {
            alert(data.data)
          }
        },
        error: function(xhr, err){
          console.log('异步请求登录API失败：');
          console.log(xhr);
          console.log(err)
        }
      });
    }
  });

  //为注册按钮添加监听事件
  $("#btRegister").click(function () {
    //读取表单的数据
    var uname = $("#registerUname").val();
    var upwd = $("#registerPwd").val();
    var upwd1 = $("#registerPwd1").val();
    var email = $("#email").val();
    var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;

    if(uname===''||upwd===''){
      alert('用户名和密码不能为空！');
    }else if(upwd!==upwd1){
      alert('密码和再次输入密码不匹配，请重新输入！')
    }else {
      if(!reg.test(email)){
        alert("邮箱格式错误，请重新输入！")
      }else {
        $.ajax({
          type:'post',
          async:true,
          xhrFields:{withCredentials: true},
          crossDomain:true,
          url:basePath+"/user/register",
          data:{"username":uname,"password":upwd,"email":email},
          success:function (data,msg,xhr) {
            console.log('异步请求注册API成功：', data);
            if(data.code===200){
              $('#registerModal').modal('hide');
              alert('注册'+data.status+'   '+data.data+'!')
            }else {
              alert(data.data)
            }
          },
          error: function(xhr, err){
            console.log('异步请求注册API失败：');
            console.log(xhr);
            console.log(err)
          }
        })
      }
    }
  });

  //为获取邮箱验证码添加监听事件
  $("#verification").click(function () {
    var uname = $("#verUserName").val();
    $.ajax({
      type:'post',
      async:true,
      xhrFields:{withCredentials: true},
      crossDomain:true,
      url:basePath+"/user/generateCode",
      data:{"username":uname},
      success:function (data,msg,xhr) {
        console.log('异步请求生成邮件验证码API成功：', data);
        if(data.code===200){
          alert('验证码正在发送至'+data.data+'!')
        }else {
          alert(data.data)
        }
      },
      error: function(xhr, err){
        console.log('异步请求生成邮件验证码API失败：');
        console.log(xhr);
        console.log(err)
      }
    })

  });

  //为忘记密码添加监听事件
  $("#updatePasswordByCode").click(function () {
    var uname = $("#verUserName").val();
    var code = $("#code").val();
    var x = $("#restPassword").val();
    var y = $("#restPassword1").val();
    if(uname===''){
      alert('用户名不能为空！');
    }else if (x === ''){
      alert('新密码不能为空！');
    }else {
      if( x === y ){
        $.ajax({
          type:'post',
          async:false,
          xhrFields:{withCredentials: true},
          crossDomain:true,
          url:basePath+"/user/UpdatePasswordByCode",
          data:{"code":code,"restPassword":y},
          success:function (data,msg,xhr) {
            console.log('异步请求登录API成功：', data);
            if(data.code===200){
              $('#forgetPasswordModal').modal('hide');
              alert(data.data+'!')
            }else {
              alert(data.data)
            }
          },
          error: function(xhr, err){
            console.log('异步请求登录API失败：');
            console.log(xhr);
            console.log(err)
          }
        })
      }else {
        alert('新密码和原密码不匹配！')
      }
    }
  });

  //为退出按钮添加监听事件
  $("#btnLogoutConfirm").click(function () {
    $.ajax({
      type:'post',
      async:true,
      xhrFields:{withCredentials: true},
      crossDomain:true,
      url:basePath+"/user/logout",
      success:function (data,msg,xhr) {
        console.log('异步请求注销API成功',data);
        if(data.code===200){
          $('#logoutModal').modal('hide');
          window.location.reload()
        }
      },
      error:function (xhr,err) {
        console.log('异步请求注册API失败：');
        console.log(xhr);
        console.log(err)
      }
    })
  });

  //点击修改密码按钮隐藏个人中心模态框
  $("#btnUpdatePassword").click(function () {
    $('#userModal').modal('hide')
  });

  //个人中心的显示页面
  $("#pensonalCenter").click(function () {
    $.ajax({
      type:'get',
      async:true,
      xhrFields:{withCredentials: true},
      crossDomain:true,
      url:basePath+"/user/selectUserByUserId",
      success:function (data,msg,xhr) {
        console.log('异步请求查询用户API成功：', data);
        if(data.code===200){
          var result = data.data;
          var x = result.username;
          $("#userName").val(x);
          var y = result.email;
          $("#uesrEmail").val(y);
        }
      },
      error: function(xhr, err){
        console.log('异步请求查询用户API失败：');
        console.log(xhr);
        console.log(err)
      }
    })
  });

  //为修改密码添加监听事件
  $("#updatePassword").click(function () {
    var upwd = $("#oldPassword").val();
    var restpwd = $("#newPassword").val();
    if(upwd===''||restpwd===""){
      alert('原密码和新密码不能为空！');
    }else {
      $.ajax({
        type:'post',
        async:true,
        xhrFields:{withCredentials: true},
        crossDomain:true,
        url:basePath+"/user/update",
        data:{"password":upwd,"restPassword":restpwd},
        success:function (data,msg,xhr) {
          console.log('异步请求用户密码修改API成功：', data);
          if(data.code===200){
            alert(data.data+'!');
            $('#updataPasswordModal').modal('hide')
          }else {
            alert(data.data)
          }
        },
        error: function(xhr, err){
          console.log('异步请求用户密码修改API失败：');
          console.log(xhr);
          console.log(err)
        }
      })
    }
  });

  //刷新页面是判断是否处于登录状态
  $.ajax({
    type:'get',
    async:true,
    xhrFields:{withCredentials: true},
    crossDomain:true,
    url:basePath+"/user/selectUserByUserId",
    success:function (data,msg,xhr) {
      console.log('异步请求查询用户API成功：', data);
      if(data.code===200){
        $('#btnLogout').show();
        $('#btnLogin').hide();
        $('#btnRegister').hide();
        $('#btnUserManage').show();
        var result = data.data;
        $('#welcomeText').html('欢迎'+result.username+'!')
      }
    },
    error: function(xhr, err){
      console.log('异步请求查询用户API失败：');
      console.log(xhr);
      console.log(err)
    }
  });

});


// ChenRong
$(document).ready(function () {

  // 访问首页默认ajax请求连接的查询接口,刷新页面时也会访问
  $.ajax({
    type: 'get',
    async: false,
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true,
    url: basePath + "/connectInfo/selectByUserId",
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
            "<button type='button' class='btn btn-default btn-xs btn-create-database' data-toggle='modal' data-target='#newDatabaseModal'>" +
            "<span class='glyphicon glyphicon-plus'></span>  新建数据库" +
            "</button>" +
            "<button type='button' class='btn btn-default btn-xs btn-update' data-toggle='modal' data-target='#updateConnectModal' style='margin-left: 1%'>" +
            "<span class='glyphicon glyphicon-pencil'></span>  编辑连接" +
            "</button>" +
            "<button type='button' class='btn btn-default btn-xs btn-delete' data-toggle='modal' data-target='#deleteConnectModal' style='margin-left: 1%'>" +
            "<span class='glyphicon glyphicon-minus'></span>  删除连接" +
            "</button>" +
            // 定义折叠，关联collapse_i折叠内容
            "<button type='button' class='btn btn-default btn-xs btn-open' data-toggle='collapse' data-parent='#accordion' href='#collapse_" + sub.connectId + "' style='margin-left: 1%'>" +
            "<span id='openAndClose' class='glyphicon glyphicon-th-list'></span>  展开" +
            "</button>" +
            "</p>" +
            // 定义的折叠板
            "<div id='collapse_" + sub.connectId + "' class='panel-collapse collapse'>" +
            "<div class='panel-body'>" +
            "<ul class='list-group'>" +
/*            "<li class='list-group-item'>database1" +
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
            "</li>" +*/
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
                  url: basePath + "/connectInfo/insert",
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
                            "<button type='button' class='btn btn-default btn-xs btn-create-database' data-toggle='modal' data-target='#newDatabaseModal'>" +
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
                           /* "<li class='list-group-item'>database1" +
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
                            "</li>" +*/
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
           url: basePath + "/connectInfo/delete",
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
      url: basePath + "/connectInfo/update",
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

  // 新建数据库保存按钮
  $("#createDatabaseSave").on("click", function () {
       var connectId = $("#createDatabase").attr("value");
       var databaseName = $("#databaseName").val();
       var characterSetDatabase = $("#characterSet").val();
       var collationDatabase = $("#sortRuleSet").val();
       $.ajax({
            type: 'post',
            async: false,
            xhrFields: {withCredentials:true},
            crossDomain: true,
            url: basePath + "/database/createDateBase",
            data: {"connectId":connectId, "databaseName":databaseName, "characterSetDatabase":characterSetDatabase, "collationDatabase":collationDatabase},
            success: function (result) {
                    if(result.code == 200){
                         console.log("新建数据库成功");
                         var collapse =
                        "<li class='list-group-item' connectId='" + connectId + "'><span>" + databaseName + "</span>" +
                        "<button type='button' class='btn btn-info btn-xs pull-right' name='openDB'>" +
                        "<span class='glyphicon glyphicon-th-large'>&nbsp;打开</span>" +
                        "</button>" +
                        "<a class='pull-right'>&nbsp;&nbsp;</a>" +
                        "<button type='button' class='btn btn-info btn-xs pull-right delete-database' data-toggle='modal' data-target='#deleteDatabaseModal'>" +
                        "<span class='glyphicon glyphicon-minus'>&nbsp;删除数据库</span>" +
                        "</button>" +
                        "<a class='pull-right'>&nbsp;&nbsp;</a>" +
                        "<button type='button' class='btn btn-info btn-xs pull-right update-database' data-toggle='modal' data-target='#updateDatabaseModal'>" +
                        "<span class='glyphicon glyphicon-pencil'>&nbsp;编辑数据库</span>" +
                        "</button>" +
                        "</li>";
                         $(".panel-heading").each(function (index, item) {
                                if($(item).attr("data-connectId") == connectId){
                                     // 获取对应的ul标签对象
                                     var listGroup = $(item).children("div").children().children();
                                     $(listGroup).append(collapse);
                                }
                         });
                    }else{
                        console.log("新建数据库失败");
                    }
            },
            error: function () {
                 console.log("新建数据库失败");
            }
       });
       // 模态框关闭
       $("#newDatabaseModal").modal('hide');
  });

  // 编辑数据库保存按钮
  $("#update-database-save").on("click", function () {
        var connectId = $("#update-database-input").attr("value");
        var databaseName = $("#update-database-name").val();
        var characterSetDatabase = $("#update-database-character").val();
        var collationDatabase = $("#update-database-sortRule").val();
        // 更新数据库信息
        $.ajax({
           type: 'post',
           async: true,
           xhrFields: {withCredentials:true},
           crossDomain: true,
           url: basePath + "/database/updateDataBase",
           data: {"connectId":connectId, "databaseName":databaseName, "characterSetDatabase":characterSetDatabase, "collationDatabase":collationDatabase},
           success: function (result) {
                console.log(result.data);
           },
           error: function () {
                console.log("更新数据库属性失败")
           }
        });
        // 关闭模态框
        $("#updateDatabaseModal").modal('hide');
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
    // ajax请求连接的信息，填充到模态框中
    $.ajax({
        type: 'get',
        async: true,
        xhrFields: {withCredentials:true},
        crossDomain: true,
        url: basePath + "/connectInfo/selectByConnectId",
        data: {"connectId":connectId},
        success: function (result) {
              if(result.code == 200){
                  console.log("查询连接接口成功");
                  var connectInfo = result.data;
                  // 填充模态框内容
                  $("#updateConnectName").attr("value", connectInfo.connectName);
                  $("#updateConnectIP").attr("value", connectInfo.host);
                  $("#updateConnectPort").attr("value", connectInfo.port);
                  $("#updateConnectUsername").attr("value", connectInfo.username);
                  $("#updateConnectPassword").attr("value", connectInfo.password);
                  // 填充是否保存
              }else{
                  console.log("查询连接接口失败");
              }
        },
        error: function () {
            console.log("查询连接接口失败");
        }
    });
  });

  // 定义展开数据库按钮的点击事情
  $(document).on("click", ".btn-open", function () {
        var connectId = $(this).parents(".panel-heading").attr("data-connectId");
        // 折叠板 list-group
        var panel = $(this).parent().next().children().children();
        // 清空折叠板的内容
        panel.html("");
        // 请求数据库的查询接口
        $.ajax({
            type: 'get',
            async: true,
            xhrFields: {withCredentials:true},
            crossDomain: true,
            url: basePath + "/database/showDateBase",
            data: {"connectId":connectId},
            success: function (result) {
                   if(result.code == 200){
                      var arr = result.data;
                      $(arr).each(function (index, item) {
                        var collapse =
                        "<li class='list-group-item' connectId='" + connectId + "'><span>" + item + "</span>" +
                        "<button type='button' class='btn btn-info btn-xs pull-right' name='openDB'>" +
                        "<span class='glyphicon glyphicon-th-large'>&nbsp;打开</span>" +
                        "</button>" +
                        "<a class='pull-right'>&nbsp;&nbsp;</a>" +
                        "<button type='button' class='btn btn-info btn-xs pull-right delete-database' data-toggle='modal' data-target='#deleteDatabaseModal'>" +
                        "<span class='glyphicon glyphicon-minus'>&nbsp;删除数据库</span>" +
                        "</button>" +
                        "<a class='pull-right'>&nbsp;&nbsp;</a>" +
                        "<button type='button' class='btn btn-info btn-xs pull-right update-database' data-toggle='modal' data-target='#updateDatabaseModal'>" +
                        "<span class='glyphicon glyphicon-pencil'>&nbsp;编辑数据库</span>" +
                        "</button>" +
                        "</li>";
                         // 添加内容到折叠板里
                         panel.append(collapse);
                      });
                   }else{
                      console.log("查询数据库接口失败");
                   }
            },
            error: function () {
               console.log("查询数据库接口失败");
            }
        });
  });

  // 编辑数据库按钮的点击事件
  $(document).on("click", ".update-database", function () {
          var connectId = $(this).parent().attr("connectid");
          var databaseName = $(this).parent().children(":first").text();
          // 将connectId传递给模态框
          $("#update-database-input").attr("value", connectId);

          // 查询原来数据库的属性
          $.ajax({
             type: 'get',
             async: false,
             xhrFields: {withCredentials:true},
             crossDomain: true,
             cache: false, // 禁止使用缓存
             url: basePath + "/database/showProperty",
             data: {"connectId":connectId, "databaseName":databaseName},
             success: function (result) {
                    if(result.code == 200){
                        console.log("查询数据库属性成功");
                        var json = result.data;
                        $("#update-database-name").val(json.databaseName);
                        $("#update-database-character").val(json.characterSetDatabase);
                        $("#update-database-sortRule").val(json.collationDatabase);
                    }else{
                        console.log("查询数据库属性失败");
                    }
             },
             error: function () {
                   console.log("查询数据库属性失败");
             }
          });

         //查询字符集
         $.ajax({
           type:'get',
           async: true,
           xhrFields: {withCredentials:true},
           crossDomain: true,
           url: basePath + "/database/selectCharacterSet",
           data: {"connectId":connectId},
           success: function (result) {
            if(result.code == 200){
              console.log("查询字符集接口成功");
              var arr = result.data;
              $(arr).each(function (index, item) {
              var li = "<li><a>" + item + "</a></li>";
              $("#character-update").append(li);
             });
            }else{
              console.log("查询字符集接口失败");
             }
            },
            error: function () {
            console.log("查询字符集接口失败");
            }
        });

  });

  // 新建数据库按钮字符集查询
  $(document).on("click", ".btn-create-database", function () {
       var connectId = $(this).parents(".panel-heading").attr("data-connectId");
       $("#createDatabase").attr("value", connectId);

       //查询字符集
       $.ajax({
          type:'get',
          async: true,
          xhrFields: {withCredentials:true},
          crossDomain: true,
          url: basePath + "/database/selectCharacterSet",
          data: {"connectId":connectId},
          success: function (result) {
                if(result.code == 200){
                   console.log("查询字符集接口成功");
                   var arr = result.data;
                   $(arr).each(function (index, item) {
                       var li = "<li><a>" + item + "</a></li>";
                       $("#character").append(li);
                   });
                }else{
                   console.log("查询字符集接口失败");
                }
          },
          error: function () {
              console.log("查询字符集接口失败");
          }
       });
  });

  // 为character和sortRule的li添加点击监听事件
  $(document).on("click", "li", function () {
         // 新建数据库模块
         if(($(this).parent().attr("id") == "character") || ($(this).parent().attr("id") == "sortRule")) {
           var connectId = $("#createDatabase").attr("value");
           var father = $(this).parent();
           var characterSet = $(this).children().text();
           if (father.attr("id") == "character") {
             // 更新排序规则列表
             // 先清空ul
             $("#sortRule").html('');
             $("#sortRuleSet").val('');
             $.ajax({
               type: 'get',
               async: false,
               xhrFields: {withCredentials: true},
               crossDomain: true,
               url: basePath + "/database/selectCollations",
               data: {"connectId": connectId, "characterSet": characterSet},
               success: function (result) {
                 if (result.code == 200) {
                   var arr = result.data;
                   $(arr).each(function (index, item) {
                     var li = "<li><a>" + item + "</a></li>";
                     $("#sortRule").append(li);
                   });
                 } else {
                   console.log("查询排序规则失败");
                 }
               },
               error: function () {
                 console.log("查询排序规则失败");
               }
             });
           }
           if ((father.attr("id") == "character") || (father.attr("id") == "sortRule")) {
             father.parent().prev().val(characterSet);
           }
         }

         // 编辑数据库模块
    if(($(this).parent().attr("id") == "character-update") || ($(this).parent().attr("id") == "sortRule-update")) {
      var connectId = $("#update-database-input").attr("value");
      var father = $(this).parent();
      var characterSet = $(this).children().text();
      if (father.attr("id") == "character-update") {
        // 更新排序规则列表
        // 先清空ul
        $("#sortRule-update").html('');
        $("#update-database-sortRule").val('');
        $.ajax({
          type: 'get',
          async: false,
          xhrFields: {withCredentials: true},
          crossDomain: true,
          url: basePath + "/database/selectCollations",
          data: {"connectId": connectId, "characterSet": characterSet},
          success: function (result) {
            if (result.code == 200) {
              var arr = result.data;
              $(arr).each(function (index, item) {
                var li = "<li><a>" + item + "</a></li>";
                $("#sortRule-update").append(li);
              });
            } else {
              console.log("查询排序规则失败");
            }
          },
          error: function () {
            console.log("查询排序规则失败");
          }
        });
      }
      if ((father.attr("id") == "character-update") || (father.attr("id") == "sortRule-update")) {
           father.parent().prev().val(characterSet);
      }
    }
  });

  // 删除数据库按钮添加监听事件
  $(document).on("click", ".delete-database", function () {
         var father = $(this).parent();
         var connectId = $(father).attr("connectId");
         var databaseName = $(father).children(":first").text();
         $("#delete-database-connectId").attr("value", connectId);
         $("#delete-database-name").attr("value", databaseName);
         // 按钮未被点击
         $("#delete-database-confirm").attr("isClick", "false");
  });

  var jqObj;  // 全局变量，谨慎使用该变量，唯一识别打开模态框的事件
  // 打开删除数据库模态框触发的事件
  $("#deleteDatabaseModal").on('shown.bs.modal', function (event) {
    jqObj = $(event.relatedTarget);
  });

  // 模态框   确认删除数据库按钮的监听事件
  $("#delete-database-confirm").on("click", function () {
         var connectId = $("#delete-database-connectId").attr("value");
         var databaseName = $("#delete-database-name").attr("value");

    $.ajax({
      type: 'post',
      async: true,
      xhrFields: {withCredentials:true},
      crossDomain: true,
      url: basePath + "/database/deleteDateBase",
      data: {"connectId":connectId, "databaseName":databaseName},
      success: function (result) {
        if(result.code == 200){
          console.log("删除数据库成功");
          // 模态框的按钮确认被点击
          $("#delete-database-confirm").attr("isClick", "true");
        }else{
          console.log("删除数据库失败");
        }
      },
      error: function () {
        console.log("删除数据库失败");
      }
    });
        // 删除对应的li
        $(jqObj).parent().remove();
        // 关闭模态框
        $("#deleteDatabaseModal").modal('hide');
  });

  // 模态框   关闭新建数据库触发的事件
  $('#newDatabaseModal').on('hidden.bs.modal', function () {
        console.log("newDatabaseModal模态框关闭了");
        $("#databaseName").val("");
        $("#characterSet").val("");
        $("#sortRuleSet").val("");
  });

  // 模态框   关闭编辑数据库触发的事件
  $("#updateDatabaseModal").on('hidden.bs.modal', function () {
        console.log("updateDatabaseModal模态框关闭了");
        $("#update-database-name").val("");
        $("#update-database-character").val("");
        $("#update-database-sortRule").val("");
  });

});

//跳转到用户页面通过sessionStorage携带参数connectId
$(document).on("click",".toDBuser",function () {
  let connectId = $(this).next().val()
  let connectName = $(this).next().next().val()
  sessionStorage.setItem("DBconnectName",connectName)
  sessionStorage.setItem("DBconnectId",connectId)
})

//点击连接列表打开按钮跳转到showDatabase.html
$(document).on("click","button[name$='openDB']",function () {

  let li = $(this).parent()
  let connectId = li.attr("connectid")
  let database = li.children(":first").text()
  sessionStorage.setItem("connectId",connectId)
  sessionStorage.setItem("database",database)
  //TODO:发布前修改url
  window.open("database/showDatabase.html","_blank")
  // window.open("http://www.chenrong.xyz/database/showDatabase.html","_blank")
})

//点击导航用户事件，更新用户列表
$(document).on("click","#openDBuserUl",function () {

  $.ajax({
    type: 'get',
    async: false,
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true,
    url: basePath + "/connectInfo/selectByUserId",
    success: function (result) {
      if(result.code == 200) {
        var arr = result.data;
        //用户按钮下拉列表赋值
        let usersHtml = ''
        for(let i in arr){
          usersHtml += `
            <li>
              <a href="DBuser/DBuserList.html" target="_blank" class="toDBuser">
                ${arr[i].connectName}
              </a>
              <input type="text" hidden="hidden" value="${arr[i].connectId}">
              <input type="text" hidden="hidden" value="${arr[i].connectName}">
            </li>
          `
        }
        $("#DBuserUl").html(usersHtml)
      }else{
        alert(result.data);
      }
    },
    error: function () {
      alert("请求查询连接接口失败");
    }
  });

  // 在模态框出现后添加可拖拽功能
  $(document).on("show.bs.modal", ".modal", function() {
    // draggable 属性规定元素是否可拖动
    $(this).draggable({
      handle: ".modal-header", // 只能点击头部拖动
      cursor: 'move' //光标呈现为指示链接的指针（一只手）,
    });
    $(this).css("overflow", "hidden"); // 防止出现滚动条，出现的话，你会把滚动条一起拖着走的
  });

})
