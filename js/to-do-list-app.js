const elementInput = document.getElementById('elementInput')
const descriptionInput = document.getElementById('descriptionInput')
const pendingItems = document.getElementById('pendingItems')
const showAll = document.getElementById('showAll')
const showPending = document.getElementById('showPending')
const showCompleted = document.getElementById('showCompleted')
const addButton = document.getElementById('addButton')
const removeButton = document.getElementById('removeButton')
const clearCompleted = document.getElementById('clearCompleted')
const toDoList = document.getElementById('toDoList')
const listTitle = document.getElementById('listTitle')
const editTitle = document.querySelectorAll('.edit-title')
let savedItems = []
let savedDescriptions = []
let completedSavedItems = []
let draggables

/* Función para mostrar los elementos de la lista */
const displayList = () =>{
    removeItemsFromList()
    for(let item of savedItems){
        const newItem = document.createElement('LI')
        newItem.innerHTML = `<div><p class="list-element__content">${item}</p></div></div> <div class="buttons"><img src="./images/check.svg" alt="check icon" class="check-item-button icon" tabindex="0"><img src="./images/uncheck.svg" alt="uncheck icon" class="check-item-button icon hide uncheck-icon" tabindex="0"><img src="./images/clear.svg" alt="clear icon" class="delete-item-button icon" tabindex="0"></div>`
        newItem.classList.add('list-element')
        newItem.setAttribute('draggable','true')
        toDoList.appendChild(newItem)    
    }
    let listArray = Array.from(toDoList.children)
    for(let item of listArray){
        let index = listArray.indexOf(item)
        let description = document.createElement('P')
        description.innerHTML = `${savedDescriptions[index]}`
        description.classList.add('list-element__content', 'list-element__description')
        item.children[0].appendChild(description)
    }
    addSingleDeleteEvent()
    addCheckItemEvent()
    reCheckCompletedItems()
    recallFilter()
    pendingCount()
    addDragAndDrop()
}

/* Función para mantener(recordar) el último filtro usado */
const recallFilter = () =>{
    let filter = localStorage.getItem('filter')
    if(filter == 'all'){
        showAll.click()
    }else if(filter == 'pending'){
        showPending.click()
    }else if (filter == 'completed'){
        showCompleted.click()
    }
}

/* Función para almacenar los elementos de la lista en localStorage */
const storeList = () =>{
    if(savedItems.length != 0){
        localStorage.setItem('toDoList', JSON.stringify(savedItems))
        localStorage.setItem('listDescriptions', JSON.stringify(savedDescriptions))
    }else{
        localStorage.removeItem('toDoList')
        localStorage.removeItem('listDescriptions')
    }
}

/* Función para recordar los elementos de la lista del localStorage */
const retrieveList = () =>{
    if(localStorage.getItem("toDoList") != null){
        savedItems = JSON.parse(localStorage.getItem("toDoList"))
        savedDescriptions = JSON.parse(localStorage.getItem("listDescriptions"))
        if(localStorage.getItem("completedList") != null){
            completedSavedItems = JSON.parse(localStorage.getItem("completedList"))
            // displayList()
        }
        displayList()
    }
}

/* Función para agregar un nuevo elemento al array savedItems */
const addElementToList = () =>{
    if(elementInput.value.trim() != ""){
        savedItems.push(elementInput.value.trim())
        savedDescriptions.push(descriptionInput.value.trim())
        elementInput.value = ""
        descriptionInput.value = ""
        storeList()
        displayList()
    }
}
/* Función para eliminar todos los elementos de la lista (HTML) */
const removeItemsFromList = () =>{
    while(toDoList.children[0]){
        toDoList.removeChild(toDoList.children[0])
    }
}

/* Función que agrega las tareas completadas al array completedSavedItems y las guarda en el localStorage */
const saveCompletedItems = () =>{
    completedSavedItems = []
    let listItems = Array.from(toDoList.children)
    listItems.forEach(item =>{
        if(item.classList.contains("completed")){
            completedSavedItems.push(listItems.indexOf(item))
            // console.log(listItems.indexOf(item))
        }
    })
    // console.dir(Array.from(toDoList.children))
    // console.dir(completedSavedItems)
    if(completedSavedItems.length != 0){
        localStorage.setItem('completedList', JSON.stringify(completedSavedItems))
    }else{
        localStorage.removeItem('completedList')
    }
}

/* Función para agregar evento que permite eliminar un elemento de la lista */
const addSingleDeleteEvent = () =>{
    let listArray
    let singleDeleteButtons = document.querySelectorAll('.delete-item-button')
    singleDeleteButtons.forEach(button =>{
        button.addEventListener('click', (e) =>{
            listArray = Array.from(toDoList.children)
            let removedItem = (listArray.indexOf(e.target.parentElement.parentElement))
            savedItems.splice(removedItem, 1)
            savedDescriptions.splice(removedItem, 1)
            toDoList.removeChild(toDoList.children[removedItem])
            storeList()
            saveCompletedItems()
            displayList()
        })
    })
}

