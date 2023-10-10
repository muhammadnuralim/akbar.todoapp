import { sendData } from '../components/data'
import { validate, showError, resetError, enableSubmit, validateSubmit } from '../components/form'
import showNotice from '../components/notice'
import loadAnimation from '../components/animation'

class LoginForm {
    constructor() {
        this.form = document.querySelector('form')
        this.fields = {
            email: document.getElementById('form-login-email'),
            password: document.getElementById('form-login-password')
        }
        this.submit = document.getElementById('form-login-submit')
    }

    handleForm = () => {
        enableSubmit(this.fields, this.submit)
        this.handleInput()
        this.handleBlur()
        this.handleFocus()
        this.handleSubmit()
    }

    // Validate the input field when the user click outside the field and if it's invalid, show the error message
    handleBlur = () => {
        for (const field in this.fields) {
            this.fields[field].addEventListener('blur', () => {
                let isValid = validate(this.fields[field])

                if (!isValid) {
                    showError(this.fields[field])
                }
            })
        }
    }

    // Remove the error message if the user gets back to the input field
    handleFocus = () => {
        for (const field in this.fields) {
            this.fields[field].addEventListener('focus', () => {
                resetError(this.fields[field])
            })
        }
    }

    // Check if each field is valid while the user make an input and enable the submit button once all the fields are valid
    handleInput = () => {
        for (const field in this.fields) {
            this.fields[field].addEventListener('input', () => {
                enableSubmit(this.fields, this.submit)
            })
        }
    }

    // Handle the event after the form being submitted and validated on the server
    handleSubmit = () => {
        // If the user has submitted the form:
        this.form.addEventListener('submit', async (e) => {
            // Prevent the browser to reload the page
            e.preventDefault()

            // Show loading state
            this.submit.innerHTML = ''
            loadAnimation(this.submit, 'dots-white')

            // Create a FormData object
            const formData = new FormData(this.form)

            // Get the response after the request being sent and the form being validated
            try {
                const res = await validateSubmit(formData, '/auth/login', sendData)
                // If success, get the tokens and store them inside the local storage
                if (res.success) {
                    localStorage.setItem('access_token', res.access_token)
                    localStorage.setItem('refresh_token', res.refresh_token)

                    // Then redirect the user to the home page
                    window.location.replace('/home')
                    // If not success, abort the loading state and show a notice with error message
                } else {
                    this.submit.innerHTML = 'login'

                    const errors = res.message.map((error) => `<p class='flex gap-1 items-center text-sm'><i class="fa-solid fa-xmark"></i>${error}</p>`)
                    showNotice(errors.join(''), 'error')
                }
            } catch (error) {
                console.error(error)
            }
        })
    }
}

export default LoginForm