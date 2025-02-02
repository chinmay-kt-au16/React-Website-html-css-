import React, { useEffect} from "react";

import {
 
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
} from "react-bootstrap";
import Message from '../components/Message'
import { useDispatch, useSelector } from "react-redux";

import CheckoutSteps from "../components/CheckoutSteps";
import {createOrder} from '../actions/orderActions'

const PlaceorderScreen = ({history}) => {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart );
  console.log(cart)

  const addDecimals = (num) => {
      return (Math.round(num * 100)/100).toFixed(2)
  }
  // calculate price
  cart.itemsPrice = addDecimals(cart.cartItems.reduce((acc, item)=> acc + item.price * item.qty , 0) )

  // shipping price  if total picce is greater than 500 then take zero rupies  else take 500 rs
  cart.shippingPrice = addDecimals(cart.itemsPrice > 500 ? 50 : 500)

  // calculate tax
  cart.taxPrice = addDecimals(Number((0.05 * cart.itemsPrice).toFixed(2)) )

  // total price
  cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2)

  const orderCreate = useSelector((state) => state.orderCreate)

  // console.log(orderCreate)
  const {order , success , error } = orderCreate

  // console.log(order)
  //  console.log(order.createOrder)
  //  console.log(order.createOrder._id)

  console.log(success)

  useEffect(()=>{
    if(success){
      history.push(`/order/${order._id}`)
    }
    // eslint-disable-next-line 
  },[history, success])
  
  const placeOrderHandler = () => {
    dispatch(createOrder({
      orderItems : cart.cartItems, 
      shippingAddress : cart.shippingAddress,
      paymentMethod : cart.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice : cart.shippingPrice,
      taxPrice : cart.taxPrice,
      totalPrice : cart.totalPrice

    }))

    console.log("placeorder")
}

  return (
    <div  >
      
        <CheckoutSteps step1 step2 step3 step4 />
        <Row>
          <Col  md={8}>
            <ListGroup variant="flush">
              <ListGroup.Item>
              <h2>Shipping</h2>
                <p>
                  Name : {cart.shippingAddress.name} ,
                  Phone : {cart.shippingAddress.phone}
                </p>
                
                <p>
                  <strong>
                    Address: {cart.shippingAddress.address},
                    {cart.shippingAddress.city}
                    {""},{cart.shippingAddress.postalCode}
                    {""},{cart.shippingAddress.country}{" "}
                  </strong>
                </p>
              </ListGroup.Item>

              <ListGroup.Item>
               <h2>Payment Method</h2>
               <strong>Method : {cart.paymentMethod}</strong>
              </ListGroup.Item>

              <ListGroup.Item>
                  <h2>Oder Items</h2>
                  {
                      cart.cartItems.length === 0 ? <Message>Your cart is empty</Message>
                      : (
                          <ListGroup variant='flush' >
                              {cart.cartItems.map((item , index) => (
                                  <ListGroup.Item key={index} >
                                      <Row>
                                          <Col md={1}>
                                              <Image src={item.image} alt={item.name} fluid rounded></Image>
                                          </Col>

                                          <Col>
                                            <p >{item.name} : </p>
                                          </Col>
                                          <Col md={4} style={{width:"50%"}}>
                                              {item.qty}  x ₹{item.price} = ₹{item.qty * item.price}
                                          </Col>
                                      </Row>
                                  </ListGroup.Item>
                              ))}

                          </ListGroup>
                      )
                  }
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col ma={4}>
            <Card>
                <ListGroup variant="flush" >
                    <ListGroup.Item>
                        <h2>Order Summary</h2>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Row>
                            <Col>Items:</Col>
                            <Col>₹{cart.itemsPrice}</Col>
                        </Row>
                        
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Row>
                            <Col>Shipping:</Col>
                            <Col>₹{cart.shippingPrice}</Col>
                        </Row>
                        
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Row>
                            <Col>Tax:</Col>
                            <Col>₹{cart.taxPrice}</Col>
                        </Row>
                        
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Row>
                            <Col>Total:</Col>
                            <Col>₹{cart.totalPrice}</Col>
                        </Row>
                        
                    </ListGroup.Item>
                    <ListGroup.Item>
                      {
                        error && <Message variant='danger'>{error}</Message>
                      }

                    </ListGroup.Item>

                    <ListGroup.Item>
                    <Button type="button" className ='btn-block'
                         disabled={cart.cartItems === 0} 
                         onClick = {placeOrderHandler}
                         > Place Order </Button>
                        
                    </ListGroup.Item>


                </ListGroup>
                
            </Card>
          </Col>
        </Row>
     
    </div>
  );
};

export default PlaceorderScreen;
