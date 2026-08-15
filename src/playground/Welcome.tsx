import React from "react"
import { useState, useEffect } from "react"

export const Welcome = ({ name }: { name: string }) => {
    return <h1> Hello {name}, let's get started</h1>
}

type WelcomeProps = {
    name: string;
};

export const Card = ({ children }: { children: React.ReactElement<WelcomeProps> }) => {
    let name: String;
    let [isLoggedIn, setIsloggedIn] = useState(false);
    const [roles, setRoles] = useState(["admin", "tester"]);
    const [newRole, setNewRole] = useState("");
    if (React.isValidElement(children)) {
        name = children.props.name;
    }
    const getWelcomeMessage = (isLoggedIn: boolean) => {
        if (isLoggedIn) {
            return "Succesfully Logged In"
        }
        return "Logged Out"
    }
    useEffect(()=>{
        alert("Use Effect Triggered")
    },[roles]);

    return <div><h3>This is a Card</h3><br></br>{children}<button style={{ height: 70, width: 200, border: "2px solid" }} onClick={() => {
        {
            name === "Kuldeep" ? alert(`Welcome ${name}`) : alert(`Hi ${name}, Please ask Kuldeep for access `)
        }

    }}> Card Details</button>  {
            <button onClick={
                () => setIsloggedIn(!isLoggedIn)
            }>
                {isLoggedIn ? "login" : "logout"}
            </button>

        }
        <h4>{getWelcomeMessage(isLoggedIn)}</h4>
        <input value={newRole} onChange={(e) => setNewRole(e.target.value)}></input><button onClick={() => {
            setRoles([...roles, newRole]);
        }}> Add Role</button>
        <button onClick={() => {
            roles.pop();
            setRoles([...roles]);
        }}> Delete Role</button>
        <ul style={{ width: 30 }}>
            {
                roles.map((role, index) => (
                    <li key={index}>{role}</li>
                ))
            }</ul>
    </div>
}