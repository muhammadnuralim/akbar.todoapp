import { fetchData, updateData } from "../components/data"
import loadAnimation from "../components/animation"
import showNotice from "../components/notice"

class User {
    constructor(user) {
        this.user = user

        this.profile = {
            profile: document.getElementById('profile-user'),
            fields: {
                name: document.getElementById('profile-user-name'),
                role: document.getElementById('profile-user-role'),
                bio: document.getElementById('profile-user-bio')
            },
            update: document.getElementById('profile-user-update')
        }

        this.tasks = {
            total: document.getElementById('profile-tasks-total'),
            onProgress: document.getElementById('profile-tasks-onprogress'),
            done: document.getElementById('profile-tasks-done')
        }

        this.loading = document.getElementById('profile-loading')
    }

    // Get and return the user profile data
    getProfile = async () => {
        try {
            const { data } = await fetchData(`/api/users/${this.user}`)

            this.profile.fields.name.textContent = data.name
            this.profile.fields.role.textContent = data.role
            if (data.bio) {
                this.profile.fields.bio.textContent = data.bio
            } else {
                this.profile.fields.bio.textContent = 'Describe yourself here...'
            }

            return data
        } catch (err) {
            console.error(err)
        }
    }

    // Show the update button if the user attempts to edit their profile
    handleShowUpdate = () => {
        this.showUpdate = (e) => {
            if (e.target.hasAttribute('contenteditable')) {
                this.profile.update.classList.remove('hidden')
            }
        }

        this.profile.profile.addEventListener('focus', this.showUpdate, true)
    }

    // Hide the update button if the user clicked outside of the fields to update their profile
    handleHideUpdate = () => {
        this.hideUpdate = (e) => {
            if (e.target.hasAttribute('contenteditable')) {
                this.profile.update.classList.add('hidden')
            }
        }

        this.profile.profile.addEventListener('blur', this.hideUpdate, true)
    }

    // Disable the function to hide the update button if the user hovers on the update button
    handleHoverUpdate = () => {
        this.profile.update.addEventListener('mouseenter', () => {
            this.profile.profile.removeEventListener('blur', this.hideUpdate, true)
        })
        this.profile.update.addEventListener('mouseover', () => {
            this.profile.profile.removeEventListener('blur', this.hideUpdate, true)
        })
        this.profile.update.addEventListener('mouseleave', () => {
            this.profile.profile.addEventListener('blur', this.hideUpdate, true)
        })
    }

    // Update the user profile
    updateProfile = async () => {
        // Get the user data
        try {
            const { data } = await fetchData(`/api/users/${this.user}`)
            // Make an updated data object based on the user input
            const updatedData = {
                ...data,
                name: this.profile.fields.name.textContent,
                role: this.profile.fields.role.textContent,
                bio: this.profile.fields.bio.textContent
            }

            // Get and return the response after make an api call to update the data
            const res = await updateData(`/api/users/${this.user}`, JSON.stringify(updatedData))

            return res
        } catch (err) {
            console.error(err)
        }
    }

    // Handle the event after updating the profile
    handleUpdateProfile = () => {
        // If the update button is clicked:
        this.profile.update.addEventListener('click', async () => {
            // Show loading state
            this.profile.update.innerHTML = ''
            loadAnimation(this.profile.update, 'dots-white')

            // Get the response after the request being sent
            try {
                const res = await this.updateProfile()
                // If success, reload the page
                if (res.success) {
                    location.reload()
                    // If not, abort the loading state and show a notice with error message
                } else {
                    this.profile.update.innerHTML = 'update profile'

                    showNotice(res.message, 'error')
                }
            } catch (err) {
                console.error(err)
            }
        })
    }

    // Get the tasks details of the user
    getTasksDetails = async () => {
        try {
            const todoTasks = await fetchData(`/api/users/${this.user}/todos`)
            const doneTasks = await fetchData(`/api/users/${this.user}/dones`)

            this.tasks.total.textContent = todoTasks['data'].length + doneTasks['data'].length
            this.tasks.onProgress.textContent = todoTasks['data'].length
            this.tasks.done.textContent = doneTasks['data'].length

            return { todoTasks, doneTasks }
        } catch (err) {
            console.error(err)
        }
    }

    // Get the user profile and their tasks details
    handleProfile = async () => {
        // Show the loading state
        loadAnimation(this.loading, 'loading')

        // Get the profile and tasks details
        try {
            const profile = await this.getProfile()
            const tasksDetails = await this.getTasksDetails()
            if (profile && tasksDetails) {
                // After getting the profile and tasks details, hide the loading state
                this.loading.classList.add('hidden')

                this.handleShowUpdate()
                this.handleHideUpdate()
                this.handleHoverUpdate()
                this.handleUpdateProfile()
            } else {
                // If not success, show a notice with error message
                this.loading.classList.add('hidden')
                showNotice('Failed to load your profile', 'error')
            }
        } catch (err) {
            console.error(err)
        }
    }
}

export default User