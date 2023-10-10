import Projects from './projects'
import active from '../components/active'
import { handleFlash } from '../components/notice'
import handleHamburger from '../components/hamburger'
import handleLogout from '../components/logout'
import setFooter from '../components/footer'


// Handle flash
const flash = document.getElementById('flash')
if (flash) {
    handleFlash()
}

// Mobile screen
handleHamburger()

// Active link
active('/projects')

// Handle Logout
handleLogout()

// Logged in user
const userId = document.getElementById('current-user').dataset.user

// Project object instance with the logged in user data
const projects = new Projects(userId)

// Get the projects stack
projects.handleStack()
// Handle modals
projects.handleModal()
// Handle form
projects.handleForm()

// Footer
setFooter()