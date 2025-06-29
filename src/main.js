import "@/assets/main.css"
import PrimeVue from "primevue/config"
import Material from "@primeuix/themes/material"
import "primeicons/primeicons.css"

import { createApp } from "vue"
import ToastService from "primevue/toastservice"
import Toast from "primevue/toast"
import App from "./App.vue"
import router from "./router"

const app = createApp(App)
app.use(ToastService)

app.use(router)
app.use(PrimeVue, {
	theme: {
		preset: Material
	}
})

app.component("ToastComponent", Toast)

app.mount("#app")
