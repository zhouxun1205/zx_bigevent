$(function(){

    // 调用 getUserInfo 获取用户基本信息
    getUserInfo()

    var layer = layui.layer
    // 退出功能
    $('#btnLogout').on('click', function(){
        layer.confirm('是否确认退出?', {icon: 3, title:'提示'}, function(index){
            //do something
            // 1 清空本地的token
            localStorage.removeItem('token')
            // 2 跳转页面到登录
            location.href = './login.html'
            // 3 关闭询问框
            layer.close(index);
          })
    })
})

//获取用户基本信息的方法
 function getUserInfo(){
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        // headers 配置请求头对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res){
            if(res.status !== 0){
                return layui.layer.msg('获取用户信息失败！' + res.message)
            }
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        },
        // 在 complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        // complete: function(res){
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
        //         // 1 强制清空 token
        //         localStorage.removeItem('token')
        //         // 2 强制跳转到登录界面
        //         location.href = './login.html'
        //     }

        // }
    })
}

// 渲染用户的头像
function renderAvatar(user){
   
    // 1 获取用户的名称
    var name = user.nickname || user.username
    // 2 设置欢迎文本
    $('#welcom').html('欢迎&nbsp;&nbsp;' + name)
    // 3 按需渲染用户的头像
    if(user.user_pic !== null){
        // 3.1 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 3.2 渲染文字头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }

}