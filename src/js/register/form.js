import { sendData } from '../components/data'
import { validate, validatePasswordMatch, showError, resetError, enableSubmit, validateSubmit } from '../components/form'
import showNotice from '../components/notice'
import loadAnimation from '../components/animation'

class RegisterForm {
    constructor() {
        this.form = document.querySelector('form')
        this.fields = {
            name: document.getElementById('form-register-name'),
            role: document.getElementById('form-register-role'),
            email: document.getElementById('form-register-email'),
            password: document.getElementById('form-register-password'),
            confirmPassword: document.getElementById('form-register-confirm-password')
        }
        this.submit = document.getElementById('form-register-submit')
    }

    handleForm = () => {
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

                if (this.fields[field] === this.fields['confirmPassword']) {
                    isValid = validatePasswordMatch(this.fields['password'], this.fields[field])
                }

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
                const res = await validateSubmit(formData, 'auth/register', sendData)
                // If success, redirect the user to the login page
                if (res.success) {
                    window.location.replace('/login')
                    // If not, abort the loading state and show a notice with error message
                } else {
                    this.submit.innerHTML = 'create account'

                    const errors = res.message.map((error) => `<p class='flex gap-1 items-center text-sm'><i class="fa-solid fa-xmark"></i>${error}</p>`)
                    showNotice(errors.join(''), 'error')
                }
            } catch (error) {
                console.error(error)
            }
        })
    }
}

export default RegisterForm