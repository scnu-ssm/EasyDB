/**
 *        ┏┓　　┏┓+ +
 * 　 　　┏┛┻━━━┛┻┓ + +
 * 　　 　┃　　　　　　　┃ 　
 *  　　　┃　　　━　　　┃ ++ + + +
 * 　 　 ████━████ ┃+
 * 　 　　┃　　　　　　　┃ +
 * 　 　　┃　　　┻　　　┃
 * 　　 　┃　　　　　　　┃ + +
 * 　　 　┗━┓　　　┏━┛
 * 　　　　　┃　　　┃　　　　　　　　　　　
 * 　　　　　┃　　　┃ + + + +
 * 　　　　　┃　　　┃　　　　Codes are far away from bugs with the animal protecting　　　
 * 　　　　　┃　　　┃ + 　　　　　　神兽保佑，代码无BUG
 * 　　　　　┃　　　┃
 * 　　　　　┃　　　┃　　+　　　　　　　　　
 * 　　　　　┃　 　　┗━━━┓ + +
 * 　　　　　┃ 　　　　　　　┣┓
 * 　　　　　┃ 　　　　　　　┏┛
 * 　　　　　┗┓┓┏━┳┓┏┛ + + + +
 * 　　　　 　┃┫┫ ┃┫┫
 * 　　　　 　┗┻┛ ┗┻┛+ + + +
 *
 */
//初始化
$(document).ready(function () {
  //获取url参数
  let url = decodeURI(window.location.href)
  let urlarr1 = url.split("?con=")
  let urlarr2 = urlarr1[1].split("&db=")
  let connectId = urlarr2[0]
  let urlarr3 = urlarr2[1].split("&tb=")
  let database = urlarr3[0]
  let table = urlarr3[1]
  $("#connectId").val(connectId)
  $("#database").val(database)
  $("#table").val(table)

  //查询字段
  $.ajax({
    type:'post',
    async:true,
    xhrFields:{withCredentials: true},
    crossDomain:true,
    url:'http://www.chenrong.xyz/tableinfo/showtablemsg',
    data: {"connectId":connectId,"database":database,"table":table},
    success:function (data) {
      let fieldHtml = ''
      let allfields = data.data
      for(let i in allfields){
        let afield = allfields[i]
        let typeStr = afield.Type.split("(")
        let atype = typeStr[0]
        let alength = typeStr[1].substring(0,typeStr[1].length-1)
        fieldHtml += `<tr>
      <!-- 名 -->
      <td name="fieldName">${afield.Field}</td>
      <!-- 类型 -->
      <td>${atype}</td>
      <!-- 长度 -->
      <td>${alength}</td>
      <!-- 不是null -->
      <td><input type="checkbox" disabled="disabled" ${afield.Null=="NO"?'checked="checked"':null}/></td>
      <!-- 是主键 -->
      <td><input type="checkbox" name="primary" ${afield.Key=="PRI"?'checked="checked"':null}/></td>
      <!-- 删除-->
      <td>
        <button class="btn-danger btn-xs" name="delField">
          <span class="glyphicon glyphicon-remove"></span>
        </button>
      </td>
      <td>
        <button class="btn-xs btn-success" data-toggle="modal" data-target="#editFieldModal" name="editField">
          <span class="glyphicon glyphicon-edit"></span>
        </button>
      </td>
    </tr>`
      }
      $("#fieldTable").html(fieldHtml)
    },
    error: function(xhr, err){
      console.log('异步请求showtablemsg API失败：')
      console.log(xhr)
      console.log(err)
    }
  })

  //查询外键
  $.ajax({
    type:'post',
    async:true,
    xhrFields:{withCredentials: true},
    crossDomain:true,
    url:'http://www.chenrong.xyz/tableinfo/allfk',
    data: {"connectId":connectId,"database":database,"table":table},
    success:function (data) {
      let fkHtml = ''
      let allfk = data.data
      for(let j in allfk){
        fkHtml += `            <tr>
              <td name="fkName">${allfk[j].name}</td>
              <td>${allfk[j].field}</td>
              <td>${allfk[j].withDatabase}</td>
              <td>${allfk[j].withTable}</td>
              <td>${allfk[j].withField}</td>
              <td>${allfk[j].delete}</td>
              <td>${allfk[j].update}</td>
              <td>
                <button class="btn-xs btn-danger" name="delFk">
                  <span class="glyphicon glyphicon-remove"></span>
                </button>
              </td>
            </tr>`
      }
      $("#fkTable").html(fkHtml)
    },
    error: function(xhr, err){
      console.log('异步请求allfk API失败：')
      console.log(xhr)
      console.log(err)
    }
  })


})

