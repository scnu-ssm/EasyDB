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

$(document).ready(function () {

  var fieldtr = `      <tr>
        <!-- 名 -->
        <td><input type="text"/></td>
        <!-- 类型 -->
        <td>
          <select>
            <option>bigint</option>
            <option>bit</option>
            <option>binary</option>
            <option>blob</option>
            <option>char</option>
            <option>date</option>
            <option>datetime</option>
            <option>decimal</option>
            <option>double</option>
            <option>enum</option>
            <option>float</option>
            <option>geometry</option>
            <option>geometrycollection</option>
            <option selected="selected">int</option>
            <option>integer</option>
            <option>json</option>
            <option>linestring</option>
            <option>longblob</option>
            <option>longtext</option>
            <option>mediumblob</option>
            <option>mediumint</option>
            <option>mediumtext</option>
            <option>multilinestring</option>
            <option>multipoint</option>
            <option>multipolygon</option>
            <option>numeric</option>
            <option>point</option>
            <option>polygon</option>
            <option>real</option>
            <option>set</option>
            <option>smallint</option>
            <option>text</option>
            <option>time</option>
            <option>timestamp</option>
            <option>tinyblob</option>
            <option>tinyint</option>
            <option>tinytext</option>
            <option>varbinary</option>
            <option>varchar</option>
            <option>year</option>
          </select>
        </td>
        <!-- 长度 -->
        <td><input type="number"/></td>
        <!-- 小数点 -->
        <td><input type="number" value="0"/></td>
        <!-- 不是null -->
        <td><input type="checkbox" /></td>
        <!-- 是主键 -->
        <td><input type="checkbox" name="primary"/></td>
        <!-- 删除-->
        <td>
          <button class="btn-danger btn-xs" name="fieldDel">
            <span class="glyphicon glyphicon-remove"></span>
          </button>
        </td>
      </tr>`

  var fktrL = `<tr>
          <td><input type="text"></td>
          <td><input type="text"></td>
          <td>
            <select name="fkDB">
            <option selected="selected"></option>`

  var fktrR= ` </select>
          </td>
          <td>
            <select name="fkTB">
                <option selected="selected"></option>
            </select>
          </td>
          <td>
            <select name="fkFD">
                <option selected="selected"></option>
            </select>
          </td>
          <td>
            <select>
              <option selected="selected">NO ACTION</option>
              <option>CASCADE</option>
              <option>RESTRICT</option>
              <option>SET NULL</option>
            </select>
          </td>
          <td>
            <select>
              <option selected="selected">NO ACTION</option>
              <option>CASCADE</option>
              <option>RESTRICT</option>
              <option>SET NULL</option>
            </select>
          </td>
          <td>
            <button class="btn-danger btn-xs" name="fkDel">
              <span class="glyphicon glyphicon-remove"></span>
            </button>
          </td>
        </tr>`

  //获取url传递的参数
  let url = decodeURI(window.location.href)
  let arr = url.split("?con=")
  let arr2 = arr[1].split("&db=")
  let connectId = arr2[0]
  let database = arr2[1]
  $("#connectId").val(connectId)
  $("#database").val(database)

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
      for(let i in dblist){
        fktrL += `<option>${dblist[i]}</option>`
      }
    },
    error: function(xhr, err){
      console.log('异步请求showDataBase API失败：')
      console.log(xhr)
      console.log(err)
    }
  })

//插入字段
  $("#addField").on("click",function () {
    $("#fieldTable").append(fieldtr)
  })

//插入外键
  $("#addFK").on("click",function () {
    $("#fkTable").append(fktrL+fktrR)
  })

})



//删除字段
$(document).on("click","button[name$='fieldDel']",function () {
  $(this).parent().parent().remove()
})


//删除外键
$(document).on("click","button[name$='fkDel']",function () {
  $(this).parent().parent().remove()
})

//主键被选中
$(document).on("click","input:checkbox[name$='primary']",function () {
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
    }
  }else {
    //取消选中，删除主键
  }
})

//外键参考模式选中数据库，获取选中数据库所有表
$(document).on("change","select[name$='fkDB']",function () {
  let connectId = $("#connectId").val()
  let database = $(this).find("option:selected").text()
  let tr = $(this).parent().parent()
  //参考表select
  let fkTB = tr.find("select[name$='fkTB']")
  //参考字段select
  let fkFB = tr.find("select[name$='fkFD']")
  fkFB.html("<option selected=\"selected\"></option>")

  //选中数据库的所有表
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
      fkTB.html(html)
    },
    error: function(xhr, err){
      console.log('异步请求showtables API失败：')
      console.log(xhr)
      console.log(err)
    }
  })

})

//外键参考表中选中表，获取表中所有字段名
$(document).on("change","select[name$='fkTB']",function () {
  let tr = $(this).parent().parent()
  //参考模式select
  let fkDB = tr.find("select[name$='fkDB']")
  //参考字段select
  let fkFB = tr.find("select[name$='fkFD']")
  let table = $(this).find("option:selected").text()
  let connectId = $("#connectId").val()
  let database = fkDB.find("option:selected").text()
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
      fkFB.html(html)
    },
    error: function(xhr, err){
      console.log('异步请求showcolumns API失败：')
      console.log(xhr)
      console.log(err)
    }
  })
})

