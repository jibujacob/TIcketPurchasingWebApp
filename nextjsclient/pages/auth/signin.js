import React, { useState } from 'react';
import Router from "next/router";

import useRequest from '../../hooks/use-request';

const signin = () => {
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const {doRequest,errors} = useRequest({
        url: "/api/users/signin",
        method: "post",
        body : {email,password},
        onSuccess : () => Router.push("/")
        });

    const handleSumbit = async (e) => {
        e.preventDefault();
        doRequest();
    }

    return (
        <div className='container'>
            <form onSubmit={handleSumbit}>
                <h1>Sign In</h1>
                <br />
                <div className="form-group">
                    <label>Email Address</label>
                    <input value={email} onChange={e=>setEmail(e.target.value)} type="text" className="form-control" />
                </div>
                <br />
                <div className="form-group">
                    <label>Password</label>
                    <input value={password} onChange={e=>setPassword (e.target.value)}  type="password" className="form-control" />
                </div>
                <br />
                {errors}
                <br />
                <button className='btn btn-primary'>Sign In</button>
            </form>
        </div>
    )
}

export default signin
