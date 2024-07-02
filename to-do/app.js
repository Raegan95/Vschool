let selectedItem, selectedElement
const input = document['todo-form'].firstElementChild
input.addEventListener('blur', async e => await reset())

const reset = async () => {
    input.value = ''
    await getTodos()
    document['todo-form'].removeEventListener('submit', handleUpdateTodo)
    document['todo-form'].addEventListener('submit', handleCreateTodo)
}

const handleCreateTodo = async e => {
    e.preventDefault()
    await createTodo(input.value)
    await getTodos()
    input.value = ''
}

const handleUpdateTodo = async e => {
    e.preventDefault()
    if (selectedItem) {
        await updateTodo(selectedItem._id, { title: input.value })
    }
    await reset()
}

const handleDeleteTodo = async item => {
    await deleteTodo(item._id)
    await getTodos()
}

const handleCompleteTodo = async item => {
    await updateTodo(item._id, { completed: !item.completed })
    await getTodos()
}

const handleEditTodo = item => {
    selectedItem = item
    input.value = item.title
    input.select()
    document['todo-form'].removeEventListener('submit', handleCreateTodo)
    document['todo-form'].addEventListener('submit', handleUpdateTodo)
}

const updateDOM = items => {
    const list = document.querySelector('.todo-list')
    while (list.firstChild) list.removeChild(list.lastChild)
    items.forEach(item => {
        const listItem = createListItem(item)
        list.appendChild(listItem)
    })
}

const createListItem = item => {
    const listItemElement = document.createElement('li')
    const containerElement = document.createElement('div')
    const paragraphElement = document.createElement('p')
    const buttons = createButtons(listItemElement, item)
    paragraphElement.textContent = item.title
    listItemElement.dataset.id = item._id
    containerElement.appendChild(paragraphElement)
    listItemElement.appendChild(containerElement)
    listItemElement.appendChild(buttons)
    addTouchListeners(listItemElement, item)
    addClickListeners(listItemElement, item)
    if (item.completed) addCompletionStyles(listItemElement)
    return listItemElement
}

const addCompletionStyles = element => {
    element.firstElementChild.style.textDecorationLine = 'line-through'
    element.style.backgroundColor = 'green'
}

const createButtons = (listItemElement, item) => {
    const containerElement = document.createElement('div')
    const editButtonElement = document.createElement('button')
    const deleteButtonElement = document.createElement('button')
    editButtonElement.textContent = 'EDIT'
    editButtonElement.addEventListener('click', () => {
        listItemElement.style.backgroundColor = 'dodgerblue'
        handleEditTodo(item)
    })
    deleteButtonElement.textContent = 'DELETE'
    deleteButtonElement.addEventListener('click', () => handleDeleteTodo(item))
    deleteButtonElement.addEventListener('mouseenter', () => {
        listItemElement.style.backgroundColor = 'red'
    })
    deleteButtonElement.addEventListener('mouseleave', () => {
        if (item.completed) {
            listItemElement.style.backgroundColor = 'green'
        } else {
            listItemElement.style.backgroundColor = 'rgba(0,50,50,.3)'
        }
    })
    containerElement.appendChild(editButtonElement)
    containerElement.appendChild(deleteButtonElement)
    containerElement.className = 'button-container'
    return containerElement
}

const showButtons = element => {
    const buttonContainer = Array.from(element.childNodes).find(
        child => child.className === 'button-container'
    )
    buttonContainer.style.height = '55px'
    buttonContainer.style.borderTop = '1px solid #ddd'
    buttonContainer.style.paddingTop = '10px'
}

const hideButtons = element => {
    const buttonContainer = Array.from(element.childNodes).find(
        child => child.className === 'button-container'
    )
    buttonContainer.style.height = '0px'
    buttonContainer.style.borderTop = 'none'
    buttonContainer.style.paddingTop = '0'
}

document.body.addEventListener('click', () => {
    if (selectedElement) {
        hideButtons(selectedElement)
        selectedElement = null
    }
})

const addClickListeners = (element, item) => {
    let pendingClick
    element.addEventListener('click', async e => {
        e.stopPropagation()

        const toggleButtons = () => {
            if (selectedElement === element) {
                hideButtons(selectedElement)
            } else {
                selectedItem = item
                selectedElement = element
                showButtons(selectedElement)
            }
        }

        if (pendingClick) {
            clearTimeout(pendingClick)
            pendingClick = null
        }

        if (e.detail === 1) pendingClick = setTimeout(toggleButtons, 150)
        else if (e.detail === 2) await handleCompleteTodo(item)
    })
}

const addTouchListeners = (element, item) => {
    let touchStart
    const threshold = window.innerWidth / 5
    onTouchStart(element)
    onTouchMove(element, threshold)
    onTouchEnd(element, item, threshold)
}

const onTouchStart = element => {
    element.addEventListener('touchstart', e => {
        e.preventDefault()
        touchStart = e.touches[0].pageX
    })
}

const onTouchMove = (element, threshold) => {
    element.addEventListener('touchmove', e => {
        e.preventDefault()
        const move = e.touches[0].pageX
        const offset = move - touchStart
        element.style.transform = `translate(${offset}px)`
        if (offset > 1) {
            if (Math.abs(offset) > threshold) {
                //delete
                element.style.backgroundColor = 'red'
            }
        } else if (offset < -1) {
            if (Math.abs(offset) > threshold) {
                //complete
                element.style.backgroundColor = 'green'
            }
        }
    })
}

const onTouchEnd = (element, item, threshold) => {
    element.addEventListener('touchend', async e => {
        e.preventDefault()
        element.style.transform = `translate(0px)`
        const touchEnd = e.changedTouches[0].pageX
        const change = touchStart - touchEnd
        if (change > 1) {
            if (Math.abs(change) > threshold) {
                await handleCompleteTodo(item)
            }
        } else if (change < -1) {
            if (Math.abs(change) > threshold) {
                await handleDeleteTodo(item)
            }
        }
        if (Math.floor(touchStart) === Math.floor(touchEnd)) {
            if (selectedElement) {
                selectedElement.style.backgroundColor = `rgba(0, 50, 50, .3)`
            }
            selectedElement = element
            element.style.backgroundColor = `dodgerblue`
            handleEditTodo(item)
        } else {
            element.style.backgroundColor = `rgba(0, 50, 50, .3)`
        }
    })
}

document['todo-form'].addEventListener('submit', handleCreateTodo)

// Axios

let name = localStorage.getItem('name')
if (!name) {
    name = prompt('Enter your name to load your todos:')
    localStorage.setItem('name', name)
}
const baseURL = `https://api.vschool.io/${name}/todo`

const createTodo = async text => {
    await axios.post(baseURL, { title: text })
}

const deleteTodo = async id => {
    await axios.delete(`${baseURL}/${id}`)
}

const updateTodo = async (id, data) => {
    await axios.put(`${baseURL}/${id}`, data)
}

const getTodos = async () => {
    const resp = await axios.get(baseURL)
    updateDOM(resp.data)
}

getTodos()
