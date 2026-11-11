import { createContext, useEffect, useState } from "react";
export const StoreContext=createContext(null)
const url = import.meta.env.VITE_BACKEND_URL;
import axios from "axios"

const StoreContextProvider=(props)=>{

    const [cartItems,setCartItems]=useState({})

const [token, setToken] = useState(
    localStorage.getItem("token") || ""
);

const [food_list,setFoodlist]=useState([]);
    const addToCart=(itemId)=>{
        if(!cartItems[itemId])
        {
            setCartItems((prev)=>({...prev,[itemId]:1}))
        }
        else{
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }
    }
    const removeFromCart = (itemId) => {
    setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        }

       const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
        if (cartItems[item] > 0) {
            let itemInfo = food_list.find((product) => product._id === item);
            totalAmount += itemInfo.price * cartItems[item];
        }
    }
    return totalAmount;
}
 
const fetchFoodList=async()=>{
    const response=await axios.get(url+"/api/food/list");
    setFoodlist(response.data.data);
}
useEffect(()=>{
    async function loadData(){
        await fetchFoodList();
    }
    loadData();
},[])




    const contextValue={
        food_list,addToCart,removeFromCart,cartItems,setCartItems,
        getTotalCartAmount,token,setToken

    }
    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}
export default StoreContextProvider