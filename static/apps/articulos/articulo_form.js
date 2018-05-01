/**
 * Created by alan on 10/04/17.
 */

// se hacen invisibles los mensajes de los complementos

document.getElementById('id_mensaje_marca').style.display = 'none';
document.getElementById('id_mensaje_rubro').style.display = 'none';
document.getElementById('id_mensaje_categoria').style.display = 'none';

// --> token name : csrfmiddlewaretoken

/* Función ajax para guardar marcas */
    var guardar_marca = function(){
        $.ajax({
            url: '/articulos/ajax/marca/alta/',
            type: 'post',
            data: {
                descripcion: $('#id_descripcion_marca').val(),
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
            },
            success: function(data){
                if (data.is_valid){
                    $('#id_mensaje_marca').val(' ');
                    $('#id_marca').append($('<option>', {
                        value: data.id_marca,
                        text: data.id_descripcion
                    }));
                    $('#id_marca').val(data.id_marca);
                    $('#id_descripcion_marca').val(' ');
                }else{
                    document.getElementById('id_mensaje_marca').style.display = 'block';
                    var texto = '';
                    if (data.message['descripcion'] != undefined){
                        texto = data.message['descripcion'];
                    }
                    $('#id_mensaje_marca').append('<p>' + texto + '</p>');
                }
            }
        });
    };

    /* Función ajax para guardar rubros */
    var guardar_rubro = function(){
        $.ajax({
            url: '/articulos/ajax/rubro/alta/',
            type: 'post',
            data: {
                descripcion: $('#id_descripcion_rubro').val(),
                categoria: $('#id_categoria').val(),
                csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
            },
            success: function(data){
                if (data.is_valid) {
                    $('#id_mensaje_rubro').val(' ');
                    $('#id_rubro').append($('<option>', {
                        value: data.id_rubro,
                        text: data.id_descripcion
                    }));
                    $('#id_rubro').val(data.id_rubro);
                    $('#id_descripcion_rubro').val(' ');
                }else{
                    document.getElementById('id_mensaje_rubro').style.display = 'block';
                    var texto = '';
                    if (data.message['descripcion'] != undefined){
                        texto = 'Descripción : ' + data.message['descripcion'];
                    }else {
                        texto = 'Categoría : ' +  data.message['categoria'];
                    }
                    $('#id_mensaje_rubro').append('<p>' + texto +  '</p>')
                }
            }
        });
    };


/* Función ajax para guardar categorias */
var guardar_categoria = function(){
    $.ajax({
        url: '/articulos/ajax/categoria/alta/',
        type: 'post',
        data: {
            descripcion: $('#id_descripcion_categoria').val(),
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        },
        success: function(data){
            if (data.is_valid) {
                $('#id_mensaje_categoria').val(' ');
                console.log(data);
                $('#id_categoria_seleccion').append($('<option>', {
                    value: data.id_categoria,
                    text: data.id_descripcion
                }));
                $('#id_categoria').append($('<option>', {
                    value: data.id_categoria,
                    text: data.id_descripcion
                }));
                $('#id_categoria_seleccion').val(data.id_categoria);
                $('#id_categoria').val(data.id_categoria);
                $('#id_descripcion_categoria').val(' ');
            }else{
                document.getElementById('id_mensaje_categoria').style.display = 'block';
                var texto = '';
                if (data.message['descripcion'] != undefined){
                    texto = 'Descripción : ' + data.message['descripcion'];
                }
                $('#id_mensaje_categoria').append('<p>' + texto +  '</p>')
            }
        }
    });
};


/*------------------------------------------*/
/*         ajax para consultar rubros       */
/*------------------------------------------*/
$('#id_categoria_seleccion').change(function() {
    $.ajax({
        url: '/articulos/ajax/categoria/subcategoria/',
        type: 'post',
        data: {
            categoria__id: $('#id_categoria_seleccion').val(),
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        },
        success: function(data){
            $('#id_rubro').empty();
            for (var x =0; x < data.length; x++){
                $('#id_rubro').append($('<option>', {
                    value: data[x].pk,
                    text: data[x].fields.descripcion
                }));
            }
        },
        error: function(err){
            console.log(err)
            $('#id_rubro').empty();
        }
    });
});
/*------------------------------------------*/
/*         ajax para consultar rubros       */
/*------------------------------------------*/