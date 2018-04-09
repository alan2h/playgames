/**
 * Created by alan on 10/04/17.
 */

// se hacen invisibles los mensajes de los complementos

document.getElementById('id_mensaje_marca').style.display = 'none';
document.getElementById('id_mensaje_rubro').style.display = 'none';

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