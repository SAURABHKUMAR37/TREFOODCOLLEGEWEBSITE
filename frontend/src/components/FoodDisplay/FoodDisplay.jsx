import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'
const FoodDisplay = ({category}) => {

    const {food_list, searchTerm}=useContext(StoreContext)

    const filteredList = food_list.filter((item) =>
        (category === "All" || category === item.category) &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

  return (
    <div className='food-display' id="food-display">
        <h2>Top dishes near you</h2>
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
  )
}

export default FoodDisplay