// Switch the appearance of a dragged To Do task into a Done task
const todoToDone = (dragged, newButton) => {
    // Switch the heading color
    const heading = dragged.firstElementChild
    heading.classList.remove('bg-violet-700', 'text-white')
    heading.classList.add('bg-teal-600', 'text-teal-500')

    // Switch the label color
    const label = heading.lastElementChild
    label.classList.remove('border-white')
    label.classList.add('border-teal-500')

    // Change the task description color
    const description = heading.nextElementSibling
    description.classList.add('text-neutral-400')

    // Switch the buttons color
    const leftButtons = dragged.lastElementChild.firstElementChild
    const editButton = leftButtons.firstElementChild
    editButton.classList.remove('text-white')
    editButton.classList.add('text-emerald-500')
    const deleteButton = leftButtons.lastElementChild
    deleteButton.classList.remove('text-white')
    deleteButton.classList.add('text-rose-500')

    // Switch the old button to the new button
    const rightButtons = dragged.lastElementChild.lastElementChild
    const oldButton = rightButtons.firstElementChild
    oldButton.remove()
    rightButtons.append(newButton)
}

// Switch the appearance of a dragged Done task into a To Do task
const doneToTodo = (dragged, newButton) => {
    // Switch the heading color
    const heading = dragged.firstElementChild
    heading.classList.remove('bg-teal-600', 'text-teal-500')
    heading.classList.add('bg-violet-700', 'text-white')

    // Switch the label color
    const label = heading.lastElementChild
    label.classList.remove('border-teal-500')
    label.classList.add('border-white')

    // Change the task description color
    const description = heading.nextElementSibling
    description.classList.remove('text-neutral-400')

    // Switch the buttons color
    const leftButtons = dragged.lastElementChild.firstElementChild
    const editButton = leftButtons.firstElementChild
    editButton.classList.remove('text-emerald-500')
    editButton.classList.add('text-white')
    const deleteButton = leftButtons.lastElementChild
    deleteButton.classList.remove('text-rose-500')
    deleteButton.classList.add('text-white')

    // Switch the old button to the new button
    const rightButtons = dragged.lastElementChild.lastElementChild
    const oldButton = rightButtons.firstElementChild
    oldButton.remove()
    rightButtons.append(newButton)
}

// Get the element that is present next to the dragged element
const getNextElement = (container, y) => {
    // Target the elements other than the dragged element
    const otherElements = [...container.querySelectorAll('div[draggable="true"]:not(.opacity-50)')]

    return otherElements.reduce((next, element) => {
        // Get the offset of the dragged element and the next element
        const box = element.getBoundingClientRect()
        const offset = y - (box.top + box.height / 2)
        if (offset < 0 && offset > next.offset) {
            return { offset, nextElement: element }
        } else {
            return next
        }
    }, { offset: Number.NEGATIVE_INFINITY })
}

export { todoToDone, doneToTodo, getNextElement }