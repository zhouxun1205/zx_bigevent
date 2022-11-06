$(function(){

    var form = layui.form
    var layer = layui.layer

    form.verify({
        nickname: function(value){
            if(value.length > 6){
                return '昵称的长度需要在1~6个字符之间！'
            }
        }
    })

    initUserInfo()

    // 初始化用户信息
    function initUserInfo(){
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res){
                if(res.code !== 0){
                    return layer.msg('获取用户信息失败！' + res.message)
                }
                // console.log(res)
                // $('input[name="username"]').val(res.data.username)
                // 调用form.val快速位表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置功能
    $('#btnReset').on('click', function(e){
        // 组织表单的默认重置功能
        e.preventDefault()
        initUserInfo()
    })

    // 提交修改功能
    $('.layui-form').on('submit', function(e){
        // 组织表单的默认提交行为
        e.preventDefault()
        // 发起ajax请求
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('更新用户信息失败！'+ res.message)
                }
                layer.msg('更新用户信息成功！')
                // 调用父页面中的方法，重新渲染用户的头像和用户信息
                window.parent.getUserInfo()
            }
        })
    })
})