//初始化
$(document).ready(function () {
  let connectId = sessionStorage.getItem("connectId")
  let database = sessionStorage.getItem("database")
  $("#DBname").text(database)
  $("#connectId").val(connectId)
  $.ajax({
    type:'post',
    async:true,
    xhrFields:{withCredentials: true},
    crossDomain:true,
    url:'http://www.chenrong.xyz/tableinfo/showtables',
    data: {"connectId":connectId,"databaseName":database},
    success:function (data) {
      let tables = data.data
      let html = ''
      for(let i in tables){
        html += `
              <li class="list-group-item">
              <span>${tables[i]}</span>
              <button type="button" class="btn btn-info btn-xs pull-right" name="btn-del">
              <span class="glyphicon glyphicon-minus"> 删除</span>
              </button>
              <a class="pull-right">&nbsp;&nbsp;</a>
              <button type="button" class="btn btn-info btn-xs pull-right" name="btn-clean">
              <span class="glyphicon glyphicon-remove"> 清空</span>
                </button>
               <a class="pull-right">&nbsp;&nbsp;</a>
              <button type="button" class="btn btn-info btn-xs pull-right" name="btn-design">
                <span class="glyphicon glyphicon-pencil"> 设计</span>
                </button>
                 <a class="pull-right">&nbsp;&nbsp;</a>
               <button type="button" class="btn btn-info btn-xs pull-right" name="btn-open">
              <span class="glyphicon glyphicon-th-large"> 打开</span>
                </button>
               </li>
        `
      }
      $("#tableUl").html(html)
    },
    error: function(xhr, err){
      console.log('异步请求登录API失败：')
      console.log(xhr)
      console.log(err)
    }
  })

})


//删除表按钮
$(document).on("click","button[name$='btn-del']",function () {
  if(confirm("确定删除表吗？")) {
    let connectId = $("#connectId").val()
    let database = $("#DBname").text()
    let table = $(this).parent().children(":first").text()
    let li = $(this).parent()
    $.ajax({
      type:'post',
      async:true,
      xhrFields:{withCredentials: true},
      crossDomain:true,
      url:'http://www.chenrong.xyz/tableinfo/droptable',
      data: {"connectId":connectId,"database":database,"table":table},
      success:function (data) {
        alert(data.data)
        if(data.code == 200){
          li.remove()
        }
      },
      error: function(xhr, err){
        console.log('异步请求删除表API失败：')
        console.log(xhr)
        console.log(err)
      }
    })
  }
})

//清空表按钮
$(document).on("click","button[name$='btn-clean']",function () {
  if(confirm("确定删除表吗？")) {
    let connectId = $("#connectId").val()
    let database = $("#DBname").text()
    let table = $(this).parent().children(":first").text()
    $.ajax({
      type:'post',
      async:true,
      xhrFields:{withCredentials: true},
      crossDomain:true,
      url:'http://www.chenrong.xyz/tableinfo/truncatetable',
      data: {"connectId":connectId,"database":database,"table":table},
      success:function (data) {
        alert(data.data)
      },
      error: function(xhr, err){
        console.log('异步请求清空表API失败：')
        console.log(xhr)
        console.log(err)
      }
    })
  }
})

//新建表
$(document).on("click","#newTable",function () {
  alert("新建表")
})

//设计表
$(document).on("click","button[name$='btn-design']",function () {
  alert("design table")
  window.open('../table/designTable.html','_blank')
})

//打开表
$(document).on("click","button[name$='btn-open']",function () {
  alert("open table")
  window.open('../table/showTable.html','_blank')
})


/*
    $.ajax({
      type:'post',
      async:true,
      xhrFields:{withCredentials: true},
      crossDomain:true,
      url:'http://www.chenrong.xyz/tableinfo/droptable',
      data: {"connectId":connectId,"database":database,"table":table},
      success:function (data) {

      },
      error: function(xhr, err){
        console.log('异步请求登录API失败：')
        console.log(xhr)
        console.log(err)
      }
    })
* */
