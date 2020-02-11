var protocol = "http://";
var host = "www.chenrong.xyz";
var basePath = protocol + host;

$(document).ready(function () {
  //将下拉列表的数据显示到input
  $(document).on("click", "li", function () {
    var x = $(this).children().text();
    var father = $(this).parent();
    if(($(this).parent().attr("id") == "connectId")||($(this).parent().attr("id") == "database")){
      father.parent().prev().val(x);
    }
  })

  //获取连接
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
          "<li>"+"<a>"+sub.connectName+"</a>"+"</li>";
          $("#connectId").append(connect);
        }
      }else{
        alert(result.data);
      }
    },
    error: function () {
      alert("请求查询连接接口失败");
    }
  });

  //点击连接id的li事件
  $(document).on("click", "li", function ()  {
    if(($(this).parent().attr("id") == "connectId")){
      var connect = $("#connectIdSet").val();
      var father = $(this).parent();
      var x = $(this).children().text();
      if(father.attr("id")==('connectId')){
        //更新数据库列表
        //先清空ul、右侧信息
        $("#database").html('');
        $("#databaseSet").val('');
        $("#connectName").val('');
        $("#host").val('');
        $("#port").val('');
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
        $.ajax({
          type: 'get',
          async: true,
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          url:basePath+"/connectInfo/selectByConnectId",
          data:{"connectId":connect},
          success:function (data) {
            if(data.code==200){
              var result = data.data;
              var x = result.connectName;
              var y = result.host;
              var z = result.port;
              $("#connectName").html(x);
              $("#host").html(y);
              $("#port").html(z);
            }
          },
        });
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
  })

  //点击数据库的li事件
  $(document).on("click", "li", function ()  {
    if(($(this).parent().attr("id") == "database")){
      var connectId = $("#connectIdSet").val();
      var databaseName = $("#databaseSet").val();
      var father = $(this).parent();
      var x = $(this).children().text();
      if(father.attr("id")==('database')){
        //更新数据表
        //先清空select
        $("#sel_userName2").val('');
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
                var option = "<option value="+(index+1)+">"+item+"</option>";
                $("#sel_userName2").append(option);
                $("#sel_userName2").selectpicker('refresh');
              });
            }
          },
        });
      }
    }
  })
})
