import {buildClient} from "../api/build-client";

const index = ({currentUser}) => {
    return (
        <div className="container">
            {currentUser ? 
                <h1>You are signed in</h1> :
                <h1>You are NOT signed in</h1>}
        </div>
    )
}

index.getInitialProps = async (context) => {
    console.log("Landing Page");
    const {data} = await buildClient(context).get("/api/users/currentUser");
    return data;
}

 
export default index;
