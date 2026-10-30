import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function RentalDetails() {
    const { id } = useParams();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showFullDescription, setShowFullDescription] = useState(false);

    useEffect(() => {
        const fetchRental = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/rentals/${id}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message);
                }

                setItem(data);
            } catch (error) {
                console.error(error);
                setError("Rental item load nahi ho paaya.");
            } finally {
                setLoading(false);
            }
        };

        fetchRental();
    }, [id]);

    if (loading) {
        return (
            <div className="rental-details-message">
                Loading item...
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="rental-details-message">
                <h2>Item not found</h2>
                <p>{error}</p>

                <Link to="/rentals">
                    ← Back to Rentals
                </Link>
            </div>
        );
    }

    return (
        <div className="rental-details-page">
            <div className="rental-details-container">

                <Link
                    to="/rentals"
                    className="back-to-rentals"
                >
                    ← Back to Rentals
                </Link>

                <div className="rental-details-card">

                    {/* IMAGE */}
                    <div className="rental-details-image">
                        {item.image ? (
                            <img
                                src={item.image}
                                alt={item.title}
                            />
                        ) : (
                            <div className="no-detail-image">
                                No Image Available
                            </div>
                        )}
                    </div>

                    {/* CONTENT */}
                    <div className="rental-details-content">

                        <span className="rental-details-category">
                            {item.category}
                        </span>

                        <span
                            className={`availability-badge ${item.available ? "available" : "unavailable"
                                }`}
                        >
                            {item.available ? "Available for Rent" : "Currently Unavailable"}
                        </span>

                        <h1>{item.title}</h1>

                        <p className="rental-details-location">
                            📍 {item.location}
                        </p>

                        <div className="rental-details-price">
                            ₹{item.pricePerDay}
                            <span> / day</span>
                        </div>



                        <div className="rental-details-divider"></div>

                        <div className="rental-details-description">
                            <h2>Description</h2>
                            <p>{item.description}</p>
                        </div>

                        {item.owner && (
                            <div className="rental-owner">
                                <div className="owner-avatar">
                                    {item.owner.name
                                        ? item.owner.name.charAt(0).toUpperCase()
                                        : "U"}
                                </div>

                                <div>
                                    <span>Listed by</span>
                                    <strong>{item.owner.name}</strong>
                                </div>
                            </div>
                        )}

                        {item.available ? (
                            <Link
                                to={`/rentals/${item._id}/book`}
                                className="rent-now-btn"
                            >
                                Rent Now
                            </Link>
                        ) : (
                            <button
                                type="button"
                                className="rent-now-btn rent-now-disabled"
                                disabled
                            >
                                Currently Unavailable
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RentalDetails;