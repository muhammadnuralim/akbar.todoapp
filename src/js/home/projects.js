import Menu from "./menu"
import Todos from "./todos"
import Dones from "./dones"

import { fetchData, sendData } from "../components/data"
import { validate, showError, resetError, enableSubmit, validateSubmit } from '../components/form'
import createButton from "../components/button"
import showNotice from '../components/notice'
import loadAnimation from "../components/animation"
class Projects {
    constructor(user) {
        this.user = user

        this.filter = {
            dropdown: document.getElementById('home-projects-dropdown'),
            options: document.getElementById('home-projects-options'),
            selected: document.getElementById('home-project-selected')
        }

        this.add = {
            modal: document.getElementById('modal-add-project'),
            form: {
                form: document.getElementById('form-add-project'),
                fields: {
                    title: document.getElementById('form-add-project-title'),
                    description: document.getElementById('form-add-project-description')
                },
                submit: document.getElementById('form-add-project-submit')
            },
            show: document.getElementById('modal-add-project-show-button'),
            close: document.getElementById('modal-add-project-close-button')
        }
    }

    // Create and return the option for the dropdown menu
    createOption = (projectTitle, projectId, handler) => {
        const option = document.createElement('li')
        option.className = "w-full text-center border-b border-solid border-violet-500 py-2 cursor-pointer hover:text-teal-400"
        option.textContent = projectTitle
        option.setAttribute('data-projectid', projectId)
        option.addEventListener('click', handler)

        return option
    }

    // Create an additional option to reset the filter by the dropdown menu
    createResetFilter = () => {
        // Remove the old reset option if present
        const oldReset = document.querySelector('li[data-projectid="0"]')
        if (oldReset) {
            oldReset.remove()
        }

        // Define the handler for the reset option
        const handleReset = () => {
            // If the reset option is clicked, close the dropdown
            this.closeOptions()

            // Show loading state
            this.filter.selected.innerHTML = ''
            loadAnimation(this.filter.selected, 'dots-white')

            const todos = new Todos(this.user)
            const dones = new Dones(this.user)

            // Reset the stacks
            todos.resetStack()
            dones.resetStack()

            // Rebuild the stacks
            todos.handleStack()
            dones.handleStack()

            // Abort the loading state and hide the reset option
            this.filter.selected.innerHTML = reset.textContent
            reset.classList.add('hidden')

            // Show all the other options
            const options = [...reset.parentNode.children].filter(option => option !== reset)
            options.forEach((option) => option.classList.remove('hidden'))

            this.filter.options.lastElementChild.previousElementSibling.classList.remove('border-b')
        }

        // Create the reset option
        const reset = this.createOption('All Projects', 0, handleReset)
        reset.classList.add('text-teal-400', 'hover:text-violet-400')
        reset.classList.remove('border-b', 'hover:text-teal-600')
        if (this.filter.options.hasChildNodes()) {
            this.filter.options.lastElementChild.classList.add('border-b')
        }

        // Append the reset option to the dropdown menu
        this.filter.options.append(reset)
    }

    // Create the options list for the dropdown menu
    createOptions = (data) => {
        // Iterate over the array
        for (let i = 0; i < data.length; i++) {
            // Define the handler for filtering the tasks
            const handleFilterTasks = async () => {
                // If an option is clicked, close the dropdown
                this.closeOptions()

                // Show loading state
                this.filter.selected.innerHTML = ''
                loadAnimation(this.filter.selected, 'dots-white')

                const todos = new Todos(this.user)
                const dones = new Dones(this.user)

                // Filter the tasks stack
                try {
                    const filteredTodos = await todos.filterByProject(option.dataset.projectid)
                    const filteredDones = await dones.filterByProject(option.dataset.projectid)

                    if (filteredTodos && filteredDones) {
                        // After the tasks filtered, abort the loading state and hide the clicked option
                        this.filter.selected.innerHTML = option.textContent
                        option.classList.add('hidden')

                        // Show all the other options
                        const others = [...option.parentNode.children].filter(other => other !== option)
                        others.forEach((other) => other.classList.remove('hidden'))

                        // Show the reset filter option
                        this.createResetFilter()
                    }
                } catch (err) {
                    console.error(err)
                }
            }
            // Create the option
            const option = this.createOption(data[i].title, data[i].project_id, handleFilterTasks)

            // Append the option to the dropdown menu
            this.filter.options.append(option)
        }

        this.filter.options.lastElementChild.classList.remove('border-b')
    }

    // Get the options using the projects data from the database
    getOptions = async () => {
        try {
            const { data } = await fetchData(`/api/users/${this.user}/projects`)

            this.createOptions(data)

            return data
        } catch (err) {
            console.error(err)
        }
    }

