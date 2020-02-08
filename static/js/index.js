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

  //为登录按钮添加监听事件
  $("#btLogin").click(function () {
    //读取表单的数据
    var uname = $("#uname").val()
    var upwd = $("#upwd").val()
    console.log(uname,upwd)
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
        console.log('异步请求注册API成功：', data)
        if(data.code===200){
          alert('登录'+data.status+'    欢迎'+data.data+'!')
        }else {
          alert(data.data)
        }
      },
      error: function(xhr, err){
        console.log('异步请求注册API失败：')
        console.log(xhr)
        console.log(err)
      }
    });
  });
  // 访问首页默认ajax请求连接的查询接口
  $.ajax({
    type: 'get',
    async: true,
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true,
    url: 'http://localhost/connectInfo/selectByUserId',
    success: function (result) {
         var arr = result.data;
         for(var i in arr){
             var sub = arr[i];
             alert("connectId: " + sub.connectId);
             alert("connectName: " + sub.connectName);
             alert("host: " + sub.host);
             alert("username: " + sub.username);
             alert("password: " + sub.password);
             alert("isSave: " + sub.isSave);
         }

    },
    error: function () {
         alert("请求查询连接接口失败");
    }

  });

});



