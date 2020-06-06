const users = []

//add User , removeUser

const addUser = ({id,username,room})=>{
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    // Validate the data
    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // check for exisiting user
    const exisitingUser = users.find((user)=>{
        return user.room == room && user.username == username
    })
    //Validate username 
    if(exisitingUser){
        return {
            error: "Username is already in use"
        }
    }

    const user = {id,username,room}
    users.push(user)
    return {user}
}

const removeUser =(id)=>{
    const index = users.findIndex((user)=> user.id ==id)
    if(index !==-1)
    {
        return users.splice(index,1)[0]
    }
}
const getUser = (id)=>{
    return users.find(user=>user.id == id)
}

const userList = (room)=>{
    return users.filter(user=>user.room == room)
}
module.exports={
    addUser,
    getUser,
    userList,
    removeUser
}
// addUser({
//     id:23,
//     username:'prince',
//     room:'bilsi'
// })

// addUser({
//     id:24,
//     username:'roshan',
//     room:'bilsi'
// })
// const all = userList('bilsi')
// console.log(all)
// console.log(users)
// const get = getUser(24)
// console.log(get)
// // console.log(users)