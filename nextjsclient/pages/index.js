import React from 'react'

const index = ({color}) => {
    console.log("I am in the component",color);
    return (
        <div>
            <h1>Landing Page</h1>
        </div>
    )
}

index.getInitialProps = () => {
    console.log("Inside the server");

    return {color:"red"}
}

 
export default index
