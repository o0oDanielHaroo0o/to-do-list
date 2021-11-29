const modeIcons = [...document.querySelectorAll('.mode-icon')]
const bgImages = [...document.querySelectorAll('.bg-image')]
const container = document.getElementById('container')
const body = document.getElementById('body')
const filters = [...document.querySelectorAll('.filter')]
const unckeckIcons = [...document.querySelectorAll('.uncheck-icon')]
// toDoList ya está declarado en el anterior script

/* Función para cambiar a modo oscuro */

const toggleDarkMode = () =>{
    modeIcons.forEach(icon =>{
        icon.classList.toggle('hide')
    })
    bgImages.forEach(image =>{
        image.classList.toggle('hide')
    })
    body.classList.toggle('body--dark')
    container.classList.toggle('container--dark')
    toDoList.classList.toggle('to-do-list--dark')
    filters.forEach(filter =>{
        filter.classList.toggle('filter--dark')
    })
    elementInput.classList.toggle('input--dark')
    descriptionInput.classList.toggle('input--dark')
    unckeckIcons.forEach(icon =>{
        icon.classList.toggle('uncheck-icon--dark')
    })
}

/* Evento para cambiar de modo */

modeIcons.forEach(icon =>{
    icon.addEventListener('click', () =>{
        toggleDarkMode()
        if(localStorage.getItem('darkMode') == 'disabled' || localStorage.getItem('darkMode') == null){
            localStorage.setItem('darkMode','enabled')
        }else if(localStorage.getItem('darkMode') == 'enabled'){
            localStorage.setItem('darkMode', 'disabled')
        }
    })
})

/* Comprobar la preferencia de modo */
if(localStorage.getItem('darkMode') == 'enabled'){
    toggleDarkMode()
}