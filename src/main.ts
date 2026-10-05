import '../styles.css'
import { mount } from './mount'

const root = document.querySelector('#app')
if (root instanceof HTMLElement) {
	mount(root)
}