//主键被选中
$(document).on("click","input:checkbox[name$='primary']",function () {
  let tr = $(this).parent().parent()
  let tds = tr.children()
  //字段名
  let fieldname = tds.eq(0).text()
  let connectId = $("#connectId").val()
  let database = $("#database").val()
  let table = $("#table").val()
  if($(this).is(":checked")){
    //选中
    let ckN = $("input:checkbox:checked[name='primary']").length
    //超过1个被选中，取消操作
    if(ckN > 1){
      $(this).prop("checked",false);
      alert("只能有一个主键");
    }
    else {
      //设置主键
      $.ajax({
        type:'post',
        async:true,
        xhrFields:{withCredentials: true},
        crossDomain:true,
        url:'http://www.chenrong.xyz/tableinfo/setpk',
        data: {"connectId":connectId,"database":database,"table":table,"field":fieldname},
        success:function (data) {
          if(data.code == 200){
            alert("设置主键"+fieldname+"成功")
          }else {
            alert(data.data)
          }
        },
        error: function(xhr, err){
          console.log('异步请求setpk API失败：')
          console.log(xhr)
          console.log(err)
        }
      })
    }
  }else {
    //取消选中，删除主键
    $.ajax({
      type:'post',
      async:true,
      xhrFields:{withCredentials: true},
      crossDomain:true,
      url:'http://www.chenrong.xyz/tableinfo/deletepk',
      data: {"connectId":connectId,"database":database,"table":table},
      success:function (data) {
        if(data.code == 200){
          alert("取消主键"+fieldname+"成功")
        }else {
          alert(data.data)
        }
      },
      error: function(xhr, err){
        console.log('异步请求deletepk API失败：')
        console.log(xhr)
        console.log(err)
      }
    })
  }
})

//删除字段
$(document).on("click","button[name$='delField']",function () {
  let tr = $(this).parent().parent()
  let tds = tr.children()
  //字段名
  let fieldname = tds.eq(0).text()
  let connectId = $("#connectId").val()
  let database = $("#database").val()
  let table = $("#table").val()
  if(confirm("确定删除字段"+fieldname+"？")) {
    $.ajax({
      type: 'post',
      async: true,
      xhrFields: {withCredentials: true},
      crossDomain: true,
      url: 'http://www.chenrong.xyz/tableinfo/dropfield',
      data: {"connectId": connectId, "database": database, "table": table, "field": fieldname},
      success: function (data) {
        if(data.code == 200){
          alert(data.data)
          tr.remove()
        }else {
          alert(data.data)
        }
      },
      error: function (xhr, err) {
        console.log('异步请求dropfield API失败：')
        console.log(xhr)
        console.log(err)
      }
    })
  }
})

//删除外键
$(document).on("click","button[name$='delFk']",function () {
  let tr = $(this).parent().parent()
  let tds = tr.children()
  let fname = tds.eq(0).text()
  let connectId = $("#connectId").val()
  let database = $("#database").val()
  let table = $("#table").val()
  if(confirm("确定删除外键"+fname+"吗？")) {
    $.ajax({
      type: 'post',
      async: true,
      xhrFields: {withCredentials: true},
      crossDomain: true,
      url: 'http://www.chenrong.xyz/tableinfo/deletefk',
      data: {"connectId": connectId, "database": database, "table": table, "fname": fname},
      success: function (data) {
        if (data.code == 200) {
          alert("删除外键" + fname + "成功")
          tr.remove()
        } else {
          alert(data.data)
        }
      },
      error: function (xhr, err) {
        console.log('异步请求deletefk API失败：')
        console.log(xhr)
        console.log(err)
      }
    })
  }
})

