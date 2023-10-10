// Create and return a button element
const createButton = (classList, content, handler, name = "", title = "") => {
    const button = document.createElement('button')

    button.className = classList
    button.innerHTML = content

    button.setAttribute('name', name)
    button.setAttribute('title', title)

    button.addEventListener('click', handler)

    return button
}

export default createButton
