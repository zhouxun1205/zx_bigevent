$(function() {

    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

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

                // 调用渲染分页的方法
                renderPage(res.total)
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

    // 定义渲染分页的方法
    function renderPage(total){
        // console.log(total);
        // 调用laypage.rander()方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox',//分页容器的id
            count: total,//总数据条数
            limit: q.pagesize,//每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count','limit','prev', 'page', 'next','skip'],
            limits:[2,3,5,10],
            // 分页发生切换时，触发jump回调
            // 触发 jump 回调的方式有两种
            // 1 点击页码的时候，会触发 jump 回调的方式有两种
            // 2 只要调用了laypage.render()方法，就会触发 jump 回调
            jump: function(obj, first){
                // console.log(obj.curr);
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                // 把最新的条目数，赋值到 q 这个查询参数对象中
                q.pagesize = obj.limit
                // 可以通过first的值，来判断是否通过哪种方式触发的回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                if(!first){
                    // 根据最新的 q 获取对应的数据列表，并渲染表格
                    initTable()
                }
            }
        })
    }

    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '#btn-del', function(){
        // 获取当前页面删除按钮的个数
        var len = $('#btn-del').length

        // 获取文章的id
        var id = $(this).attr('data-id')
        // 询问用户是否删除
        layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
            //发ajax请求删除数据
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res){
                    if(res.status !== 0){
                       return layer.msg('删除失败！' + res.message)
                    }
                    layer.msg('删除成功！')

                    // 当数据删除之后，要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了，则让页码值 -1 之后，再调用initTable方法
                    if(len === 1){
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
          });
    })
})