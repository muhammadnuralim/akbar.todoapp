import { handleFlash } from '../components/notice'
import handleHamburger from '../components/hamburger'

// Handle flash
const flash = document.getElementById('flash')
if (flash) {
    handleFlash()
}

// Mobile screen
handleHamburger()