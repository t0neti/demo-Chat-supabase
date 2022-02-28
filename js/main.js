import { createApp } from './vue.esm-browser.js'

const supabaseUrl = 'https://sfgxdpmqsrhaxxjpspoq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmZ3hkcG1xc3JoYXh4anBzcG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDYwMzkxNDYsImV4cCI6MTk2MTYxNTE0Nn0.zl5kC284rgKNfsN5sdMZcp6Y-MkmEnKPm4uQMai9Z9o'
const cli = supabase.createClient(supabaseUrl, supabaseKey)


createApp({
    data() {
        return {
            mensajes: [],
            nombre: '',
            nuevoMensaje: ''
        }
    },
    methods: {
        cargarMensajes: async function() {
            let {data: data, error} = await cli
                .from('Mensajes')
                .select('*')
                .order('created_at', { ascending: true})
            // ordenar
            this.mensajes = data;
        },
        enviarMensaje: async function() {
            const { data, error } = await cli
                .from('Mensajes')
                .insert([
                    { nombre: this.nombre, texto: this.nuevoMensaje }
                ])
            // Limpiamos el mensaje
            this.nuevoMensaje = '';
        },
        esucharNuevosMensajes: function () {
            cli
                .from('Mensajes')
                .on('INSERT', payload => {
                // Anyado mensaje nueuvo
                     this.mensajes.push(payload.new);
                })
                .subscribe()
        }
    },
    mounted() {
        this.cargarMensajes();
        this.esucharNuevosMensajes();
    },
        watch: {
            mensajes: {
                handler(newValue, oldValue) {
                    // Desciendo el sroll
                    this.$nextTick(() => {
                        const elemento = this.$refs.mensajesContenedor;
                        elemento.scrollTo(0, elemento.scrollHeight)
                    })
                },
                deep: true
            }
        }

}).mount('#app')