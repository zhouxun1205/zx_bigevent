$(function(){

    var form = layui.form
    var layer = layui.layer

    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位之间！且不能出现空格'],
        samePwd: function(newpwd){
            if(newpwd === $('[name="oldPwd"]').val()){
                return '新旧密码不能相同！'
            }
        },
        rePwd: function(repwd){
            if(repwd !== $('[name="newPwd"]').val()){
                return '两次密码不一致！'
            }
        }
    })

    // 提交修改密码
    $('.layui-form').on('submit', function(e){
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('更新密码失败！'+ res.message)
                }
                layer.msg('更新密码成功！')
                // 重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
})