$(document).ready(function () {
  $.ajax({
    type:'post',
    async:true,
    xhrFields:{withCredentials: true},
    crossDomain:true,
    url:'http://www.chenrong.xyz/dbuser/allusers',
    data:{"connectId":"0c45122aa00f4c038ddd00ffe69c7955"},
    success:function (data) {
      let users = data.data
      let html = ''
      for(let i in users) {
        html += `
          <li class="list-group-item">
        <button type="button" class="btn btn-info btn-xs" data-toggle="modal" data-target="#editDBuserModal">
          <span class="glyphicon glyphicon-pencil"></span>&nbsp;&nbsp;编辑
        </button>
        <button type="button" class="btn btn-info btn-xs" data-toggle="modal" data-target="#editDBuserModal">
          <span class="glyphicon glyphicon-ok-circle"></span>  权限
        </button>
        <button type="button" class="btn btn-info btn-xs" data-toggle="modal" data-target="#deleteDBuserModal">
          <span class="glyphicon glyphicon-minus"></span>&nbsp;&nbsp;删除
        </button>
        ${users[i].user}@${users[i].host}
      </li>
        `
      }
      $('#userUl').html(html)
    },
    error: function(xhr, err){
      console.log('异步请求登录API失败：')
      console.log(xhr)
      console.log(err)
    }
  })
})
