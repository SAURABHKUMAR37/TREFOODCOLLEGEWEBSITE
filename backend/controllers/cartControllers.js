import userModel from"../models/userModel.js"

//add items to user cart

const addToCart=async(req,res)=>{
try {
    let userData=await userModel.findById(req.body.userId);
    let cartData=await userData.cartData;
    if(!cartData[req.body.itemId])
    {
        cartData[req.body.itemId]=1
    }
    else{
        cartData[req.body.itemId]+=1
    }
await userModel.findByIdAndUpdate(req.body.userId,{cartData})
res.json({success:true,message:"Added to cart"})
    
} catch (error) {
    res.json({success:false,message:error})
}



}

//removes items from user cart

const removeFromCart=async(req,res)=>{

    try {
        let userData=await userModel.findById(req.body.userId)
        let cartData=await userData.cartData;

        if(cartData[req.body.itemId]>0)
        {
            cartData[req.body.itemId]-=1
        }
        else if(cartData[req.body.itemId]<=0)
        {
           return res.json({success:false,message:"cart is empty"})
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData})
        res.json({successs:true,message:"removed from card"})
        
    } catch (error) {
        res.json({successs:false,message:error})

    }




}

//fetch user cart data

const getCart=async(req,res)=>{

    try {
        let userData=await userModel.findById(req.body.userId)
        let cartData= await userData.cartData;
        res.json({success:true,cartData});
        
    } catch (error) {
        res.json({success:false,message:error})
        
    }

}
export{addToCart,removeFromCart,getCart}
