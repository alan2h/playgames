webpackHotUpdate(1,{

/***/ 29:
/***/ (function(module, exports) {

eval("/* ---- variables globales ---- */\nvar total = 0.0;\nvar contador_tabla = 0;\nvar credito_porcentaje = 0;\nvar articulos_vendidos = [];\nvar forma_pago = '';\n/* --- hacer invisible los campos que solo son para efectivo ---- */\ndocument.getElementById('id_div_pago').style.display = 'none';\ndocument.getElementById('id_div_vuelto').style.display = 'none';\ndocument.getElementById('id_div_descuento').style.display = 'none';\n/* --- hacer invisible los campos que solo son para crédito ---- */\ndocument.getElementById('id_div_porcentaje').style.display = 'none';\ndocument.getElementById('id_div_credito_total').style.display = 'none';\n\nvar seleccion_articulo = function (id, descripcion, marca, rubro, precio_venta, precio_credito, precio_compra, stock, proveedor) {\n    var cantidad = prompt(\"Ingrese la cantidad\", \"\");\n    var precio_enviar = '';\n    if (cantidad != null && cantidad != '') {\n        switch (forma_pago) {\n            case 'efectivo':\n                precio_enviar = precio_venta;\n                break;\n            case 'credito':\n                precio_enviar = precio_venta;\n                break;\n            case 'debito':\n                precio_enviar = precio_venta;\n                break;\n        };\n        calcular_total(cantidad, id, precio_enviar);\n        contador_tabla += 1;\n        $('#id_tabla_articulos tr:last').after('<tr id=\"tr_' + contador_tabla.toString() + '\"><td>' + cantidad + '</td>' + '<td>' + descripcion + '</td>' + '<td>' + marca + '</td>' + '<td>' + rubro + '</td>' + '<td> $' + precio_enviar + '</td>' + '<td>' + stock + '</td>' + '<td><a onclick=\"eliminar_articulo(' + contador_tabla.toString() + ',' + cantidad + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\"></i> </a></td></tr>');\n    }\n};\n\nvar guardar_compra = function () {\n    $.ajax({\n        url: '/ventas/ajax/ventas/alta/',\n        type: 'post',\n        data: {\n            ventas: JSON.stringify(articulos_vendidos),\n            fecha: $('#id_fecha').val,\n            precio_venta_total: total.toString(),\n            forma_pago: forma_pago,\n            credito_porcentaje: credito_porcentaje,\n            csrfmiddlewaretoken: $(\"input[name=csrfmiddlewaretoken]\").val()\n        },\n        success: function (data) {\n            if (data.success) {\n                new PNotify({\n                    title: 'Sistema',\n                    text: data.success,\n                    type: 'success'\n                });\n                $('#id_total').html('$ 0.0');\n                $('#id_tabla_articulos').empty();\n                window.location.href = '/ventas/ticket/' + data.id_venta;\n            }\n        }\n    });\n};\n\n/* ---- funcion para el lector de codigo de barras --- */\n$('#id_codigo_articulo_buscar').keypress(function (e) {\n    if (e.which == 13) {\n        $.ajax({\n            url: '/ventas/ajax/codigo/articulo/',\n            type: 'post',\n            data: {\n                'codigo_articulo': $('#id_codigo_articulo_buscar').val(),\n                csrfmiddlewaretoken: $(\"input[name=csrfmiddlewaretoken]\").val()\n            },\n            success: function (data) {\n                var precio_enviar = '';\n                switch (forma_pago) {\n                    case 'efectivo':\n                        precio_enviar = data.precio_venta;\n                        break;\n                    case 'credito':\n                        precio_enviar = data.precio_venta;\n                        break;\n                    case 'debito':\n                        precio_enviar = data.precio_venta;\n                        break;\n                };\n                contador_tabla += 1;\n                calcular_total('1', data.id, precio_enviar);\n                $('#id_tabla_articulos tr:last').after('<tr id=\"tr_' + contador_tabla.toString() + '\"><td>' + data.cantidad + '</td>' + '<td>' + data.descripcion + '</td>' + '<td>' + data.marca + '</td>' + '<td>' + data.rubro + '</td>' + '<td> $' + precio_enviar + '</td>' + '<td>' + data.stock + '<td><a onclick=\"agregar_cantidad(' + contador_tabla.toString() + ',' + data.id + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-info btn-xs\"><i class=\"fa fa-plus\"></i> </a><a onclick=\"eliminar_articulo(' + contador_tabla.toString() + ',' + data.cantidad + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\"></i> </a></td></tr>');\n            }\n        });\n        $('#id_codigo_articulo_buscar').val('');\n    }\n});\n/* ---- funcion para el lector de codigo de barras --- */\n\n/* ---------- Esta funcion calcula el total y la coloca\n*** ---------- en la parte inferior del formulario de ventas ---- */\nvar calcular_total = function (cantidad, id, precio_venta) {\n    /* ---- Armar un array con los articulos vendidos ----- */\n    var obj = {};\n    obj['id'] = id;\n    obj['cantidad'] = cantidad;\n    articulos_vendidos.push(obj);\n    /* ---- Armar un array con los articulos vendidos ----- */\n\n    total += parseFloat(cantidad) * parseFloat(precio_venta.toString().replace(',', '.'));\n    var representar = total.toFixed(2);\n    $('#id_total').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---------- Esta funcion calcula el total y la coloca\n---------- en la parte inferior del formulario de ventas ---- */\n\n/* ---- detectar que tipo de pago es ---- */\nvar calcular_tipo_pago = function (forma_pago_parametro) {\n    $('#id_fecha').prop(\"disabled\", false);\n    $('#id_codigo_articulo_buscar').prop(\"disabled\", false);\n    $('#id_button_buscar').prop(\"disabled\", false);\n    $('#id_button_guardar_compra').prop(\"disabled\", false);\n    // Pongo disabled la seleccion de la forma de pago\n    forma_pago = forma_pago_parametro;\n    if (forma_pago == 'efectivo') {\n        // si es efectivo habilito sus respectivos pagos\n        document.getElementById('id_div_pago').style.display = 'block';\n        document.getElementById('id_div_vuelto').style.display = 'block';\n        document.getElementById('id_div_descuento').style.display = 'block';\n    };\n    if (forma_pago == 'credito') {\n        // si es credito habilito sus respectivos aumentos\n        document.getElementById('id_div_porcentaje').style.display = 'block';\n        document.getElementById('id_div_credito_total').style.display = 'block';\n    };\n    if (forma_pago != 'efectivo') {\n        $('#id_efectivo').hide();\n    };\n    if (forma_pago != 'credito') {\n        $('#id_credito').hide();\n    };\n    if (forma_pago != 'debito') {\n        $('#id_debito').hide();\n    };\n};\n/* ---- detectar que tipo de pago es ---- */\n\n/* ---- Eliminar un articulo desde la tabla ---- */\nvar eliminar_articulo = function (id, cantidad, precio_enviar) {\n\n    articulos_vendidos.splice(id, 1);\n    $('#tr_' + id).remove();\n    total -= parseFloat(cantidad) * parseFloat(precio_enviar.toString().replace(',', '.'));\n    var representar = total.toFixed(2);\n    $('#id_total').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---- Eliminar un articulo desde la tabla ---- */\n\n/* ---- Agregar cantidad a un articulo desde la tabla ---- */\nvar agregar_cantidad = function (contador, id, precio) {\n    var cantidad = prompt(\"Ingrese la cantidad\", \"\");\n    if (cantidad != null && cantidad != '') {\n        var cantidad_tabla = document.getElementById(\"id_tabla_articulos\").rows[contador + 1].cells.item(0).innerHTML;\n        document.getElementById(\"id_tabla_articulos\").rows[contador + 1].cells.item(0).innerHTML = parseInt(cantidad_tabla) + parseInt(cantidad);\n        calcular_total(cantidad, id, precio);\n    }\n};\n/* ---- Agregar cantidad a un articulo desde la tabla ---- */\n\n/* ---- Evento y metodos para vueltos si es efectivo ---- */\n$('#id_pago').click(function () {\n    if ($('#id_pago').val() == '0') {\n        $('#id_pago').val(' ');\n    }\n});\n$('#id_descuento').click(function () {\n    if ($('#id_descuento').val() == '0') {\n        $('#id_descuento').val(' ');\n    }\n});\n/* --- por cada evento calcular el vuelto --- */\n$('#id_pago').focusout(function () {\n    if ($('#id_pago').val() == '') {\n        $('#id_pago').val('0');\n    }\n    calcular_vuelto();\n});\n$('#id_descuento').focusout(function () {\n    calcular_descuento();\n});\n$('#id_descuento').focusout(function () {\n    calcular_descuento();\n});\n$('#id_pago').keypress(function (e) {\n    if (e.keyCode == 13) {\n        calcular_vuelto();\n    }\n});\nvar calcular_vuelto = function () {\n    /* ----- calcula si es efectivo el vuelto ----- */\n\n    var pago = $('#id_pago').val();\n    var vuelto = parseFloat(pago) - parseFloat(total);\n    var representar = vuelto.toFixed(2);\n    $('#id_vuelto').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---- Evento y metodos para vueltos si es efectivo ---- */\n/* ---- Evento y metodos para descuento si es efectivo ---- */\n/* $('#id_descuento').focusout(function() {\n    // calcular_descuento();\n });*/\n$('#id_descuento').keypress(function (e) {\n    if (e.keyCode == 13) {\n        calcular_descuento();\n    }\n});\n/* ---- Evento y metodos para descuento si es efectivo ---- */\n\n/* ---- Evento y metodos para aumento si es credito ---- */\n$('#id_porcentaje').click(function () {\n    if ($('#id_porcentaje').val() == '0') {\n        $('#id_porcentaje').val(' ');\n    }\n});\n/* --- por cada evento calcular el vuelto --- */\n$('#id_porcentaje').focusout(function () {\n    calcular_aumento();\n});\n$('#id_porcentaje').keypress(function (e) {\n    if (e.keyCode == 13) {\n        calcular_aumento();\n    }\n});\nvar calcular_aumento = function () {\n    /* ----- calcula si es credito el aumento ----- */\n    var porcentaje = $('#id_porcentaje').val();\n    credito_porcentaje = porcentaje;\n    var aumento = parseFloat(total) * parseInt(porcentaje) / 100;\n    var total_aumentado = parseFloat(total) + parseFloat(aumento);\n    var representar = total_aumentado.toFixed(2);\n    $('#id_credito_total').html('$ ' + representar.toString().replace('.', ','));\n};\n\nvar calcular_descuento = function () {\n    var descuento = $('#id_descuento').val();\n    var cambio = total;\n    total = parseFloat(cambio) - parseFloat(descuento);\n    //alert(descuento);\n    //$('#id_total').html('$ ' + total.toString().replace('.', ','));\n};\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdGF0aWMvYXBwcy92ZW50YXMvanMvb3BlcmFjaW9uZXMuanM/MzYwNyJdLCJuYW1lcyI6WyJ0b3RhbCIsImNvbnRhZG9yX3RhYmxhIiwiY3JlZGl0b19wb3JjZW50YWplIiwiYXJ0aWN1bG9zX3ZlbmRpZG9zIiwiZm9ybWFfcGFnbyIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJzdHlsZSIsImRpc3BsYXkiLCJzZWxlY2Npb25fYXJ0aWN1bG8iLCJpZCIsImRlc2NyaXBjaW9uIiwibWFyY2EiLCJydWJybyIsInByZWNpb192ZW50YSIsInByZWNpb19jcmVkaXRvIiwicHJlY2lvX2NvbXByYSIsInN0b2NrIiwicHJvdmVlZG9yIiwiY2FudGlkYWQiLCJwcm9tcHQiLCJwcmVjaW9fZW52aWFyIiwiY2FsY3VsYXJfdG90YWwiLCIkIiwiYWZ0ZXIiLCJ0b1N0cmluZyIsImd1YXJkYXJfY29tcHJhIiwiYWpheCIsInVybCIsInR5cGUiLCJkYXRhIiwidmVudGFzIiwiSlNPTiIsInN0cmluZ2lmeSIsImZlY2hhIiwidmFsIiwicHJlY2lvX3ZlbnRhX3RvdGFsIiwiY3NyZm1pZGRsZXdhcmV0b2tlbiIsInN1Y2Nlc3MiLCJQTm90aWZ5IiwidGl0bGUiLCJ0ZXh0IiwiaHRtbCIsImVtcHR5Iiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiaWRfdmVudGEiLCJrZXlwcmVzcyIsImUiLCJ3aGljaCIsIm9iaiIsInB1c2giLCJwYXJzZUZsb2F0IiwicmVwbGFjZSIsInJlcHJlc2VudGFyIiwidG9GaXhlZCIsImNhbGN1bGFyX3RpcG9fcGFnbyIsImZvcm1hX3BhZ29fcGFyYW1ldHJvIiwicHJvcCIsImhpZGUiLCJlbGltaW5hcl9hcnRpY3VsbyIsInNwbGljZSIsInJlbW92ZSIsImFncmVnYXJfY2FudGlkYWQiLCJjb250YWRvciIsInByZWNpbyIsImNhbnRpZGFkX3RhYmxhIiwicm93cyIsImNlbGxzIiwiaXRlbSIsImlubmVySFRNTCIsInBhcnNlSW50IiwiY2xpY2siLCJmb2N1c291dCIsImNhbGN1bGFyX3Z1ZWx0byIsImNhbGN1bGFyX2Rlc2N1ZW50byIsImtleUNvZGUiLCJwYWdvIiwidnVlbHRvIiwiY2FsY3VsYXJfYXVtZW50byIsInBvcmNlbnRhamUiLCJhdW1lbnRvIiwidG90YWxfYXVtZW50YWRvIiwiZGVzY3VlbnRvIiwiY2FtYmlvIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNZLElBQUlBLFFBQVEsR0FBWjtBQUNBLElBQUlDLGlCQUFpQixDQUFyQjtBQUNBLElBQUlDLHFCQUFxQixDQUF6QjtBQUNBLElBQUlDLHFCQUFxQixFQUF6QjtBQUNBLElBQUlDLGFBQWEsRUFBakI7QUFDUDtBQUNPQyxTQUFTQyxjQUFULENBQXdCLGFBQXhCLEVBQXVDQyxLQUF2QyxDQUE2Q0MsT0FBN0MsR0FBdUQsTUFBdkQ7QUFDQUgsU0FBU0MsY0FBVCxDQUF3QixlQUF4QixFQUF5Q0MsS0FBekMsQ0FBK0NDLE9BQS9DLEdBQXlELE1BQXpEO0FBQ0FILFNBQVNDLGNBQVQsQ0FBd0Isa0JBQXhCLEVBQTRDQyxLQUE1QyxDQUFrREMsT0FBbEQsR0FBNEQsTUFBNUQ7QUFDUDtBQUNPSCxTQUFTQyxjQUFULENBQXdCLG1CQUF4QixFQUE2Q0MsS0FBN0MsQ0FBbURDLE9BQW5ELEdBQTZELE1BQTdEO0FBQ0FILFNBQVNDLGNBQVQsQ0FBd0Isc0JBQXhCLEVBQWdEQyxLQUFoRCxDQUFzREMsT0FBdEQsR0FBZ0UsTUFBaEU7O0FBRUEsSUFBSUMscUJBQXFCLFVBQVNDLEVBQVQsRUFBYUMsV0FBYixFQUEwQkMsS0FBMUIsRUFBaUNDLEtBQWpDLEVBQXdDQyxZQUF4QyxFQUFzREMsY0FBdEQsRUFBc0VDLGFBQXRFLEVBQXFGQyxLQUFyRixFQUE0RkMsU0FBNUYsRUFBc0c7QUFDM0gsUUFBSUMsV0FBV0MsT0FBTyxxQkFBUCxFQUE4QixFQUE5QixDQUFmO0FBQ0EsUUFBSUMsZ0JBQWdCLEVBQXBCO0FBQ0EsUUFBSUYsWUFBWSxJQUFaLElBQW9CQSxZQUFZ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QndFLFNBQVNTLFVBQVQsQ0FBcEIsR0FBeUMsR0FBdkQ7QUFDQSxRQUFJRSxrQkFBa0I5QixXQUFXckQsS0FBWCxJQUFvQnFELFdBQVc2QixPQUFYLENBQTFDO0FBQ0EsUUFBSTNCLGNBQWM0QixnQkFBZ0IzQixPQUFoQixDQUF3QixDQUF4QixDQUFsQjtBQUNBakMsTUFBRSxtQkFBRixFQUF1Qm1CLElBQXZCLENBQTRCLE9BQU9hLFlBQVk5QixRQUFaLEdBQXVCNkIsT0FBdkIsQ0FBK0IsR0FBL0IsRUFBb0MsR0FBcEMsQ0FBbkM7QUFDSCxDQVJEOztBQVVBLElBQUlzQixxQkFBcUIsWUFBVTtBQUM5QixRQUFJUSxZQUFZN0QsRUFBRSxlQUFGLEVBQW1CWSxHQUFuQixFQUFoQjtBQUNBLFFBQUlrRCxTQUFTckYsS0FBYjtBQUNBQSxZQUFRcUQsV0FBV2dDLE1BQVgsSUFBcUJoQyxXQUFXK0IsU0FBWCxDQUE3QjtBQUNBO0FBQ0E7QUFDSixDQU5EIiwiZmlsZSI6IjI5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogLS0tLSB2YXJpYWJsZXMgZ2xvYmFsZXMgLS0tLSAqL1xuICAgICAgICAgICAgdmFyIHRvdGFsID0gMC4wO1xuICAgICAgICAgICAgdmFyIGNvbnRhZG9yX3RhYmxhID0gMDtcbiAgICAgICAgICAgIHZhciBjcmVkaXRvX3BvcmNlbnRhamUgPSAwO1xuICAgICAgICAgICAgdmFyIGFydGljdWxvc192ZW5kaWRvcyA9IFtdO1xuICAgICAgICAgICAgdmFyIGZvcm1hX3BhZ28gPSAnJztcbiAgICAgLyogLS0tIGhhY2VyIGludmlzaWJsZSBsb3MgY2FtcG9zIHF1ZSBzb2xvIHNvbiBwYXJhIGVmZWN0aXZvIC0tLS0gKi9cbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfcGFnbycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3Z1ZWx0bycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X2Rlc2N1ZW50bycpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgIC8qIC0tLSBoYWNlciBpbnZpc2libGUgbG9zIGNhbXBvcyBxdWUgc29sbyBzb24gcGFyYSBjcsOpZGl0byAtLS0tICovXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3BvcmNlbnRhamUnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9jcmVkaXRvX3RvdGFsJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICAgICAgICAgICAgdmFyIHNlbGVjY2lvbl9hcnRpY3VsbyA9IGZ1bmN0aW9uKGlkLCBkZXNjcmlwY2lvbiwgbWFyY2EsIHJ1YnJvLCBwcmVjaW9fdmVudGEsIHByZWNpb19jcmVkaXRvLCBwcmVjaW9fY29tcHJhLCBzdG9jaywgcHJvdmVlZG9yKXtcbiAgICAgICAgICAgICAgICB2YXIgY2FudGlkYWQgPSBwcm9tcHQoXCJJbmdyZXNlIGxhIGNhbnRpZGFkXCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgIHZhciBwcmVjaW9fZW52aWFyID0gJyc7XG4gICAgICAgICAgICAgICAgaWYgKGNhbnRpZGFkICE9IG51bGwgJiYgY2FudGlkYWQgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChmb3JtYV9wYWdvKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2VmZWN0aXZvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gcHJlY2lvX3ZlbnRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY3JlZGl0byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IHByZWNpb192ZW50YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2RlYml0byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IHByZWNpb192ZW50YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfdG90YWwoY2FudGlkYWQsIGlkLCBwcmVjaW9fZW52aWFyKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGFkb3JfdGFibGEgKz0xO1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdGFibGFfYXJ0aWN1bG9zIHRyOmxhc3QnKS5hZnRlcignPHRyIGlkPVwidHJfJyArIGNvbnRhZG9yX3RhYmxhLnRvU3RyaW5nKCkgKyAnXCI+PHRkPicgKyBjYW50aWRhZCArICc8L3RkPicgKyAnPHRkPicgKyBkZXNjcmlwY2lvbiArICc8L3RkPicgKyAnPHRkPidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArIG1hcmNhICsgJzwvdGQ+JyArICc8dGQ+JyArIHJ1YnJvICsgJzwvdGQ+JyArICc8dGQ+ICQnICsgcHJlY2lvX2VudmlhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgJzwvdGQ+JyArICc8dGQ+JyArIHN0b2NrICsgJzwvdGQ+JyArICc8dGQ+PGEgb25jbGljaz1cImVsaW1pbmFyX2FydGljdWxvKCcgKyBjb250YWRvcl90YWJsYS50b1N0cmluZygpICsgJywnICsgY2FudGlkYWQgKyAnLCcgKyBwcmVjaW9fZW52aWFyICsnKVwiICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjbGFzcz1cImJ0biBidG4tZGFuZ2VyIGJ0bi14c1wiPjxpIGNsYXNzPVwiZmEgZmEtdHJhc2hcIj48L2k+IDwvYT48L3RkPjwvdHI+Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIGd1YXJkYXJfY29tcHJhID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvdmVudGFzL2FqYXgvdmVudGFzL2FsdGEvJyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2ZW50YXM6IEpTT04uc3RyaW5naWZ5KGFydGljdWxvc192ZW5kaWRvcyksXG4gICAgICAgICAgICAgICAgICAgICAgICBmZWNoYTogJCgnI2lkX2ZlY2hhJykudmFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX3ZlbnRhX3RvdGFsOiB0b3RhbC50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWFfcGFnbzogZm9ybWFfcGFnbyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWRpdG9fcG9yY2VudGFqZTogY3JlZGl0b19wb3JjZW50YWplLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3NyZm1pZGRsZXdhcmV0b2tlbjogJChcImlucHV0W25hbWU9Y3NyZm1pZGRsZXdhcmV0b2tlbl1cIikudmFsKClcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgUE5vdGlmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnU2lzdGVtYScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEuc3VjY2VzcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3RvdGFsJykuaHRtbCgnJCAwLjAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdGFibGFfYXJ0aWN1bG9zJykuZW1wdHkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvdmVudGFzL3RpY2tldC8nICsgZGF0YS5pZF92ZW50YVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgLyogLS0tLSBmdW5jaW9uIHBhcmEgZWwgbGVjdG9yIGRlIGNvZGlnbyBkZSBiYXJyYXMgLS0tICovXG4gICAgICAgICAgICAkKCcjaWRfY29kaWdvX2FydGljdWxvX2J1c2NhcicpLmtleXByZXNzKGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgIGlmIChlLndoaWNoID09IDEzKXtcbiAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJy92ZW50YXMvYWpheC9jb2RpZ28vYXJ0aWN1bG8vJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY29kaWdvX2FydGljdWxvJzogJCgnI2lkX2NvZGlnb19hcnRpY3Vsb19idXNjYXInKS52YWwoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjc3JmbWlkZGxld2FyZXRva2VuOiAkKFwiaW5wdXRbbmFtZT1jc3JmbWlkZGxld2FyZXRva2VuXVwiKS52YWwoKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcmVjaW9fZW52aWFyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChmb3JtYV9wYWdvKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnZWZlY3Rpdm8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IGRhdGEucHJlY2lvX3ZlbnRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NyZWRpdG8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IGRhdGEucHJlY2lvX3ZlbnRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2RlYml0byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVjaW9fZW52aWFyID0gZGF0YS5wcmVjaW9fdmVudGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhZG9yX3RhYmxhICs9MTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxjdWxhcl90b3RhbCgnMScsIGRhdGEuaWQsIHByZWNpb19lbnZpYXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNpZF90YWJsYV9hcnRpY3Vsb3MgdHI6bGFzdCcpLmFmdGVyKCc8dHIgaWQ9XCJ0cl8nICsgY29udGFkb3JfdGFibGEudG9TdHJpbmcoKSArICdcIj48dGQ+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmNhbnRpZGFkICsgJzwvdGQ+JyArICc8dGQ+JyArIGRhdGEuZGVzY3JpcGNpb24gKyAnPC90ZD4nICsgJzx0ZD4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBkYXRhLm1hcmNhICsgJzwvdGQ+JyArICc8dGQ+JyArIGRhdGEucnVicm8gKyAnPC90ZD4nICsgJzx0ZD4gJCcgKyBwcmVjaW9fZW52aWFyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnPC90ZD4nICsgJzx0ZD4nICsgZGF0YS5zdG9jayArICc8dGQ+PGEgb25jbGljaz1cImFncmVnYXJfY2FudGlkYWQoJyArIGNvbnRhZG9yX3RhYmxhLnRvU3RyaW5nKCkgKyAnLCcgKyBkYXRhLmlkICsgJywnICsgcHJlY2lvX2VudmlhciArICcpXCIgJyArICdjbGFzcz1cImJ0biBidG4taW5mbyBidG4teHNcIj48aSBjbGFzcz1cImZhIGZhLXBsdXNcIj48L2k+IDwvYT48YSBvbmNsaWNrPVwiZWxpbWluYXJfYXJ0aWN1bG8oJyArIGNvbnRhZG9yX3RhYmxhLnRvU3RyaW5nKCkgKyAnLCcgKyBkYXRhLmNhbnRpZGFkICsgJywnICsgcHJlY2lvX2VudmlhciArICcpXCIgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjbGFzcz1cImJ0biBidG4tZGFuZ2VyIGJ0bi14c1wiPjxpIGNsYXNzPVwiZmEgZmEtdHJhc2hcIj48L2k+IDwvYT48L3RkPjwvdHI+Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfY29kaWdvX2FydGljdWxvX2J1c2NhcicpLnZhbCgnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgLyogLS0tLSBmdW5jaW9uIHBhcmEgZWwgbGVjdG9yIGRlIGNvZGlnbyBkZSBiYXJyYXMgLS0tICovXG5cbiAgICAvKiAtLS0tLS0tLS0tIEVzdGEgZnVuY2lvbiBjYWxjdWxhIGVsIHRvdGFsIHkgbGEgY29sb2NhXG4gICAgKioqIC0tLS0tLS0tLS0gZW4gbGEgcGFydGUgaW5mZXJpb3IgZGVsIGZvcm11bGFyaW8gZGUgdmVudGFzIC0tLS0gKi9cbiAgICAgICAgICAgIHZhciBjYWxjdWxhcl90b3RhbCA9IGZ1bmN0aW9uKGNhbnRpZGFkLCBpZCwgcHJlY2lvX3ZlbnRhKXtcbiAgICAvKiAtLS0tIEFybWFyIHVuIGFycmF5IGNvbiBsb3MgYXJ0aWN1bG9zIHZlbmRpZG9zIC0tLS0tICovXG4gICAgICAgICAgICAgICAgICAgIHZhciBvYmogPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgb2JqWydpZCddID0gaWQ7XG4gICAgICAgICAgICAgICAgICAgIG9ialsnY2FudGlkYWQnXSA9IGNhbnRpZGFkO1xuICAgICAgICAgICAgICAgICAgICBhcnRpY3Vsb3NfdmVuZGlkb3MucHVzaChvYmopO1xuICAgIC8qIC0tLS0gQXJtYXIgdW4gYXJyYXkgY29uIGxvcyBhcnRpY3Vsb3MgdmVuZGlkb3MgLS0tLS0gKi9cblxuICAgICAgICAgICAgICAgICAgICB0b3RhbCArPSAocGFyc2VGbG9hdChjYW50aWRhZCkgKiBwYXJzZUZsb2F0KHByZWNpb192ZW50YS50b1N0cmluZygpLnJlcGxhY2UoJywnLCAnLicpKSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXByZXNlbnRhciA9IHRvdGFsLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF90b3RhbCcpLmh0bWwoJyQgJyArIHJlcHJlc2VudGFyLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICcsJykpO1xuICAgICAgICAgICAgfTtcbiAgICAvKiAtLS0tLS0tLS0tIEVzdGEgZnVuY2lvbiBjYWxjdWxhIGVsIHRvdGFsIHkgbGEgY29sb2NhXG4gICAgLS0tLS0tLS0tLSBlbiBsYSBwYXJ0ZSBpbmZlcmlvciBkZWwgZm9ybXVsYXJpbyBkZSB2ZW50YXMgLS0tLSAqL1xuXG4gICAgLyogLS0tLSBkZXRlY3RhciBxdWUgdGlwbyBkZSBwYWdvIGVzIC0tLS0gKi9cbiAgICAgICAgICAgIHZhciBjYWxjdWxhcl90aXBvX3BhZ28gPSBmdW5jdGlvbihmb3JtYV9wYWdvX3BhcmFtZXRybyl7XG4gICAgICAgICAgICAgICAgJCgnI2lkX2ZlY2hhJykucHJvcCggXCJkaXNhYmxlZFwiLCBmYWxzZSApO1xuICAgICAgICAgICAgICAgICQoJyNpZF9jb2RpZ29fYXJ0aWN1bG9fYnVzY2FyJykucHJvcCggXCJkaXNhYmxlZFwiLCBmYWxzZSApO1xuICAgICAgICAgICAgICAgICQoJyNpZF9idXR0b25fYnVzY2FyJykucHJvcCggXCJkaXNhYmxlZFwiLCBmYWxzZSApO1xuICAgICAgICAgICAgICAgICQoJyNpZF9idXR0b25fZ3VhcmRhcl9jb21wcmEnKS5wcm9wKCBcImRpc2FibGVkXCIsIGZhbHNlICk7XG4gICAgICAgICAgICAgICAgLy8gUG9uZ28gZGlzYWJsZWQgbGEgc2VsZWNjaW9uIGRlIGxhIGZvcm1hIGRlIHBhZ29cbiAgICAgICAgICAgICAgICBmb3JtYV9wYWdvID0gZm9ybWFfcGFnb19wYXJhbWV0cm87XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hX3BhZ28gPT0gJ2VmZWN0aXZvJyl7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNpIGVzIGVmZWN0aXZvIGhhYmlsaXRvIHN1cyByZXNwZWN0aXZvcyBwYWdvc1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3BhZ28nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl92dWVsdG8nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9kZXNjdWVudG8nKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvID09ICdjcmVkaXRvJyl7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNpIGVzIGNyZWRpdG8gaGFiaWxpdG8gc3VzIHJlc3BlY3Rpdm9zIGF1bWVudG9zXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfcG9yY2VudGFqZScpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X2NyZWRpdG9fdG90YWwnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvICE9ICdlZmVjdGl2bycpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfZWZlY3Rpdm8nKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyAhPSAnY3JlZGl0bycpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfY3JlZGl0bycpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvICE9ICdkZWJpdG8nKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2RlYml0bycpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfTtcbiAgICAvKiAtLS0tIGRldGVjdGFyIHF1ZSB0aXBvIGRlIHBhZ28gZXMgLS0tLSAqL1xuXG4gICAgLyogLS0tLSBFbGltaW5hciB1biBhcnRpY3VsbyBkZXNkZSBsYSB0YWJsYSAtLS0tICovXG4gICAgICAgICAgICB2YXIgZWxpbWluYXJfYXJ0aWN1bG8gPSBmdW5jdGlvbihpZCwgY2FudGlkYWQsIHByZWNpb19lbnZpYXIpe1xuXG4gICAgICAgICAgICAgICAgYXJ0aWN1bG9zX3ZlbmRpZG9zLnNwbGljZShpZCwgMSk7XG4gICAgICAgICAgICAgICAgJCgnI3RyXycgKyBpZCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgdG90YWwgLT0gKHBhcnNlRmxvYXQoY2FudGlkYWQpICogcGFyc2VGbG9hdChwcmVjaW9fZW52aWFyLnRvU3RyaW5nKCkucmVwbGFjZSgnLCcsICcuJykpKTtcbiAgICAgICAgICAgICAgICB2YXIgcmVwcmVzZW50YXIgPSB0b3RhbC50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICQoJyNpZF90b3RhbCcpLmh0bWwoJyQgJyArIHJlcHJlc2VudGFyLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICcsJykpO1xuXG4gICAgICAgICAgICB9O1xuICAgIC8qIC0tLS0gRWxpbWluYXIgdW4gYXJ0aWN1bG8gZGVzZGUgbGEgdGFibGEgLS0tLSAqL1xuXG4gICAgLyogLS0tLSBBZ3JlZ2FyIGNhbnRpZGFkIGEgdW4gYXJ0aWN1bG8gZGVzZGUgbGEgdGFibGEgLS0tLSAqL1xuICAgICAgICAgICAgdmFyIGFncmVnYXJfY2FudGlkYWQgPSBmdW5jdGlvbihjb250YWRvciwgaWQsIHByZWNpbyl7XG4gICAgICAgICAgICAgICAgdmFyIGNhbnRpZGFkID0gcHJvbXB0KFwiSW5ncmVzZSBsYSBjYW50aWRhZFwiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICBpZiAoY2FudGlkYWQgIT0gbnVsbCAmJiBjYW50aWRhZCAhPSAnJykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2FudGlkYWRfdGFibGEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlkX3RhYmxhX2FydGljdWxvc1wiKS5yb3dzW2NvbnRhZG9yICsgMV0uY2VsbHMuaXRlbSgwKS5pbm5lckhUTUw7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWRfdGFibGFfYXJ0aWN1bG9zXCIpLnJvd3NbY29udGFkb3IgKyAxXS5jZWxscy5pdGVtKDApLmlubmVySFRNTCA9IHBhcnNlSW50KGNhbnRpZGFkX3RhYmxhKSArIHBhcnNlSW50KGNhbnRpZGFkKTtcbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfdG90YWwoY2FudGlkYWQsIGlkLCBwcmVjaW8pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgLyogLS0tLSBBZ3JlZ2FyIGNhbnRpZGFkIGEgdW4gYXJ0aWN1bG8gZGVzZGUgbGEgdGFibGEgLS0tLSAqL1xuXG4gICAgLyogLS0tLSBFdmVudG8geSBtZXRvZG9zIHBhcmEgdnVlbHRvcyBzaSBlcyBlZmVjdGl2byAtLS0tICovXG4gICAgICAgICAgICAkKCcjaWRfcGFnbycpLmNsaWNrKCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfcGFnbycpLnZhbCgpID09ICcwJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9wYWdvJykudmFsKCcgJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjaWRfZGVzY3VlbnRvJykuY2xpY2soIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9kZXNjdWVudG8nKS52YWwoKSA9PSAnMCcpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfZGVzY3VlbnRvJykudmFsKCcgJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgLyogLS0tIHBvciBjYWRhIGV2ZW50byBjYWxjdWxhciBlbCB2dWVsdG8gLS0tICovXG4gICAgICAgICAgICAkKCcjaWRfcGFnbycpLmZvY3Vzb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfcGFnbycpLnZhbCgpID09ICcnKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3BhZ28nKS52YWwoJzAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FsY3VsYXJfdnVlbHRvKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJyNpZF9kZXNjdWVudG8nKS5mb2N1c291dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjYWxjdWxhcl9kZXNjdWVudG8oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50bycpLmZvY3Vzb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNhbGN1bGFyX2Rlc2N1ZW50bygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjaWRfcGFnbycpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3Z1ZWx0bygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIGNhbGN1bGFyX3Z1ZWx0byA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLyogLS0tLS0gY2FsY3VsYSBzaSBlcyBlZmVjdGl2byBlbCB2dWVsdG8gLS0tLS0gKi9cblxuICAgICAgICAgICAgICAgIHZhciBwYWdvID0gJCgnI2lkX3BhZ28nKS52YWwoKTtcbiAgICAgICAgICAgICAgICB2YXIgdnVlbHRvID0gcGFyc2VGbG9hdChwYWdvKSAtIHBhcnNlRmxvYXQodG90YWwpO1xuICAgICAgICAgICAgICAgIHZhciByZXByZXNlbnRhciA9IHZ1ZWx0by50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICQoJyNpZF92dWVsdG8nKS5odG1sKCckICcgKyByZXByZXNlbnRhci50b1N0cmluZygpLnJlcGxhY2UoJy4nLCAnLCcpKTtcbiAgICAgICAgICAgIH07XG4gICAgLyogLS0tLSBFdmVudG8geSBtZXRvZG9zIHBhcmEgdnVlbHRvcyBzaSBlcyBlZmVjdGl2byAtLS0tICovXG4gICAgLyogLS0tLSBFdmVudG8geSBtZXRvZG9zIHBhcmEgZGVzY3VlbnRvIHNpIGVzIGVmZWN0aXZvIC0tLS0gKi9cbiAgICAgICAgICAgLyogJCgnI2lkX2Rlc2N1ZW50bycpLmZvY3Vzb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgLy8gY2FsY3VsYXJfZGVzY3VlbnRvKCk7XG4gICAgICAgICAgICB9KTsqL1xuICAgICAgICAgICAgICQoJyNpZF9kZXNjdWVudG8nKS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAxMykge1xuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhcl9kZXNjdWVudG8oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAvKiAtLS0tIEV2ZW50byB5IG1ldG9kb3MgcGFyYSBkZXNjdWVudG8gc2kgZXMgZWZlY3Rpdm8gLS0tLSAqL1xuXG4gICAgLyogLS0tLSBFdmVudG8geSBtZXRvZG9zIHBhcmEgYXVtZW50byBzaSBlcyBjcmVkaXRvIC0tLS0gKi9cbiAgICAgICAgICAgICQoJyNpZF9wb3JjZW50YWplJykuY2xpY2soIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNpZF9wb3JjZW50YWplJykudmFsKCkgPT0gJzAnKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3BvcmNlbnRhamUnKS52YWwoJyAnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8qIC0tLSBwb3IgY2FkYSBldmVudG8gY2FsY3VsYXIgZWwgdnVlbHRvIC0tLSAqL1xuICAgICAgICAgICAgJCgnI2lkX3BvcmNlbnRhamUnKS5mb2N1c291dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjYWxjdWxhcl9hdW1lbnRvKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJyNpZF9wb3JjZW50YWplJykua2V5cHJlc3MoZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfYXVtZW50bygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIGNhbGN1bGFyX2F1bWVudG8gPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIC8qIC0tLS0tIGNhbGN1bGEgc2kgZXMgY3JlZGl0byBlbCBhdW1lbnRvIC0tLS0tICovXG4gICAgICAgICAgICAgICAgdmFyIHBvcmNlbnRhamUgPSAkKCcjaWRfcG9yY2VudGFqZScpLnZhbCgpO1xuICAgICAgICAgICAgICAgIGNyZWRpdG9fcG9yY2VudGFqZSA9IHBvcmNlbnRhamU7XG4gICAgICAgICAgICAgICAgdmFyIGF1bWVudG8gPSBwYXJzZUZsb2F0KHRvdGFsKSAqIHBhcnNlSW50KHBvcmNlbnRhamUpLzEwMDtcbiAgICAgICAgICAgICAgICB2YXIgdG90YWxfYXVtZW50YWRvID0gcGFyc2VGbG9hdCh0b3RhbCkgKyBwYXJzZUZsb2F0KGF1bWVudG8pO1xuICAgICAgICAgICAgICAgIHZhciByZXByZXNlbnRhciA9IHRvdGFsX2F1bWVudGFkby50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICQoJyNpZF9jcmVkaXRvX3RvdGFsJykuaHRtbCgnJCAnICsgcmVwcmVzZW50YXIudG9TdHJpbmcoKS5yZXBsYWNlKCcuJywgJywnKSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgY2FsY3VsYXJfZGVzY3VlbnRvID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgdmFyIGRlc2N1ZW50byA9ICQoJyNpZF9kZXNjdWVudG8nKS52YWwoKTtcbiAgICAgICAgICAgICAgICAgdmFyIGNhbWJpbyA9IHRvdGFsO1xuICAgICAgICAgICAgICAgICB0b3RhbCA9IHBhcnNlRmxvYXQoY2FtYmlvKSAtIHBhcnNlRmxvYXQoZGVzY3VlbnRvKTtcbiAgICAgICAgICAgICAgICAgLy9hbGVydChkZXNjdWVudG8pO1xuICAgICAgICAgICAgICAgICAvLyQoJyNpZF90b3RhbCcpLmh0bWwoJyQgJyArIHRvdGFsLnRvU3RyaW5nKCkucmVwbGFjZSgnLicsICcsJykpO1xuICAgICAgICAgICAgfVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3N0YXRpYy9hcHBzL3ZlbnRhcy9qcy9vcGVyYWNpb25lcy5qcyJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ })

})