/* Función para tachar y destachar los items completados */
const addCheckItemEvent = () =>{
    let listArray
    let checkUncheckButtons = document.querySelectorAll('.check-item-button')
    checkUncheckButtons.forEach(button =>{
        button.addEventListener('click', (e) =>{
            listArray = Array.from(e.target.parentElement.parentElement.parentElement.children)
            let checkedIndex = listArray.indexOf(e.target.parentElement.parentElement)
            // console.log(listArray)
            // console.log(checkedItem)
            let checkButton = listArray[checkedIndex].children[1].children[0]
            let uncheckButton = listArray[checkedIndex].children[1].children[1]
            checkButton.classList.toggle("hide")
            uncheckButton.classList.toggle("hide")
            let checkedItem = e.target.parentElement.parentElement
            checkedItem.classList.toggle("completed")

            e.target.parentElement.parentElement.children[0].classList.toggle("checked")
            saveCompletedItems()
            recallFilter()
            pendingCount()
        })
    })
}


/* Función para volver a tachar los elementos que estén dentro de completedSavedItems */
const reCheckCompletedItems = () =>{
    completedSavedItems.forEach(item =>{
        if(toDoList.children[item] != undefined){
            toDoList.children[item].children[1].children[0].click()
            // console.log(item)
        }
    })
}

/* Función para determinar cuántas tareas siguen pendientes o cuántas han sido completadas */
/* const pendingCount = () =>{
    let count = savedItems.length-completedSavedItems.length
    pendingItems.innerHTML = `Hay ${count} elementos pendientes`
} */
const pendingCount = () =>{
    if(localStorage.getItem('toDoList') == null){
        pendingItems.innerHTML = `Todavía no hay elementos en la lista, ¡Agrega uno!`
    }else{
        if(localStorage.getItem('filter') == 'all' || localStorage.getItem('filter') == 'pending'){
            let count = savedItems.length-completedSavedItems.length
            if(count == 0){
                pendingItems.innerHTML = `No hay elementos pendientes, ¡Has completado todos los elementos de la lista!`
            }else if(count == 1){
                pendingItems.innerHTML = `Hay ${count} elemento pendiente`
            }else if(count > 1){
                pendingItems.innerHTML = `Hay ${count} elementos pendientes`
            }
        }else if(localStorage.getItem('filter') == 'completed'){
            let completedCount = completedSavedItems.length
            if(completedSavedItems.length == savedItems.length){
                pendingItems.innerHTML = `¡Has completado todos los elementos de la lista!`
            }else if(completedCount == 0){
                pendingItems.innerHTML = `No hay elementos completados`
            }else if(completedCount == 1){
                pendingItems.innerHTML = `Has completado ${completedCount} elemento de la lista`
            }else if(completedCount > 1){
                pendingItems.innerHTML = `Has completado ${completedCount} elementos de la lista`
            }
        }
    }
}

/* Función para agregar eventos drag and drop */
const addDragAndDrop = () =>{
    draggables = document.querySelectorAll('.list-element')
    // Eventos para los elementos de la lista(draggables)
    draggables.forEach(draggable =>{
        draggable.addEventListener('dragstart', () =>{
            // console.log('empeiza el drag')
            draggable.classList.add('dragging')
        })
        draggable.addEventListener('dragend', () =>{
            // console.log('termina el drag')
            draggable.classList.remove('dragging')
            saveCompletedItems()
        })
    })
    // Eventos para la lista (container drop)
    toDoList.addEventListener('dragover', (e) =>{
        e.preventDefault()
        const draggingItem = document.querySelector('.dragging')
        const afterElement = getDragAfterElement(e.clientY)
        // console.log(afterElement)
        if(afterElement == null){
            toDoList.appendChild(draggingItem)
        }else{
            toDoList.insertBefore(draggingItem, afterElement)
        }
        // console.log('dragging over the list')
        rearrange()
    })
}

