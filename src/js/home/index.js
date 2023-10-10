import Menu from './menu'
import Projects from './projects'
import Todos from './todos'
import Dones from './dones'

import { handleFlash } from '../components/notice'
import handleHamburger from '../components/hamburger'
import handleLogout from '../components/logout'
import setFooter from '../components/footer'
import loadAnimation from '../components/animation'

// Handle flash
const flash = document.getElementById('flash')
if (flash) {
    handleFlash()
}

// Mobile screen
handleHamburger()

// Handle Logout
handleLogout()

// Logged in user
const userId = document.getElementById('current-user').dataset.user

// Object instances with the logged in user data
const projects = new Projects(userId)
const todos = new Todos(userId)
const dones = new Dones(userId)
const menu = new Menu()

// Dropdown
projects.handleOptions()

// Tasks Stack

// Show the loading state
const loading = document.getElementById('home-loading')
loadAnimation(loading, 'loading')

const todoStack = await todos.handleStack()
const doneStack = await dones.handleStack()
if (todoStack && doneStack) {
    // After getting the stacks, hide the loading state
    loading.classList.add('hidden')
}

// Menu
menu.handleMenu()

// Modals
projects.handleModal()
todos.handleModal()

// Forms
todos.handleForm()
projects.handleForm()

// Footer
setFooter()