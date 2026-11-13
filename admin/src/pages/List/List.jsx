import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ token, setToken }) => {
  const url = import.meta.env.VITE_BACKEND_URL;

  const [list, setList] = useState([]);
  const [editFood, setEditFood] = useState(null);

  const fetchList = async () => {
    const response = await axios.get(url + "/api/food/list");
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Error");
    }
  };

  const removeFood = async (foodId) => {
    const response = await axios.post(
      url + "/api/food/remove",
      { id: foodId },
      { headers: { token } },
    );
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
      if (
        response.data.message.includes("Not authorized") ||
        response.data.message.includes("Invalid or expired")
      ) {
        setToken("");
      }
    }
  };
  const updateFood = async () => {
    try {
      const formData = new FormData();

      formData.append("id", editFood._id);
      formData.append("name", editFood.name);
      formData.append("description", editFood.description);
      formData.append("price", editFood.price);
      formData.append("category", editFood.category);
      if (editFood.image instanceof File) {
        formData.append("image", editFood.image);
      }
      const response = await axios.post(url + "/api/food/update", formData, {
        headers: { token },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setEditFood(null);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update food");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      {editFood && (
        <div className="edit-form">
          <h3>Edit Food</h3>

          <input
            type="text"
            value={editFood.name}
            placeholder="Food name"
            onChange={(e) => setEditFood({ ...editFood, name: e.target.value })}
          />
          <textarea
            value={editFood.description}
            placeholder="Description"
            onChange={(e) =>
              setEditFood({ ...editFood, description: e.target.value })
            }
          />
          <input
            type="number"
            value={editFood.price}
            placeholder="Price"
            onChange={(e) =>
              setEditFood({ ...editFood, price: e.target.value })
            }
          />
          <input
            type="text"
            value={editFood.category}
            placeholder="Category"
            onChange={(e) =>
              setEditFood({ ...editFood, category: e.target.value })
            }
          />
          <img
            src={
              editFood.image instanceof File
                ? URL.createObjectURL(editFood.image)
                : `${url}/images/${editFood.image}`
            }
            alt="Food preview"
            width="100"
          />

          {/* ADD THIS HERE */}
          <label htmlFor="edit-image" className="cursor">
            Change Image
          </label>

          <input
            id="edit-image"
            type="file"
            accept="image/*"
            hidden
            onChange={(e) =>
              setEditFood({
                ...editFood,
                image: e.target.files[0],
              })
            }
          />
          <button onClick={updateFood}>Save Changes</button>
          <button onClick={() => setEditFood(null)}>Cancel</button>
        </div>
      )}
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className="list-table-format">
              <img src={`${url}/images/` + item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>₹{item.price}</p>
              <div>
                <p onClick={() => removeFood(item._id)} className="cursor">
                  X
                </p>

                <p onClick={() => setEditFood(item)} className="cursor">
                  Edit
                </p>
              </div>{" "}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;
