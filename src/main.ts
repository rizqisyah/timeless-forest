import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { vReveal } from './motion/reveal'

// ?motion=2 previews the invitation at another tempo without touching tokens.css.
const motion = Number(new URLSearchParams(location.search).get('motion'))
if (motion > 0) document.documentElement.style.setProperty('--motion', String(motion))

createApp(App).directive('reveal', vReveal).mount('#app')