    // Create an empty state if the user hasn't got any project yet
    emptyState = () => {
        // Create the container
        const emptyBox = document.createElement('div')
        emptyBox.className = 'flex flex-col gap-2 justify-center items-center w-full py-10 border border-dashed border-white text-white text-lg text-center capitalize rounded-2xl sm:text-xl'

        // Create the message
        const text = document.createElement('h3')
        text.textContent = "you haven't added any projects yet"

        // Define the handler for a cta button
        const handleCta = () => {
            this.showAddModal()
            this.closeOptions()
        }

        // Create the cta button
        const ctaButton = createButton('bg-white mt-8 px-4 py-1 text-indigo-700 font-semibold rounded-xl shadow-button-lg uppercase', 'get started', handleCta, 'project-cta-button', 'Create your first project')

        // Put the components into the container
        emptyBox.append(text, ctaButton)

        // Append the empty state to the dropdown
        this.filter.options.append(emptyBox)
    }

    // Get the options. If there is no option, show the empty state
    handleOptions = async () => {
        const options = await this.getOptions()
        if (!options) {
            this.emptyState()
        }
    }

    // Show and close modals

    showOptions = () => {
        this.filter.options.classList.toggle('hidden')
        this.filter.options.classList.add('shadow-modal')
    }

    handleShowOptions = () => {
        this.filter.dropdown.addEventListener('click', () => {
            this.showOptions()
        })
    }

    closeOptions = () => {
        this.filter.options.classList.add('hidden')
    }

    showAddModal = () => {
        this.add.modal.classList.remove('hidden')
    }

    handleShowAddModal = () => {
        this.add.show.addEventListener('click', () => {
            this.showAddModal()

            const menu = new Menu()
            menu.closeMenu()
        })
    }

    closeAddModal = () => {
        this.add.modal.classList.add('hidden')
    }

    handleCloseAddModal = () => {
        this.add.close.addEventListener('click', () => {
            this.closeAddModal()
        })
    }

    handleClickOutsideModal = () => {
        document.addEventListener('click', (e) => {
            if (this.filter.options) {
                const projectDropdownClicked = this.filter.dropdown.contains(e.target) || this.filter.options.contains(e.target)
                if (!projectDropdownClicked) {
                    this.closeOptions();
                }
            }

            if (this.add.modal) {
                const projectsCtaButton = document.querySelector('button[name="project-cta-button"]')
                let addProjectClicked = this.add.modal.firstElementChild.contains(e.target) || this.add.show.contains(e.target)
                if (projectsCtaButton) {
                    addProjectClicked = this.add.modal.firstElementChild.contains(e.target) || this.add.show.contains(e.target) || projectsCtaButton.contains(e.target)
                }
                if (!addProjectClicked) {
                    this.closeAddModal()
                }
            }
        })
    }

    handleModal = () => {
        this.handleShowOptions()
        this.handleShowAddModal()
        this.handleCloseAddModal()
        this.handleClickOutsideModal()
    }

    // Validate the input field when the user click outside the field and if it's invalid, show the error message
    handleBlur = (fields) => {
        for (const field in fields) {
            fields[field].addEventListener('blur', () => {
                let isValid = validate(fields[field])

                if (!isValid) {
                    showError(fields[field])
                }
            })
        }
    }

    // Remove the error message if the user gets back to the input field
    handleFocus = (fields) => {
        for (const field in fields) {
            fields[field].addEventListener('focus', () => {
                resetError(fields[field])
            })
        }
    }

    // Check if each field is valid while the user make an input and enable the submit button once all the fields are valid
    handleInput = (fields, submit) => {
        for (const field in fields) {
            fields[field].addEventListener('input', () => {
                enableSubmit(fields, submit)
            })
        }
    }

    // Handle the event after the form being submitted and validated on the server
    handleSubmit = (form) => {
        // If the user has submitted the form:
        form.addEventListener('submit', async (e) => {
            // Prevent the browser to reload the page
            e.preventDefault()

            // Show loading state
            this.add.form.submit.innerHTML = ''
            loadAnimation(this.add.form.submit, 'dots-white')

            // Create a FormData object
            const formData = new FormData(form)

            // Get the response after the request being sent and the form being validated
            try {
                const res = await validateSubmit(formData, `/api/users/${this.user}/projects`, sendData)
                // If success, reload the page
                if (res.success) {
                    form.reset()
                    location.reload()
                    // If not, abort the loading state and close the modal
                } else {
                    this.add.form.submit.innerHTML = "add"
                    form.reset()
                    this.closeAddModal()

                    // Then show a notice with error message
                    const errors = res.message.map((error) => `<p class='flex gap-1 items-center text-sm'><i class="fa-solid fa-xmark"></i>${error}</p>`)
                    showNotice(errors.join(''), 'error')
                }
            } catch (error) {
                console.error(error)
            }
        })
    }

    handleForm = () => {
        this.handleInput(this.add.form.fields, this.add.form.submit)
        this.handleBlur(this.add.form.fields)
        this.handleFocus(this.add.form.fields)
        this.handleSubmit(this.add.form.form)
    }
}

export default Projects