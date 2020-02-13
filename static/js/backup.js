$(document).ready(function () {

  //将下拉列表的数据显示到input
  $(document).on("click", "li", function () {
    var x = $(this).children().text();
    var father = $(this).parent();
    if(($(this).parent().attr("id") == "connect")||($(this).parent().attr("id") == "database")){
      father.parent().prev().val(x);
    }
  });

  //选中csv文件，隐藏是否仅传输表结构等内容
  $(document).on("click","#singleRadio2",function () {
    $("#choice").hide();
  });
  $(document).on("click","#singleRadio",function () {
    $("#choice").show();
  })


  //获取源连接
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
          var connect =
            "<li data-connectId="+sub.connectId+" data-connectName="+sub.connectName+" data-host="+sub.host+" data-port="+sub.port+"><a>"+sub.connectName+"</a></li>";
          $("#connect").append(connect);
        }
      }else{
        alert(result.data);
      }
    },
    error: function () {
      alert("请求查询连接接口失败");
    }
  });

  //点击源连接的li的事件
  $(document).on("click","li",function () {
    if(($(this).parent().attr("id") == "connect")){
      var connect = $(this).attr("data-connectId");
      sessionStorage.setItem("connect", connect);
      var connectName = $(this).attr("data-connectName");
      var host = $(this).attr("data-host");
      var port = $(this).attr("data-port");
      var father = $(this).parent();
      var x = $(this).children().text();
      if(father.attr("id")==('connect')){
        //更新数据库列表
        //先清空ul
        $("#database").html('');
        $("#databaseSet").val();
        $("#connectName").val('');
        $("#host").val('');
        $("#port").val('');
        $("#version").val('');
        //填充数据库列表
        $.ajax({
          type: 'get',
          async: true,
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          url:basePath+"/database/showDateBase",
          data:{"connectId":connect},
          success:function (result) {
            if(result.code==200){
              var arr = result.data;
              $(arr).each(function (index,item) {
                var li = "<li><a>"+item+"</a></li>";
                $("#database").append(li);
              });
            }
          },
        });
        //填充相对应的信息：连接名、主机、端口、版本
        $("#connectName").html(connectName);
        $("#host").html(host);
        $("#port").html(port);
        $.ajax({
          type: 'get',
          async: true,
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          url:basePath+"/database/getVersion",
          data:{"connectId":connect},
          success:function (data) {
            if(data.code==200){
              var result = data.data;
              $("#version").html(result);
            }
          },
        });
      }
    }
  });

  //储存源数据库名
  $(document).on("click","li",function (){
    if(($(this).parent().attr("id") == "database")){
      var database = $(this).text();
      sessionStorage.setItem("database", database);
    }
    var connectId = sessionStorage.getItem("connect");
    var databaseName = sessionStorage.getItem("database");
    //清空数据表列表
    $("#sel_userName2").html('');
    //填充数据表列表
    $.ajax({
      type: 'post',
      async: true,
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      url:basePath+"/tableinfo/showtables",
      data:{"connectId":connectId,"databaseName":databaseName},
      success:function (result) {
        if(result.code==200){
          var arr = result.data;
          $(arr).each(function (index,item) {
            var option = "<option>"+item+"</option>";
            $("#sel_userName2").append(option);
            $("#sel_userName2").selectpicker('refresh');
          });
        }
      },
    });

  });

  //传参的方法
  var DownLoadFile = function (options) {
    var config = $.extend(true, { method: 'post' }, options);
    var $iframe = $('<iframe id="down-file-iframe" />');
    var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
    $form.attr('action', config.url);
    for (var key in config.data) {
      $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
    }
    $iframe.append($form);
    $(document.body).append($iframe);
    $form[0].submit();
    $iframe.remove();
  };

  //传参的方法
  var DownLoadFile = function (options) {
    var config = $.extend(true, { method: 'post' }, options);
    var $iframe = $('<iframe id="down-file-iframe" />');
    var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
    $form.attr('action', config.url);
    for (var key in config.data) {
      $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
    }
    $iframe.append($form);
    $(document.body).append($iframe);
    $form[0].submit();
    $iframe.remove();
  };

  //开始备份
  $(document).on("click","#backup",function (){
    var connectId = sessionStorage.getItem("connect");
    var databaseName = sessionStorage.getItem("database");
    var checkbox = $("#inlineCheckbox2").prop('checked');
    var tableList = [];
    $("#sel_userName2 option:selected").each(function () {
      tableList.push($(this).val())
    });
    tableList = tableList.toString();
    if($("#singleRadio").prop('checked')){

      //调用函数
      DownLoadFile({

        url:basePath+"/mysql/backup",

        data:{connectId:connectId,database:databaseName,tables:tableList,isOnlyStructor:checkbox}//要发送的数据

      });
    };
    if($("#singleRadio2").prop('checked')){
      //调用函数
      DownLoadFile({

        url:basePath+"/mysql/leadingOutCSV",

        data:{connectId:connectId,database:databaseName,tables:tableList}//要发送的数据

      });
    };
  });
})
