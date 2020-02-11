$(document).ready(function () {
  let connectId = sessionStorage.getItem("DBconnectId")
  let connectName = sessionStorage.getItem("DBconnectName")
  $("#listHeader").text(connectName)
  $("#connectId").val(connectId)
  $.ajax({
    type:'post',
    async:true,
    xhrFields:{withCredentials: true},
    crossDomain:true,
    url:'http://www.chenrong.xyz/dbuser/allusers',
    data:{"connectId":connectId},
    success:function (data) {
      let users = data.data
      let html = ''
      for(let i in users) {
        html += `
          <li class="list-group-item">
        <button type="button" class="btn btn-info btn-xs myedit" data-toggle="modal" data-target="#editDBuserModal">
          <span class="glyphicon glyphicon-pencil"></span>&nbsp;&nbsp;编辑
        </button>
        <button type="button" class="btn btn-info btn-xs mygrant">
          <span class="glyphicon glyphicon-ok-circle"></span>  权限
        </button>
        <button type="button" class="btn btn-info btn-xs mydel" data-toggle="modal" data-target="#deleteDBuserModal">
          <span class="glyphicon glyphicon-minus"></span>&nbsp;&nbsp;删除
        </button>
        <a>${users[i].user}@${users[i].host}</a>
      </li>
        `
      }
      $('#userUl').html(html)
    },
    error: function(xhr, err){
      console.log('异步请求登录API失败：')
      console.log(xhr)
      console.log(err)
    }
  })
})

//编辑用户按钮
$(document).on("click",".myedit",function () {
  let connectId = $("#connectId").val()
  let strarr = $(this).parent().find("a").text().split("@")
  let username = strarr[0]
  let host = strarr[1]
  $.ajax({
    type:'post',
    async:true,
    xhrFields:{withCredentials: true},
    crossDomain:true,
    url:'http://www.chenrong.xyz/dbuser/oneuser',
    data: {"connectId":connectId,"username":username,"host":host},
    success:function (data) {
      let user = data.data
      $("#Eusername").val(user.user)
      $("#Ehost").val(user.host)
      $("#Epassword").val(user.password)
    },
    error: function(xhr, err){
      console.log('异步请求登录API失败：')
      console.log(xhr)
      console.log(err)
    }
  })
})

//编辑用户确认按钮
$(document).ready(function () {
  $("#Ecomfirm").on("click",function () {
    let connectId = $("#connectId").val()
    let username = $("#Eusername").val()
    let host = $("#Ehost").val()
    let pwd = $("#Epwd").val()
    if(pwd == null || pwd == "" || typeof pwd == "undefined"){
      alert("密码不能为空")
    }else {
      $.ajax({
        type:'post',
        async:true,
        xhrFields:{withCredentials: true},
        crossDomain:true,
        url:'http://www.chenrong.xyz/dbuser/updatepwd',
        data: {"connectId":connectId,"username":username,"host":host, "pwd":pwd},
        success:function (data) {
          alert(data.data)
        },
        error: function(xhr, err){
          console.log('异步请求登录API失败：')
          console.log(xhr)
          console.log(err)
        }
      })
    }
  })
})

//添加用户确定按钮
$(document).ready(function () {
  $("#Acomfirm").on("click",function () {
    let connectId = $("#connectId").val()
    let username = $("#Ausername").val()
    let host = $("#Ahost").val()
    let pwd = $("#Apassword").val()
    let repwd = $("#Arepwd").val()
    $.ajax({
      type:'post',
      async:true,
      xhrFields:{withCredentials: true},
      crossDomain:true,
      url:'http://www.chenrong.xyz/dbuser/createuser',
      data: {"connectId":connectId,"username":username,"host":host,"pwd":pwd,"repwd":repwd},
      success:function (data) {
        alert(data.data)
        window.location.href="http://www.chenrong.xyz/DBuser/DBuserList.html"
      },
      error: function(xhr, err){
        console.log('异步请求登录API失败：')
        console.log(xhr)
        console.log(err)
      }
    })
  })
})

//删除按钮
$(document).on("click",".mydel",function () {
  let strarr = $(this).parent().find("a").text().split("@")
  let username = strarr[0]
  let host = strarr[1]
  $("#Dusername").val(username)
  $("#Dhost").val(host)
})

//删除确定
$(document).ready(function () {
  $("#btn-del").on("click",function () {
    let connectId = $("#connectId").val()
    let username = $("#Dusername").val()
    let host = $("#Dhost").val()

    $.ajax({
      type:'post',
      async:true,
      xhrFields:{withCredentials: true},
      crossDomain:true,
      url:'http://www.chenrong.xyz/dbuser/dropuser',
      data: {"connectId":connectId,"username":username,"host":host},
      success:function (data) {
        alert(data.data)
        window.location.href="http://www.chenrong.xyz/DBuser/DBuserList.html"
      },
      error: function(xhr, err){
        console.log('异步请求登录API失败：')
        console.log(xhr)
        console.log(err)
      }
    })
  })
})

//权限按钮，跳转权限页面
$(document).on("click",".mygrant",function () {
  let dbuser = $(this).parent().find("a").text()
  let connectId = $("#connectId").val()
  sessionStorage.setItem("DBconnectId",connectId)
  sessionStorage.setItem("dbuser",dbuser)
  window.open("http://www.chenrong.xyz/DBuser/EditDBuser.html")
})
/*
  $.ajax({
    type:'post',
    async:true,
    xhrFields:{withCredentials: true},
    crossDomain:true,
    url:'http://www.chenrong.xyz/dbuser/oneuser',
    data: {"connectId":connectId,"username":username,"host":host},
    success:function (data) {

    },
    error: function(xhr, err){
      console.log('异步请求登录API失败：')
      console.log(xhr)
      console.log(err)
    }
  })
* */
