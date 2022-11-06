$(function () {

    // 点击去注册的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击去登录的链接
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从 layui 中获取 form 对象
    var form = layui.form
    form.verify({
        pwd: [/^[\S]{6,12}$/,'密码必须6-12位，且不能包含空格'],
        repwd: function(repwd){
            var pwd = $('.reg-box [name="password"]').val()
            if(repwd !== pwd){
                return '两次密码输入不一致！'
            }
        }
    })

    var layer = layui.layer

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e){
        // 1 阻止默认的提交行为
        e.preventDefault()
        // 2 发起ajax的post请求
        data = {
            username: $('.reg-box [name="username"]').val(),
            password:$('.reg-box [name="password"]').val()
        }
        $.post('/api/reguser', data, function(res){
            if(res.status !== 0){
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录！')
            $('#link_login').click()
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function(e){
        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    console.log(res);
                    return layer.msg('登录失败！' + res.message)
                }
                layer.msg('登录成功！')
                localStorage.setItem('token', res.token)
                location.href = './index.html'
            }
        })
    })

})

