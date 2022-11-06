$(function() {

    var layer = layui.layer
    var form = layui.form

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormt = function(date){
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' '+ hh + ":" + mm + ':' + ss
    }
    // 定义补零函数
    function padZero(n){
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象
    // 请求数据的时候需要将参数对象提交到服务器
    var q = {
        pagenum: 1,//页码值，默认请求第一天页的数据
        pagesize: 2,//每页显示几条数据，默认显示2条
        cate_id: '',//文章分类的 id
        state: ''//文章的分布状态
    }

    initTable()
    //获取文章列表数据的方法
    function initTable(){
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('获取文章列表失败！'+res.message)
                }
                // 使用模板引擎渲染页面
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    initCate()
    // 初始化文章分类的方法
    function initCate(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('获取文章分类失败!' + res.message)
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-artCate', res)
                $('[name="cate_id"]').html(htmlStr)
                // 通过layui重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 筛选功能，监听筛选的submit事件
    $('#form-search').on('submit', function(e){
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name="cate_id"]').val()
        var state = $('[name="state"]').val()
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据新的查询参数，重新渲染table
        initTable()

    })
})