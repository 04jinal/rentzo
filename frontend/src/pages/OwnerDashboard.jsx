import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function OwnerDashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [items, setItems] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");

        if (!savedUser) {
            navigate("/login");
            return;
        }

        const currentUser = JSON.parse(savedUser);
        setUser(currentUser);

        fetchOwnerData(currentUser.id);
    }, [navigate]);

    const fetchOwnerData = async (ownerId) => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const itemsResponse = await fetch(
                `http://localhost:5000/api/rentals/owner/${ownerId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const itemsData = await itemsResponse.json();

            if (!itemsResponse.ok) {
                alert(itemsData.message || "Items fetch nahi ho paaye");
                return;
            }

            setItems(itemsData);

            const bookingRequests = itemsData.map((item) =>
                fetch(
                    `http://localhost:5000/api/bookings/rental/${item._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                ).then((response) => response.json())
            );

            const bookingResults = await Promise.all(bookingRequests);

            const allBookings = bookingResults.flat();

            setBookings(allBookings);
        } catch (error) {
            console.error(error);
            alert("Dashboard data fetch nahi ho paaya.");
        } finally {
            setLoading(false);
        }
    };

    const updateBookingStatus = async (bookingId, status) => {
        try {
            console.log("CURRENT USER:", user);
            console.log("TOKEN:", localStorage.getItem("token"));
            console.log("BOOKING ID:", bookingId);
            console.log("NEW STATUS:", status);

            const response = await fetch(
                `http://localhost:5000/api/bookings/${bookingId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        status,
                    }),
                }
            );

            const data = await response.json();

            console.log("STATUS RESPONSE:", response.status);
            console.log("STATUS RESPONSE DATA:", data);
            console.log("STATUS RESPONSE MESSAGE:", data.message);

            if (!response.ok) {
                alert(data.message || "Booking update nahi ho paayi");
                return;
            }

            setBookings((previousBookings) =>
                previousBookings.map((booking) =>
                    booking._id === bookingId
                        ? {
                            ...booking,
                            status: data.booking.status,
                        }
                        : booking
                )
            );

            alert(
                status === "confirmed"
                    ? "Booking confirmed successfully ✅"
                    : "Booking cancelled successfully"
            );
        } catch (error) {
            console.error(error);
            alert("Server se connect nahi ho pa raha.");
        }
    };

    const handleDeleteRental = async (rentalId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this rental?"
        );

        if (!confirmed) {
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Session expired. Please login again.");
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/rentals/${rentalId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                    "Rental delete nahi ho paaya."
                );
                return;
            }

            alert("Rental deleted successfully ✅");

            // Dashboard se deleted item remove karo
            setItems((previousItems) =>
                previousItems.filter(
                    (item) => item._id !== rentalId
                )
            );

        } catch (error) {
            console.error(
                "DELETE RENTAL ERROR:",
                error
            );

            alert(
                "Server se connect nahi ho pa raha."
            );
        }
    };
    const handleToggleAvailability = async (rentalId, currentAvailability) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Session expired. Please login again.");
                navigate("/login");
                return;
            }

            const response = await fetch(
                `http://localhost:5000/api/rentals/${rentalId}/availability`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        available: !currentAvailability,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                    "Rental availability update nahi ho paayi."
                );
                return;
            }

            setItems((previousItems) =>
                previousItems.map((item) =>
                    item._id === rentalId
                        ? {
                            ...item,
                            available: data.item.available,
                        }
                        : item
                )
            );
        } catch (error) {
            console.error(
                "TOGGLE AVAILABILITY ERROR:",
                error
            );

            alert("Server se connect nahi ho pa raha.");
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusClass = (status) => {
        if (status === "confirmed") return "status-confirmed";
        if (status === "cancelled") return "status-cancelled";
        if (status === "completed") return "status-completed";

        return "status-pending";
    };

    if (loading) {
        return (
            <div className="owner-dashboard-page">
                <div className="dashboard-loading">
                    Loading your dashboard...
                </div>
            </div>
        );
    }

    return (
        <div className="owner-dashboard-page">
            <div className="owner-dashboard-container">

                {/* HEADER */}
                <div className="owner-dashboard-header">
                    <div>
                        <p className="dashboard-eyebrow">
                            OWNER DASHBOARD
                        </p>

                        <h1>
                            Welcome, {user?.name}
                        </h1>

                        <p>
                            Manage your rental items and track your bookings.
                        </p>
                    </div>

                    <Link
                        to="/list-item"
                        className="dashboard-list-btn"
                    >
                        + List New Item
                    </Link>
                </div>

                {/* STATS */}
                <div className="owner-stats-grid">

                    <div className="owner-stat-card">
                        <div className="stat-icon">📦</div>

                        <div>
                            <span>Listed Items</span>
                            <strong>{items.length}</strong>
                        </div>
                    </div>

                    <div className="owner-stat-card">
                        <div className="stat-icon">📅</div>

                        <div>
                            <span>Total Bookings</span>
                            <strong>{bookings.length}</strong>
                        </div>
                    </div>

                    <div className="owner-stat-card">
                        <div className="stat-icon">⏳</div>

                        <div>
                            <span>Pending</span>
                            <strong>
                                {
                                    bookings.filter(
                                        (booking) => booking.status === "pending"
                                    ).length
                                }
                            </strong>
                        </div>
                    </div>

                    <div className="owner-stat-card">
                        <div className="stat-icon">💰</div>

                        <div>
                            <span>Booking Value</span>
                            <strong>
                                ₹
                                {bookings
                                    .reduce(
                                        (total, booking) =>
                                            total + Number(booking.totalAmount || 0),
                                        0
                                    )
                                    .toLocaleString("en-IN")}
                            </strong>
                        </div>
                    </div>

                </div>

                {/* MY ITEMS */}
                <section className="owner-dashboard-section">

                    <div className="section-heading">
                        <div>
                            <h2>My Listed Items</h2>
                            <p>
                                Items you have listed on Rentzo.
                            </p>
                        </div>
                    </div>

                    {items.length === 0 ? (
                        <div className="owner-empty-state">
                            <div className="empty-icon">📦</div>

                            <h3>No items listed yet</h3>

                            <p>
                                Start earning by listing something for rent.
                            </p>

                            <Link
                                to="/list-item"
                                className="empty-action-btn"
                            >
                                List Your First Item
                            </Link>
                        </div>
                    ) : (
                        <div className="owner-items-grid">

                            {items.map((item) => (
                                <div
                                    className="owner-item-card"
                                    key={item._id}
                                >

                                    <div className="owner-item-image">

                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                            />
                                        ) : (
                                            <div className="no-image">
                                                📦
                                            </div>
                                        )}

                                        <span>
                                            {item.category}
                                        </span>
                                    </div>

                                    <span
                                        className={`availability-badge ${item.available
                                                ? "available"
                                                : "unavailable"
                                            }`}
                                    >
                                        {item.available
                                            ? "Available"
                                            : "Unavailable"}
                                    </span>

                                    <div className="owner-item-content">

                                        <h3>{item.title}</h3>

                                        <p className="owner-item-location">
                                            📍 {item.location}
                                        </p>

                                        <div className="owner-item-footer">

                                            <strong>
                                                ₹{item.pricePerDay}
                                                <small>/day</small>
                                            </strong>

                                            <Link
                                                to={`/rentals/${item._id}`}
                                                className="view-item-btn"
                                            >
                                                View Item
                                            </Link>

                                            <Link
                                                to={`/owner-dashboard/edit/${item._id}`}
                                                className="edit-item-btn"
                                            >
                                                ✏️ Edit
                                            </Link>

                                            <button
                                                type="button"
                                                className={`availability-toggle-btn ${item.available
                                                    ? "availability-active"
                                                    : "availability-inactive"
                                                    }`}
                                                onClick={() =>
                                                    handleToggleAvailability(
                                                        item._id,
                                                        item.available
                                                    )
                                                }
                                            >
                                                {item.available
                                                    ? "Mark Unavailable"
                                                    : "Mark Available"}
                                            </button>

                                            <button
                                                type="button"
                                                className="delete-item-btn"
                                                onClick={() => handleDeleteRental(item._id)}
                                            >
                                                🗑 Delete
                                            </button>



                                        </div>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </section>

                {/* BOOKINGS */}
                <section className="owner-dashboard-section">

                    <div className="section-heading">
                        <div>
                            <h2>Recent Bookings</h2>
                            <p>
                                Bookings received for your rental items.
                            </p>
                        </div>
                    </div>

                    {bookings.length === 0 ? (
                        <div className="owner-empty-state">
                            <div className="empty-icon">📅</div>

                            <h3>No bookings yet</h3>

                            <p>
                                When someone rents your item, the booking
                                will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="owner-bookings-list">

                            {bookings.map((booking) => (
                                <div
                                    className="owner-booking-card"
                                    key={booking._id}
                                >

                                    <div className="booking-item-info">

                                        <div className="booking-thumb">

                                            {booking.rentalItem?.image ? (
                                                <img
                                                    src={booking.rentalItem.image}
                                                    alt={booking.rentalItem.title}
                                                />
                                            ) : (
                                                <span>📦</span>
                                            )}

                                        </div>

                                        <div>
                                            <h3>
                                                {booking.rentalItem?.title}
                                            </h3>

                                            <p>
                                                {booking.rentalItem?.location}
                                            </p>
                                        </div>

                                    </div>

                                    <div className="booking-renter">

                                        <span>Renter</span>

                                        <strong>
                                            {booking.renter?.name || "User"}
                                        </strong>

                                        <small>
                                            {booking.renter?.email || ""}
                                        </small>

                                    </div>

                                    <div className="booking-dates">

                                        <span>Rental Period</span>

                                        <strong>
                                            {formatDate(booking.startDate)}
                                            {" → "}
                                            {formatDate(booking.endDate)}
                                        </strong>

                                        <small>
                                            {booking.totalDays} day
                                            {booking.totalDays !== 1 ? "s" : ""}
                                        </small>

                                    </div>

                                    <div className="booking-amount">

                                        <span>Total Amount</span>

                                        <strong>
                                            ₹
                                            {Number(
                                                booking.totalAmount || 0
                                            ).toLocaleString("en-IN")}
                                        </strong>

                                    </div>

                                    <div className="booking-actions">

                                        <span
                                            className={`booking-status ${getStatusClass(
                                                booking.status
                                            )}`}
                                        >
                                            {booking.status}
                                        </span>

                                        {booking.status === "pending" && (
                                            <div className="booking-action-buttons">

                                                <button
                                                    type="button"
                                                    className="confirm-booking-btn"
                                                    onClick={() =>
                                                        updateBookingStatus(
                                                            booking._id,
                                                            "confirmed"
                                                        )
                                                    }
                                                >
                                                    Confirm
                                                </button>

                                                <button
                                                    type="button"
                                                    className="cancel-booking-btn"
                                                    onClick={() =>
                                                        updateBookingStatus(
                                                            booking._id,
                                                            "cancelled"
                                                        )
                                                    }
                                                >
                                                    Cancel
                                                </button>

                                            </div>
                                        )}

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </section>

            </div>
        </div>
    );
}

export default OwnerDashboard;