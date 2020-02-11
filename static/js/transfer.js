var protocol = "http://";
var host = "www.chenrong.xyz";
var basePath = protocol + host;

$(document).ready(function () {

  //将下拉列表的数据显示到input
  $(document).on("click", "li", function () {
    var x = $(this).children().text();
    var father = $(this).parent();
    if(($(this).parent().attr("id") == "sourceConnect")||($(this).parent().attr("id") == "database")||($(this).parent().attr("id") == "targetConnect")||($(this).parent().attr("id") == "targetDatabase")){
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
            "<li data-connectId="+sub.connectId+" data-connectName="+sub.connectName+" data-host="+sub.host+" data-port="+sub.port+"><a>"+sub.connectName+"</a></li>";
          $("#sourceConnect").append(connect);
          $("#targetConnect").append(connect);
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
    if(($(this).parent().attr("id") == "sourceConnect")){
      var connect = $(this).attr("data-connectId");
      sessionStorage.setItem("sourceConnect", connect);
      var connectName = $(this).attr("data-connectName");
      var host = $(this).attr("data-host");
      var port = $(this).attr("data-port");
      var father = $(this).parent();
      var x = $(this).children().text();
      if(father.attr("id")==('sourceConnect')){
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
        //填充相对应的信息：连接名、主机、端口
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
      var sourceDatabase = $(this).text();
      sessionStorage.setItem("sourceDatabase", sourceDatabase);
    }
  });

  //点击目标连接的li的事件
  $(document).on("click","li",function () {
    if(($(this).parent().attr("id") == "targetConnect")){
      var connect = $(this).attr("data-connectId");
      sessionStorage.setItem("targetConnect", connect);
      var connectName = $(this).attr("data-connectName");
      var host = $(this).attr("data-host");
      var port = $(this).attr("data-port");
      var father = $(this).parent();
      var x = $(this).children().text();
      if(father.attr("id")==('targetConnect')){
        //更新数据库列表
        //先清空ul
        $("#targetDatabase").html('');
        $("#targetDatabaseSet").val();
        $("#targetConnectName").val('');
        $("#targetHost").val('');
        $("#targetPort").val('');
        $("#targetVersion").val('');
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
                $("#targetDatabase").append(li);
              });
            }
          },
        });
        //填充相对应的信息：连接名、主机、端口、版本
        $("#targetConnectName").html(connectName);
        $("#targetHost").html(host);
        $("#targetPort").html(port);
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
              $("#targetVersion").html(result);
            }
          },
        });
      }
    }
  });
  //储存目标数据库名
  $(document).on("click","li",function (){
    if(($(this).parent().attr("id") == "targetDatabase")){
      var targetDatabase = $(this).text();
      sessionStorage.setItem("targetDatabase", targetDatabase);
    }
  });

})
