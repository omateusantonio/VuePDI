import "./assets/main.css"
import PrimeVue from "primevue/config"
import Material from "@primeuix/themes/material"
import "primeicons/primeicons.css"

import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"

const app = createApp(App)

app.use(router)
app.use(PrimeVue, {
	theme: {
		preset: Material
	}
})

app.mount("#app")
