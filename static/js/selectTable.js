$(document).ready(function () {
   $("#sel_userName").selectpicker({
    "width":350
   });
   $("#sel_userName2").selectpicker({
    "width":250
  });


   var connectId = sessionStorage.getItem("sourceConnect");
   var databaseName = sessionStorage.getItem("sourceDatabase");
   var targetConnect = sessionStorage.getItem("targetConnect");
   var targetDatabase = sessionStorage.getItem("targetDatabase");
   var checkbox = $("#inlineCheckbox2").prop('checked');

  //填充数据表列表
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
          var option = "<option>"+item+"</option>";
          $("#sel_userName").append(option);
          $("#sel_userName").selectpicker('refresh');
        });
      }
    },
  });
  //开始传输
  $(document).on("click","#transfer",function (){
    var tableList = [];
    $("#sel_userName option:selected").each(function () {
      tableList.push($(this).val())
    });
    tableList = tableList.toString();
    $.ajax({
      type: 'post',
      async: true,
      xhrFields:{withCredentials: true},
      url: basePath+"/mysql/dataTransfer",
      crossDomain: true,
      data:{"srcConnectId":connectId,"srcDatabase":databaseName,"tables":tableList,"destconnectId":targetConnect,"destDatabase":targetDatabase,"isOnlyStructor":checkbox},
      success:function (result) {
        console.log("请求传输接口成功");
        console.log(result.code);
        if(result.data==200){
          alert(result.data)
        }else {
          alert(result.data)
        }
      },
      error:function () {
        console.log("请求传输接口失败")
      }
    })
  });

});

