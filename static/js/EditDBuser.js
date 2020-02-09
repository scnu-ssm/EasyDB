$(document).ready(function () {
  //删除行（删除字段）
  $("button.btn-danger").click(function () {
    let num = $("tr").length;
    if($("tr").length < 3){
      alert("至少保留一行");
    }
    else {
      $(this).parent().parent().remove();
    }
  })

  //添加行（添加字段）
  $("#grant").click(function () {
    let row = $("tr:last").clone(true);
    $("tr:last").after(row);
  })

})
