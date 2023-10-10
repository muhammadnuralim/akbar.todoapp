// Toggle a hamburger menu
const handleHamburger = () => {
    const hamburger = document.getElementById('landing-hamburger-button')
    const menu = document.getElementById('landing-hamburger-menu')

    hamburger.addEventListener('click', () => {
        menu.classList.toggle('opacity-0')
        menu.classList.toggle('invisible')

        hamburger.contains(hamburger.querySelector('.fa-bars')) ?
            hamburger.innerHTML = '<i class="fa-solid fa-circle-xmark text-white group-hover:cursor-pointer"></i>' :
            hamburger.innerHTML = '<i class="fa-solid fa-bars text-white group-hover:cursor-pointer"></i>'
    })
}

export default handleHamburger