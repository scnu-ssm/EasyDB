//读取下拉菜单到input中
$(document).ready(function () {
  $("#character li").click(function () {
    var x = $(this).text();
    $("#characterSet").val(x);
  })
  $("#character1 li").click(function () {
    var x = $(this).text();
    $("#characterSet1").val(x);
  })
  $("#sortRule li").click(function () {
    var y = $(this).text();
    $("#sortRuleSet").val(y);
  })
  $("#sortRule1 li").click(function () {
    var y = $(this).text();
    $("#sortRuleSet1").val(y);
  })
})

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
      xhrFields:{withCredentials: true},
      crossDomain:true,
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
    })
  })
})

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
})

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
})

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
})

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

