import { fetchData, sendData, updateData, deleteData } from "../components/data"
import { validate, showError, resetError, enableSubmit, validateSubmit } from '../components/form'
import createButton from "../components/button"
import showNotice from "../components/notice"
import loadAnimation from "../components/animation"
import emptyPrimary from '../../img/empty-primary.svg'

class Projects {
    constructor(user) {
        this.user = user

        this.stack = {
            container: document.getElementById('projects-container'),
            counter: document.getElementById('projects-counter')
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

        this.edit = {
            modal: document.getElementById('modal-edit-project'),
            form: {
                form: document.getElementById('form-edit-project'),
                fields: {
                    id: document.getElementById('form-edit-project-id'),
                    title: document.getElementById('form-edit-project-title'),
                    description: document.getElementById('form-edit-project-description')
                },
                submit: document.getElementById('form-edit-project-submit')
            },
            close: document.getElementById('modal-edit-project-close-button')
        }

        this.delete = {
            modal: document.getElementById('modal-delete-project'),
            deleted: document.getElementById('modal-delete-project-deleted'),
            confirm: document.getElementById('modal-delete-project-confirm'),
            cancel: document.getElementById('modal-delete-project-cancel'),
            close: document.getElementById('modal-delete-project-close-button')
        }

        this.todos = {
            modal: document.getElementById('modal-add-todo'),
            form: {
                form: document.getElementById('form-add-todo'),
                fields: {
                    project: document.getElementById('form-add-todo-project'),
                    title: document.getElementById('form-add-todo-title'),
                    description: document.getElementById('form-add-todo-description')
                },
                submit: document.getElementById('form-add-todo-submit')
            },
            close: document.getElementById('modal-add-todo-close-button')
        }

        this.loading = document.getElementById('projects-loading')
    }

    // Create and return a container for a project
    createCard = (projectId) => {
        const card = document.createElement('div')
        card.className = 'flex flex-col bg-white rounded-2xl border border-solid border-indigo-700'
        card.setAttribute('data-id', projectId)

        return card
    }

    // Create and return the heading part of the card
    createHeading = () => {
        const heading = document.createElement('div')
        heading.className = 'flex justify-between items-center px-4 bg-indigo-700 text-white rounded-t-2xl group'

        return heading
    }

    // Create and return the content of the card
    createContent = (projectTitle, projectDescription) => {
        const content = document.createElement('div')
        content.className = 'flex-1 pr-4 py-2'

        const title = document.createElement('p')
        title.className = 'text-2xl font-semibold'
        title.textContent = projectTitle

        const description = document.createElement('p')
        description.textContent = projectDescription

        content.append(title, description)

        return content
    }

    // Create and return the toolbar part of the card
    createToolbar = (editButton, deleteButton, addButton) => {
        const toolbar = document.createElement('div')
        toolbar.className = 'flex gap-2'

        toolbar.append(editButton, deleteButton, addButton)
        return toolbar
    }

    // Create an empty state if a project hasn't contained any task yet
    createEmptyList = (projectId) => {
        // Create the container
        const emptyList = document.createElement('li')
        emptyList.className = 'mx-auto'

        // Define the handler for an add button
        const handleAdd = () => {
            this.showTodosModal()

            this.todos.form.fields.project.value = projectId

            this.handleCloseTodosModal()
            this.handleClickOutsideTodos()
        }

        // Create the add button
        const addButton = createButton('flex gap-2 items-center px-4 py-1 text-indigo-700 font-semibold border border-dashed border-indigo-700 rounded-lg shadow-button-lg uppercase', '<i class="fa-solid fa-circle-plus fa-sm text-indigo-700"></i><span>add your first task</span>', handleAdd, 'add-todo-button', 'Create your first task')

        // Put the button inside the container
        emptyList.append(addButton)

        return emptyList
    }

    // Create and return the tasks list
    createList = (projectId, tasks) => {
        // Create the container
        const list = document.createElement('ul')
        list.className = 'h-full flex flex-col justify-center px-8 py-2'

        // If the tasks is empty, put the empty state inside the list container
        if (tasks.length === 0) {
            const empty = this.createEmptyList(projectId)

            list.append(empty)

            return list
        }

        // Iterate over the array
        for (let i = 0; i < tasks.length; i++) {
            // Create the list item
            const task = document.createElement('li')
            task.className = 'flex gap-4 justify-between items-center border-b border-solid border-slate-300'

            // Create the title
            const title = document.createElement('h6')
            title.className = 'text-xs'
            title.textContent = tasks[i].title

            // Put a badge icon according to whether a task is Done or not
            const badge = document.createElement('div')
            tasks[i].is_done === false ? badge.innerHTML = '<i class="fa-regular fa-hourglass fa-xs text-violet-700"></i>' : badge.innerHTML = '<i class="fa-solid fa-circle-check fa-xs text-teal-600"></i>'

            // Put the title and the badge inside the item
            task.append(title, badge)

            // Append the item into the list container
            list.append(task)
        }

        list.lastElementChild.classList.remove('border-b')

        return list
    }

    // Create a project card by merging all the components
    createProject = (projectId, projectTitle, projectDesc, tasks) => {
        const card = this.createCard(projectId)
        const heading = this.createHeading()
        const content = this.createContent(projectTitle, projectDesc)

        // Define a handler for the edit button
        const handleEdit = async () => {
            // If the edit button clicked, show the edit modal
            this.showEditModal()

            // Fill all the fields inside the modal with the relevant data
            const { data } = await fetchData(`/api/users/${this.user}/projects/${projectId}`)
            this.edit.form.fields.id.value = data.project_id
            this.edit.form.fields.title.value = data.title
            this.edit.form.fields.description.value = data.description

            this.handleCloseEditModal()
            this.handleClickOutsideEdit()
        }

        // Define a handler for the delete button
        const handleDelete = async () => {
            // If the delete button clicked, show the delete modal
            this.showDeleteModal()

            // Show the project title to the user
            const { data } = await fetchData(`/api/users/${this.user}/projects/${projectId}`)
            this.delete.deleted.textContent = data.title

            this.handleDeleteConfirm(projectId)
            this.handleDeleteCancel()
            this.handleCloseDeleteModal()
            this.handleClickOutsideDelete()
        }

        // Define a handler for the add task button
        const handleAdd = () => {
            this.showTodosModal()

            this.todos.form.fields.project.value = projectId

            this.handleCloseTodosModal()
            this.handleClickOutsideTodos()
        }

        // Create all the buttons
        const editButton = createButton('invisible group-hover:visible hover:text-emerald-500', '<i class="fa-solid fa-pen-to-square fa-sm"></i>', handleEdit, 'edit-button', 'Edit this project')
        const deleteButton = createButton('invisible group-hover:visible hover:text-rose-500', '<i class="fa-solid fa-trash fa-sm"></i>', handleDelete, 'delete-button', 'Delete this project')
        const addButton = createButton('invisible group-hover:visible hover:text-violet-500', '<i class="fa-solid fa-circle-plus fa-sm">', handleAdd, 'add-todo-button', 'Add a new task')

        // Put the buttons inside their container
        const toolbar = this.createToolbar(editButton, deleteButton, addButton)
        // Put the content and toolbar into the heading
        heading.append(content, toolbar)

        // Create the tasks list
        const tasksList = this.createList(projectId, tasks)
        // Put all the card components inside the container
        card.append(heading, tasksList)

        return card
    }

    // If the user confirms to delete the task:
    handleDeleteConfirm = (projectId) => {
        this.deleteConfirm = async () => {
            // Show the loading state
            this.delete.confirm.innerHTML = ''
            loadAnimation(this.delete.confirm, 'dots-white')

            // Make an api call to delete the project using its ID
            try {
                const res = await deleteData(`/api/users/${this.user}/projects/${projectId}`)
                // If success, reload the page
                if (res.success) {
                    location.reload()
                    // If not, abort the loading state and show a notice with error message
                } else {
                    this.delete.confirm.innerHTML = 'Confirm'
                    this.closeDeleteModal()

                    showNotice(res.message, 'error')
                }
            } catch (err) {
                console.error(err)
            }
        }

        this.delete.confirm.addEventListener('click', this.deleteConfirm)
    }

    // If the user cancels the deletion process:
    handleDeleteCancel = () => {
        this.delete.cancel.addEventListener('click', () => {
            // Close the modal
            this.closeDeleteModal()
        })
    }

    // Create a stack of project cards
    createStack = async (data) => {
        for (let i = 0; i < data.length; i++) {
            const tasks = await fetchData(`/api/users/${this.user}/projects/${data[i].project_id}/todos`)

            const card = this.createProject(data[i].project_id, data[i].title, data[i].description, tasks.data)

            this.stack.container.append(card)
        }
    }

    // Get the stack using the projects data from the database
    getStack = async () => {
        try {
            const { data } = await fetchData(`/api/users/${this.user}/projects`)

            this.stack.counter.innerHTML = `You have <span class="text-teal-300 font-bold">${data.length
                } projects</span> so far`

            this.createStack(data)

            return data
        } catch (err) {
            console.error(err)
        }
    }

    // Create an empty state if the user hasn't got any project yet
    emptyState = () => {
        // Create the container
        const emptyBox = document.createElement('div')
        emptyBox.className = 'col-span-1 flex flex-col gap-2 justify-center items-center w-full py-10 border border-dashed border-indigo-700 text-indigo-700 text-lg text-center capitalize rounded-2xl sm:text-xl sm:col-span-2 sm:col-span-3'
        emptyBox.setAttribute('id', 'empty-state')

        // Create the illustration
        const illustration = document.createElement('img')
        illustration.className = 'w-20'
        illustration.setAttribute('src', emptyPrimary)
        illustration.setAttribute('alt', 'This column is empty')

        // Create the message
        const text = document.createElement('h3')
        text.textContent = "you haven't added any projects yet"

        // Define the handler for a cta button
        const handleCta = () => {
            this.showAddModal()

            this.handleCloseAddModal()
            this.handleClickOutsideAdd()
        }

        // Create the cta button
        const ctaButton = createButton('bg-indigo-700 mt-8 px-4 py-1 text-white font-semibold rounded-xl shadow-button-lg uppercase', 'get started', handleCta, 'project-cta-button', 'Create your first project')

        // Put the components into the container
        emptyBox.append(illustration, text, ctaButton)

        // Append the empty state to the main container
        this.stack.container.append(emptyBox)
    }

    // Get the stack. If there is no stack, show the empty state
    handleStack = async () => {
        // Show the loading state
        loadAnimation(this.loading, 'loading')

        // Get the stack
        try {
            const stack = await this.getStack()
            if (stack) {
                // After getting the stack, hide the loading state
                this.loading.classList.add('hidden')

                // If the stack is empty, show the empty state
                if (stack.length === 0) {
                    this.emptyState()
                }
            }
        } catch (err) {
            console.error(err)
        }
    }

    // Show and close modals

    showTodosModal = () => {
        this.todos.modal.classList.remove('hidden')
    }

    closeTodosModal = () => {
        this.todos.close.removeEventListener('click', () => {
            this.closeTodosModal()
        })
        document.removeEventListener('click', this.clickOutsideTodos)

        this.todos.modal.classList.add('hidden')
    }

    handleCloseTodosModal = () => {
        this.todos.close.addEventListener('click', () => {
            this.closeTodosModal()
        })
    }

    showAddModal = () => {
        this.add.modal.classList.remove('hidden')
    }

    handleShowAddModal = () => {
        this.add.show.addEventListener('click', () => {
            this.showAddModal()

            this.handleCloseAddModal()
            this.handleClickOutsideAdd()
        })
    }

    closeAddModal = () => {
        this.add.close.removeEventListener('click', () => {
            this.closeAddModal()
        })
        document.removeEventListener('click', this.clickOutsideAdd)

        this.add.modal.classList.add('hidden')
    }

    handleCloseAddModal = () => {
        this.add.close.addEventListener('click', () => {
            this.closeAddModal()
        })
    }

    handleModal = () => {
        this.handleShowAddModal()
    }

    showEditModal = () => {
        this.edit.modal.classList.remove('hidden')
    }

    closeEditModal = () => {
        this.edit.close.removeEventListener('click', () => {
            this.closeEditModal()
        })
        document.removeEventListener('click', this.clickOutsideEdit)

        this.edit.modal.classList.add('hidden')
    }

    handleCloseEditModal = () => {
        this.edit.close.addEventListener('click', () => {
            this.closeEditModal()
        })
    }

    showDeleteModal = () => {
        this.delete.modal.classList.remove('hidden')
    }

    closeDeleteModal = () => {
        this.delete.confirm.removeEventListener('click', this.deleteConfirm)
        this.delete.close.removeEventListener('click', () => {
            this.closeDeleteModal()
        })
        document.removeEventListener('click', this.clickOutsideDelete)

        this.delete.modal.classList.add('hidden')
    }

    handleCloseDeleteModal = () => {
        this.delete.close.addEventListener('click', () => {
            this.closeDeleteModal()
        })
    }

    handleClickOutsideAdd = () => {
        this.clickOutsideAdd = (e) => {
            if (this.add.modal) {
                const ctaButton = document.querySelector('button[name="project-cta-button"]')
                let addProjectClicked = this.add.modal.firstElementChild.contains(e.target) || this.add.show.contains(e.target)
                if (ctaButton) {
                    addProjectClicked = this.add.modal.firstElementChild.contains(e.target) || this.add.show.contains(e.target) || ctaButton.contains(e.target)
                }
                if (!addProjectClicked) {
                    this.closeAddModal()
                }
            }
        }
        document.addEventListener('click', this.clickOutsideAdd)
    }

    handleClickOutsideEdit = () => {
        this.clickOutsideEdit = (e) => {
            if (this.edit.modal) {
                const editButtons = document.querySelectorAll('button[name="edit-button"]')
                const editProjectClicked = this.edit.modal.firstElementChild.contains(e.target) || [...editButtons].some((button) => button.contains(e.target))
                if (!editProjectClicked) {
                    this.closeEditModal()
                }
            }
        }
        document.addEventListener('click', this.clickOutsideEdit)
    }

    handleClickOutsideDelete = () => {
        this.clickOutsideDelete = (e) => {
            if (this.delete.modal) {
                const deleteButtons = document.querySelectorAll('button[name="delete-button"]')
                const deleteProjectClicked = this.delete.modal.firstElementChild.contains(e.target) || [...deleteButtons].some((button) => button.contains(e.target))
                if (!deleteProjectClicked) {
                    this.closeDeleteModal()
                }
            }
        }
        document.addEventListener('click', this.clickOutsideDelete)
    }

    handleClickOutsideTodos = () => {
        this.clickOutsideTodos = (e) => {
            if (this.todos.modal) {
                const addTodoButtons = document.querySelectorAll('button[name="add-todo-button"]')
                const addTodoClicked = this.todos.modal.firstElementChild.contains(e.target) || [...addTodoButtons].some((button) => button.contains(e.target))
                if (!addTodoClicked) {
                    this.closeTodosModal()
                }
            }
        }
        document.addEventListener('click', this.clickOutsideTodos)
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
    handleSubmit = (form, apiUrl, method, submitButton, modalCloser) => {
        // If the user has submitted the form:
        form.addEventListener('submit', async (e) => {
            // Prevent the browser to reload the page
            e.preventDefault()

            // Show loading state
            const defaultMsg = submitButton.innerHTML
            submitButton.innerHTML = ''
            loadAnimation(submitButton, 'dots-white')

            // Create a FormData object
            const formData = new FormData(form)

            // Get the response after the request being sent and the form being validated
            try {
                const res = formData.get('_method') !== 'PUT' ?
                    await validateSubmit(formData, apiUrl, method) :
                    await validateSubmit(formData, apiUrl + formData.get('project_id'), method)
                // If success, reload the page
                if (res.success) {
                    form.reset()
                    location.reload()
                    // If not, abort the loading state and close the modal
                } else {
                    submitButton.innerHTML = defaultMsg
                    form.reset()
                    modalCloser()

                    // Then show a notice with error message
                    const errors = res.message.map((error) => `<p class='flex gap-1 items-center text-sm'><i class="fa-solid fa-xmark"></i>${error}</p>`)
                    showNotice(errors.join(''), 'error')
                }
            } catch (err) {
                console.error(err)
            }
        })
    }

    handleForm = () => {
        this.handleInput(this.add.form.fields, this.add.form.submit)
        this.handleInput(this.edit.form.fields, this.edit.form.submit)
        this.handleInput(this.todos.form.fields, this.todos.form.submit)
        this.handleBlur(this.add.form.fields)
        this.handleBlur(this.edit.form.fields)
        this.handleBlur(this.todos.form.fields)
        this.handleFocus(this.add.form.fields)
        this.handleFocus(this.edit.form.fields)
        this.handleFocus(this.todos.form.fields)
        this.handleSubmit(this.add.form.form, `/api/users/${this.user}/projects`, sendData, this.add.form.submit, this.closeAddModal)
        this.handleSubmit(this.edit.form.form, `/api/users/${this.user}/projects/`, updateData, this.edit.form.submit, this.closeEditModal)
        this.handleSubmit(this.todos.form.form, `/api/users/${this.user}/todos`, sendData, this.todos.form.submit, this.closeTodosModal)
    }
}

export default Projects
