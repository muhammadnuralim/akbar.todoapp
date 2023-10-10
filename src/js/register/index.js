import RegisterForm from './form'
import { handleFlash } from '../components/notice'

// Handle flash
const flash = document.getElementById('flash')
if (flash) {
    handleFlash()
}

// Handle form
const form = new RegisterForm();
form.handleForm()