$(function() {

    var layer = layui.layer
    var form = layui.form
    var indexAdd = null

    initArtCateList()

    // 获取文章分类的列表
    function initArtCateList(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加类别按钮绑定点击事件
    $('#btnAddCate').on('click',function(){
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
          });
    })

    // 通过代理的形式，为form-add绑定submit事件
    $('body').on('submit', '#form-add', function(e){
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0 ){
                    return layer.msg('新增分类失败！'+ res.message)
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                //根据索引，关闭对应弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理方式，为btn-edit 编辑按钮绑定点击事件
    var indexEdit = null
    $('body').on('click', '#btn-edit', function(){
        // console.log('OK');
        // 弹出一个修改文章分类的信息层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
          });

          var id = $(this).attr('data-Id')
        //发请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res){
                // console.log(res);
                // layui中form表单快速填充数据，lay-filter属性
                form.val('form-edit', res.data)
            }
        })
    })

    // 通过代理方式，为编辑的表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e){
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('更新分类失败！' + res.message)
                }
                layer.msg('更新分类成功！')
                //根据索引，关闭对应弹出层
                layer.close(indexEdit)
                initArtCateList()
            }

        })
    })

    // 通过代理方式，为btn-del 编辑按钮绑定点击事件
    $('body').on('click', '#btn-del', function(){
        // console.log("OK");
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('是否确认删除?', {icon: 3, title:'提示'}, function(index){
           $.ajax({
            method: 'GET',
            url: '/my/article/deletecate/' + id,
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('删除失败！'+ res.message)
                }
                layer.msg('删除成功！')
                initArtCateList()
            }
           })
            
            layer.close(index);
          });
    })
})