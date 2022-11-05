$(function() {

    var layer = layui.layer
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
})