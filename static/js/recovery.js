var protocol = "http://";
var host = "www.chenrong.xyz";
var basePath = protocol + host;

$(document).ready(function () {
  $('.file-preview').parent().css('width','50%');

  //将下拉列表的数据显示到input
  $(document).on("click", "li", function () {
    var x = $(this).children().text();
    var father = $(this).parent();
    if(($(this).parent().attr("id") == "destConnect")||($(this).parent().attr("id") == "destDatabase")){
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
          $("#destConnect").append(connect);
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
    if(($(this).parent().attr("id") == "destConnect")){
      var connect = $(this).attr("data-connectId");
      sessionStorage.setItem("destConnect", connect);
      var connectName = $(this).attr("data-connectName");
      var host = $(this).attr("data-host");
      var port = $(this).attr("data-port");
      var father = $(this).parent();
      var x = $(this).children().text();
      if(father.attr("id")==('destConnect')){
        //更新数据库列表
        //先清空ul
        $("#destDatabase").html('');
        $("#destDatabaseList").val();
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
                $("#destDatabase").append(li);
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

  //储存目标数据库名
  $(document).on("click","li",function (){
    if(($(this).parent().attr("id") == "destDatabase")){
      var destDatabase = $(this).text();
      sessionStorage.setItem("destDatabase", destDatabase);
    }
  });

  //sql文件
  $(document).on("click","#recovery",function () {
    var connectId = sessionStorage.getItem("destConnect");
    var destDatabase = sessionStorage.getItem("destDatabase");
    var form = new FormData();
    var files = $("#file")[0].files;
    form.append("sqlFile",files[0]);
    form.append("connectId",connectId);
    form.append("database",destDatabase)
    console.log(form);
    $.ajax({
      type:'post',
      async:true,
      url:basePath+"/mysql/recovery",
      xhrFields:{withCredentials:true},
      crossDomain:true,
      processData: false,
      contentType:false,
      data:form,
      success:function (result) {
        console.log("请求成功");
        if (result.code==200){
          alert(result.data);
        }else {
          alert(result.data);
        }
      },
      error:function () {
        console.log("请求失败")
      }
    })
  })

});

