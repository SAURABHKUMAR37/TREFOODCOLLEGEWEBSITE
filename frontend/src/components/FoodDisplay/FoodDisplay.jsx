import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
const FoodDisplay = ({ category }) => {
  const { food_list, searchTerm, priceRange,setPriceRange } = useContext(StoreContext);
  const filteredList = food_list.filter((item) => {
    const categoryMatch = category === "All" || category === item.category;

    const searchMatch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    let priceMatch = true;
    if (priceRange !== "All") {
      if (priceRange === "500+") {
        priceMatch = item.price >= 500;
      } else {
        const [min, max] = priceRange.split("-").map(Number);

        priceMatch =
          priceRange === "0-200"
            ? item.price >= min && item.price <= max
            : item.price > min && item.price <= max;
      }
    }

    return categoryMatch && searchMatch && priceMatch;
  });

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="price-filter">
        <label htmlFor="priceRange">Filter by Price:</label>

        <select
          id="priceRange"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
        >
          <option value="All">All Prices</option>
          <option value="0-200">₹0 - ₹200</option>
          <option value="200-300">₹200 - ₹300</option>
          <option value="300-400">₹300 - ₹400</option>
          <option value="400-500">₹400 - ₹500</option>
          <option value="500+">₹500+</option>
        </select>
      </div>

      <div className="food-display-list">
        {filteredList.length === 0 ? (
          <p>No food found</p>
        ) : (
          filteredList.map((item) => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              image={item.image}
              price={item.price}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
