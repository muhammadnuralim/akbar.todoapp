// Display a clock
const setClock = () => {
    const date = new Date()
    const clock = document.getElementById('footer-clock')

    clock.textContent = date.toLocaleTimeString([], { hour12: false })
}

// Display the year dynamically
const setYear = () => {
    const year = document.getElementById('footer-year')
    year.textContent = new Date().getFullYear()
}

// Set footer content
const setFooter = () => {
    // If a page uses footer, add some space above the footer
    const footer = document.getElementById('footer')
    if (footer.hasChildNodes) {
        footer.classList.add('mt-8')
    }

    // Display the clock and the year
    setInterval(setClock, 1000)
    setYear()
}

export default setFooter