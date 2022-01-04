import axios from "axios";

export const buildClient = ({req}) =>{
    if(typeof window === "undefined"){
        return axios.create({
            baseURL : "http://www.test-app-jpj-prod.xyz/",
            headers: req.headers,
        })
    }else{
        return axios.create({
            baseURL : "/" 
        })
    }
}