//添加字段按钮
$(document).on("click","#btn-addField",function () {
  let connectId = $("#connectId").val()
  let database = $("#database").val()
  let table = $("#table").val()
  let name = $("#m-name").val()
  let type = $("#m-type").find("option:selected").text()
  let length = $("#m-length").val().toString()
  let point = $("#m-point").val().toString()
  let notNull = $("#m-notNull").is(":checked")?"1":"0"

  if(name.indexOf(" ") != -1){
    alert("字段名不能包含空格")
    return;
  }
  if(typeof name == "undefined" || name == null || name == ""){
    alert("字段名不能为空")
    return;
  }

  //判断字段名是否已存在
  let fieldnameTds = $("#fieldTable").find("td[name$='fieldName']")
  for(let i = 0; i < fieldnameTds.length; i++){
    if(name == fieldnameTds.eq(i).text()){
      alert("字段名已存在！")
      return;
    }
  }

  if(typeof length == "undefined" || length == null || length == ""){
    alert("字段长度不能为空")
    return;
  }

  if(typeof point == "undefined" || point == null || point == ""){
    alert("小数点不能为空")
    return;
  }

  let field = {}
  field["name"] = name
  field["type"] = type
  field["length"] = length
  field["point"] = point
  field["notNull"] = notNull
  field["primary"] = "0"

  let mydata = {}
  mydata["connectId"] = connectId
  mydata["database"] = database
  mydata["table"] = table
  mydata["field"] = field
  console.log(mydata)

  $.ajax({
    type:'post',
    dataType:'json',
    contentType:'application/json;charset=UTF-8',
    async:true,
    xhrFields:{withCredentials: true},
    crossDomain:true,
    url:'http://www.chenrong.xyz/tableinfo/insertfield',
    data: JSON.stringify(mydata),
    success:function (data) {
      if(data.code == 200){
        alert("插入字段成功")
        html = `    <tr>
      <!-- 名 -->
      <td name="fieldName">${name}</td>
      <!-- 类型 -->
      <td>${type}</td>
      <!-- 长度 -->
      <td>${length}</td>
      <!-- 不是null -->
      <td><input type="checkbox" disabled="disabled" ${notNull=="1"?'checked="checked"':null}/></td>
      <!-- 是主键 -->
      <td><input type="checkbox" name="primary"/></td>
      <!-- 删除-->
      <td>
        <button class="btn-danger btn-xs" name="delField">
          <span class="glyphicon glyphicon-remove"></span>
        </button>
      </td>
      <td>
        <button class="btn-xs btn-success" data-toggle="modal" data-target="#editFieldModal">
          <span class="glyphicon glyphicon-edit"></span>
        </button>
      </td>
    </tr>`
        $("#fieldTable").append(html)
      }else {
        alert(data.data)
      }
    },
    error: function(xhr, err){
      console.log('异步请求createtable API失败：')
      console.log(xhr)
      console.log(err)
    }
  })

})

//添加外键按钮
$(document).on("click","#addFk",function () {
  let connectId = $("#connectId").val()
  //获取数据库列表用于外键参照模式选择
  $.ajax({
    type:'GET',
    async:true,
    xhrFields:{withCredentials: true},
    crossDomain:true,
    url:'http://www.chenrong.xyz/database/showDateBase',
    data:{"connectId":connectId},
    success:function (data) {
      let dblist = data.data
      let fkdatabaseHtml = `<option selected="selected"></option>`
      for(let i in dblist){
        fkdatabaseHtml += `<option>${dblist[i]}</option>`
      }
      $("#m-fdatabase").html(fkdatabaseHtml)
    },
    error: function(xhr, err){
      console.log('异步请求showDataBase API失败：')
      console.log(xhr)
      console.log(err)
    }
  })
})

//外键参考模式选中数据库，获取选中数据库所有表
$(document).on("change","#m-fdatabase",function () {
  let connectId = $("#connectId").val()
  let database = $("#m-fdatabase").find("option:selected").text()
  $("#m-fwfield").html("<option selected=\"selected\"></option>")
  //获取选中数据库的所有表
  $.ajax({
    type:'post',
    async:true,
    xhrFields:{withCredentials: true},
    crossDomain:true,
    url:'http://www.chenrong.xyz/tableinfo/showtables',
    data: {"connectId":connectId,"databaseName":database},
    success:function (data) {
      let tables = data.data
      let html = `<option selected="selected"></option>`
      for(let i in tables){
        html += `<option>${tables[i]}</option>`
      }
      $("#m-ftable").html(html)
    },
    error: function(xhr, err){
      console.log('异步请求showtables API失败：')
      console.log(xhr)
      console.log(err)
    }
  })
})

//外键参考表中选中表，获取表中所有字段名
$(document).on("change","#m-ftable",function () {
  let connectId = $("#connectId").val()
  let database = $("#m-fdatabase").find("option:selected").text()
  let table = $("#m-ftable").find("option:selected").text()
  //获取选中表的所有字段
  $.ajax({
    type:'post',
    async:true,
    xhrFields:{withCredentials: true},
    crossDomain:true,
    url:'http://www.chenrong.xyz/tableinfo/showcolumns',
    data: {"connectId":connectId,"database":database,"table":table},
    success:function (data) {
      let fields = data.data
      let html = `<option selected="selected"></option>`
      for(let i in fields){
        html += `<option>${fields[i]}</option>`
      }
      $("#m-fwfield").html(html)
    },
    error: function(xhr, err){
      console.log('异步请求showcolumns API失败：')
      console.log(xhr)
      console.log(err)
    }
  })
})

