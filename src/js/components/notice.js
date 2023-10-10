import loadAnimation from './animation'

// Create and show a notice containing a feedback to the user
const showNotice = (message, category) => {
    // Create the container
    const mainContainer = document.createElement('div')
    mainContainer.className = 'fixed flex gap-1 items-center left-1/2 -translate-x-1/2 bottom-10 px-8 py-1 text-white rounded-2xl transition-opacity'
    mainContainer.classList.add(category)

    // Load the animation
    const animationContainer = document.createElement('div')
    animationContainer.className = 'h-20'
    loadAnimation(animationContainer, category)

    // Show the message
    const messageContainer = document.createElement('div')
    messageContainer.innerHTML = message

    // Attach the notice into the page
    mainContainer.append(animationContainer, messageContainer)
    document.getElementById('content').appendChild(mainContainer)

    // Remove the notice after 3 seconds
    setTimeout(() => {
        mainContainer.classList.add('hidden')
    }, 3000)
}

// Handle the flash notice sent by the Flask server
const handleFlash = () => {
    // Target the flash element
    const flash = document.getElementById('flash')
    const animation = document.getElementById('flash-animation')
    const category = flash.dataset.category

    // Load the animation
    loadAnimation(animation, category)

    // Remove the flash after 3 seconds
    setTimeout(() => {
        if (flash) {
            flash.classList.add('hidden')
        }
    }, 3000)
}

export default showNotice
export { handleFlash }