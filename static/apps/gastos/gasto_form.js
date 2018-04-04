
Vue.options.delimiters = ['{[{', '}]}'];
var app = new Vue({
  el: '#app',
  data: {
    gastos: [],
    motivos: [],
    gastosPost: {
        "fecha": null,
        "motivo": null,
        "monto": null
    }
  },
    methods: {
        cargarGastos: function(){
            var self = this;
            axios.get('/gastos/api/gastos/')
            .then(function (response) {
                self.gastos = response.data;
            })
              .catch(function (error) {
                console.log(error);
            });
        },
        cargarMotivos: function(){
            var self = this;
            axios.get('/gastos/motivos/')
                    .then(function (response){
                        self.motivos = response.data;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
        }
    },
    mounted: function()
    {
        this.cargarGastos(),
        this.cargarMotivos()
    }
});