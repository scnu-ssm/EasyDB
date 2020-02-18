var protocol = "http://";
var host = "www.chenrong.xyz";
var basePath = protocol + host;

var connectId = sessionStorage.getItem("connectId");
var database = sessionStorage.getItem("database");
var table = sessionStorage.getItem("table");

$(function(){

  // 设置表的名字
  $("#table").text(table);

  //初始化页面的数据
  function innitTable(current, orderColumn, orderType) {

    // 根据不同参数构造不同的值
    if(arguments.length == 0){
           current = null;    orderColumn = null;    orderType = null;
    }else if(arguments.length == 1){
           current = arguments[0];   orderColumn = null;    orderType = null;
    }else if(arguments.length == 2){
           current = null;    orderColumn = arguments[0];    orderType = arguments[1];
    }

    $.ajax({
      type: 'post',
      async: false,
      xhrFields: {withCredentials: true},
      crossDomain: false,
      url: basePath + "/record/selectRecords",
      contentType: 'application/json;charset=utf-8',
      data: JSON.stringify({"connectId": connectId, "database": database, "table": table, "current":current, "orderColumn":orderColumn, "orderType":orderType}),
      dataType: 'json',
      success: function (result) {
        if (result.code == 200) {
          console.log("查询记录接口成功");

          // 初始化查找下拉列表、初始化表头
          var arrColumn = result.data.columnsName;
          var types = result.data.types;
          $('#selectColumn').html('');
          $('#theadTr').html('');
          for (var i in arrColumn) {
            $('#selectColumn').append(`<option>${arrColumn[i]}</option>`)
            $('#theadTr').append(`<th class="text-primary"><h4>${arrColumn[i]}</h4></th>`)
          }

          // 将列列表存储到sessionStorage
          sessionStorage.setItem("arrColumn", JSON.stringify(arrColumn));
          // 将字段类型列表存到sessionStorage
          sessionStorage.setItem("types", JSON.stringify(types));

          // 初始化tbody
          var arrRecords = result.data.records;
          $("#tbody").html('');
          for (var i in arrRecords) {
            var html = `<tr>`;
            for (var j in arrColumn) {
              if (arrRecords[i][arrColumn[j]] != undefined) {
                html += (`<td key="${arrColumn[j]}">${arrRecords[i][arrColumn[j]]}</td>`);
              } else {
                html += (`<td key="${arrColumn[j]}"></td>`);
              }
            }
            html += `</tr>`;
            $("#tbody").append(html);
          }

          // 设置主键的sessionStorage, 存在JSON字符串
          var primaryKeys = result.data.primaryKeys;
          sessionStorage.setItem("primaryKeys", JSON.stringify(primaryKeys));

          //设置分页的数据
          var page = result.data.page;
          $("#PageUl").html('');
          var start = `          <li id="start" value="${page.start}">
                                      <a href="#" aria-label="Start">
                                      <span aria-hidden="true">首页</span>
                                      </a>
                                 </li>`;
          var pre = `            <li id="pre" value="${page.prePage}">
                                      <a href="#" aria-label="Previous">
                                      <span aria-hidden="true">«</span>
                                      </a>
                                 </li>`;
          $("#PageUl").append(start);
          $("#PageUl").append(pre);
          var current = page.current;
          var pageArr = page.pageArr;
          for(var i = 0; i < pageArr.length; i++){
                   if(pageArr[i] == current){
                        $("#PageUl").append(`<li class="active" value="${pageArr[i]}"><a href="#">${pageArr[i]}</a></li>`);
                   }else{
                        $("#PageUl").append(`<li value="${pageArr[i]}"><a href="#">${pageArr[i]}</a></li>`);
                   }
          }
          var next = `           <li id="next" value="${page.nextPage}">
                                      <a href="#" aria-label="Next">
                                      <span aria-hidden="true">»</span>
                                      </a>
                                 </li>`;
          var end = `            <li id="end" value="${page.end}">
                                      <a href="#" aria-label="End">
                                      <span aria-hidden="true">末页</span>
                                      </a>
                                 </li>`;
          $("#PageUl").append(next);
          $("#PageUl").append(end);

          // 设置首页、前一页不可动
          if(page.start == current){
               $("#start").addClass("disabled");
               $("#pre").addClass("disabled");
          }
          // 设置末页、下一页不可动
          if(page.end == current){
               $("#next").addClass("disabled");
               $("#end").addClass("disabled");
          }

          // 设置当前记录和总记录
          $("#current").html('');
          $("#all").html('');

          $("#current").append(`当前 ${page.rows} 条`);
          $("#all").append(`共  ${page.allRows}  条`);

        } else {
          console.log("查询记录接口失败")
        }
      },
      error: function () {
        console.log("查询记录接口失败")
      }
    });
    // 自动添加复选框
    initTableCheckBox();
  }

  // 初始化表
  innitTable();

  function initTableCheckBox() {

    var $thr = $('table thead tr');
    var $checkAllTh = $('<th style="width: 140px"><h5><input type="checkbox" class="text-primary" id="checkAll" name="checkAll" />&nbsp;&nbsp;Select All</h5></th>');
    /*将全选/反选复选框添加到表头最前，即增加一列*/
    $thr.prepend($checkAllTh);
    /* 全选/反选 复选框*/
    var $checkAll = $thr.find('input');
    $checkAll.click(function(event){
      /*将所有行的选中状态设成全选框的选中状态*/
      $tbr.find('input').prop('checked',$(this).prop('checked'));
      /*并调整所有选中行的CSS样式*/
      if ($(this).prop('checked')) {
        $tbr.find('input').parent().parent().addClass('info');
      } else{
        $tbr.find('input').parent().parent().removeClass('info');
      }
      /*阻止向上冒泡，以防再次触发点击操作*/
      event.stopPropagation();
    });
    /*点击全选框所在单元格时也触发全选框的点击操作*/
    $checkAllTh.click(function(){
      $(this).find('input').click();
    });
    var $tbr = $('table tbody tr');
    var $checkItemTd = $('<td style="width: 140px"><input type="checkbox" name="checkItem" /></td>');
    /*每一行都在最前面插入一个选中复选框的单元格*/
    $tbr.prepend($checkItemTd);
    /*点击每一行的选中复选框时*/
    $tbr.find('input').click(function(event){
      /*调整选中行的CSS样式*/
      $(this).parent().parent().toggleClass('info');
      /*如果已经被选中行的行数等于表格的数据行数，将全选框设为选中状态，否则设为未选中状态*/
      $checkAll.prop('checked',$tbr.find('input:checked').length == $tbr.length ? true : false);
      /*阻止向上冒泡，以防再次触发点击操作*/
      event.stopPropagation();
    });
    /*点击每一行时也触发该行的选中操作*/
    $tbr.click(function(){
      $(this).find('input').click();
    });
  }

  // 清除body掩盖
  $("body").removeAttr("style");

  // 填充完模态框span的内容后再设置span的长度
  function setMaxWidth(str) {

    var arr;
    if(str == "updateRecord"){
      arr = $("#updateRecord .input-group .input-group-addon");
    }
    if(str == "insertRecord"){
      arr = $("#insertRecord .input-group .input-group-addon");
    }

    if(str == "selectRecord"){
      arr = $("#selectRecord .input-group .input-group-addon");
    }

    var max = 0;
    $(arr).each(function (index, item) {
      var len = getTextWidth($(item).text());
      if(max < len){
        max = len;
      }
    });
    $(arr).each(function (index, item) {
      // 取得的结果并不完全准确
      $(item).removeAttr("width");
      $(item).css("width", max + 30 + "px");
    });
    // 获取文本长度px
    function getTextWidth(str) {
      var width = 0;
      var html = document.createElement('span');
      html.innerText = str;
      html.className = 'getTextWidth';
      document.querySelector('body').appendChild(html);
      width = document.querySelector('.getTextWidth').offsetWidth;
      document.querySelector('.getTextWidth').remove();
      return width;
    }
  }

  // 为增加记录按钮添加监听事件
  $(document).on("click", "#insert", function () {
    $("#insertDiv").html('');
    var arrColumn = JSON.parse(sessionStorage.getItem("arrColumn"));
    var types = JSON.parse(sessionStorage.getItem("types"));
    for(var i in arrColumn){
      var html = `  <div class="input-group">
                         <span class="input-group-addon" style="text-align: left">${arrColumn[i]}</span>
                         <input type="text" class="form-control" placeholder="${types[arrColumn[i]]}">
                    </div>
                    <br>`;
      $("#insertDiv").append(html);
    }
    // 设置span的长度
    setMaxWidth("insertRecord");
  });

  // 删除记录按钮
  $(document).on("click", "#delete", function () {
        var $tbr = $('table tbody tr');

        if($tbr.find('input:checked').length == 0){
             alert("没有选中任何的记录");
        } else {

          // 找到对应tr的td数组
          var arrInput = $tbr.find('input:checked');
          var oldRecords = [];
          for(var i = 0;  i < arrInput.length; i++) {

            // 组装oldRecord对象
            var arr = $(arrInput[i]).parent().parent().children();
            var oldRecord = {};
            for (var j = 1; j < arr.length; j++) {
              var key = $(arr[j]).attr("key");
              var value = $(arr[j]).text();
              oldRecord[key] = value;
            }

            oldRecords.push(oldRecord);
          }

          // 获取主键
          var primaryKeys = sessionStorage.getItem("primaryKeys") == null ? null : JSON.parse(sessionStorage.getItem("primaryKeys"));
          // 删除请求
          $.ajax({
              type: 'post',
              async: true,
              xhrFields: {withCredentials: true},
              crossDomain: true,
              contentType: "application/json;charset=utf-8",
              url: basePath + "/record/delete",
              data: JSON.stringify({"connectId":connectId, "database":database, "table":table, "primaryKeys":primaryKeys, "oldRecords":oldRecords}),
              dataType: "json",
              success: function (result) {
                        console.log(result.data);
                       if(result.code == 200){
                              // 重新刷新页面
                              //innitTable();
                         var current = $("#PageUl .active").children().text();
                         var findFlag = $("#find").attr("flag");
                         var ascFlag = $("#asc").attr("flag");
                         var descFlag = $("#desc").attr("flag");
                         var orderColumn = $("#selectColumn option:selected").text();

                         if(findFlag == "false" && ascFlag == "false" && descFlag == "false"){
                           // 按照页码查询
                           innitTable(current);
                         }
                         if(ascFlag == "true"){
                           innitTable(current, orderColumn, "asc");
                         }
                         if(descFlag == "true"){
                           innitTable(current, orderColumn, "desc");
                         }
                         if(findFlag == "true"){
                           findRecords(current);
                         }
                       }
              },
              error: function () {
                  console.log("删除记录失败");
              }
          });

        }
  });

  // 定义全局变量，记忆被选中的tr
  var selectedTr;
  // 编辑按钮监听事件
  $(document).on("click", "#update", function (event) {
           var $tbr = $('table tbody tr');
           if($tbr.find('input:checked').length == 0){
                  alert("没有选择任何的记录");
           }else if($tbr.find('input:checked').length > 1){
                  alert("至多只能选择一条记录");
           }else{
                  var arr = $tbr.find('input:checked').parent().parent().children();
                  selectedTr = $tbr.find('input:checked').parent().parent();
                  $("#updateDiv").html('');
                  for(var i = 1; i < arr.length; i++){
                      var html = `  <div class="input-group">
                                       <span class="input-group-addon" style="text-align: left">${$(arr[i]).attr("key")}</span>
                                       <input type="text" class="form-control" value="${$(arr[i]).text()}">
                                    </div>
                                 <br>`;
                      $("#updateDiv").append(html);
                  }

                  // 设置span的长度
                  setMaxWidth("updateRecord");
                  // 弹出模态框
                  $("#updateModal").click();
           }
  });

  // 查看按钮监听事件
  $(document).on("click", "#select", function () {
     var $tbr = $('table tbody tr');
     if($tbr.find('input:checked').length == 0){
       alert("没有选择任何的记录");
     }else if($tbr.find('input:checked').length > 1){
       alert("至多只能选择一条记录");
     }else{
       var arr = $tbr.find('input:checked').parent().parent().children();
       $("#selectDiv").html('');
       for(var i = 1; i < arr.length; i++){
         var html = `       <div class="input-group">
                                       <span class="input-group-addon" style="text-align: left">${$(arr[i]).attr("key")}</span>
                                       <input type="text" class="form-control" disabled="disabled" value="${$(arr[i]).text()}">
                            </div>
                            <br>`;
         $("#selectDiv").append(html);
       }
       // 设置span的长度
       setMaxWidth("selectRecord");
       // 弹出模态框
       $("#selectModal").click();
     }
   });

  // 刷新按钮监听事件
  $(document).on("click", "#refresh", function () {
           // flag标志
           $("#asc").attr("flag", "false");
           $("#desc").attr("flag", "false");
           $("#find").attr("flag", "false");
           innitTable();
   });

  // 升序按钮监听事件
  $(document).on("click", "#asc", function () {
       var orderColumn = $("#selectColumn option:selected").text();
       var orderType = "asc";
       // 标记位，用于选择页码
       $("#asc").attr("flag", "true");
       $("#desc").attr("flag", "false");
       $("#find").attr("flag", "false");
       // 默认从第一页开始排序
       innitTable(1, orderColumn, orderType);
  });

  // 降序按钮监听事件
  $(document).on("click", "#desc", function () {
       var orderColumn = $("#selectColumn option:selected").text();
       var orderType = "desc";
       // 标记位，用于选择页码
       $("#asc").attr("flag", "false");
       $("#desc").attr("flag", "true");
       $("#find").attr("flag", "false");
       // 默认从第一页开始排序
       innitTable(1, orderColumn, orderType);
  });

  // 查找按钮监听事件
  $(document).on("click", "#find", function () {

       // 标记位，用于选择页码
       $("#asc").attr("flag", "false");
       $("#desc").attr("flag", "false");
       $("#find").attr("flag", "true");

       // 默认查询第一页的数据
       findRecords(1);

  });

  // 模态框  增加记录保存按钮监听事件
  $(document).on("click", "#insertSave", function () {
    // 组装newRecord对象
    var arr = $("#insertDiv .input-group");
    var newRecord = {};
    for(var i = 0; i < arr.length; i++){
      var key = $(arr[i]).children('span').text();
      var value = $(arr[i]).children('input').val();
      newRecord[key] = value;
    }
    var connectId = sessionStorage.getItem("connectId");
    var database = sessionStorage.getItem("database");
    var table = sessionStorage.getItem("table");

    $.ajax({
      type: 'post',
      async: true,
      xhrFields: {withCredentials: true},
      crossDomain: true,
      url: basePath + "/record/insert",
      contentType: "application/json;charset=utf-8",
      data: JSON.stringify({"connectId":connectId, "database":database, "table":table, "newRecord":newRecord}),
      dataType: "json",
      success: function (result) {
        if(result.code == 200){
          console.log(result.data);
          // 重新刷新表
          //innitTable();
          var current = $("#PageUl .active").children().text();
          var findFlag = $("#find").attr("flag");
          var ascFlag = $("#asc").attr("flag");
          var descFlag = $("#desc").attr("flag");
          var orderColumn = $("#selectColumn option:selected").text();

          if(findFlag == "false" && ascFlag == "false" && descFlag == "false"){
            // 按照页码查询
            innitTable(current);
          }
          if(ascFlag == "true"){
            innitTable(current, orderColumn, "asc");
          }
          if(descFlag == "true"){
            innitTable(current, orderColumn, "desc");
          }
          if(findFlag == "true"){
               findRecords(current);
          }
        }else{
          console.log(result.data);
        }
      },
      error: function () {
        console.log("新增记录失败");
      }
    });
    // 关闭模态框
    $("#insertRecord").modal('hide');

    // 去除按钮选择的状态
    $(this).css("border", "none !important");
    $(this).css("box-shadow", "none !important");
  });

  // 模态框  编辑记录重置按钮
  $(document).on("click", "#updateReset", function () {
           var arr = $("#updateDiv .input-group input");
           for(var i = 0; i < arr.length; i++){
               $(arr[i]).val($(arr[i]).attr("value"));
           }
  });

  // 模态框  编辑保存按钮监听事件
  $(document).on("click", "#updateSave", function () {

           // 组装oldRecord
           var oldRecord = {};
           // 组装newRecord
           var newRecord = {};

           var arr = $("#updateDiv .input-group");
           for(var i = 0; i < arr.length; i++){
                  var key = $(arr[i]).find('span').text();
                  var oldValue = $(arr[i]).find('input').attr("value");
                  var newValue = $(arr[i]).find('input').val();
                  oldRecord[key] = oldValue;
                  newRecord[key] = newValue;
           }

           //请求更新数据接口
           $.ajax({
              type: 'post',
              async: true,
              xhrFields: {withCredentials:true},
              crossDomain: true,
              contentType: "application/json;charset=utf-8",
              url: basePath + "/record/update",
              data: JSON.stringify({"connectId":connectId, "database":database, "table":table, "primaryKeys":JSON.parse(sessionStorage.getItem("primaryKeys")), "oldRecord":oldRecord, "newRecord":newRecord}),
              dataType: "json",
              success: function (result) {
                       console.log(result.data);
                       if(result.code == 200){
                               // 更新前端的值
                               var arrTd = $(selectedTr).children();
                               for(var i = 0; i < arr.length; i++){
                                     $(arrTd[i+1]).text($(arr[i]).find('input').val());
                               }
                       }else {
                           alert("主键冲突，记录更新失败");
                       }
              },
              error: function () {
                   console.log("更新记录失败");
              }
           });
           // 关闭模态框
           $("#updateRecord").modal('hide');
  });

  // 页面按钮监听事件
  $(document).on("click", "#PageUl li", function () {
          var current = $(this).attr("value");
          var findFlag = $("#find").attr("flag");
          var ascFlag = $("#asc").attr("flag");
          var descFlag = $("#desc").attr("flag");
          var orderColumn = $("#selectColumn option:selected").text();

          if(findFlag == "false" && ascFlag == "false" && descFlag == "false"){
                   // 按照页码查询
                   innitTable(current);
          }
          if(ascFlag == "true"){
                   innitTable(current, orderColumn, "asc");
          }
          if(descFlag == "true"){
                   innitTable(current, orderColumn, "desc");
          }
          if(findFlag == "true"){
                   findRecords(current);
          }
  });

  // 按照指定字段查询记录的事件
  function findRecords(current) {
    var columnName = $("#selectColumn option:selected").text();
    var value = $("#selectInput").val();

    $.ajax({
      type: 'get',
      async: true,
      xhrFields: {withCredentials: true},
      crossDomain: true,
      url: basePath + "/record/selectRecordsByColumn",
      data: {"connectId":connectId, "database":database, "table":table, "columnName":columnName, "value":value, "current":current},
      success: function (result) {
        if(result.code == 200){
          console.log("指定字段查询记录接口成功");
          // 初始化查找下拉列表、初始化表头
          var arrColumn = result.data.columnsName;
          $('#selectColumn').html('');
          $('#theadTr').html('');
          $('#theadTrTwo').html('');
          for (var i in arrColumn) {
            $('#selectColumn').append(`<option>${arrColumn[i]}</option>`)
            $('#theadTr').append(`<th class="text-primary"><h4>${arrColumn[i]}</h4></th>`)
            $('#theadTrTwo').append(`<th class="text-primary"><h4>${arrColumn[i]}</h4></th>`)
          }

          // 将列列表存储到sessionStorage
          sessionStorage.setItem("arrColumn", JSON.stringify(arrColumn));

          // 初始化tbody
          var arrRecords = result.data.records;
          $("#tbody").html('');
          for (var i in arrRecords) {
            var html = `<tr>`;
            for (var j in arrColumn) {
              if (arrRecords[i][arrColumn[j]] != undefined) {
                html += (`<td key="${arrColumn[j]}">${arrRecords[i][arrColumn[j]]}</td>`);
              } else {
                html += (`<td key="${arrColumn[j]}"></td>`);
              }
            }
            html += `</tr>`;
            $("#tbody").append(html);
          }

          // 添加复选框
          initTableCheckBox();

          // 清空页码，不分页
          //设置分页的数据
          var page = result.data.page;
          $("#PageUl").html('');
          var start = `          <li id="start" value="${page.start}">
                                      <a href="#" aria-label="Start">
                                      <span aria-hidden="true">首页</span>
                                      </a>
                                 </li>`;
          var pre = `            <li id="pre" value="${page.prePage}">
                                      <a href="#" aria-label="Previous">
                                      <span aria-hidden="true">«</span>
                                      </a>
                                 </li>`;
          $("#PageUl").append(start);
          $("#PageUl").append(pre);
          var current = page.current;
          var pageArr = page.pageArr;
          for(var i = 0; i < pageArr.length; i++){
            if(pageArr[i] == current){
              $("#PageUl").append(`<li class="active" value="${pageArr[i]}"><a href="#">${pageArr[i]}</a></li>`);
            }else{
              $("#PageUl").append(`<li value="${pageArr[i]}"><a href="#">${pageArr[i]}</a></li>`);
            }
          }
          var next = `           <li id="next" value="${page.nextPage}">
                                      <a href="#" aria-label="Next">
                                      <span aria-hidden="true">»</span>
                                      </a>
                                 </li>`;
          var end = `            <li id="end" value="${page.end}">
                                      <a href="#" aria-label="End">
                                      <span aria-hidden="true">末页</span>
                                      </a>
                                 </li>`;
          $("#PageUl").append(next);
          $("#PageUl").append(end);

          // 设置首页、前一页不可动
          if(page.start == current){
            $("#start").addClass("disabled");
            $("#pre").addClass("disabled");
          }
          // 设置末页、下一页不可动
          if(page.end == current){
            $("#next").addClass("disabled");
            $("#end").addClass("disabled");
          }

          // 设置当前记录和总记录
          $("#current").html('');
          $("#all").html('');

          $("#current").append(`当前 ${page.rows} 条`);
          $("#all").append(`共  ${page.allRows}  条`);

          // 重新设置选中
          var arr = $("#selectColumn option");
          for(var i = 0; i < arr.length; i++){
            if(columnName == $(arr[i]).text()){
              arr[i].selected = 'selected';
              break;
            }
          }

        }else{
          console.log("指定字段查询记录失败");
        }
      },
      error: function () {
        console.log("指定字段查询记录失败");
      }
    });
  }

});
