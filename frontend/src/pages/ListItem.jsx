import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ListItem() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [pricePerDay, setPricePerDay] = useState("");
    const [location, setLocation] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("Please login first.");
            navigate("/login");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Session expired. Please login again.");
            navigate("/login");
            return;
        }
        if (!image) {
            alert("Please select an image.");
            return;
        }

        setLoading(true);

        try {
            // 1. Image ko Cloudinary par upload karo
            const formData = new FormData();

            formData.append("file", image);
            formData.append(
                "upload_preset",
                "rentzo_uploads"
            );

            const uploadResponse = await fetch(
                "https://api.cloudinary.com/v1_1/dehtissu/image/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const uploadData = await uploadResponse.json();

            if (!uploadResponse.ok) {
                alert("Image upload nahi hui");
                return;
            }

            // 2. Cloudinary se image URL milega
            const imageUrl = uploadData.secure_url;

            // 3. Ab rental item backend ko bhejo
            const response = await fetch(
                "http://localhost:5000/api/rentals",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        category,
                        pricePerDay: Number(pricePerDay),
                        location,
                        image: imageUrl,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Your item has been listed successfully 🎉");

            navigate("/rentals");
        } catch (error) {
            console.error(error);
            alert("Server se connect nahi ho pa raha.");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="list-item-page">
            <div className="list-item-container">

                <div className="list-item-header">
                    <h1>List Your Item</h1>
                    <p>
                        Rent out your unused items and start earning.
                    </p>
                </div>

                <form
                    className="list-item-form"
                    onSubmit={handleSubmit}
                >
                    <label>Item Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Canon Camera"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <label>Description</label>
                    <textarea
                        placeholder="Describe your item..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />

                    <label>Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select category</option>
                        <option value="Camera & Photography">
                            Camera & Photography
                        </option>
                        <option value="Electronics">
                            Electronics
                        </option>
                        <option value="Furniture">
                            Furniture
                        </option>
                        <option value="Vehicles">
                            Vehicles
                        </option>
                        <option value="Sports">
                            Sports
                        </option>
                        <option value="Tools">
                            Tools
                        </option>
                        <option value="Party & Events">
                            Party & Events
                        </option>
                        <option value="Other">
                            Other
                        </option>
                    </select>

                    <label>Price Per Day (₹)</label>
                    <input
                        type="number"
                        placeholder="e.g. 800"
                        min="0"
                        value={pricePerDay}
                        onChange={(e) => setPricePerDay(e.target.value)}
                        required
                    />

                    <label>Location</label>
                    <input
                        type="text"
                        placeholder="e.g. Vadodara"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />

                    <div className="image-upload-section">
                        <label>Item Image</label>

                        <div className="image-upload-box">
                            <div className="image-upload-left">
                                <span className="upload-icon">📷</span>

                                <div>
                                    <h3>Upload Item Image</h3>
                                    <p>Choose a clear photo of your item</p>
                                </div>
                            </div>

                            <label className="choose-file-btn">
                                Choose File
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setImage(e.target.files[0])
                                    }
                                    required
                                />
                            </label>
                        </div>

                        {image && (
                            <p className="selected-file">
                                ✓ {image.name}
                            </p>
                        )}
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Listing..." : "List Item"}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default ListItem;