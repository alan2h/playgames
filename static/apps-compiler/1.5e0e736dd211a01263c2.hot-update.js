webpackHotUpdate(1,{

/***/ 29:
/***/ (function(module, exports) {

eval("/* ---- variables globales ---- */\nvar total = 0.0;\nvar contador_tabla = 0;\nvar credito_porcentaje = 0;\nvar articulos_vendidos = [];\nvar forma_pago = '';\n/* --- hacer invisible los campos que solo son para efectivo ---- */\ndocument.getElementById('id_div_pago').style.display = 'none';\ndocument.getElementById('id_div_vuelto').style.display = 'none';\ndocument.getElementById('id_div_descuento').style.display = 'none';\n/* --- hacer invisible los campos que solo son para crédito ---- */\ndocument.getElementById('id_div_porcentaje').style.display = 'none';\ndocument.getElementById('id_div_credito_total').style.display = 'none';\n\nvar seleccion_articulo = function (id, descripcion, marca, rubro, precio_venta, precio_credito, precio_compra, stock, proveedor) {\n    var cantidad = prompt(\"Ingrese la cantidad\", \"\");\n    var precio_enviar = '';\n    if (cantidad != null && cantidad != '') {\n        switch (forma_pago) {\n            case 'efectivo':\n                precio_enviar = precio_venta;\n                break;\n            case 'credito':\n                precio_enviar = precio_venta;\n                break;\n            case 'debito':\n                precio_enviar = precio_venta;\n                break;\n        };\n        calcular_total(cantidad, id, precio_enviar);\n        contador_tabla += 1;\n        $('#id_tabla_articulos tr:last').after('<tr id=\"tr_' + contador_tabla.toString() + '\"><td>' + cantidad + '</td>' + '<td>' + descripcion + '</td>' + '<td>' + marca + '</td>' + '<td>' + rubro + '</td>' + '<td> $' + precio_enviar + '</td>' + '<td>' + stock + '</td>' + '<td><a onclick=\"eliminar_articulo(' + contador_tabla.toString() + ',' + cantidad + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\"></i> </a></td></tr>');\n    }\n};\n\nvar guardar_compra = function () {\n    $.ajax({\n        url: '/ventas/ajax/ventas/alta/',\n        type: 'post',\n        data: {\n            ventas: JSON.stringify(articulos_vendidos),\n            fecha: $('#id_fecha').val,\n            precio_venta_total: total.toString(),\n            forma_pago: forma_pago,\n            credito_porcentaje: credito_porcentaje,\n            csrfmiddlewaretoken: $(\"input[name=csrfmiddlewaretoken]\").val()\n        },\n        success: function (data) {\n            if (data.success) {\n                new PNotify({\n                    title: 'Sistema',\n                    text: data.success,\n                    type: 'success'\n                });\n                $('#id_total').html('$ 0.0');\n                $('#id_tabla_articulos').empty();\n                window.location.href = '/ventas/ticket/' + data.id_venta;\n            }\n        }\n    });\n};\n\n/* ---- funcion para el lector de codigo de barras --- */\n$('#id_codigo_articulo_buscar').keypress(function (e) {\n    if (e.which == 13) {\n        $.ajax({\n            url: '/ventas/ajax/codigo/articulo/',\n            type: 'post',\n            data: {\n                'codigo_articulo': $('#id_codigo_articulo_buscar').val(),\n                csrfmiddlewaretoken: $(\"input[name=csrfmiddlewaretoken]\").val()\n            },\n            success: function (data) {\n                var precio_enviar = '';\n                switch (forma_pago) {\n                    case 'efectivo':\n                        precio_enviar = data.precio_venta;\n                        break;\n                    case 'credito':\n                        precio_enviar = data.precio_venta;\n                        break;\n                    case 'debito':\n                        precio_enviar = data.precio_venta;\n                        break;\n                };\n                contador_tabla += 1;\n                calcular_total('1', data.id, precio_enviar);\n                $('#id_tabla_articulos tr:last').after('<tr id=\"tr_' + contador_tabla.toString() + '\"><td>' + data.cantidad + '</td>' + '<td>' + data.descripcion + '</td>' + '<td>' + data.marca + '</td>' + '<td>' + data.rubro + '</td>' + '<td> $' + precio_enviar + '</td>' + '<td>' + data.stock + '<td><a onclick=\"agregar_cantidad(' + contador_tabla.toString() + ',' + data.id + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-info btn-xs\"><i class=\"fa fa-plus\"></i> </a><a onclick=\"eliminar_articulo(' + contador_tabla.toString() + ',' + data.cantidad + ',' + precio_enviar + ')\" ' + 'class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\"></i> </a></td></tr>');\n            }\n        });\n        $('#id_codigo_articulo_buscar').val('');\n    }\n});\n/* ---- funcion para el lector de codigo de barras --- */\n\n/* ---------- Esta funcion calcula el total y la coloca\n*** ---------- en la parte inferior del formulario de ventas ---- */\nvar calcular_total = function (cantidad, id, precio_venta) {\n    /* ---- Armar un array con los articulos vendidos ----- */\n    var obj = {};\n    obj['id'] = id;\n    obj['cantidad'] = cantidad;\n    articulos_vendidos.push(obj);\n    /* ---- Armar un array con los articulos vendidos ----- */\n\n    total += parseFloat(cantidad) * parseFloat(precio_venta.toString().replace(',', '.'));\n    var representar = total.toFixed(2);\n    $('#id_total').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---------- Esta funcion calcula el total y la coloca\n---------- en la parte inferior del formulario de ventas ---- */\n\n/* ---- detectar que tipo de pago es ---- */\nvar calcular_tipo_pago = function (forma_pago_parametro) {\n    $('#id_fecha').prop(\"disabled\", false);\n    $('#id_codigo_articulo_buscar').prop(\"disabled\", false);\n    $('#id_button_buscar').prop(\"disabled\", false);\n    $('#id_button_guardar_compra').prop(\"disabled\", false);\n    // Pongo disabled la seleccion de la forma de pago\n    forma_pago = forma_pago_parametro;\n    if (forma_pago == 'efectivo') {\n        // si es efectivo habilito sus respectivos pagos\n        document.getElementById('id_div_pago').style.display = 'block';\n        document.getElementById('id_div_vuelto').style.display = 'block';\n        document.getElementById('id_div_descuento').style.display = 'block';\n    };\n    if (forma_pago == 'credito') {\n        // si es credito habilito sus respectivos aumentos\n        document.getElementById('id_div_porcentaje').style.display = 'block';\n        document.getElementById('id_div_credito_total').style.display = 'block';\n    };\n    if (forma_pago != 'efectivo') {\n        $('#id_efectivo').hide();\n    };\n    if (forma_pago != 'credito') {\n        $('#id_credito').hide();\n    };\n    if (forma_pago != 'debito') {\n        $('#id_debito').hide();\n    };\n};\n/* ---- detectar que tipo de pago es ---- */\n\n/* ---- Eliminar un articulo desde la tabla ---- */\nvar eliminar_articulo = function (id, cantidad, precio_enviar) {\n\n    articulos_vendidos.splice(id, 1);\n    $('#tr_' + id).remove();\n    total -= parseFloat(cantidad) * parseFloat(precio_enviar.toString().replace(',', '.'));\n    var representar = total.toFixed(2);\n    $('#id_total').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---- Eliminar un articulo desde la tabla ---- */\n\n/* ---- Agregar cantidad a un articulo desde la tabla ---- */\nvar agregar_cantidad = function (contador, id, precio) {\n    var cantidad = prompt(\"Ingrese la cantidad\", \"\");\n    if (cantidad != null && cantidad != '') {\n        var cantidad_tabla = document.getElementById(\"id_tabla_articulos\").rows[contador + 1].cells.item(0).innerHTML;\n        document.getElementById(\"id_tabla_articulos\").rows[contador + 1].cells.item(0).innerHTML = parseInt(cantidad_tabla) + parseInt(cantidad);\n        calcular_total(cantidad, id, precio);\n    }\n};\n/* ---- Agregar cantidad a un articulo desde la tabla ---- */\n\n/* ---- Evento y metodos para vueltos si es efectivo ---- */\n$('#id_pago').click(function () {\n    if ($('#id_pago').val() == '0') {\n        $('#id_pago').val(' ');\n    }\n});\n$('#id_descuento').click(function () {\n    if ($('#id_descuento').val() == '0') {\n        $('#id_descuento').val(' ');\n    }\n});\n/* --- por cada evento calcular el vuelto --- */\n$('#id_pago').focusout(function () {\n    calcular_vuelto();\n});\n$('#id_descuento').focusout(function () {\n    calcular_descuento();\n});\n$('#id_pago').keypress(function (e) {\n    if (e.keyCode == 13) {\n        calcular_vuelto();\n    }\n});\nvar calcular_vuelto = function () {\n    /* ----- calcula si es efectivo el vuelto ----- */\n\n    var pago = $('#id_pago').val();\n    var vuelto = parseFloat(pago) - parseFloat(total);\n    var representar = vuelto.toFixed(2);\n    $('#id_vuelto').html('$ ' + representar.toString().replace('.', ','));\n};\n/* ---- Evento y metodos para vueltos si es efectivo ---- */\n/* ---- Evento y metodos para descuento si es efectivo ---- */\n$('#id_descuento').focusout(function () {\n    calcular_descuento();\n});\n/* ---- Evento y metodos para descuento si es efectivo ---- */\n\n/* ---- Evento y metodos para aumento si es credito ---- */\n$('#id_porcentaje').click(function () {\n    if ($('#id_porcentaje').val() == '0') {\n        $('#id_porcentaje').val(' ');\n    }\n});\n/* --- por cada evento calcular el vuelto --- */\n$('#id_porcentaje').focusout(function () {\n    calcular_aumento();\n});\n$('#id_porcentaje').keypress(function (e) {\n    if (e.keyCode == 13) {\n        calcular_aumento();\n    }\n});\nvar calcular_aumento = function () {\n    /* ----- calcula si es credito el aumento ----- */\n    var porcentaje = $('#id_porcentaje').val();\n    credito_porcentaje = porcentaje;\n    var aumento = parseFloat(total) * parseInt(porcentaje) / 100;\n    var total_aumentado = parseFloat(total) + parseFloat(aumento);\n    var representar = total_aumentado.toFixed(2);\n    $('#id_credito_total').html('$ ' + representar.toString().replace('.', ','));\n};\n\nvar calcular_descuento = function () {\n    var descuento = $('#id_descuento').val();\n    total = parseFloat(total) - parseFloat(descuento);\n    $('#id_total').html('$ ' + total.toString().replace('.', ','));\n};\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdGF0aWMvYXBwcy92ZW50YXMvanMvb3BlcmFjaW9uZXMuanM/MzYwNyJdLCJuYW1lcyI6WyJ0b3RhbCIsImNvbnRhZG9yX3RhYmxhIiwiY3JlZGl0b19wb3JjZW50YWplIiwiYXJ0aWN1bG9zX3ZlbmRpZG9zIiwiZm9ybWFfcGFnbyIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJzdHlsZSIsImRpc3BsYXkiLCJzZWxlY2Npb25fYXJ0aWN1bG8iLCJpZCIsImRlc2NyaXBjaW9uIiwibWFyY2EiLCJydWJybyIsInByZWNpb192ZW50YSIsInByZWNpb19jcmVkaXRvIiwicHJlY2lvX2NvbXByYSIsInN0b2NrIiwicHJvdmVlZG9yIiwiY2FudGlkYWQiLCJwcm9tcHQiLCJwcmVjaW9fZW52aWFyIiwiY2FsY3VsYXJfdG90YWwiLCIkIiwiYWZ0ZXIiLCJ0b1N0cmluZyIsImd1YXJkYXJfY29tcHJhIiwiYWpheCIsInVybCIsInR5cGUiLCJkYXRhIiwidmVudGFzIiwiSlNPTiIsInN0cmluZ2lmeSIsImZlY2hhIiwidmFsIiwicHJlY2lvX3ZlbnRhX3RvdGFsIiwiY3NyZm1pZGRsZXdhcmV0b2tlbiIsInN1Y2Nlc3MiLCJQTm90aWZ5IiwidGl0bGUiLCJ0ZXh0IiwiaHRtbCIsImVtcHR5Iiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiaWRfdmVudGEiLCJrZXlwcmVzcyIsImUiLCJ3aGljaCIsIm9iaiIsInB1c2giLCJwYXJzZUZsb2F0IiwicmVwbGFjZSIsInJlcHJlc2VudGFyIiwidG9GaXhlZCIsImNhbGN1bGFyX3RpcG9fcGFnbyIsImZvcm1hX3BhZ29fcGFyYW1ldHJvIiwicHJvcCIsImhpZGUiLCJlbGltaW5hcl9hcnRpY3VsbyIsInNwbGljZSIsInJlbW92ZSIsImFncmVnYXJfY2FudGlkYWQiLCJjb250YWRvciIsInByZWNpbyIsImNhbnRpZGFkX3RhYmxhIiwicm93cyIsImNlbGxzIiwiaXRlbSIsImlubmVySFRNTCIsInBhcnNlSW50IiwiY2xpY2siLCJmb2N1c291dCIsImNhbGN1bGFyX3Z1ZWx0byIsImNhbGN1bGFyX2Rlc2N1ZW50byIsImtleUNvZGUiLCJwYWdvIiwidnVlbHRvIiwiY2FsY3VsYXJfYXVtZW50byIsInBvcmNlbnRhamUiLCJhdW1lbnRvIiwidG90YWxfYXVtZW50YWRvIiwiZGVzY3VlbnRvIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNZLElBQUlBLFFBQVEsR0FBWjtBQUNBLElBQUlDLGlCQUFpQixDQUFyQjtBQUNBLElBQUlDLHFCQUFxQixDQUF6QjtBQUNBLElBQUlDLHFCQUFxQixFQUF6QjtBQUNBLElBQUlDLGFBQWEsRUFBakI7QUFDUDtBQUNPQyxTQUFTQyxjQUFULENBQXdCLGFBQXhCLEVBQXVDQyxLQUF2QyxDQUE2Q0MsT0FBN0MsR0FBdUQsTUFBdkQ7QUFDQUgsU0FBU0MsY0FBVCxDQUF3QixlQUF4QixFQUF5Q0MsS0FBekMsQ0FBK0NDLE9BQS9DLEdBQXlELE1BQXpEO0FBQ0FILFNBQVNDLGNBQVQsQ0FBd0Isa0JBQXhCLEVBQTRDQyxLQUE1QyxDQUFrREMsT0FBbEQsR0FBNEQsTUFBNUQ7QUFDUDtBQUNPSCxTQUFTQyxjQUFULENBQXdCLG1CQUF4QixFQUE2Q0MsS0FBN0MsQ0FBbURDLE9BQW5ELEdBQTZELE1BQTdEO0FBQ0FILFNBQVNDLGNBQVQsQ0FBd0Isc0JBQXhCLEVBQWdEQyxLQUFoRCxDQUFzREMsT0FBdEQsR0FBZ0UsTUFBaEU7O0FBRUEsSUFBSUMscUJBQXFCLFVBQVNDLEVBQVQsRUFBYUMsV0FBYixFQUEwQkMsS0FBMUIsRUFBaUNDLEtBQWpDLEVBQXdDQyxZQUF4QyxFQUFzREMsY0FBdEQsRUFBc0VDLGFBQXRFLEVBQXFGQyxLQUFyRixFQUE0RkMsU0FBNUYsRUFBc0c7QUFDM0gsUUFBSUMsV0FBV0MsT0FBTyxxQkFBUCxFQUE4QixFQUE5QixDQUFmO0FBQ0EsUUFBSUMsZ0JBQWdCLEVBQXBCO0FBQ0EsUUFBSUYsWUFBWSxJQUFaLElBQW9CQSxZQUFZLEVBQXBDLEVB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QyxHQUFwQyxDQUFuQztBQUNILENBUkQ7O0FBVUEsSUFBSXNCLHFCQUFxQixZQUFVO0FBQzlCLFFBQUlRLFlBQVk3RCxFQUFFLGVBQUYsRUFBbUJZLEdBQW5CLEVBQWhCO0FBQ0FuQyxZQUFRcUQsV0FBV3JELEtBQVgsSUFBb0JxRCxXQUFXK0IsU0FBWCxDQUE1QjtBQUNBN0QsTUFBRSxXQUFGLEVBQWVtQixJQUFmLENBQW9CLE9BQU8xQyxNQUFNeUIsUUFBTixHQUFpQjZCLE9BQWpCLENBQXlCLEdBQXpCLEVBQThCLEdBQTlCLENBQTNCO0FBQ0osQ0FKRCIsImZpbGUiOiIyOS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIC0tLS0gdmFyaWFibGVzIGdsb2JhbGVzIC0tLS0gKi9cbiAgICAgICAgICAgIHZhciB0b3RhbCA9IDAuMDtcbiAgICAgICAgICAgIHZhciBjb250YWRvcl90YWJsYSA9IDA7XG4gICAgICAgICAgICB2YXIgY3JlZGl0b19wb3JjZW50YWplID0gMDtcbiAgICAgICAgICAgIHZhciBhcnRpY3Vsb3NfdmVuZGlkb3MgPSBbXTtcbiAgICAgICAgICAgIHZhciBmb3JtYV9wYWdvID0gJyc7XG4gICAgIC8qIC0tLSBoYWNlciBpbnZpc2libGUgbG9zIGNhbXBvcyBxdWUgc29sbyBzb24gcGFyYSBlZmVjdGl2byAtLS0tICovXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3BhZ28nKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl92dWVsdG8nKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9kZXNjdWVudG8nKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAvKiAtLS0gaGFjZXIgaW52aXNpYmxlIGxvcyBjYW1wb3MgcXVlIHNvbG8gc29uIHBhcmEgY3LDqWRpdG8gLS0tLSAqL1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9wb3JjZW50YWplJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfY3JlZGl0b190b3RhbCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cbiAgICAgICAgICAgIHZhciBzZWxlY2Npb25fYXJ0aWN1bG8gPSBmdW5jdGlvbihpZCwgZGVzY3JpcGNpb24sIG1hcmNhLCBydWJybywgcHJlY2lvX3ZlbnRhLCBwcmVjaW9fY3JlZGl0bywgcHJlY2lvX2NvbXByYSwgc3RvY2ssIHByb3ZlZWRvcil7XG4gICAgICAgICAgICAgICAgdmFyIGNhbnRpZGFkID0gcHJvbXB0KFwiSW5ncmVzZSBsYSBjYW50aWRhZFwiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICB2YXIgcHJlY2lvX2VudmlhciA9ICcnO1xuICAgICAgICAgICAgICAgIGlmIChjYW50aWRhZCAhPSBudWxsICYmIGNhbnRpZGFkICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoZm9ybWFfcGFnbyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdlZmVjdGl2byc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IHByZWNpb192ZW50YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NyZWRpdG8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBwcmVjaW9fdmVudGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdkZWJpdG8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBwcmVjaW9fdmVudGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3RvdGFsKGNhbnRpZGFkLCBpZCwgcHJlY2lvX2Vudmlhcik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhZG9yX3RhYmxhICs9MTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3RhYmxhX2FydGljdWxvcyB0cjpsYXN0JykuYWZ0ZXIoJzx0ciBpZD1cInRyXycgKyBjb250YWRvcl90YWJsYS50b1N0cmluZygpICsgJ1wiPjx0ZD4nICsgY2FudGlkYWQgKyAnPC90ZD4nICsgJzx0ZD4nICsgZGVzY3JpcGNpb24gKyAnPC90ZD4nICsgJzx0ZD4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBtYXJjYSArICc8L3RkPicgKyAnPHRkPicgKyBydWJybyArICc8L3RkPicgKyAnPHRkPiAkJyArIHByZWNpb19lbnZpYXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArICc8L3RkPicgKyAnPHRkPicgKyBzdG9jayArICc8L3RkPicgKyAnPHRkPjxhIG9uY2xpY2s9XCJlbGltaW5hcl9hcnRpY3VsbygnICsgY29udGFkb3JfdGFibGEudG9TdHJpbmcoKSArICcsJyArIGNhbnRpZGFkICsgJywnICsgcHJlY2lvX2VudmlhciArJylcIiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2xhc3M9XCJidG4gYnRuLWRhbmdlciBidG4teHNcIj48aSBjbGFzcz1cImZhIGZhLXRyYXNoXCI+PC9pPiA8L2E+PC90ZD48L3RyPicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBndWFyZGFyX2NvbXByYSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL3ZlbnRhcy9hamF4L3ZlbnRhcy9hbHRhLycsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmVudGFzOiBKU09OLnN0cmluZ2lmeShhcnRpY3Vsb3NfdmVuZGlkb3MpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmVjaGE6ICQoJyNpZF9mZWNoYScpLnZhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb192ZW50YV90b3RhbDogdG90YWwudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hX3BhZ286IGZvcm1hX3BhZ28sXG4gICAgICAgICAgICAgICAgICAgICAgICBjcmVkaXRvX3BvcmNlbnRhamU6IGNyZWRpdG9fcG9yY2VudGFqZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNzcmZtaWRkbGV3YXJldG9rZW46ICQoXCJpbnB1dFtuYW1lPWNzcmZtaWRkbGV3YXJldG9rZW5dXCIpLnZhbCgpXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2Vzcyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFBOb3RpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1Npc3RlbWEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBkYXRhLnN1Y2Nlc3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdWNjZXNzJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNpZF90b3RhbCcpLmh0bWwoJyQgMC4wJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2lkX3RhYmxhX2FydGljdWxvcycpLmVtcHR5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL3ZlbnRhcy90aWNrZXQvJyArIGRhdGEuaWRfdmVudGFcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgIC8qIC0tLS0gZnVuY2lvbiBwYXJhIGVsIGxlY3RvciBkZSBjb2RpZ28gZGUgYmFycmFzIC0tLSAqL1xuICAgICAgICAgICAgJCgnI2lkX2NvZGlnb19hcnRpY3Vsb19idXNjYXInKS5rZXlwcmVzcyhmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBpZiAoZS53aGljaCA9PSAxMyl7XG4gICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvdmVudGFzL2FqYXgvY29kaWdvL2FydGljdWxvLycsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NvZGlnb19hcnRpY3Vsbyc6ICQoJyNpZF9jb2RpZ29fYXJ0aWN1bG9fYnVzY2FyJykudmFsKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NyZm1pZGRsZXdhcmV0b2tlbjogJChcImlucHV0W25hbWU9Y3NyZm1pZGRsZXdhcmV0b2tlbl1cIikudmFsKClcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcHJlY2lvX2VudmlhciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoZm9ybWFfcGFnbyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2VmZWN0aXZvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBkYXRhLnByZWNpb192ZW50YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjcmVkaXRvJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZWNpb19lbnZpYXIgPSBkYXRhLnByZWNpb192ZW50YTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdkZWJpdG8nOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJlY2lvX2VudmlhciA9IGRhdGEucHJlY2lvX3ZlbnRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250YWRvcl90YWJsYSArPTE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXJfdG90YWwoJzEnLCBkYXRhLmlkLCBwcmVjaW9fZW52aWFyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdGFibGFfYXJ0aWN1bG9zIHRyOmxhc3QnKS5hZnRlcignPHRyIGlkPVwidHJfJyArIGNvbnRhZG9yX3RhYmxhLnRvU3RyaW5nKCkgKyAnXCI+PHRkPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5jYW50aWRhZCArICc8L3RkPicgKyAnPHRkPicgKyBkYXRhLmRlc2NyaXBjaW9uICsgJzwvdGQ+JyArICc8dGQ+J1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgZGF0YS5tYXJjYSArICc8L3RkPicgKyAnPHRkPicgKyBkYXRhLnJ1YnJvICsgJzwvdGQ+JyArICc8dGQ+ICQnICsgcHJlY2lvX2VudmlhclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgJzwvdGQ+JyArICc8dGQ+JyArIGRhdGEuc3RvY2sgKyAnPHRkPjxhIG9uY2xpY2s9XCJhZ3JlZ2FyX2NhbnRpZGFkKCcgKyBjb250YWRvcl90YWJsYS50b1N0cmluZygpICsgJywnICsgZGF0YS5pZCArICcsJyArIHByZWNpb19lbnZpYXIgKyAnKVwiICcgKyAnY2xhc3M9XCJidG4gYnRuLWluZm8gYnRuLXhzXCI+PGkgY2xhc3M9XCJmYSBmYS1wbHVzXCI+PC9pPiA8L2E+PGEgb25jbGljaz1cImVsaW1pbmFyX2FydGljdWxvKCcgKyBjb250YWRvcl90YWJsYS50b1N0cmluZygpICsgJywnICsgZGF0YS5jYW50aWRhZCArICcsJyArIHByZWNpb19lbnZpYXIgKyAnKVwiICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2xhc3M9XCJidG4gYnRuLWRhbmdlciBidG4teHNcIj48aSBjbGFzcz1cImZhIGZhLXRyYXNoXCI+PC9pPiA8L2E+PC90ZD48L3RyPicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2NvZGlnb19hcnRpY3Vsb19idXNjYXInKS52YWwoJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIC8qIC0tLS0gZnVuY2lvbiBwYXJhIGVsIGxlY3RvciBkZSBjb2RpZ28gZGUgYmFycmFzIC0tLSAqL1xuXG4gICAgLyogLS0tLS0tLS0tLSBFc3RhIGZ1bmNpb24gY2FsY3VsYSBlbCB0b3RhbCB5IGxhIGNvbG9jYVxuICAgICoqKiAtLS0tLS0tLS0tIGVuIGxhIHBhcnRlIGluZmVyaW9yIGRlbCBmb3JtdWxhcmlvIGRlIHZlbnRhcyAtLS0tICovXG4gICAgICAgICAgICB2YXIgY2FsY3VsYXJfdG90YWwgPSBmdW5jdGlvbihjYW50aWRhZCwgaWQsIHByZWNpb192ZW50YSl7XG4gICAgLyogLS0tLSBBcm1hciB1biBhcnJheSBjb24gbG9zIGFydGljdWxvcyB2ZW5kaWRvcyAtLS0tLSAqL1xuICAgICAgICAgICAgICAgICAgICB2YXIgb2JqID0ge307XG4gICAgICAgICAgICAgICAgICAgIG9ialsnaWQnXSA9IGlkO1xuICAgICAgICAgICAgICAgICAgICBvYmpbJ2NhbnRpZGFkJ10gPSBjYW50aWRhZDtcbiAgICAgICAgICAgICAgICAgICAgYXJ0aWN1bG9zX3ZlbmRpZG9zLnB1c2gob2JqKTtcbiAgICAvKiAtLS0tIEFybWFyIHVuIGFycmF5IGNvbiBsb3MgYXJ0aWN1bG9zIHZlbmRpZG9zIC0tLS0tICovXG5cbiAgICAgICAgICAgICAgICAgICAgdG90YWwgKz0gKHBhcnNlRmxvYXQoY2FudGlkYWQpICogcGFyc2VGbG9hdChwcmVjaW9fdmVudGEudG9TdHJpbmcoKS5yZXBsYWNlKCcsJywgJy4nKSkpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVwcmVzZW50YXIgPSB0b3RhbC50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfdG90YWwnKS5odG1sKCckICcgKyByZXByZXNlbnRhci50b1N0cmluZygpLnJlcGxhY2UoJy4nLCAnLCcpKTtcbiAgICAgICAgICAgIH07XG4gICAgLyogLS0tLS0tLS0tLSBFc3RhIGZ1bmNpb24gY2FsY3VsYSBlbCB0b3RhbCB5IGxhIGNvbG9jYVxuICAgIC0tLS0tLS0tLS0gZW4gbGEgcGFydGUgaW5mZXJpb3IgZGVsIGZvcm11bGFyaW8gZGUgdmVudGFzIC0tLS0gKi9cblxuICAgIC8qIC0tLS0gZGV0ZWN0YXIgcXVlIHRpcG8gZGUgcGFnbyBlcyAtLS0tICovXG4gICAgICAgICAgICB2YXIgY2FsY3VsYXJfdGlwb19wYWdvID0gZnVuY3Rpb24oZm9ybWFfcGFnb19wYXJhbWV0cm8pe1xuICAgICAgICAgICAgICAgICQoJyNpZF9mZWNoYScpLnByb3AoIFwiZGlzYWJsZWRcIiwgZmFsc2UgKTtcbiAgICAgICAgICAgICAgICAkKCcjaWRfY29kaWdvX2FydGljdWxvX2J1c2NhcicpLnByb3AoIFwiZGlzYWJsZWRcIiwgZmFsc2UgKTtcbiAgICAgICAgICAgICAgICAkKCcjaWRfYnV0dG9uX2J1c2NhcicpLnByb3AoIFwiZGlzYWJsZWRcIiwgZmFsc2UgKTtcbiAgICAgICAgICAgICAgICAkKCcjaWRfYnV0dG9uX2d1YXJkYXJfY29tcHJhJykucHJvcCggXCJkaXNhYmxlZFwiLCBmYWxzZSApO1xuICAgICAgICAgICAgICAgIC8vIFBvbmdvIGRpc2FibGVkIGxhIHNlbGVjY2lvbiBkZSBsYSBmb3JtYSBkZSBwYWdvXG4gICAgICAgICAgICAgICAgZm9ybWFfcGFnbyA9IGZvcm1hX3BhZ29fcGFyYW1ldHJvO1xuICAgICAgICAgICAgICAgIGlmIChmb3JtYV9wYWdvID09ICdlZmVjdGl2bycpe1xuICAgICAgICAgICAgICAgICAgICAvLyBzaSBlcyBlZmVjdGl2byBoYWJpbGl0byBzdXMgcmVzcGVjdGl2b3MgcGFnb3NcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9wYWdvJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfdnVlbHRvJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpZF9kaXZfZGVzY3VlbnRvJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyA9PSAnY3JlZGl0bycpe1xuICAgICAgICAgICAgICAgICAgICAvLyBzaSBlcyBjcmVkaXRvIGhhYmlsaXRvIHN1cyByZXNwZWN0aXZvcyBhdW1lbnRvc1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaWRfZGl2X3BvcmNlbnRhamUnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lkX2Rpdl9jcmVkaXRvX3RvdGFsJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyAhPSAnZWZlY3Rpdm8nKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2VmZWN0aXZvJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKGZvcm1hX3BhZ28gIT0gJ2NyZWRpdG8nKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2NyZWRpdG8nKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWFfcGFnbyAhPSAnZGViaXRvJyl7XG4gICAgICAgICAgICAgICAgICAgICQoJyNpZF9kZWJpdG8nKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH07XG4gICAgLyogLS0tLSBkZXRlY3RhciBxdWUgdGlwbyBkZSBwYWdvIGVzIC0tLS0gKi9cblxuICAgIC8qIC0tLS0gRWxpbWluYXIgdW4gYXJ0aWN1bG8gZGVzZGUgbGEgdGFibGEgLS0tLSAqL1xuICAgICAgICAgICAgdmFyIGVsaW1pbmFyX2FydGljdWxvID0gZnVuY3Rpb24oaWQsIGNhbnRpZGFkLCBwcmVjaW9fZW52aWFyKXtcblxuICAgICAgICAgICAgICAgIGFydGljdWxvc192ZW5kaWRvcy5zcGxpY2UoaWQsIDEpO1xuICAgICAgICAgICAgICAgICQoJyN0cl8nICsgaWQpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIHRvdGFsIC09IChwYXJzZUZsb2F0KGNhbnRpZGFkKSAqIHBhcnNlRmxvYXQocHJlY2lvX2Vudmlhci50b1N0cmluZygpLnJlcGxhY2UoJywnLCAnLicpKSk7XG4gICAgICAgICAgICAgICAgdmFyIHJlcHJlc2VudGFyID0gdG90YWwudG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICAkKCcjaWRfdG90YWwnKS5odG1sKCckICcgKyByZXByZXNlbnRhci50b1N0cmluZygpLnJlcGxhY2UoJy4nLCAnLCcpKTtcblxuICAgICAgICAgICAgfTtcbiAgICAvKiAtLS0tIEVsaW1pbmFyIHVuIGFydGljdWxvIGRlc2RlIGxhIHRhYmxhIC0tLS0gKi9cblxuICAgIC8qIC0tLS0gQWdyZWdhciBjYW50aWRhZCBhIHVuIGFydGljdWxvIGRlc2RlIGxhIHRhYmxhIC0tLS0gKi9cbiAgICAgICAgICAgIHZhciBhZ3JlZ2FyX2NhbnRpZGFkID0gZnVuY3Rpb24oY29udGFkb3IsIGlkLCBwcmVjaW8pe1xuICAgICAgICAgICAgICAgIHZhciBjYW50aWRhZCA9IHByb21wdChcIkluZ3Jlc2UgbGEgY2FudGlkYWRcIiwgXCJcIik7XG4gICAgICAgICAgICAgICAgaWYgKGNhbnRpZGFkICE9IG51bGwgJiYgY2FudGlkYWQgIT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhbnRpZGFkX3RhYmxhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpZF90YWJsYV9hcnRpY3Vsb3NcIikucm93c1tjb250YWRvciArIDFdLmNlbGxzLml0ZW0oMCkuaW5uZXJIVE1MO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlkX3RhYmxhX2FydGljdWxvc1wiKS5yb3dzW2NvbnRhZG9yICsgMV0uY2VsbHMuaXRlbSgwKS5pbm5lckhUTUwgPSBwYXJzZUludChjYW50aWRhZF90YWJsYSkgKyBwYXJzZUludChjYW50aWRhZCk7XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3RvdGFsKGNhbnRpZGFkLCBpZCwgcHJlY2lvKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgIC8qIC0tLS0gQWdyZWdhciBjYW50aWRhZCBhIHVuIGFydGljdWxvIGRlc2RlIGxhIHRhYmxhIC0tLS0gKi9cblxuICAgIC8qIC0tLS0gRXZlbnRvIHkgbWV0b2RvcyBwYXJhIHZ1ZWx0b3Mgc2kgZXMgZWZlY3Rpdm8gLS0tLSAqL1xuICAgICAgICAgICAgJCgnI2lkX3BhZ28nKS5jbGljayggZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX3BhZ28nKS52YWwoKSA9PSAnMCcpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfcGFnbycpLnZhbCgnICcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50bycpLmNsaWNrKCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICgkKCcjaWRfZGVzY3VlbnRvJykudmFsKCkgPT0gJzAnKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50bycpLnZhbCgnICcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIC8qIC0tLSBwb3IgY2FkYSBldmVudG8gY2FsY3VsYXIgZWwgdnVlbHRvIC0tLSAqL1xuICAgICAgICAgICAgJCgnI2lkX3BhZ28nKS5mb2N1c291dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjYWxjdWxhcl92dWVsdG8oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI2lkX2Rlc2N1ZW50bycpLmZvY3Vzb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNhbGN1bGFyX2Rlc2N1ZW50bygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcjaWRfcGFnbycpLmtleXByZXNzKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGFyX3Z1ZWx0bygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIGNhbGN1bGFyX3Z1ZWx0byA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLyogLS0tLS0gY2FsY3VsYSBzaSBlcyBlZmVjdGl2byBlbCB2dWVsdG8gLS0tLS0gKi9cblxuICAgICAgICAgICAgICAgIHZhciBwYWdvID0gJCgnI2lkX3BhZ28nKS52YWwoKTtcbiAgICAgICAgICAgICAgICB2YXIgdnVlbHRvID0gcGFyc2VGbG9hdChwYWdvKSAtIHBhcnNlRmxvYXQodG90YWwpO1xuICAgICAgICAgICAgICAgIHZhciByZXByZXNlbnRhciA9IHZ1ZWx0by50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICQoJyNpZF92dWVsdG8nKS5odG1sKCckICcgKyByZXByZXNlbnRhci50b1N0cmluZygpLnJlcGxhY2UoJy4nLCAnLCcpKTtcbiAgICAgICAgICAgIH07XG4gICAgLyogLS0tLSBFdmVudG8geSBtZXRvZG9zIHBhcmEgdnVlbHRvcyBzaSBlcyBlZmVjdGl2byAtLS0tICovXG4gICAgLyogLS0tLSBFdmVudG8geSBtZXRvZG9zIHBhcmEgZGVzY3VlbnRvIHNpIGVzIGVmZWN0aXZvIC0tLS0gKi9cbiAgICAgICAgICAgICQoJyNpZF9kZXNjdWVudG8nKS5mb2N1c291dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjYWxjdWxhcl9kZXNjdWVudG8oKTtcbiAgICAgICAgICAgIH0pO1xuICAgIC8qIC0tLS0gRXZlbnRvIHkgbWV0b2RvcyBwYXJhIGRlc2N1ZW50byBzaSBlcyBlZmVjdGl2byAtLS0tICovXG5cbiAgICAvKiAtLS0tIEV2ZW50byB5IG1ldG9kb3MgcGFyYSBhdW1lbnRvIHNpIGVzIGNyZWRpdG8gLS0tLSAqL1xuICAgICAgICAgICAgJCgnI2lkX3BvcmNlbnRhamUnKS5jbGljayggZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBpZiAoJCgnI2lkX3BvcmNlbnRhamUnKS52YWwoKSA9PSAnMCcpe1xuICAgICAgICAgICAgICAgICAgICAkKCcjaWRfcG9yY2VudGFqZScpLnZhbCgnICcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLyogLS0tIHBvciBjYWRhIGV2ZW50byBjYWxjdWxhciBlbCB2dWVsdG8gLS0tICovXG4gICAgICAgICAgICAkKCcjaWRfcG9yY2VudGFqZScpLmZvY3Vzb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNhbGN1bGFyX2F1bWVudG8oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI2lkX3BvcmNlbnRhamUnKS5rZXlwcmVzcyhmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAxMykge1xuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhcl9hdW1lbnRvKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgY2FsY3VsYXJfYXVtZW50byA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLyogLS0tLS0gY2FsY3VsYSBzaSBlcyBjcmVkaXRvIGVsIGF1bWVudG8gLS0tLS0gKi9cbiAgICAgICAgICAgICAgICB2YXIgcG9yY2VudGFqZSA9ICQoJyNpZF9wb3JjZW50YWplJykudmFsKCk7XG4gICAgICAgICAgICAgICAgY3JlZGl0b19wb3JjZW50YWplID0gcG9yY2VudGFqZTtcbiAgICAgICAgICAgICAgICB2YXIgYXVtZW50byA9IHBhcnNlRmxvYXQodG90YWwpICogcGFyc2VJbnQocG9yY2VudGFqZSkvMTAwO1xuICAgICAgICAgICAgICAgIHZhciB0b3RhbF9hdW1lbnRhZG8gPSBwYXJzZUZsb2F0KHRvdGFsKSArIHBhcnNlRmxvYXQoYXVtZW50byk7XG4gICAgICAgICAgICAgICAgdmFyIHJlcHJlc2VudGFyID0gdG90YWxfYXVtZW50YWRvLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgJCgnI2lkX2NyZWRpdG9fdG90YWwnKS5odG1sKCckICcgKyByZXByZXNlbnRhci50b1N0cmluZygpLnJlcGxhY2UoJy4nLCAnLCcpKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBjYWxjdWxhcl9kZXNjdWVudG8gPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICB2YXIgZGVzY3VlbnRvID0gJCgnI2lkX2Rlc2N1ZW50bycpLnZhbCgpO1xuICAgICAgICAgICAgICAgICB0b3RhbCA9IHBhcnNlRmxvYXQodG90YWwpIC0gcGFyc2VGbG9hdChkZXNjdWVudG8pO1xuICAgICAgICAgICAgICAgICAkKCcjaWRfdG90YWwnKS5odG1sKCckICcgKyB0b3RhbC50b1N0cmluZygpLnJlcGxhY2UoJy4nLCAnLCcpKTtcbiAgICAgICAgICAgIH1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zdGF0aWMvYXBwcy92ZW50YXMvanMvb3BlcmFjaW9uZXMuanMiXSwic291cmNlUm9vdCI6IiJ9");

/***/ })

})