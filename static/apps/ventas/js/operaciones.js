/* ---- variables globales ---- */
            var total = 0.0;
            var total_con_descuento = 0.0;
            var resultado = 0.0;
            var contador_tabla = 0;
            var credito_porcentaje = 0;
            var articulos_vendidos = [];
            var forma_pago = '';
     /* --- hacer invisible los campos que solo son para efectivo ---- */
            document.getElementById('id_div_pago').style.display = 'none';
            document.getElementById('id_div_vuelto').style.display = 'none';
     /* --- hacer invisible los campos que solo son para crédito ---- */
            document.getElementById('id_div_porcentaje').style.display = 'none';
            document.getElementById('id_div_credito_total').style.display = 'none';
     /* --- hacer invisible los campos que solo son para descuento ---- */
            document.getElementById('id_div_descuento').style.display = 'none';  

            var seleccion_articulo = function(id, descripcion, marca, rubro, precio_venta, precio_credito, precio_debito, precio_compra, stock, proveedor){
                var cantidad = prompt("Ingrese la cantidad", "");
                var precio_enviar = '';
                if (cantidad != null && cantidad != '') {
                    switch (forma_pago){
                        case 'efectivo':
                            precio_enviar = precio_venta;
                            break;
                        case 'descuento':
                            precio_enviar = precio_venta;
                            break;    
                        case 'credito':
                            precio_enviar = precio_credito;
                            break;
                        case 'debito':
                            precio_enviar = precio_debito;
                            break;
                    };
                    calcular_total(cantidad, id, precio_enviar);
                    contador_tabla +=1;
                    $('#id_tabla_articulos tr:last').after('<tr id="tr_' + contador_tabla.toString() + '"><td>' + cantidad + '</td>' + '<td>' + descripcion + '</td>' + '<td> $' + precio_enviar
                            + '</td>' +  '<td><a onclick="eliminar_articulo(' + contador_tabla.toString() + ',' + cantidad + ',' + precio_enviar +')" ' +
                            'class="btn btn-danger btn-xs"><i class="fa fa-trash"></i> </a></td></tr>');
                }
            };

            var guardar_compra = function(){
                total_con_descuento = resultado;
                var no_sumar = false;
                if ($('#id_no_sumar').is(':checked')){no_sumar = true;}
                $.ajax({
                    url: '/ventas/ajax/ventas/alta/',
                    type: 'post',
                    data: {
                        ventas: JSON.stringify(articulos_vendidos),
                        fecha: $('#id_fecha').val,
                        id_socio: $('#id_socio').val(),
                        porcentaje_descuento: $('#id_monto_descuento').val(),
                        total_con_descuento: total_con_descuento,
                        precio_venta_total: total.toString(),
                        forma_pago: forma_pago,
                        no_sumar: no_sumar,
                        credito_porcentaje: credito_porcentaje,
                        csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
                    },
                    success: function(data){
                        if (data.success){
                            new PNotify({
                                title: 'Sistema',
                                text: data.success,
                                type: 'success'
                            });
                            $('#id_total').html('$ 0.0');
                            $('#id_tabla_articulos').empty();
                            window.location.href = '/ventas/ticket/' + data.id_venta
                        }
                    }
                });
            };

    /* ---- funcion para el lector de codigo de barras --- */
            $('#id_codigo_articulo_buscar').keypress(function(e){
                if (e.which == 13){
                    
                    $.ajax({
                        url: '/ventas/ajax/codigo/articulo/',
                        type: 'post',
                        data: {
                            'codigo_articulo': $('#id_codigo_articulo_buscar').val(),
                            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
                        },
                        success: function(data){
                            if (Object.keys(data).length == 0){
                                alert('El árticulo no fue encontrado o el stock es 0. Verifique en la lista de árticulos los datos correspondientes. ')
                            }else{

                                var precio_enviar = '';
                                switch (forma_pago){
                                    case 'efectivo':
                                        precio_enviar = data.precio_venta;
                                        break;
                                    case 'descuento':
                                        precio_enviar = data.precio_venta;
                                        break;    
                                    case 'credito':
                                        precio_enviar = data.precio_credito;
                                        break;
                                    case 'debito':
                                        precio_enviar = data.precio_debito;
                                        break;
                                };
                                contador_tabla +=1;
                                calcular_total('1', data.id, precio_enviar);
                                $('#id_tabla_articulos tr:last').after('<tr id="tr_' + contador_tabla.toString() + '"><td>' +
                                        data.cantidad + '</td>' + '<td>' + data.nombre + '</td>' + '<td> $' + precio_enviar
                                + '</td>' + '<td><a onclick="agregar_cantidad(' + contador_tabla.toString() + ',' + data.id + ',' + precio_enviar + ')" ' + 'class="btn btn-info btn-xs"><i class="fa fa-plus"></i> </a><a onclick="eliminar_articulo(' + contador_tabla.toString() + ',' + data.cantidad + ',' + precio_enviar + ')" ' +
                                                                        'class="btn btn-danger btn-xs"><i class="fa fa-trash"></i> </a></td></tr>');
                            }
                        }
                    });
                    $('#id_codigo_articulo_buscar').val('');
                }
            });
    /* ---- funcion para el lector de codigo de barras --- */

    /* ---------- Esta funcion calcula el total y la coloca
    *** ---------- en la parte inferior del formulario de ventas ---- */
            var calcular_total = function(cantidad, id, precio_venta){
    /* ---- Armar un array con los articulos vendidos ----- */
                    var obj = {};
                    obj['id'] = id;
                    obj['cantidad'] = cantidad;
                    articulos_vendidos.push(obj);
    /* ---- Armar un array con los articulos vendidos ----- */
                    console.log(precio_venta)
                    total += (parseFloat(cantidad) * parseFloat(precio_venta.toString().replace(',', '.')));
                    var representar = total.toFixed(2);
                    $('#id_total').html('$ ' + representar.toString().replace('.', ','));
            };
    /* ---------- Esta funcion calcula el total y la coloca
    ---------- en la parte inferior del formulario de ventas ---- */

    /* ---- detectar que tipo de pago es ---- */
            var calcular_tipo_pago = function(forma_pago_parametro){
                $('#id_fecha').prop( "disabled", false );
                $('#id_codigo_articulo_buscar').prop( "disabled", false );
                $('#id_button_buscar').prop( "disabled", false );
                $('#buscar_socio').prop( "disabled", false );
                $('#id_button_guardar_compra').prop( "disabled", false );
                $('#id_no_sumar').prop( "disabled", false );
                // Pongo disabled la seleccion de la forma de pago
                forma_pago = forma_pago_parametro;
                if (forma_pago == 'efectivo'){
                    // si es efectivo habilito sus respectivos pagos
                    document.getElementById('id_div_pago').style.display = 'block';
                    document.getElementById('id_div_vuelto').style.display = 'block';
                };
                if (forma_pago == 'descuento'){
                    // si es descuento habilito sus respectivos pagos y descuento
                    document.getElementById('id_div_pago').style.display = 'block';
                    document.getElementById('id_div_vuelto').style.display = 'block';
                    document.getElementById('id_div_descuento').style.display = 'block';
                };
                if (forma_pago == 'credito'){
                    // si es credito habilito sus respectivos aumentos
                    document.getElementById('id_div_porcentaje').style.display = 'block';
                    document.getElementById('id_div_credito_total').style.display = 'block';
                };
                if (forma_pago != 'efectivo'){
                    $('#id_efectivo').hide();
                };
                if (forma_pago != 'credito'){
                    $('#id_credito').hide();
                };
                if (forma_pago != 'debito'){
                    $('#id_debito').hide();
                };
                if (forma_pago != 'descuento'){
                    $('#id_descuento').hide();
                };
            };
    /* ---- detectar que tipo de pago es ---- */

    /* ---- Eliminar un articulo desde la tabla ---- */
            var eliminar_articulo = function(id, cantidad, precio_enviar){

                articulos_vendidos.splice(id, 1);
                $('#tr_' + id).remove();
                total -= (parseFloat(cantidad) * parseFloat(precio_enviar.toString().replace(',', '.')));
                var representar = total.toFixed(2);
                $('#id_total').html('$ ' + representar.toString().replace('.', ','));

            };
    /* ---- Eliminar un articulo desde la tabla ---- */

    /* ---- Agregar cantidad a un articulo desde la tabla ---- */
            var agregar_cantidad = function(contador, id, precio){
                var cantidad = prompt("Ingrese la cantidad", "");
                if (cantidad != null && cantidad != '') {
                    var cantidad_tabla = document.getElementById("id_tabla_articulos").rows[contador + 1].cells.item(0).innerHTML;
                    document.getElementById("id_tabla_articulos").rows[contador + 1].cells.item(0).innerHTML = parseInt(cantidad_tabla) + parseInt(cantidad);
                    calcular_total(cantidad, id, precio);
                }
            };
    /* ---- Agregar cantidad a un articulo desde la tabla ---- */

    /* ---- Evento y metodos para vueltos si es efectivo ---- */
            $('#id_pago').click( function(){
                if ($('#id_pago').val() == '0'){
                    $('#id_pago').val(' ');
                }
            });
            $('#id_monto_descuento').click( function(){
                if ($('#id_monto_descuento').val() == '0'){
                    $('#id_monto_descuento').val(' ');
                }
            });
    /* --- por cada evento calcular el vuelto --- */
            $('#id_pago').focusout(function() {
                if ($('#id_pago').val() == ''){
                    $('#id_pago').val('0');
                }
                calcular_vuelto();
            });
             $('#id_monto_descuento').focusout(function() {
                if ($('#id_monto_descuento').val() == ''){
                    $('#id_monto_descuento').val('0');
                }
            });
            $('#id_pago').keypress(function(e) {
                if (e.keyCode == 13) {
                    calcular_vuelto();
                }
            });
            var calcular_vuelto = function(){
                /* ----- calcula si es efectivo el vuelto ----- */

                var pago = $('#id_pago').val();
                var descuento = $('#id_monto_descuento').val();
                if (descuento != '0') {
                    descuento_total = (parseFloat(total) * parseFloat(descuento)) / 100;
                    resultado = 0.0;
                    resultado = parseFloat(total) - parseFloat(descuento_total);
                    var vuelto =  parseFloat(pago) - parseFloat(resultado);
                    var representar2 = resultado.toFixed(2);
                    $('#id_total').html('$ ' + representar2.toString().replace('.', ','));
                }else{
                    var vuelto = parseFloat(pago) - parseFloat(total);
                }
                    var representar = vuelto.toFixed(2);
                    $('#id_vuelto').html('$ ' + representar.toString().replace('.', ','));
            };
    /* ---- Evento y metodos para vueltos si es efectivo ---- */
   
    /* ---- Evento y metodos para aumento si es credito ---- */
            $('#id_porcentaje').click( function(){
                if ($('#id_porcentaje').val() == '0'){
                    $('#id_porcentaje').val(' ');
                }
            });
    /* --- por cada evento calcular el vuelto --- */
            $('#id_porcentaje').focusout(function() {
                calcular_aumento();
            });
            $('#id_monto_descuento').focusout(function() {
                calcular_vuelto();
            });
            $('#id_monto_descuento').keypress(function() {
                if (e.keyCode == 13) {
                    calcular_vuelto();
                }
            });
            $('#id_porcentaje').keypress(function(e) {
                if (e.keyCode == 13) {
                    calcular_aumento();
                }
            });
            var calcular_aumento = function(){
                /* ----- calcula si es credito el aumento ----- */
                var porcentaje = $('#id_porcentaje').val();
                credito_porcentaje = porcentaje;
                var aumento = parseFloat(total) * parseInt(porcentaje)/100;
                var total_aumentado = parseFloat(total) + parseFloat(aumento);
                var representar = total_aumentado.toFixed(2);
                $('#id_credito_total').html('$ ' + representar.toString().replace('.', ','));
            };
