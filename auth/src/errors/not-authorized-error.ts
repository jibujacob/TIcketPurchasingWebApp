import { CustomError } from "./custom-error";

export class NotAuthoriedError extends CustomError{
    statusCode = 401;

    serializeErrors(){
        return [{message:"Not Authorized"}]
    }

    constructor(){
        super("Not Authorized");
        
        //Only because we are extending a built in class
        Object.setPrototypeOf(this,NotAuthoriedError.prototype)
    }
}