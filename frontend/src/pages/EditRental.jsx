import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function EditRental() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    pricePerDay: "",
    location: "",
    image: "",
  });

  useEffect(() => {
    const fetchRental = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        navigate("/login");
        return;
      }

      try {
        const apiUrl = `http://localhost:5000/api/rentals/${id}`;

        console.log("EDIT API URL:", apiUrl);

        const response = await fetch(apiUrl);

        console.log("EDIT API STATUS:", response.status);

        const responseText = await response.text();

        console.log("EDIT API RESPONSE:", responseText);

        if (!response.ok) {
          alert(`API Error ${response.status}: ${responseText}`);
          return;
        }

        const data = JSON.parse(responseText);

        setFormData({
          title: data.title || "",
          description: data.description || "",
          category: data.category || "",
          pricePerDay: data.pricePerDay || "",
          location: data.location || "",
          image: data.image || "",
        });
      } catch (error) {
        console.error("EDIT RENTAL ERROR:", error);

        alert(`Edit page error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRental();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.pricePerDay ||
      !formData.location
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `http://localhost:5000/api/rentals/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            pricePerDay: Number(
              formData.pricePerDay
            ),
            location: formData.location,
            image: formData.image,
          }),
        }
      );

      const responseText = await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        data = {
          message: responseText,
        };
      }

      if (!response.ok) {
        alert(
          data.message ||
          "Rental update nahi ho paaya"
        );
        return;
      }

      alert(
        "Rental item successfully updated ✅"
      );

      navigate("/owner-dashboard");
    } catch (error) {
      console.error(
        "UPDATE RENTAL ERROR:",
        error
      );

      alert(
        `Update error: ${error.message}`
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-rental-message">
        Loading rental...
      </div>
    );
  }

  return (
    <div className="edit-rental-page">
      <div className="edit-rental-container">

        <Link
          to="/owner-dashboard"
          className="edit-rental-back"
        >
          ← Back to Dashboard
        </Link>

        <div className="edit-rental-header">
          <h1>Edit Rental Item</h1>

          <p>
            Update your rental listing information.
          </p>
        </div>

        <form
          className="edit-rental-form"
          onSubmit={handleSubmit}
        >

          <div className="edit-form-group">
            <label>Item Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter item title"
            />
          </div>

          <div className="edit-form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your item"
              rows="5"
            />
          </div>

          <div className="edit-form-group">
            <label>Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">
                Select category
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

              <option value="Camera & Photography">
                Camera & Photography
              </option>

              <option value="Tools">
                Tools
              </option>

              <option value="Sports">
                Sports
              </option>

              <option value="Fashion">
                Fashion
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          <div className="edit-form-row">

            <div className="edit-form-group">
              <label>Price Per Day</label>

              <input
                type="number"
                name="pricePerDay"
                value={formData.pricePerDay}
                onChange={handleChange}
                min="0"
                placeholder="₹ 0"
              />
            </div>

            <div className="edit-form-group">
              <label>Location</label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Vadodara"
              />
            </div>

          </div>

          {formData.image && (
            <div className="edit-current-image">
              <label>Current Image</label>

              <img
                src={formData.image}
                alt={formData.title}
              />
            </div>
          )}

          <button
            type="submit"
            className="save-rental-btn"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default EditRental;
