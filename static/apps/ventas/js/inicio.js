
    /* ---- colocar en disabled todos los controles ----- */
    /*---------------------------------------------------*/
    $('#id_fecha').prop( "disabled", true );
    $('#id_codigo_articulo_buscar').prop( "disabled", true );
    $('#id_button_buscar').prop( "disabled", true );
    $('#id_button_guardar_compra').prop( "disabled", true );
    $('#buscar_socio').prop( "disabled", true );
    $('#id_no_sumar').prop( "disabled", true );

    $('#id_fecha').daterangepicker({
           singleDatePicker: true,
           locale: {
                  "format": "DD/MM/YYYY",
                  "separator": " - ",
                  "applyLabel": "Aplicar",
                  "cancelLabel": "Cancelar",
                  "fromLabel": "From",
                  "toLabel": "a",
                  "customRangeLabel": "Custom",
                  "daysOfWeek": [
                      "Do",
                      "Lu",
                      "Ma",
                      "Mi",
                      "Ju",
                      "Vi",
                      "Sa"
                  ],
                  "monthNames": [
                      "Enero",
                      "Febrero",
                      "Marzo",
                      "Abril",
                      "Mayo",
                      "Junio",
                      "Julio",
                      "Agosto",
                      "Septiembre",
                      "Octubre",
                      "Noviembre",
                      "Diciembre"
                  ]
           }
    });