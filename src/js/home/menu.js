class Menu {
    constructor() {
        this.menu = document.getElementById('home-menu')
        this.show = document.getElementById('home-show-menu-button')
    }

    showMenu() {
        this.menu.classList.remove('translate-y-full')
        this.menu.classList.add('shadow-modal')
    }

    handleShowMenu = () => {
        this.show.addEventListener('click', () => {
            this.showMenu()
        })
    }

    closeMenu() {
        this.menu.classList.add('translate-y-full')
        this.menu.classList.remove('shadow-modal')
    }

    handleClickOutside = () => {
        document.addEventListener('click', (e) => {
            if (this.menu) {
                const menuClicked = this.menu.contains(e.target) || this.show.contains(e.target)
                if (!menuClicked) {
                    this.closeMenu()
                }
            }
        })
    }

    handleMenu = () => {
        this.handleShowMenu()
        this.handleClickOutside()
    }
}

export default Menu
