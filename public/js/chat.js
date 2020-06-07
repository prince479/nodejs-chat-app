socket = io()
//Elements
const messageForm = document.getElementById('messageForm')
const messageFormInput = messageForm.querySelector('input')
const messageFormButton = messageForm.querySelector('button')
const sendLocationButton = document.querySelector('#send-location')
const messages = document.querySelector('#messages')
const sidebar = document.querySelector('#sidebar')
const openBtn = document.queryCommandEnabled('.openbtn')
const closeBtn = document.queryCommandEnabled('.closeBtn')

//templates

const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
//Options
const time = moment(new Date().getTime()).format('h:mm a')
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const closeNav = () => {
    sidebar.style.width = 0
    $(".openbtn").removeAttr("hidden")
    $(".closeBtn").prop("hidden", true)
}
const openNav = () => {
    sidebar.style.width = "225px";
    $(".openbtn").prop("hidden", true)
    $(".closeBtn").prop("hidden", false)
}

const autoscroll = () => {
    messages.scrollTop = messages.scrollHeight
}

const audio = new Audio('../messenger.mp3')

const append = (message) => {
    const html = `
                <div>
                    <p class="message right">${message}
                        <span class="message__meta">${time}</span>
                    </p>  
                </div>
    `
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
}

socket.on('message', message => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    if (message.username !== 'Admin') {
        audio.play()

    }
    autoscroll()
})
socket.on('locationMessage', message => {
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    messageFormButton.setAttribute('disabled', 'disabled')
    const message = e.target.elements.message.value
    if (message !== '')
        socket.emit('sendMessage', message, (error) => {
            messageFormButton.removeAttribute('disabled')
            messageFormInput.value = ''
            messageFormInput.focus()
            if (error) {
                return alert(error)
            }
            append(message)
        })
})

sendLocationButton.addEventListener('click', () => {
    sendLocationButton.setAttribute('disabled', 'disabled')
    if (!navigator.geolocation) {
        return alert("Your browser does not support GEOLOCATION")
    }
    navigator.geolocation.getCurrentPosition(position => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            sendLocationButton.removeAttribute('disabled')
            append("You Shared your location")
        })
    },error=>{
        sendLocationButton.removeAttribute('disabled')
            return alert(`Please allow http sites in your browser settings ${error}`)
    })
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    sidebar.innerHTML = html

})
socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})
