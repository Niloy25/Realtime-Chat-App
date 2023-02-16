import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { allUsersRoute, host } from '../Utils/APIRoutes'
import Contacts from '../Components/Contacts'
import Welcome from '../Components/Welcome'
import ChatContainer from '../Components/ChatContainer'
import { io } from "socket.io-client";

const Chat = () => {
  const socket = useRef();
  const [contacts, setContacts] = useState([])
  const [currentUser, setCurrentUser] = useState(undefined)
  const [currentChat, setCurrentChat] = useState(undefined)
  const [isLoaded, setIsLoaded] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if(!localStorage.getItem("chat-app-user")){
        navigate('/login')
    }
    else{
      setCurrentUser(JSON.parse(localStorage.getItem("chat-app-user")))
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    socket.current = io(host);
    socket.current.emit("add-user", currentUser?._id)
  }, [currentUser])

  useEffect(() => {
    fetchUser()
  }, [currentUser])

  const handleChatChange = (chat) => {
    setCurrentChat(chat)
  }

  const fetchUser = async() => {
    if(currentUser){
      if(currentUser.isAvatarImageSet){
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`)
        setContacts(data.data)
      }
      else{
        navigate('/setAvatar')
      }
    }
  }

  return (
    <Container>
    <div className="container">
      <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
      {
        isLoaded && currentChat === undefined ? 
        <Welcome currentUser={currentUser} /> :
        <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />
      }
    </div>
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  background-color: #131324;
  .container{
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px){
      grid-template-columns: 35% 65%;
    }
  }
`

export default Chat