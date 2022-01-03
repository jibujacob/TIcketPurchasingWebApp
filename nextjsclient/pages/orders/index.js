import React from 'react'

const OrderIndex = ({orders}) => {
    return (
        <div className='container'>
            <ul>
                {orders && orders.map(order => {
                    return <li key={order.id}>
                        {order.ticket.title} - {order.status}
                    </li>
                })}
            </ul>
        </div>
    )
}

OrderIndex.getInitialProps = async (context,client) => {
    const {data} = await client.get("/api/orders");
    return {orders:data};
}


export default OrderIndex
