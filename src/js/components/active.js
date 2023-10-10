// Give the active link a different color: 'teal'
const active = (url) => {
    const links = [...document.querySelectorAll(`a[href="${url}"]`)]
    links.forEach(link => link.classList.add('text-teal-400'))
}

export default active