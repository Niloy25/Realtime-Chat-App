import React, { Fragment, useState, useEffect } from 'react'
import styled from "styled-components"
import { Link, useNavigate } from 'react-router-dom'
import Logo from "../assets/logo.svg"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerRoute } from '../Utils/APIRoutes';
import axios from "axios"

const Register = () => {

    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const navigate = useNavigate()

    useEffect(() => {
        if(localStorage.getItem("chat-app-user")){
          navigate('/')
        }
      }, [])

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(handleValidation()) {
            const { username, email, password } = values;
            const sendData = {
                username, 
                email,
                password
            }
            const { data } = await axios.post(registerRoute, sendData);
            if(data.status === false){
                toast.error(data.msg, toastOptions)
            }
            else if(data.status === true){
                localStorage.setItem("chat-app-user", JSON.stringify(data.user))
                navigate("/login");
            }
        }
    }

    const toastOptions = {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
    }

    const handleValidation = () => {
        const { username, email, password, confirmPassword } = values;
        if (password !== confirmPassword) {
            toast.error("Password and Confirm password should be same!", toastOptions)
            return false
        }
        else if(username.length < 3){
            toast.error("Username should be greater than 3 charecters!", toastOptions)
            return false
        }
        else if(email === ""){
            toast.error("Email is required!", toastOptions)
            return false
        }
        else {
            return true
        }
    }

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value })
    }

    return (
        <Fragment>
            <FormContainer>
                <form onSubmit={handleSubmit}>
                    <div className="brand">
                        <img src={Logo} alt="Logo" />
                        <h1>Snap</h1>
                    </div>
                    <label htmlFor="userName">Username</label>
                    <input
                        type="text"
                        placeholder='Enter Username'
                        id='userName'
                        name="username"
                        onChange={(e) => handleChange(e)}
                    />
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        placeholder='Enter Email'
                        id='email'
                        name="email"
                        onChange={(e) => handleChange(e)}
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        placeholder='Enter Password'
                        id='password'
                        name="password"
                        onChange={(e) => handleChange(e)}
                    />
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        placeholder='Enter Confirm Password'
                        id='confirmPassword'
                        name="confirmPassword"
                        onChange={(e) => handleChange(e)}
                    />
                    <button type='submit'>Create User</button>
                    <span>
                        Already have a account ? <Link to="/login">Login</Link>
                    </span>
                </form>
            </FormContainer>
            <ToastContainer />
        </Fragment>
    )
}

const FormContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #131324;
    .brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
        img {
            height: 2rem;
        }
        h1{
            color: white;
            text-transform: uppercase;
        }
    }
    form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        background-color: #00000076;
        border-radius: 2rem;
        padding: 3rem 5rem;
        label{
            color: white;
        }
        input {
            background-color: transparent;
            padding: 0.6rem;
            border: 0.1rem solid #4e0eff;
            border-radius: 0.4rem;
            color: white;
            font-size: 1rem;
            &:focus {
                border: 0.1rem solid #997af0;
                outline: none;
            }
        }
        button {
            background-color: #997af0;
            color: white;
            padding: 1rem 2rem;
            border: none;
            font-weight: bold;
            cursor: pointer;
            border-radius: 0.4rem;
            font-size: 1rem;
            text-transform: uppercase;
            transition: 0.5s ease-in-out;
            &:hover{
                background-color: #4e0eff;
            }
        }
        span {
            color: white;
            text-transform: uppercase;
            a {
                color: #4e0eff;
                text-decoration: none;
                font-weight: bold;
            }
        }
    }
`;

export default Register