//添加外键模态框确定
$(document).on("click","#btn-addFK",function () {
  let connectId = $("#connectId").val()
  let database = $("#database").val()
  let table = $("#table").val()
  let name = $("#m-fname").val()
  let field = $("#m-ffield").val()
  let withDatabase = $("#m-fdatabase").find("option:selected").text()
  let withTable = $("#m-ftable").find("option:selected").text()
  let withField = $("#m-fwfield").find("option:selected").text()
  let fdelete = $("#m-fdelete").find("option:selected").text()
  let fupdate = $("#m-fupdate").find("option:selected").text()

  if(name.indexOf(" ") != -1){
    alert("外键名不能包含空格")
    return;
  }
  if(typeof name == "undefined" || name == null || name == ""){
    alert("外键名不能为空")
    return;
  }
  let fknameTds = $("#fkTable").find("td[name$='fkName']")
  for(let i = 0; i < fknameTds.length; i++){
    if(name == fknameTds.eq(i).text()){
      alert("外键名已存在")
      return;
    }
  }

  if(field.indexOf(" ") != -1){
    alert("外键字段不能包含空格")
    return;
  }
  if(typeof field == "undefined" || field == null || field == ""){
    alert("外键字段不能为空")
    return;
  }
  let fexited = true
  let fieldnameTds = $("#fieldTable").find("td[name$='fieldName']")
  for(let j = 0; j < fieldnameTds.length; j++){
    if(field == fieldnameTds.eq(j).text()){
      fexited = false
    }
  }
  if(fexited){
    alert("字段不存在")
    return;
  }
  if(withDatabase == null || withDatabase == "" || typeof withDatabase == "undefined"){
    alert("参考模式不能为空")
    return;
  }
  if(withTable == null || withTable == "" || typeof withTable == "undefined"){
    alert("参考表不能为空")
    return;
  }
  if(withField == null || withField == "" || typeof withField == "undefined"){
    alert("参考字段不能为空")
    return;
  }

  let mydata = {}
  let fk = {}
  mydata["connectId"] = connectId
  mydata["database"] = database
  mydata["table"] = table
  fk["name"] = name
  fk["field"] = field
  fk["withDatabase"] = withDatabase
  fk["withTable"] = withTable
  fk["withField"] = withField
  fk["delete"] = fdelete
  fk["update"] = fupdate
  mydata["fk"] = fk
  $.ajax({
    type:'post',
    dataType:'json',
    contentType:'application/json;charset=UTF-8',
    async:true,
    xhrFields:{withCredentials: true},
    crossDomain:true,
    url:'http://www.chenrong.xyz/tableinfo/insertfk',
    data: JSON.stringify(mydata),
    success:function (data) {
      if(data.code == 200){
        alert("添加外键"+name+"成功")
        let fkHtml =  `            <tr>
              <td name="fkName">${name}</td>
              <td>${field}</td>
              <td>${withDatabase}</td>
              <td>${withTable}</td>
              <td>${withField}</td>
              <td>${fdelete}</td>
              <td>${fupdate}</td>
              <td>
                <button class="btn-xs btn-danger" name="delFk">
                  <span class="glyphicon glyphicon-remove"></span>
                </button>
              </td>
            </tr>`
        $("#fkTable").append(fkHtml)
      }else {
        alert(data.data)
      }
    },
    error: function(xhr, err){
      console.log('异步请求createtable API失败：')
      console.log(xhr)
      console.log(err)
    }
  })

})

//修改字段按钮
$(document).on("click","button[name$='editField']",function () {
  let tr = $(this).parent().parent()
  let tds = tr.children()
  //设置字段名
  $("#e-name").val(tds.eq(0).text())
  $("#e-oldname").val(tds.eq(0).text())
  //设置类型选中
  let type = tds.eq(1).text()
  $("#e-type").find("option:selected").removeAttr("selected")
  let options = $("#e-type").children()
  for(let i = 0; i < options.length; i++){
    if(type == options.eq(i).text()){
      options.eq(i).prop("selected","selected")
      break;
    }
  }
  //设置长度
  $("#e-length").val(tds.eq(2).text())
  //设置非空选中
  if(tds.eq(3).find("input:checkbox:first").is(":checked")){
    $("#e-notNull").prop("checked","checked")
  }else {
    $("#e-notNull").removeAttr("checked")
  }
  //记录是否主键
  if(tds.eq(4).find("input:checkbox:first").is(":checked")){
    $("#e-primary").val("1")
  }else {
    $("#e-primary").val("0")
  }
})