/* Función para obtener el elemento siguiente a la posición del mouse dentro de la lista */
const getDragAfterElement = (y) =>{
    const draggableElements = [...document.querySelectorAll('.list-element:not(.dragging)')]

    return draggableElements.reduce((closest, child) =>{
        const box = child.getBoundingClientRect()
        const offset = y - box.top -box.height / 2
        if (offset < 0 && offset > closest.offset){
            return { offset: offset, element: child }        
        }else{
            return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
}

/* Función para reordenar los elementos del localStorage al usar el drag and drop */
const rearrange = () =>{
    savedItems = []
    savedDescriptions = []
    let listItems = [...toDoList.children]
    listItems.forEach(item =>{
       savedItems.push(item.children[0].children[0].textContent)
       savedDescriptions.push(item.children[0].children[1].textContent)
    })
    storeList()
}

/* Función para recordar el título de la lista */
const recallTitle = () =>{
    if(localStorage.getItem('listTitle') != null){
        listTitle.textContent = localStorage.getItem('listTitle')
    }
}

/*
======================================= 
Inicio del Programa 
=======================================
*/
retrieveList()
recallTitle()
pendingCount()
elementInput.focus()
addButton.addEventListener('click', ()=>{
    addElementToList()
})
/* Evento para eliminar los items del HTML/DOM y del localStorage*/
removeButton.addEventListener('click', ()=>{
    removeItemsFromList()
    savedItems = []
    savedDescriptions = []
    completedSavedItems = []
    localStorage.removeItem('toDoList')
    localStorage.removeItem('listDescriptions')
    localStorage.removeItem('completedList')
    pendingCount()
})

/*  Eventos para forzar evento addElementToList con la tecla enter  en los inputs*/
elementInput.addEventListener('keyup', (e) =>{
    // console.dir(e.key)
    if(e.key == "Enter"){
        addButton.click()
        elementInput.focus()
    }
})
descriptionInput.addEventListener('keyup', (e) =>{
    // console.dir(e.key)
    if(e.key == "Enter"){
        addButton.click()
        elementInput.focus()
    }
})

/* Evento para remover el filtro de tareas */
showAll.addEventListener('click', () =>{
    let listArray = Array.from(toDoList.children)
    listArray.forEach(child =>{
            child.classList.remove('hide')
    })
    showPending.classList.remove('filter--current')
    showCompleted.classList.remove('filter--current')
    showAll.classList.add('filter--current')
    localStorage.setItem('filter','all')
    pendingCount()
})

/* Evento para filtrar las tareas pendientes */
showPending.addEventListener('click', () =>{
    let listArray = Array.from(toDoList.children)
    listArray.forEach(child =>{
            child.classList.remove('hide')
    })
    listArray.forEach(child =>{
        if(child.classList.contains('completed')){
            child.classList.add('hide')
        }
    })
    showAll.classList.remove('filter--current')
    showCompleted.classList.remove('filter--current')
    showPending.classList.add('filter--current')
    localStorage.setItem('filter','pending')
    pendingCount()
})

/* Evento para filtrar las tareas completadas */
showCompleted.addEventListener('click', () =>{
    let listArray = Array.from(toDoList.children)
    listArray.forEach(child =>{
            child.classList.remove('hide')
    })
    listArray.forEach(child =>{
        if(child.classList.contains('completed') == false){
            child.classList.add('hide')
        }
    })
    showAll.classList.remove('filter--current')
    showPending.classList.remove('filter--current')
    showCompleted.classList.add('filter--current')
    localStorage.setItem('filter','completed')
    pendingCount()
})

recallFilter()

/* Evento para eliminar las tareas completadas */
clearCompleted.addEventListener('click', () =>{
    let listArray = Array.from(toDoList.children)
    let indexOfCompletedItems = []
    listArray.forEach(item =>{
        if(item.classList.contains('completed')){
            indexOfCompletedItems.push(listArray.indexOf(item))
        }
    })
    indexOfCompletedItems.reverse()
    indexOfCompletedItems.forEach(index =>{
        savedItems.splice(index, 1)
        savedDescriptions.splice(index, 1)
    })
    storeList()
    completedSavedItems = []
    localStorage.removeItem('completedList')
    displayList()
})

/* Eventos para mostrar y ocultar el botón de editar título */
const editTitleEnter = () =>{editTitle[0].classList.remove('hide')}
const editTitleExit = () =>{editTitle[0].classList.add('hide')}
listTitle.parentElement.parentElement.addEventListener('mouseenter', editTitleEnter)
listTitle.parentElement.parentElement.addEventListener('mouseleave', editTitleExit)

/* Eventos para editar el título */
let titleInput = document.createElement('INPUT')
editTitle[0].addEventListener('click', ()=>{
    listTitle.parentElement.parentElement.removeEventListener('mouseenter', editTitleEnter)
    listTitle.parentElement.parentElement.removeEventListener('mouseleave', editTitleExit)
    editTitle.forEach(button =>{
        button.classList.toggle('hide')
    })
    listTitle.classList.toggle('hide')
    titleInput.setAttribute('value', listTitle.textContent)
    titleInput.setAttribute('max-length', '21')
    titleInput.classList.add('input-title')
    listTitle.before(titleInput)
    titleInput.focus()
    titleInput.addEventListener('keydown', (e) =>{
        if(titleInput.value.length >= 20){
            if(e.key != 'Enter' && e.key != 'Backspace' && e.key != 'Delete'  && e.key != 'Tab' && e.key != 'ArrowLeft' && e.key != 'ArrowRight'){
                e.preventDefault()
            }
        }
    })

})
editTitle[1].addEventListener('click',() =>{
    /* editTitle.forEach(button =>{
        button.classList.toggle('hide')
    }) */
    editTitle[1].classList.toggle('hide')
    listTitle.classList.toggle('hide')
    listTitle.textContent = titleInput.value.trim()
    titleInput.remove()
    localStorage.setItem('listTitle', listTitle.textContent)
    listTitle.parentElement.parentElement.addEventListener('mouseenter', editTitleEnter)
    listTitle.parentElement.parentElement.addEventListener('mouseleave', editTitleExit)
})

titleInput.addEventListener('keyup', (e) =>{
    if(e.key == 'Enter'){
        editTitle[1].click()
    }
})