webpackHotUpdate(1,{

/***/ 29:
/***/ (function(module, exports) {

eval("/* ---- variables globales ---- */\nvar total = 0.0;\nvar contador_tabla = 0;\nvar credito_porcentaje = 0;\nvar articulos_vendidos = [];\nvar forma_pago = '';\n/* --- hacer invisible los campos que solo son para efectivo ---- */\ndocument.getElementById('id_div_pago').style.display = 'none';\ndocument.getElementById('id_div_vuelto').style.display = 'none';\ndocument.getElementById('id_div_descuento').style.display = 'none';\n/* --- hacer invisible los campos que solo son para crédito ---- */\ndocument.getElementById('id_div_porcentaje').style.display = 'none';\ndocument.getElementById('id_div_credito_total').style.display = 'none';\n\nvar seleccion_articulo = function (id, descripcion, marca, rubro, precio_venta, precio_credito, precio_compra, stock, proveedor) {\n    var cantidad = prompt(\"Ingrese la cantidad\", \"\");\n    var precio_enviar = '';\n    if (cantidad != null && cantidad != '') {\n        switch (forma_pago) {\n            case 'efectivo':\n                precio_enviar = precio_venta;\n                break;\n            case 'credito':\n                precio_enviar = precio_venta;\n                break;\n            case 'debito':\n                precio_enviar = precio_venta;\n                break;\n        };\n        calcular_total(cantidad, id, precio_enviar);\n        contador_tabla += 1;\n        $('#id_tabla_articulos tr:last').after('<tr id=\"tr_' + contador_tabla.toString() + '\"><td>' + cantidad + '</td>' + '<td>' + descripcion + '</td>' + '<td>' + marca + '</td>' + '<td>' + rubro + '</td>' + '<td> $' + precio_enviar + '</td>' + '<td>' + stock + '</td>' + '<td><a onclick=\"eliminar_articulo(' + contador_tabla.toString() + ',' + cantidad + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\"></i> </a></td></tr>');\n    }\n};\n\nvar guardar_compra = function () {\n    $.ajax({\n        url: '/ventas/ajax/ventas/alta/',\n        type: 'post',\n        data: {\n            ventas: JSON.stringify(articulos_vendidos),\n            fecha: $('#id_fecha').val,\n            precio_venta_total: total.toString(),\n            forma_pago: forma_pago,\n            credito_porcentaje: credito_porcentaje,\n            csrfmiddlewaretoken: $(\"input[name=csrfmiddlewaretoken]\").val()\n        },\n        success: function (data) {\n            if (data.success) {\n                new PNotify({\n                    title: 'Sistema',\n                    text: data.success,\n                    type: 'success'\n                });\n                $('#id_total').html('$ 0.0');\n                $('#id_tabla_articulos').empty();\n                window.location.href = '/ventas/ticket/' + data.id_venta;\n            }\n        }\n    });\n};\n\n/* ---- funcion para el lector de codigo de barras --- */\n$('#id_codigo_articulo_buscar').keypress(function (e) {\n    if (e.which == 13) {\n        $.ajax({\n            url: '/ventas/ajax/codigo/articulo/',\n            type: 'post',\n            data: {\n                'codigo_articulo': $('#id_codigo_articulo_buscar').val(),\n                csrfmiddlewaretoken: $(\"input[name=csrfmiddlewaretoken]\").val()\n            },\n            success: function (data) {\n                var precio_enviar = '';\n                switch (forma_pago) {\n                    case 'efectivo':\n                        precio_enviar = data.precio_venta;\n                        break;\n                    case 'credito':\n                        precio_enviar = data.precio_venta;\n                        break;\n                    case 'debito':\n                        precio_enviar = data.precio_venta;\n                        break;\n                };\n                contador_tabla += 1;\n                calcular_total('1', data.id, precio_enviar);\n                $('#id_tabla_articulos tr:last').after('<tr id=\"tr_' + contador_tabla.toString() + '\"><td>' + data.cantidad + '</td>' + '<td>' + data.descripcion + '</td>' + '<td>' + data.marca + '</td>' + '<td>' + data.rubro + '</td>' + '<td> $' + precio_enviar + '</td>' + '<td>' + data.stock + '<td><a onclick=\"agregar_cantidad(' + contador_tabla.toString() + ',' + data.id + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-info btn-xs\"><i class=\"fa fa-plus\"></i> </a><a onclick=\"eliminar_articulo(' + contador_tabla.toString() + ',' + data.cantidad + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\"></i> </a></td></tr>');\n            }\n        });\n        $('#id_codigo_articulo_buscar').val('');\n    }\n});\n/* ---- funcion para el lector de codigo de barras --- */\n\n/* ---------- Esta funcion calcula el total y la coloca\n*** ---------- en la parte inferior del formulario de ventas ---- */\nvar calcular_total = function (cantidad, id, precio_venta) {\n    /* ---- Armar un array con los articulos vendidos ----- */\n    var obj = {};\n    obj['id'] = id;\n    obj['cantidad'] = cantidad;\n    articulos_vendidos.push(obj);\n    /* ---- Armar un array con los articulos vendidos ----- */\n\n    total += parseFloat(cantidad) * parseFloat(precio_venta.toString().replace(',', '.'));\n    var representar = total.toFixed(2);\n    $('#id_total').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---------- Esta funcion calcula el total y la coloca\n---------- en la parte inferior del formulario de ventas ---- */\n\n/* ---- detectar que tipo de pago es ---- */\nvar calcular_tipo_pago = function (forma_pago_parametro) {\n    $('#id_fecha').prop(\"disabled\", false);\n    $('#id_codigo_articulo_buscar').prop(\"disabled\", false);\n    $('#id_button_buscar').prop(\"disabled\", false);\n    $('#id_button_guardar_compra').prop(\"disabled\", false);\n    // Pongo disabled la seleccion de la forma de pago\n    forma_pago = forma_pago_parametro;\n    if (forma_pago == 'efectivo') {\n        // si es efectivo habilito sus respectivos pagos\n        document.getElementById('id_div_pago').style.display = 'block';\n        document.getElementById('id_div_vuelto').style.display = 'block';\n        document.getElementById('id_div_descuento').style.display = 'block';\n    };\n    if (forma_pago == 'credito') {\n        // si es credito habilito sus respectivos aumentos\n        document.getElementById('id_div_porcentaje').style.display = 'block';\n        document.getElementById('id_div_credito_total').style.display = 'block';\n    };\n    if (forma_pago != 'efectivo') {\n        $('#id_efectivo').hide();\n    };\n    if (forma_pago != 'credito') {\n        $('#id_credito').hide();\n    };\n    if (forma_pago != 'debito') {\n        $('#id_debito').hide();\n    };\n};\n/* ---- detectar que tipo de pago es ---- */\n\n/* ---- Eliminar un articulo desde la tabla ---- */\nvar eliminar_articulo = function (id, cantidad, precio_enviar) {\n\n    articulos_vendidos.splice(id, 1);\n    $('#tr_' + id).remove();\n    total -= parseFloat(cantidad) * parseFloat(precio_enviar.toString().replace(',', '.'));\n    var representar = total.toFixed(2);\n    $('#id_total').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---- Eliminar un articulo desde la tabla ---- */\n\n/* ---- Agregar cantidad a un articulo desde la tabla ---- */\nvar agregar_cantidad = function (contador, id, precio) {\n    var cantidad = prompt(\"Ingrese la cantidad\", \"\");\n    if (cantidad != null && cantidad != '') {\n        var cantidad_tabla = document.getElementById(\"id_tabla_articulos\").rows[contador + 1].cells.item(0).innerHTML;\n        document.getElementById(\"id_tabla_articulos\").rows[contador + 1].cells.item(0).innerHTML = parseInt(cantidad_tabla) + parseInt(cantidad);\n        calcular_total(cantidad, id, precio);\n    }\n};\n/* ---- Agregar cantidad a un articulo desde la tabla ---- */\n\n/* ---- Evento y metodos para vueltos si es efectivo ---- */\n$('#id_pago').click(function () {\n    if ($('#id_pago').val() == '0') {\n        $('#id_pago').val(' ');\n    }\n});\n$('#id_descuento').click(function () {\n    if ($('#id_descuento').val() == '0') {\n        $('#id_descuento').val(' ');\n    }\n});\n/* --- por cada evento calcular el vuelto --- */\n$('#id_pago').focusout(function () {\n    if ($('#id_pago').val() == '') {\n        $('#id_pago').val('0');\n    }\n    calcular_vuelto();\n});\n$('#id_descuento').focusout(function () {\n    calcular_descuento();\n});\n$('#id_pago').keypress(function (e) {\n    if (e.keyCode == 13) {\n        calcular_vuelto();\n    }\n});\nvar calcular_vuelto = function () {\n    /* ----- calcula si es efectivo el vuelto ----- */\n\n    var pago = $('#id_pago').val();\n    var vuelto = parseFloat(pago) - parseFloat(total);\n    var representar = vuelto.toFixed(2);\n    $('#id_vuelto').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---- Evento y metodos para vueltos si es efectivo ---- */\n/* ---- Evento y metodos para descuento si es efectivo ---- */\n/* $('#id_descuento').focusout(function() {\n    // calcular_descuento();\n });*/\n\n/* ---- Evento y metodos para descuento si es efectivo ---- */\n\n/* ---- Evento y metodos para aumento si es credito ---- */\n$('#id_porcentaje').click(function () {\n    if ($('#id_porcentaje').val() == '0') {\n        $('#id_porcentaje').val(' ');\n    }\n});\n/* --- por cada evento calcular el vuelto --- */\n$('#id_porcentaje').focusout(function () {\n    calcular_aumento();\n});\n$('#id_porcentaje').keypress(function (e) {\n    if (e.keyCode == 13) {\n        calcular_aumento();\n    }\n});\nvar calcular_aumento = function () {\n    /* ----- calcula si es credito el aumento ----- */\n    var porcentaje = $('#id_porcentaje').val();\n    credito_porcentaje = porcentaje;\n    var aumento = parseFloat(total) * parseInt(porcentaje) / 100;\n    var total_aumentado = parseFloat(total) + parseFloat(aumento);\n    var representar = total_aumentado.toFixed(2);\n    $('#id_credito_total').html('$ ' + representar.toString().replace('.', ','));\n};\n\nvar calcular_descuento = function () {\n    var descuento = $('#id_descuento').val();\n    var cambio = total;\n    total = parseFloat(cambio) - parseFloat(descuento);\n    alert(descuento);\n    $('#id_total').html('$ ' + total.toString().replace('.', ','));\n};\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdGF0aWMvYXBwcy92ZW50YXMvanMvb3BlcmFjaW9uZXMuanM/MzYwNyJdLCJuYW1lcyI6WyJ0b3RhbCIsImNvbnRhZG9yX3RhYmxhIiwiY3JlZGl0b19wb3JjZW50YWplIiwiYXJ0aWN1bG9zX3ZlbmRpZG9zIiwiZm9ybWFfcGFnbyIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJzdHlsZSIsImRpc3BsYXkiLCJzZWxlY2Npb25fYXJ0aWN1bG8iLCJpZCIsImRlc2NyaXBjaW9uIiwibWFyY2EiLCJydWJybyIsInByZWNpb192ZW50YSIsInByZWNpb19jcmVkaXRvIiwicHJlY2lvX2NvbXByYSIsInN0b2NrIiwicHJvdmVlZG9yIiwiY2FudGlkYWQiLCJwcm9tcHQiLCJwcmVjaW9fZW52aWFyIiwiY2FsY3VsYXJfdG90YWwiLCIkIiwiYWZ0ZXIiLCJ0b1N0cmluZyIsImd1YXJkYXJfY29tcHJhIiwiYWpheCIsInVybCIsInR5cGUiLCJkYXRhIiwidmVudGFzIiwiSlNPTiIsInN0cmluZ2lmeSIsImZlY2hhIiwidmFsIiwicHJlY2lvX3ZlbnRhX3RvdGFsIiwiY3NyZm1pZGRsZXdhcmV0b2tlbiIsInN1Y2Nlc3MiLCJQTm90aWZ5IiwidGl0bGUiLCJ0ZXh0IiwiaHRtbCIsImVtcHR5Iiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiaWRfdmVudGEiLCJrZXlwcmVzcyIsImUiLCJ3aGljaCIsIm9iaiIsInB1c2giLCJwYXJzZUZsb2F0IiwicmVwbGFjZSIsInJlcHJlc2VudGFyIiwidG9GaXhlZCIsImNhbGN1bGFyX3RpcG9fcGFnbyIsImZvcm1hX3BhZ29fcGFyYW1ldHJvIiwicHJvcCIsImhpZGUiLCJlbGltaW5hcl9hcnRpY3VsbyIsInNwbGljZSIsInJlbW92ZSIsImFncmVnYXJfY2FudGlkYWQiLCJjb250YWRvciIsInByZWNpbyIsImNhbnRpZGFkX3RhYmxhIiwicm93cyIsImNlbGxzIiwiaXRlbSIsImlubmVySFRNTCIsInBhcnNlSW50IiwiY2xpY2siLCJmb2N1c291dCIsImNhbGN1bGFyX3Z1ZWx0byIsImNhbGN1bGFyX2Rlc2N1ZW50byIsImtleUNvZGUiLCJwYWdvIiwidnVlbHRvIiwiY2FsY3VsYXJfYXVtZW50byIsInBvcmNlbnRhamUiLCJhdW1lbnRvIiwidG90YWxfYXVtZW50YWRvIiwiZGVzY3VlbnRvIiwiY2FtYmlvIiwiYWxlcnQiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ1ksSUFBSUEsUUFBUSxHQUFaO0FBQ0EsSUFBSUMsaUJBQWlCLENBQXJCO0FBQ0EsSUFBSUMscUJBQXFCLENBQXpCO0FBQ0EsSUFBSUMscUJBQXFCLEVBQXpCO0FBQ0EsSUFBSUMsYUFBYSxFQUFqQjtBQUNQO0FBQ09DLFNBQVNDLGNBQVQsQ0FBd0IsYUFBeEIsRUFBdUNDLEtBQXZDLENBQTZDQyxPQUE3QyxHQUF1RCxNQUF2RDtBQUNBSCxTQUFTQyxjQUFULENBQXdCLGVBQXhCLEVBQXlDQyxLQUF6QyxDQUErQ0MsT0FBL0MsR0FBeUQsTUFBekQ7QUFDQUgsU0FBU0MsY0FBVCxDQUF3QixrQkFBeEIsRUFBNENDLEtBQTVDLENBQWtEQyxPQUFsRCxHQUE0RCxNQUE1RDtBQUNQO0FBQ09ILFNBQVNDLGNBQVQsQ0FBd0IsbUJBQXhCLEVBQTZDQyxLQUE3QyxDQUFtREMsT0FBbkQsR0FBNkQsTUFBN0Q7QUFDQUgsU0FBU0MsY0FBVCxDQUF3QixzQkFBeEIsRUFBZ0RDLEtBQWhELENBQXNEQyxPQUF0RCxHQUFnRSxNQUFoRTs7QUFFQSxJQUFJQyxxQkFBcUIsVUFBU0MsRUFBVCxFQUFhQyxXQUFiLEVBQTBCQyxLQUExQixFQUFpQ0MsS0FBakMsRUFBd0NDLFlBQXhDLEVBQXNEQyxjQUF0RCxFQUFzRUMsYUFBdEUsRUFBcUZDLEtBQXJGLEVBQTRGQyxTQUE1RixFQUFzRztBQUMzSCxRQUFJQyxXQUFXQyxPQUFPLHFCQUFQLEVBQThCLEVBQTlCLENBQWY7QUFDQSxRQUFJQyxnQkFBZ0IsRUFBcEI7QUFDQSxRQUFJRixZQUFZLElBQVosSUFB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bUIsSUFBdkIsQ0FBNEIsT0FBT2EsWUFBWTlCLFFBQVosR0FBdUI2QixPQUF2QixDQUErQixHQUEvQixFQUFvQyxHQUFwQyxDQUFuQztBQUNILENBUkQ7O0FBVUEsSUFBSXNCLHFCQUFxQixZQUFVO0FBQzlCLFFBQUlRLFlBQVk3RCxFQUFFLGVBQUYsRUFBbUJZLEdBQW5CLEVBQWhCO0FBQ0EsUUFBSWtELFNBQVNyRixLQUFiO0FBQ0FBLFlBQVFxRCxXQUFXZ0MsTUFBWCxJQUFxQmhDLFdBQVcrQixTQUFYLENBQTdCO0FBQ0FFLFVBQU1GLFNBQU47QUFDQTdELE1BQUUsV0FBRixFQUFlbUIsSUFBZixDQUFvQixPQUFPMUMsTUFBTXlCLFFBQU4sR0FBaUI2QixPQUFqQixDQUF5QixHQUF6QixFQUE4QixHQUE5QixDQUEzQjtBQUNKLENBTkQiLCJmaWxlIjoiMjkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiAtLS0tIHZhcmlhYmxlcyBnbG9iYWxlcyAtLS0tICovXG4gICAgICAgICAgICB2YXIgdG90YWwgPSAwLjA7XG4gICAgICAgICAgICB2YXIgY29udGFkb3JfdGFibGEgPSAwO1xuICAgICAgICAgICAgdmFyIGNyZWRpdG9fcG9yY2VudGFqZSA9IDA7XG4gICAgICAgICAgICB2YXIgYXJ0aWN1bG9zX3ZlbmRpZG9zID0gW107XG4gICAgICAgICAgICB2YXIgZm9ybWFfcGFnbyA9ICcnO1xuICAgICAvKiAtLS0gaGFjZXIgaW52aXNpYmxlIGxvcyBjYW1wb3MgcXVlIHNvbG8gc29uIHBhcmEgZWZlY3Rpdm8gLS0tLSAqL1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9wYWdvJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfdnVlbHRvJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfZGVzY3VlbnRvJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgLyogLS0tIGhhY2VyIGludmlzaWJsZSBsb3MgY2FtcG9zIHF1ZSBzb2xvIHNvbiBwYXJhIGNyw6lkaXRvIC0tLS0gKi9cbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfcG9yY2VudGFqZScpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X2NyZWRpdG9fdG90YWwnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gICAgICAgICAgICB2YXIgc2VsZWNjaW9uX2FydGljdWxvID0gZnVuY3Rpb24oaWQsIGRlc2NyaXBjaW9uLCBtYXJjYSwgcnVicm8sIHByZWNpb192ZW50YSwgcHJlY2lvX2NyZWRpdG8sIHByZWNpb19jb21wcmEsIHN0b2NrLCBwcm92ZWVkb3Ipe1xuICAgICAgICAgICAgICAgIHZhciBjYW50aWRhZCA9IHByb21wdChcIkluZ3Jlc2UgbGEgY2FudGlkYWRcIiwgXCJcIik7XG4gICAgICAgICAgICAgICAgdmFyIHByZWNpb19lbnZpYXIgPSAnJztcbiAgICAgICAgICAgICAgICBpZiAoY2FudGlkYWQgIT0gbnVsbCAmJiBjYW50aWRhZCAhPSAnJykge1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGZvcm1hX3BhZ28pe1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZWZlY3Rpdm8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBwcmVjaW9fdmVudGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjcmVkaXRvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gcHJlY2lvX3ZlbnRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZGViaXRvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gcHJlY2lvX3ZlbnRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhcl90b3RhbChjYW50aWRhZCwgaWQsIHByZWNpb19lbnZpYXIpO1xuICAgICAgICAgICAgICAgICAgICBjb250YWRvcl90YWJsYSArPTE7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF90YWJsYV9hcnRpY3Vsb3MgdHI6bGFzdCcpLmFmdGVyKCc8dHIgaWQ9XCJ0cl8nICsgY29udGFkb3JfdGFibGEudG9TdHJpbmcoKSArICdcIj48dGQ+JyArIGNhbnRpZGFkICsgJzwvdGQ+JyArICc8dGQ+JyArIGRlc2NyaXBjaW9uICsgJzwvdGQ+JyArICc8dGQ+J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgbWFyY2EgKyAnPC90ZD4nICsgJzx0ZD4nICsgcnVicm8gKyAnPC90ZD4nICsgJzx0ZD4gJCcgKyBwcmVjaW9fZW52aWFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnPC90ZD4nICsgJzx0ZD4nICsgc3RvY2sgKyAnPC90ZD4nICsgJzx0ZD48YSBvbmNsaWNrPVwiZWxpbWluYXJfYXJ0aWN1bG8oJyArIGNvbnRhZG9yX3RhYmxhLnRvU3RyaW5nKCkgKyAnLCcgKyBjYW50aWRhZCArICcsJyArIHByZWNpb19lbnZpYXIgKycpXCIgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NsYXNzPVwiYnRuIGJ0bi1kYW5nZXIgYnRuLXhzXCI+PGkgY2xhc3M9XCJmYSBmYS10cmFzaFwiPjwvaT4gPC9hPjwvdGQ+PC90cj4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgZ3VhcmRhcl9jb21wcmEgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy92ZW50YXMvYWpheC92ZW50YXMvYWx0YS8nLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlbnRhczogSlNPTi5zdHJpbmdpZnkoYXJ0aWN1bG9zX3ZlbmRpZG9zKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZlY2hhOiAkKCcjaWRfZmVjaGEnKS52YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fdmVudGFfdG90YWw6IHRvdGFsLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYV9wYWdvOiBmb3JtYV9wYWdvLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3JlZGl0b19wb3JjZW50YWplOiBjcmVkaXRvX3BvcmNlbnRhamUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjc3JmbWlkZGxld2FyZXRva2VuOiAkKFwiaW5wdXRbbmFtZT1jc3JmbWlkZGxld2FyZXRva2VuXVwiKS52YWwoKVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3Mpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBQTm90aWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdTaXN0ZW1hJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS5zdWNjZXNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3VjY2VzcydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdG90YWwnKS5odG1sKCckIDAuMCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNpZF90YWJsYV9hcnRpY3Vsb3MnKS5lbXB0eSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy92ZW50YXMvdGlja2V0LycgKyBkYXRhLmlkX3ZlbnRhXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAvKiAtLS0tIGZ1bmNpb24gcGFyYSBlbCBsZWN0b3IgZGUgY29kaWdvIGRlIGJhcnJhcyAtLS0gKi9cbiAgICAgICAgICAgICQoJyNpZF9jb2RpZ29fYXJ0aWN1bG9fYnVzY2FyJykua2V5cHJlc3MoZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgaWYgKGUud2hpY2ggPT0gMTMpe1xuICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnL3ZlbnRhcy9hamF4L2NvZGlnby9hcnRpY3Vsby8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjb2RpZ29fYXJ0aWN1bG8nOiAkKCcjaWRfY29kaWdvX2FydGljdWxvX2J1c2NhcicpLnZhbCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNzcmZtaWRkbGV3YXJldG9rZW46ICQoXCJpbnB1dFtuYW1lPWNzcmZtaWRkbGV3YXJldG9rZW5dXCIpLnZhbCgpXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByZWNpb19lbnZpYXIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGZvcm1hX3BhZ28pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdlZmVjdGl2byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gZGF0YS5wcmVjaW9fdmVudGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY3JlZGl0byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gZGF0YS5wcmVjaW9fdmVudGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZGViaXRvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBkYXRhLnByZWNpb192ZW50YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFkb3JfdGFibGEgKz0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3RvdGFsKCcxJywgZGF0YS5pZCwgcHJlY2lvX2Vudmlhcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3RhYmxhX2FydGljdWxvcyB0cjpsYXN0JykuYWZ0ZXIoJzx0ciBpZD1cInRyXycgKyBjb250YWRvcl90YWJsYS50b1N0cmluZygpICsgJ1wiPjx0ZD4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuY2FudGlkYWQgKyAnPC90ZD4nICsgJzx0ZD4nICsgZGF0YS5kZXNjcmlwY2lvbiArICc8L3RkPicgKyAnPHRkPidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArIGRhdGEubWFyY2EgKyAnPC90ZD4nICsgJzx0ZD4nICsgZGF0YS5ydWJybyArICc8L3RkPicgKyAnPHRkPiAkJyArIHByZWNpb19lbnZpYXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArICc8L3RkPicgKyAnPHRkPicgKyBkYXRhLnN0b2NrICsgJzx0ZD48YSBvbmNsaWNrPVwiYWdyZWdhcl9jYW50aWRhZCgnICsgY29udGFkb3JfdGFibGEudG9TdHJpbmcoKSArICcsJyArIGRhdGEuaWQgKyAnLCcgKyBwcmVjaW9fZW52aWFyICsgJylcIiAnICsgJ2NsYXNzPVwiYnRuIGJ0bi1pbmZvIGJ0bi14c1wiPjxpIGNsYXNzPVwiZmEgZmEtcGx1c1wiPjwvaT4gPC9hPjxhIG9uY2xpY2s9XCJlbGltaW5hcl9hcnRpY3VsbygnICsgY29udGFkb3JfdGFibGEudG9TdHJpbmcoKSArICcsJyArIGRhdGEuY2FudGlkYWQgKyAnLCcgKyBwcmVjaW9fZW52aWFyICsgJylcIiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NsYXNzPVwiYnRuIGJ0bi1kYW5nZXIgYnRuLXhzXCI+PGkgY2xhc3M9XCJmYSBmYS10cmFzaFwiPjwvaT4gPC9hPjwvdGQ+PC90cj4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9jb2RpZ29fYXJ0aWN1bG9fYnVzY2FyJykudmFsKCcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAvKiAtLS0tIGZ1bmNpb24gcGFyYSBlbCBsZWN0b3IgZGUgY29kaWdvIGRlIGJhcnJhcyAtLS0gKi9cblxuICAgIC8qIC0tLS0tLS0tLS0gRXN0YSBmdW5jaW9uIGNhbGN1bGEgZWwgdG90YWwgeSBsYSBjb2xvY2FcbiAgICAqKiogLS0tLS0tLS0tLSBlbiBsYSBwYXJ0ZSBpbmZlcmlvciBkZWwgZm9ybXVsYXJpbyBkZSB2ZW50YXMgLS0tLSAqL1xuICAgICAgICAgICAgdmFyIGNhbGN1bGFyX3RvdGFsID0gZnVuY3Rpb24oY2FudGlkYWQsIGlkLCBwcmVjaW9fdmVudGEpe1xuICAgIC8qIC0tLS0gQXJtYXIgdW4gYXJyYXkgY29uIGxvcyBhcnRpY3Vsb3MgdmVuZGlkb3MgLS0tLS0gKi9cbiAgICAgICAgICAgICAgICAgICAgdmFyIG9iaiA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBvYmpbJ2lkJ10gPSBpZDtcbiAgICAgICAgICAgICAgICAgICAgb2JqWydjYW50aWRhZCddID0gY2FudGlkYWQ7XG4gICAgICAgICAgICAgICAgICAgIGFydGljdWxvc192ZW5kaWRvcy5wdXNoKG9iaik7XG4gICAgLyogLS0tLSBBcm1hciB1biBhcnJheSBjb24gbG9zIGFydGljdWxvcyB2ZW5kaWRvcyAtLS0tLSAqL1xuXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsICs9IChwYXJzZUZsb2F0KGNhbnRpZGFkKSAqIHBhcnNlRmxvYXQocHJlY2lvX3ZlbnRhLnRvU3RyaW5nKCkucmVwbGFjZSgnLCcsICcuJykpKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlcHJlc2VudGFyID0gdG90YWwudG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3RvdGFsJykuaHRtbCgnJCAnICsgcmVwcmVzZW50YXIudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJywnKSk7XG4gICAgICAgICAgICB9O1xuICAgIC8qIC0tLS0tLS0tLS0gRXN0YSBmdW5jaW9uIGNhbGN1bGEgZWwgdG90YWwgeSBsYSBjb2xvY2FcbiAgICAtLS0tLS0tLS0tIGVuIGxhIHBhcnRlIGluZmVyaW9yIGRlbCBmb3JtdWxhcmlvIGRlIHZlbnRhcyAtLS0tICovXG5cbiAgICAvKiAtLS0tIGRldGVjdGFyIHF1ZSB0aXBvIGRlIHBhZ28gZXMgLS0tLSAqL1xuICAgICAgICAgICAgdmFyIGNhbGN1bGFyX3RpcG9fcGFnbyA9IGZ1bmN0aW9uKGZvcm1hX3BhZ29fcGFyYW1ldHJvKXtcbiAgICAgICAgICAgICAgICAkKCcjaWRfZmVjaGEnKS5wcm9wKCBcImRpc2FibGVkXCIsIGZhbHNlICk7XG4gICAgICAgICAgICAgICAgJCgnI2lkX2NvZGlnb19hcnRpY3Vsb19idXNjYXInKS5wcm9wKCBcImRpc2FibGVkXCIsIGZhbHNlICk7XG4gICAgICAgICAgICAgICAgJCgnI2lkX2J1dHRvbl9idXNjYXInKS5wcm9wKCBcImRpc2FibGVkXCIsIGZhbHNlICk7XG4gICAgICAgICAgICAgICAgJCgnI2lkX2J1dHRvbl9ndWFyZGFyX2NvbXByYScpLnByb3AoIFwiZGlzYWJsZWRcIiwgZmFsc2UgKTtcbiAgICAgICAgICAgICAgICAvLyBQb25nbyBkaXNhYmxlZCBsYSBzZWxlY2Npb24gZGUgbGEgZm9ybWEgZGUgcGFnb1xuICAgICAgICAgICAgICAgIGZvcm1hX3BhZ28gPSBmb3JtYV9wYWdvX3BhcmFtZXRybztcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyA9PSAnZWZlY3Rpdm8nKXtcbiAgICAgICAgICAgICAgICAgICAgLy8gc2kgZXMgZWZlY3Rpdm8gaGFiaWxpdG8gc3VzIHJlc3BlY3Rpdm9zIHBhZ29zXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfcGFnbycpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3Z1ZWx0bycpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X2Rlc2N1ZW50bycpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hX3BhZ28gPT0gJ2NyZWRpdG8nKXtcbiAgICAgICAgICAgICAgICAgICAgLy8gc2kgZXMgY3JlZGl0byBoYWJpbGl0byBzdXMgcmVzcGVjdGl2b3MgYXVtZW50b3NcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9wb3JjZW50YWplJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfY3JlZGl0b190b3RhbCcpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hX3BhZ28gIT0gJ2VmZWN0aXZvJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9lZmVjdGl2bycpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvICE9ICdjcmVkaXRvJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9jcmVkaXRvJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hX3BhZ28gIT0gJ2RlYml0bycpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfZGViaXRvJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuICAgIC8qIC0tLS0gZGV0ZWN0YXIgcXVlIHRpcG8gZGUgcGFnbyBlcyAtLS0tICovXG5cbiAgICAvKiAtLS0tIEVsaW1pbmFyIHVuIGFydGljdWxvIGRlc2RlIGxhIHRhYmxhIC0tLS0gKi9cbiAgICAgICAgICAgIHZhciBlbGltaW5hcl9hcnRpY3VsbyA9IGZ1bmN0aW9uKGlkLCBjYW50aWRhZCwgcHJlY2lvX2Vudmlhcil7XG5cbiAgICAgICAgICAgICAgICBhcnRpY3Vsb3NfdmVuZGlkb3Muc3BsaWNlKGlkLCAxKTtcbiAgICAgICAgICAgICAgICAkKCcjdHJfJyArIGlkKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB0b3RhbCAtPSAocGFyc2VGbG9hdChjYW50aWRhZCkgKiBwYXJzZUZsb2F0KHByZWNpb19lbnZpYXIudG9TdHJpbmcoKS5yZXBsYWNlKCcsJywgJy4nKSkpO1xuICAgICAgICAgICAgICAgIHZhciByZXByZXNlbnRhciA9IHRvdGFsLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgJCgnI2lkX3RvdGFsJykuaHRtbCgnJCAnICsgcmVwcmVzZW50YXIudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJywnKSk7XG5cbiAgICAgICAgICAgIH07XG4gICAgLyogLS0tLSBFbGltaW5hciB1biBhcnRpY3VsbyBkZXNkZSBsYSB0YWJsYSAtLS0tICovXG5cbiAgICAvKiAtLS0tIEFncmVnYXIgY2FudGlkYWQgYSB1biBhcnRpY3VsbyBkZXNkZSBsYSB0YWJsYSAtLS0tICovXG4gICAgICAgICAgICB2YXIgYWdyZWdhcl9jYW50aWRhZCA9IGZ1bmN0aW9uKGNvbnRhZG9yLCBpZCwgcHJlY2lvKXtcbiAgICAgICAgICAgICAgICB2YXIgY2FudGlkYWQgPSBwcm9tcHQoXCJJbmdyZXNlIGxhIGNhbnRpZGFkXCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgIGlmIChjYW50aWRhZCAhPSBudWxsICYmIGNhbnRpZGFkICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjYW50aWRhZF90YWJsYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWRfdGFibGFfYXJ0aWN1bG9zXCIpLnJvd3NbY29udGFkb3IgKyAxXS5jZWxscy5pdGVtKDApLmlubmVySFRNTDtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpZF90YWJsYV9hcnRpY3Vsb3NcIikucm93c1tjb250YWRvciArIDFdLmNlbGxzLml0ZW0oMCkuaW5uZXJIVE1MID0gcGFyc2VJbnQoY2FudGlkYWRfdGFibGEpICsgcGFyc2VJbnQoY2FudGlkYWQpO1xuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhcl90b3RhbChjYW50aWRhZCwgaWQsIHByZWNpbyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAvKiAtLS0tIEFncmVnYXIgY2FudGlkYWQgYSB1biBhcnRpY3VsbyBkZXNkZSBsYSB0YWJsYSAtLS0tICovXG5cbiAgICAvKiAtLS0tIEV2ZW50byB5IG1ldG9kb3MgcGFyYSB2dWVsdG9zIHNpIGVzIGVmZWN0aXZvIC0tLS0gKi9cbiAgICAgICAgICAgICQoJyNpZF9wYWdvJykuY2xpY2soIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9wYWdvJykudmFsKCkgPT0gJzAnKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3BhZ28nKS52YWwoJyAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJyNpZF9kZXNjdWVudG8nKS5jbGljayggZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX2Rlc2N1ZW50bycpLnZhbCgpID09ICcwJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9kZXNjdWVudG8nKS52YWwoJyAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAvKiAtLS0gcG9yIGNhZGEgZXZlbnRvIGNhbGN1bGFyIGVsIHZ1ZWx0byAtLS0gKi9cbiAgICAgICAgICAgICQoJyNpZF9wYWdvJykuZm9jdXNvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9wYWdvJykudmFsKCkgPT0gJycpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfcGFnbycpLnZhbCgnMCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYWxjdWxhcl92dWVsdG8oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50bycpLmZvY3Vzb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNhbGN1bGFyX2Rlc2N1ZW50bygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjaWRfcGFnbycpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3Z1ZWx0bygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIGNhbGN1bGFyX3Z1ZWx0byA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLyogLS0tLS0gY2FsY3VsYSBzaSBlcyBlZmVjdGl2byBlbCB2dWVsdG8gLS0tLS0gKi9cblxuICAgICAgICAgICAgICAgIHZhciBwYWdvID0gJCgnI2lkX3BhZ28nKS52YWwoKTtcbiAgICAgICAgICAgICAgICB2YXIgdnVlbHRvID0gcGFyc2VGbG9hdChwYWdvKSAtIHBhcnNlRmxvYXQodG90YWwpO1xuICAgICAgICAgICAgICAgIHZhciByZXByZXNlbnRhciA9IHZ1ZWx0by50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICQoJyNpZF92dWVsdG8nKS5odG1sKCckICcgKyByZXByZXNlbnRhci50b1N0cmluZygpLnJlcGxhY2UoJy4nLCAnLCcpKTtcbiAgICAgICAgICAgIH07XG4gICAgLyogLS0tLSBFdmVudG8geSBtZXRvZG9zIHBhcmEgdnVlbHRvcyBzaSBlcyBlZmVjdGl2byAtLS0tICovXG4gICAgLyogLS0tLSBFdmVudG8geSBtZXRvZG9zIHBhcmEgZGVzY3VlbnRvIHNpIGVzIGVmZWN0aXZvIC0tLS0gKi9cbiAgICAgICAgICAgLyogJCgnI2lkX2Rlc2N1ZW50bycpLmZvY3Vzb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgLy8gY2FsY3VsYXJfZGVzY3VlbnRvKCk7XG4gICAgICAgICAgICB9KTsqL1xuXG4gICAgLyogLS0tLSBFdmVudG8geSBtZXRvZG9zIHBhcmEgZGVzY3VlbnRvIHNpIGVzIGVmZWN0aXZvIC0tLS0gKi9cblxuICAgIC8qIC0tLS0gRXZlbnRvIHkgbWV0b2RvcyBwYXJhIGF1bWVudG8gc2kgZXMgY3JlZGl0byAtLS0tICovXG4gICAgICAgICAgICAkKCcjaWRfcG9yY2VudGFqZScpLmNsaWNrKCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfcG9yY2VudGFqZScpLnZhbCgpID09ICcwJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9wb3JjZW50YWplJykudmFsKCcgJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvKiAtLS0gcG9yIGNhZGEgZXZlbnRvIGNhbGN1bGFyIGVsIHZ1ZWx0byAtLS0gKi9cbiAgICAgICAgICAgICQoJyNpZF9wb3JjZW50YWplJykuZm9jdXNvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY2FsY3VsYXJfYXVtZW50bygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjaWRfcG9yY2VudGFqZScpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX2F1bWVudG8oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBjYWxjdWxhcl9hdW1lbnRvID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvKiAtLS0tLSBjYWxjdWxhIHNpIGVzIGNyZWRpdG8gZWwgYXVtZW50byAtLS0tLSAqL1xuICAgICAgICAgICAgICAgIHZhciBwb3JjZW50YWplID0gJCgnI2lkX3BvcmNlbnRhamUnKS52YWwoKTtcbiAgICAgICAgICAgICAgICBjcmVkaXRvX3BvcmNlbnRhamUgPSBwb3JjZW50YWplO1xuICAgICAgICAgICAgICAgIHZhciBhdW1lbnRvID0gcGFyc2VGbG9hdCh0b3RhbCkgKiBwYXJzZUludChwb3JjZW50YWplKS8xMDA7XG4gICAgICAgICAgICAgICAgdmFyIHRvdGFsX2F1bWVudGFkbyA9IHBhcnNlRmxvYXQodG90YWwpICsgcGFyc2VGbG9hdChhdW1lbnRvKTtcbiAgICAgICAgICAgICAgICB2YXIgcmVwcmVzZW50YXIgPSB0b3RhbF9hdW1lbnRhZG8udG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICAkKCcjaWRfY3JlZGl0b190b3RhbCcpLmh0bWwoJyQgJyArIHJlcHJlc2VudGFyLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICcsJykpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIGNhbGN1bGFyX2Rlc2N1ZW50byA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgIHZhciBkZXNjdWVudG8gPSAkKCcjaWRfZGVzY3VlbnRvJykudmFsKCk7XG4gICAgICAgICAgICAgICAgIHZhciBjYW1iaW8gPSB0b3RhbDtcbiAgICAgICAgICAgICAgICAgdG90YWwgPSBwYXJzZUZsb2F0KGNhbWJpbykgLSBwYXJzZUZsb2F0KGRlc2N1ZW50byk7XG4gICAgICAgICAgICAgICAgIGFsZXJ0KGRlc2N1ZW50byk7XG4gICAgICAgICAgICAgICAgICQoJyNpZF90b3RhbCcpLmh0bWwoJyQgJyArIHRvdGFsLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICcsJykpO1xuICAgICAgICAgICAgfVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3N0YXRpYy9hcHBzL3ZlbnRhcy9qcy9vcGVyYWNpb25lcy5qcyJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ })

})