import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
const url = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const buyNowItem = location.state?.buyNowItem;
  const [buyNowQuantity, setBuyNowQuantity] = useState(1);
  
  const { getTotalCartAmount, token, food_list, cartItems } =
    useContext(StoreContext);
  const subtotal = buyNowItem
    ? buyNowItem.price * buyNowQuantity
    : getTotalCartAmount();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    street: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });
  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };
  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Food Delivery",
      description: "Order Payment",
      order_id: order.id,

      handler: async (response) => {
        const { data } = await axios.post(
          url + "/api/order/verifyRazorpay",
          response,
          { headers: { token } },
        );

        if (data.success) {
          alert("Payment Successful");
          navigate("/myorders");
        } else {
          alert("Payment Failed");
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    let orderItems = [];

    if (buyNowItem) {
      orderItems.push({
        _id: buyNowItem._id,
        quantity: buyNowQuantity,
      });
    } else {
      food_list.forEach((item) => {
        if (cartItems[item._id] > 0) {
          orderItems.push({
            _id: item._id,
            quantity: cartItems[item._id],
          });
        }
      });
    }
    let orderData = {
      address: data,
      items: orderItems,
      amount: subtotal + 30,
    };
    let response = await axios.post(url + "/api/order/razorpay", orderData, {
      headers: { token },
    });
    if (response.data.success) {
      initPay(response.data.order);
    }
  };
  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (!buyNowItem && getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token, buyNowItem, getTotalCartAmount, navigate]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First Name"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last Name"
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="text"
          placeholder="Email Address"
        />
        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="city"
          />
          <input
            required
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="state"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            type="text"
            placeholder="Zip code"
          />
          <input
            required
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="country"
          />
        </div>
        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="phone"
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          {buyNowItem && (
            <div className="buy-now-details">
              <p>{buyNowItem.name}</p>

              <div className="buy-now-quantity">
                <button
                  type="button"
                  onClick={() =>
                    setBuyNowQuantity((prev) => Math.max(1, prev - 1))
                  }
                >
                  -
                </button>

                <span>{buyNowQuantity}</span>

                <button
                  type="button"
                  onClick={() => setBuyNowQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>
          )}
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{subtotal}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{subtotal === 0 ? 0 : 30}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{subtotal === 0 ? 0 : subtotal + 30}</b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
