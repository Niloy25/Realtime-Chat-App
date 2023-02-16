import React, { Fragment, useState, useEffect } from 'react'
import styled from "styled-components"
import { Link, useNavigate } from 'react-router-dom'
import Logo from "../assets/logo.svg"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginRoute } from '../Utils/APIRoutes';
import axios from "axios"

const Login = () => {

    const [values, setValues] = useState({
        username: "",
        password: ""
    })

    const navigate = useNavigate()

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(handleValidation()) {
            const { username, password } = values;
            const sendData = {
                username,
                password
            }
            console.log(sendData);
            const { data } = await axios.post(loginRoute, sendData);
            console.log(data);
            if(data.status === false){
                toast.error(data.msg, toastOptions)
            }
            else if(data.status === true){
                localStorage.setItem("chat-app-user", JSON.stringify(data.user))
                navigate("/");
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
        const { username, password } = values;
        if (password  === "") {
            toast.error("Username and Password is required!", toastOptions)
            return false
        }
        else if(username === ""){
            toast.error("Username and Password is required!", toastOptions)
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
                        min="3"
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        placeholder='Enter Password'
                        id='password'
                        name="password"
                        onChange={(e) => handleChange(e)}
                    />
                    <button type='submit'>Login User</button>
                    <span>
                        Don't have a account ? <Link to="/register">Register</Link>
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

export default Login