import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
const url = import.meta.env.VITE_BACKEND_URL;
import { useNavigate } from "react-router-dom";

const FoodItem = ({ id, name, price, description, image }) => {
    const navigate = useNavigate();


  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);
  const handleBuyNow = () => {
    navigate("/order", {
      state: {
        buyNowItem: {
          _id: id,
          name,
          price,
          description,
          image,
          quantity: 1,
        },
      },
    });
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          src={image}
          alt=""
          className="food-item-image"
        />
        {!cartItems[id] ? (
          <img
            src={assets.add_icon_white}
            alt=""
            className="add"
            onClick={() => addToCart(id)}
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt=""
            />
            <p>{cartItems[id]}</p>
            <img
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt=""
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">₹{price}</p>
        <button className="buy-now-btn" onClick={handleBuyNow}>
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default FoodItem;