//修改模态框确认按钮
$(document).on("click","#e-editField",function () {

  let connectId = $("#connectId").val()
  let database = $("#database").val()
  let table = $("#table").val()
  let primary = $("#e-primary").val()
  let oldname = $("#e-oldname").val()
  let name = $("#e-name").val()
  let type = $("#e-type").find("option:selected").text()
  let length = $("#e-length").val().toString()
  let notNull = $("#e-notNull").is(":checked")?"1":"0"

  if(name.indexOf(" ") != -1){
    alert("字段名不能包含空格")
    return;
  }
  if(typeof name == "undefined" || name == null || name == ""){
    alert("字段名不能为空")
    return;
  }

  //判断字段名是否已存在
  let fieldnameTds = $("#fieldTable").find("td[name$='fieldName']")
  for(let i = 0; i < fieldnameTds.length; i++){
    if(name == fieldnameTds.eq(i).text() && name != oldname){
        alert("字段名已存在！")
        return;
    }
  }

  if(typeof length == "undefined" || length == null || length == ""){
    alert("字段长度不能为空")
    return;
  }

  let mydata = {}
  let field = {}
  mydata["connectId"] = connectId
  mydata["database"] = database
  mydata["table"] = table
  mydata["fieldName"] = oldname
  field["name"] = name
  field["type"] = type
  field["length"] = length
  field["notNull"] = notNull
  field["primary"] = primary
  mydata["field"] = field

  $.ajax({
    type:'post',
    dataType:'json',
    contentType:'application/json;charset=UTF-8',
    async:true,
    xhrFields:{withCredentials: true},
    crossDomain:true,
    url:'http://www.chenrong.xyz/tableinfo/changefield',
    data: JSON.stringify(mydata),
    success:function (data) {
      if(data.code == 200){
        alert(data.data)
        //根据字段名定位到所在行，更新内容
        let tds = null
        for(let j = 0; j < fieldnameTds.length; j++){
          if(oldname == fieldnameTds.eq(j).text()){
            tds = fieldnameTds.eq(j).parent().children()
            break;
          }
        }
        tds.eq(0).text(name)
        tds.eq(1).text(type)
        tds.eq(2).text(length)
        if(notNull == "1"){
          tds.eq(3).find("input:checkbox:first").prop("checked","checked")
        }else {
          tds.eq(3).find("input:checkbox:checked").removeAttr("checked")
        }
      }else {
        alert(data.data)
      }
    },
    error: function(xhr, err){
      console.log('异步请求createtable API失败：')
      console.log(xhr)
      console.log(err)
    }
  })

})

//修改表名按钮
$(document).on("click","#btn-rename",function () {
  $("#renameInput").val($("#table").val())
  let connectId = $("#connectId").val()
  let database = $("#database").val()
  //获取所有表名，用于表名判重
  $.ajax({
    type:'post',
    async:true,
    xhrFields:{withCredentials: true},
    crossDomain:true,
    url:'http://www.chenrong.xyz/tableinfo/showtables',
    data: {"connectId":connectId,"databaseName":database},
    success:function (data) {
      $("#allTableName").val(data.data)
    },
    error: function(xhr, err){
      console.log('异步请求showtables API失败：')
      console.log(xhr)
      console.log(err)
    }
  })
})

//修改表名确认按钮
$(document).on("click","#renameSave",function () {
  let connectId = $("#connectId").val()
  let database = $("#database").val()
  let table = $("#table").val()
  let rename = $("#renameInput").val()

  if(rename.indexOf(" ") != -1){
    alert("表名不能包含空格")
    return;
  }
  if(typeof rename == "undefined" || rename == null || rename == ""){
    alert("表名不能为空")
    return;
  }
  if(table == rename){
    return;
  }
  //表名判重
  let alltables = $("#allTableName").val().split(",")
  for(let i in alltables){
    if(rename == alltables[i] && rename != table){
      alert("表"+rename+"已存在")
      return;
    }
  }

  $.ajax({
    type:'post',
    async:true,
    xhrFields:{withCredentials: true},
    crossDomain:true,
    url:'http://www.chenrong.xyz/tableinfo/renametable',
    data: {"connectId":connectId,"database":database,"table":table,"rename":rename},
    success:function (data) {
      if(data.code == 200){
        alert(data.data)
        $("#table").val(rename)
      }else {
        alert(data.data)
      }
    },
    error: function(xhr, err){
      console.log('异步请求renametable API失败：')
      console.log(xhr)
      console.log(err)
    }
  })
})
