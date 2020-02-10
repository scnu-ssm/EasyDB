//初始化页面
$(document).ready(function () {
  let connectId = sessionStorage.getItem("DBconnectId")
  let dbuser = sessionStorage.getItem("dbuser")
  $("#connectId").val(connectId)
  $("#h-DBuser").text(dbuser)
  let arr = dbuser.split("@")
  let username = arr[0]
  let host = arr[1]

  //获取权限表数据
  $.ajax({
    type:'post',
    async:true,
    xhrFields:{withCredentials: true},
    crossDomain:true,
    url:'http://www.chenrong.xyz/dbuser/showprivs',
    data: {"connectId":connectId,"username":username,"host":host},
    success:function (data) {
      let grants = data.data
      let html = ''
      for(let i in grants){
        let grant = grants[i]
        html += `
        <tr>
        <td name="database">${grant.database}</td>
        <td name="table">${grant.table}</td>
        <td name="grant">${grant.privs}</td>
        <td>
          <button class="btn-danger btn-xs" style="font-size: 10px">
            <span class="glyphicon glyphicon-remove"></span>
          </button>
        </td>
      </tr>
        `
      }
      $("#myTbody").html(html)
    },
    error: function(xhr, err){
      console.log('异步请求登录API失败：')
      console.log(xhr)
      console.log(err)
    }
  })

  //获取数据库列表
  $.ajax({
    type:'post',
    async:true,
    xhrFields:{withCredentials: true},
    crossDomain:true,
    url:'http://www.chenrong.xyz/database/showDateBase',
    data: {"connectId":connectId},
    success:function (data) {
      let databases = data.data
      let html ='<option selected="selected"></option>'
      for(let i in databases){
        html += `<option>${databases[i]}</option>`
      }
      $("#addGrant-db").html(html)
      $("#delGrant-db").html(html)
    },
    error: function(xhr, err){
      console.log('异步请求登录API失败：')
      console.log(xhr)
      console.log(err)
    }
  })

  //添加权限数据库select被选中，加载数据库表
  $("#addGrant-db").on("change",function () {
    let databaseName = $("#addGrant-db option:selected").text()
    $.ajax({
      type:'post',
      async:true,
      xhrFields:{withCredentials: true},
      crossDomain:true,
      url:'http://www.chenrong.xyz/tableinfo/showtables',
      data: {"connectId":connectId,"databaseName":databaseName},
      success:function (data) {
        let tables = data.data
        let html = '<option selected="selected">*</option>'
        for(let i in tables){
          html += `<option>${tables[i]}</option>`
        }
        $("#addGrant-tb").html(html)
      },
      error: function(xhr, err){
        console.log('异步请求登录API失败：')
        console.log(xhr)
        console.log(err)
      }
    })
  })

  //删除权限数据库select被选中，加载数据库表
  $("#delGrant-db").on("change",function () {
    let databaseName = $("#delGrant-db option:selected").text()
    $.ajax({
      type:'post',
      async:true,
      xhrFields:{withCredentials: true},
      crossDomain:true,
      url:'http://www.chenrong.xyz/tableinfo/showtables',
      data: {"connectId":connectId,"databaseName":databaseName},
      success:function (data) {
        let tables = data.data
        let html = '<option selected="selected">*</option>'
        for(let i in tables){
          html += `<option>${tables[i]}</option>`
        }
        $("#delGrant-tb").html(html)
      },
      error: function(xhr, err){
        console.log('异步请求登录API失败：')
        console.log(xhr)
        console.log(err)
      }
    })
  })

  //添加权限确认
  $("#addComfirm").on("click",function () {
    let privs = new Array()
    privs[0] = $("#addGrant-sl option:selected").text()
    let database = $("#addGrant-db option:selected").text()
    let table = $("#addGrant-tb option:selected").text()
    let privilege = {}
    privilege["connectId"] = connectId
    privilege["username"] = username
    privilege["host"] = host
    privilege["database"] = database
    privilege["table"] = table
    privilege["privs"] = privs
    let mydata = {"privilege":privilege}
    $.ajax({
      type:'post',
      dataType:'json',
      contentType:'application/json;charset=UTF-8',
      async:true,
      xhrFields:{withCredentials: true},
      crossDomain:true,
      url:'http://www.chenrong.xyz/dbuser/grant',
      data: JSON.stringify(mydata),
      success:function (data) {
        alert(data.data)
        window.location.href="http://www.chenrong.xyz/DBuser/EditDBuser.html"
      },
      error: function(xhr, err){
        console.log('异步请求登录API失败：')
        console.log(xhr)
        console.log(err)
      }
    })
  })

  //删除权限确认按钮
  $("#delComfirm").on("click",function () {
    let privs = new Array()
    privs[0] = $("#delGrant-sl option:selected").text()
    let database = $("#delGrant-db option:selected").text()
    let table = $("#delGrant-tb option:selected").text()
    let privilege = {}
    privilege["connectId"] = connectId
    privilege["username"] = username
    privilege["host"] = host
    privilege["database"] = database
    privilege["table"] = table
    privilege["privs"] = privs
    let mydata = {"privilege":privilege}
    $.ajax({
      type:'post',
      dataType:'json',
      contentType:'application/json;charset=UTF-8',
      async:true,
      xhrFields:{withCredentials: true},
      crossDomain:true,
      url:'http://www.chenrong.xyz/dbuser/revoke',
      data: JSON.stringify(mydata),
      success:function (data) {
        alert(data.data)
        window.location.href="http://www.chenrong.xyz/DBuser/EditDBuser.html"
      },
      error: function(xhr, err){
        console.log('异步请求登录API失败：')
        console.log(xhr)
        console.log(err)
      }
    })
  })

})

$(document).ready(function () {
  //删除行
  $("button.btn-danger").click(function () {
    alert("hello")
    window.confirm("是否删除")
    if(del){
      let num = $("tr").length
      if($("tr").length < 3){
        alert("至少保留一行")
      }
      else {
        $(this).parent().parent().remove()
      }
    }
  })

})

$(document).on("click",".btn-danger",function () {
  if(confirm("确认删除？")){
    let database1 = $(this).parent().parent().children("td[name$='database']").text()
    let table1 = $(this).parent().parent().children("td[name$='table']").text()
    let grants = $(this).parent().parent().children("td[name$='grant']").text()
    let dbLen = database1.length
    let tbLen = table1.length
    let database = database1.substring(1,dbLen-1)
    let table = table1.substring(1,tbLen-1)
    let connectId = $("#connectId").val()
    let dbuser = $("#h-DBuser").text()
    let arr = dbuser.split("@")
    let username = arr[0]
    let host = arr[1]
    let privilege = {}
    privilege["connectId"] = connectId
    privilege["username"] = username
    privilege["host"] = host
    privilege["database"] = database
    privilege["table"] = table
    privilege["privs"] = grants.split(",")
    let mydata = {"privilege":privilege}
    let tr = $(this).parent().parent()
    $.ajax({
      type:'post',
      dataType:'json',
      contentType:'application/json;charset=UTF-8',
      async:true,
      xhrFields:{withCredentials: true},
      crossDomain:true,
      url:'http://www.chenrong.xyz/dbuser/revoke',
      data: JSON.stringify(mydata),
      success:function (data) {
        alert(data.data)
        // window.location.href="http://localhost:63342/EasyDB/DBuser/EditDBuser.html"
        tr.remove()
      },
      error: function(xhr, err){
        console.log('异步请求登录API失败：')
        console.log(xhr)
        console.log(err)
      }
    })
  }
})
