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
  $("#addField").click(function () {
    let row = $("tr:last").clone(true);
    $("tr:last").after(row);
  })

  //主键被选中
  $("#ckPri").click(function(){
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
      alert("取消")
    }
  });

})

