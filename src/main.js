import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import permissionDirective from './directives/permission'
import '@fontsource/material-symbols-outlined/400.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import './styles/global.css'
import './styles/shared.css'

const app = createApp(App)
app.use(router)
app.directive('permission', permissionDirective)
app.mount('#app')