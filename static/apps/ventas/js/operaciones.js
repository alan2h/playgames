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
            /* ---- hacer invisible los campos que solo son para los socios ---*/
            document.getElementById('id_div_puntos_socios').style.display = 'none';
            document.getElementById('id_form_canjear').style.display = 'none';
            document.getElementById('id_form_efectivo').style.display = 'none';

            /* ----------- habilitar campos para canje de puntos en socio ---*/
            habilitar_campos_canje = function(socio){
                console.log(socio)
                if (socio.tipo_cliente.descripcion == 'Socio Normal'){
                  $('#id_puntos_socios').val(socio.puntos);
                }else{
                  $('#id_puntos_socios').val(socio.puntos_premium);
                }
                document.getElementById('id_div_puntos_socios').style.display = 'block';
                $('#id_descuento_de_socio').prop( "checked", true );
            }
            /* --------------------------------------------------------------*/

            var seleccion_articulo = function(id, descripcion, marca, rubro, precio_venta, precio_credito, precio_debito, precio_compra, stock, proveedor, no_suma_caja){
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
                    if (no_suma_caja){
                      if (!($('#id_no_sumar').is(':checked'))){
                        swal({
                            title: "El árticulo esta tildado para no sumarse a caja. Pero no se tildo en el formulario de ventas",
                            text: "Desea que el sistema tilde el check por usted ? ",
                            icon: "info",
                            buttons: ['No, porque quiero sumarlo a caja', 'Si, porque no lo voy a sumar a caja'],
                            dangerMode: false,
                          }).then((willDelete) => {
                            if (willDelete) {
                              $('#id_no_sumar').prop( "checked", true );
                            }
                          });
                      }
                    }
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
                var canje_socios = false;
                var canje_credito = false;
                var id_descuento_de_socio = false;

                $('#id_button_guardar_compra').prop( "disabled", true );
                if ($('#id_no_sumar').is(':checked')){no_sumar = true;}
                if ($('#id_canje_socios').is(':checked')){canje_socios = true;}
                if ($('#id_canje_credito').is(':checked')){canje_credito = true;}
                if ($('#id_descuento_de_socio').is(':checked')){id_descuento_de_socio = true;}

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
                        puntos_socios: $('#id_puntos_socios').val(),
                        canje_socios: canje_socios,
                        creditos_socios: $('#id_credito_socio').val(),
                        canje_credito: canje_credito,
                        credito_porcentaje: credito_porcentaje,
                        id_descuento_de_socio: id_descuento_de_socio,
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
                                swal({
                                    title: "El árticulo no fue encontrado o el stock es 0. Verifique en la lista de árticulos los datos correspondientes. ",
                                    text: "Desea realizar el pedido ? ",
                                    icon: "warning",
                                    buttons: true,
                                    dangerMode: true,
                                  })
                                  /*.then((willDelete) => {
                                    if (willDelete) {
                                      swal("Poof! Your imaginary file has been deleted!", {
                                        icon: "success",
                                      });
                                    } else {
                                      swal("El pedido ha sido enviado");
                                    }
                                  });*/
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
                                if (data.no_suma_caja){
                                  if (!($('#id_no_sumar').is(':checked'))){
                                    swal({
                                        title: "El árticulo esta tildado para no sumarse a caja. Pero no se tildo en el formulario de ventas",
                                        text: "Desea que el sistema tilde el check por usted ? ",
                                        icon: "info",
                                        buttons: ['No, porque quiero sumarlo a caja', 'Si, porque no lo voy a sumar a caja'],
                                        dangerMode: false,
                                      }).then((willDelete) => {
                                        if (willDelete) {
                                          $('#id_no_sumar').prop( "checked", true );
                                        }
                                      });
                                  }
                                }
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
                    //document.getElementById('id_div_porcentaje').style.display = 'block';
                    document.getElementById('id_div_credito_total').style.display = 'block';
                };

                // hago invisibles las imagenes de tipos de pagos
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

    /*------ cuando selecciona el canje se agrega las cajas de texto ----*/
    $("#id_canje_socios").change(function() {
        if(this.checked) {
            $('#id_canje_credito').prop( "checked", false );
            document.getElementById('id_form_canjear').style.display = 'block';
            document.getElementById('id_form_efectivo').style.display = 'none';
        }else{
            document.getElementById('id_form_canjear').style.display = 'none';
        }
    });
    $("#id_canje_credito").change(function() {
        if(this.checked) {
            $('#id_canje_socios').prop( "checked", false );
            document.getElementById('id_form_efectivo').style.display = 'block';
            document.getElementById('id_form_canjear').style.display = 'none';
        }else{
            document.getElementById('id_form_efectivo').style.display = 'none';
        }
    });
    /*-------------------------------------------------------------------*/

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
            // descuento para socios
            $('#id_descuento_socios').click( function(){
                if ($('#id_descuento_socios').val() == '0'){
                    $('#id_descuento_socios').val(' ');
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
                calcular_vuelto();
            });
            $('#id_descuento_socios').focusout(function(){
                if ($('#id_descuento_socios').val() == ''){
                    $('#id_descuento_socios').val('0');
                }
                calcular_vuelto();
            });
            $('#id_credito_socio').focusout(function(){
              if ($('#id_credito_socio').val() == ''){
                  $('#id_credito_socio').val('0');
              }
              calcular_vuelto();
            });

            $('#id_descuento_socios').keypress(function(e){
                if (e.keyCode == 13) {
                    if ($('#id_descuento_socios').val() == ''){
                        $('#id_descuento_socios').val('0');
                    }
                    calcular_vuelto();
                }
            });

            $('#id_credito_socio').keypress(function(e){
                if (e.keyCode == 13) {
                    if ($('#id_credito_socio').val() == ''){
                        $('#id_credito_socio').val('0');
                    }
                    calcular_vuelto();
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
                var descuento_socio = $('#id_descuento_socios').val();
                var credito_socio = $('#id_credito_socio').val();

                var vuelto = parseFloat(pago) - parseFloat(total);
                console.log(descuento_socio)
                if ($('#id_canje_socios').is(':checked')){
                  if (descuento_socio != '0') { // descuento para socios
                      descuento_total = (parseFloat(total) * parseFloat(descuento_socio)) / 100;
                      resultado = 0.0;
                      resultado = parseFloat(total) - parseFloat(descuento_total);
                      var vuelto =  parseFloat(pago) - parseFloat(resultado);
                      var representar2 = resultado.toFixed(2);
                      $('#id_total').html('$ ' + representar2.toString().replace('.', ','));
                  }
                }
                if ($('#id_canje_credito').is(':checked')){
                  if (credito_socio != '0') { // credito para socios
                      resultado = 0.0;
                      resultado = parseFloat(total) - parseFloat(credito_socio);
                      var vuelto =  parseFloat(pago) - parseFloat(resultado);
                      var representar2 = resultado.toFixed(2);
                      $('#id_total').html('$ ' + representar2.toString().replace('.', ','));
                  }
                }
                if ($('#id_descuento_de_socio').is(':checked')){
                  resultado = 0.0;
                  var descuento_socio = (parseFloat(total) * 5) / 100;
                  resultado = parseFloat(total) - parseFloat(descuento_socio);
                  var vuelto =  parseFloat(pago) - parseFloat(resultado);
                  var representar2 = resultado.toFixed(2);
                  $('#id_total').html('$ ' + representar2.toString().replace('.', ','));
                }
                console.log(descuento)
                if (descuento != '0') { // descuento extraordinario
                    descuento_total = (parseFloat(total) * parseFloat(descuento)) / 100;
                    resultado = 0.0;
                    resultado = parseFloat(total) - parseFloat(descuento_total);
                    var vuelto =  parseFloat(pago) - parseFloat(resultado);
                    var representar2 = resultado.toFixed(2);
                    $('#id_total').html('$ ' + representar2.toString().replace('.', ','));
                }
                console.log(vuelto)
                console.log(vuelto.toFixed(2))
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
