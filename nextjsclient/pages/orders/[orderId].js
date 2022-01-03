import React, { useEffect, useState } from 'react';
import StripeCheckout from "react-stripe-checkout";
import useRequest from '../../hooks/use-request';
import Router from "next/router"

const OrderShow = ({order,currentUser}) => {
    const [timeLeft,setTimeLeft] = useState(0);
    const {doRequest,errors} = useRequest({
        url:"/api/payments",
        method:"post",
        body:{
            orderId: order.id
        },
        onSuccess:()=> {Router.push("/orders")}
    })
    useEffect(()=>{
        const findTimeLeft = () =>{
            const sLeft = Math.floor((new Date(order.expiresAt).getTime() - new Date().getTime())/1000)
            setTimeLeft(sLeft)
        }
        findTimeLeft(); 
        const timerId = setInterval(findTimeLeft,1000);

        return () => {
            clearInterval(timerId)
        }
    },[order])

    if(timeLeft < 0 ){
        return <div className='container'>Order Expired</div>
    }
    return (
        <div className='container'>
            Time left to purchase: {timeLeft} seconds
            <StripeCheckout
                token={({id}) => doRequest({token:id})}
                stripeKey="pk_test_51KDiWOSAfRzolvPglgEoOiEhYisB0reALzGA5TXdpmHf0ASkOOCGmyscfs4kVjOZXQHV5yyq2z5OwYI9PvhUyjrG00C4CQjrZI"
                amount={order.ticket.price * 100}
                email={currentUser.email}
                currency="INR"
            />
            {errors}
        </div>
    )
}

OrderShow.getInitialProps = async (context,client)=>{
    const {orderId} = context.query;
    const {data} = await client.get(`/api/orders/${orderId}`)

    return {order:data}
}

export default OrderShow