$(document).on("click","#save",function () {
  let mydata = {}
  //获取连接，数据库名，表名
  let connetId = $("#connectId").val()
  let database = $("#database").val()
  let table = $("#table").val()
  if(typeof table == "undefined" || table==null || table==""){
    alert("表名不能为空")
    return;
  }
  if(table.indexOf(" ") != -1){
    alert("表名不能包含空格")
    return;
  }
  mydata["connectId"] = connetId
  mydata["database"] = database
  mydata["table"] = table
  //字段对象数组
  let fields = new Array()
  //获取字段表中所有行
  let fieldtr = $("#fieldTable").children()
  //遍历所有行
  for(let i = 0; i < fieldtr.length; i++){
    //获取每行各个列信息
    let field = {}
    let tds = fieldtr.eq(i).children()
    //字段名
    let name = tds.eq(0).find("input:first").val()
    if(name.indexOf(" ") != -1){
      alert("字段名不能包含空格")
      return;
    }
    if(typeof name == "undefined" || name == null || name == ""){
      alert("字段名不能为空")
      return;
    }
    field["name"] = name
    //字段类型
    let type = tds.eq(1).find("option:checked").text()
    field["type"] = type
    //字段长度
    let length = tds.eq(2).find("input:first").val()
    if(typeof length == "undefined" || length == null || length == ""){
      alert("字段长度不能为空")
      return;
    }
    field["length"] = length.toString()
    //字段小数点
    let point =  tds.eq(3).find("input:first").val()
    if(typeof point == "undefined" || point == null || point == ""){
      alert("小数点不能为空")
      return;
    }
    field["point"] = point.toString()
    //非空选项
    if(tds.eq(4).find("input:checkbox:first").is(":checked")){
      field["notNull"] = "1"
    }else {
      field["notNull"] = "0"
    }
    //是否主键
    if(tds.eq(5).find("input:checkbox:first").is(":checked")){
      field["primary"] = "1"
    }else {
      field["primary"] = "0"
    }
    fields[i] = field
  }
  mydata["fields"] = fields

  //外键对象数组
  let fktrs = $("#fkTable").children()
  if(fktrs.length > 0){
    let fkeys = new Array()
    for(let j = 0; j < fktrs.length; j++){
      let fktds = fktrs.eq(j).children()
      let fkey = {}
      //外键名
      let fkname = fktds.eq(0).find("input:first").val()
      if(fkname.indexOf(" ") != -1){
        alert("外键名不能包含空格")
        return;
      }
      if(typeof fkname == "undefined" || fkname == null || fkname == ""){
        alert("外键名不能为空")
        return;
      }
      fkey["name"] = fkname
      //外键字段
      let fkfield = fktds.eq(1).find("input:first").val()
      if(fkfield.indexOf(" ") != -1){
        alert("外键字段不能包含空格")
        return;
      }
      if(typeof fkfield == "undefined" || fkfield == null || fkfield == ""){
        alert("外键字段不能为空")
        return;
      }
      let exited = true
      for(let k in fields){
        //判断字段是否存在
        if(fields[k].name == fkfield){
          exited = false
        }
      }
      if(exited){
        alert("外键字段"+fkfield+"不存在于表字段中")
        return;
      }
      fkey["field"] = fkfield
      //参考模式
      let withDatabase = fktds.eq(2).find("option:checked").text()
      if(withDatabase == null || withDatabase == "" || typeof withDatabase == "undefined"){
        alert("参考模式不能为空")
        return;
      }
      fkey["withDatabase"] = withDatabase
      //参考表
      let withTable = fktds.eq(3).find("option:checked").text()
      if(withTable == null || withTable == "" || typeof withTable == "undefined"){
        alert("参考表不能为空")
        return;
      }
      fkey["withTable"] = withTable
      //参考字段
      let withField = fktds.eq(4).find("option:checked").text()
      if(withField == null || withField == "" || typeof withField == "undefined"){
        alert("参考字段不能为空")
        return;
      }
      fkey["withField"] = withField
      //删除时
      fkey["delete"] = fktds.eq(5).find("option:checked").text()
      //更新时
      fkey["update"] = fktds.eq(6).find("option:checked").text()
      fkeys[j] = fkey
    }
    mydata["foreignKeys"] = fkeys
  }

  if(confirm("是否保存表？")){
    // console.log(mydata)
    $.ajax({
      type:'post',
      dataType:'json',
      contentType:'application/json;charset=UTF-8',
      async:true,
      xhrFields:{withCredentials: true},
      crossDomain:true,
      url:'http://www.chenrong.xyz/tableinfo/createtable',
      data: JSON.stringify(mydata),
      success:function (data) {
        if(data.code == 200){
          alert(data.data)
          window.location.reload()
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
  }
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
