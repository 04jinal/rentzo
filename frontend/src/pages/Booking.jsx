import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function Booking() {
    const { id } = useParams();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [totalDays, setTotalDays] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    const [bookingLoading, setBookingLoading] = useState(false);
    const [availability, setAvailability] = useState(null);
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const getTodayDate = () => {
        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };


    // Fetch rental item
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }
        const fetchRental = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/rentals/${id}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Rental item nahi mila"
                    );
                }

                setItem(data);
            } catch (error) {
                console.error("FETCH RENTAL ERROR:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRental();
    }, [id]);
    // Calculate total
    useEffect(() => {
        if (!startDate || !endDate || !item) {
            setTotalDays(0);
            setTotalAmount(0);
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        const difference =
            end.getTime() - start.getTime();

        const days = Math.ceil(
            difference / (1000 * 60 * 60 * 24)
        );

        if (days > 0) {
            setTotalDays(days);
            setTotalAmount(days * item.pricePerDay);
        } else {
            setTotalDays(0);
            setTotalAmount(0);
        }
    }, [startDate, endDate, item]);

    const checkAvailability = async (selectedStartDate, selectedEndDate) => {
        if (!selectedStartDate || !selectedEndDate || !id) {
            setAvailability(null);
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            setAvailability({
                available: false,
                message: "Please login first to check availability.",
            });
            return;
        }


        if (selectedEndDate <= selectedStartDate) {
            setAvailability({
                available: false,
                message: "End date start date ke baad honi chahiye.",
            });
            return;
        }

        try {
            setCheckingAvailability(true);

            const response = await fetch(
                `http://localhost:5000/api/bookings/rental/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const bookings = await response.json();

            if (!response.ok) {
                setAvailability({
                    available: false,
                    message: "Availability check nahi ho paayi.",
                });
                return;
            }

            const selectedStart = new Date(selectedStartDate);
            const selectedEnd = new Date(selectedEndDate);

            const overlappingBooking = bookings.find((booking) => {
                if (
                    booking.status !== "pending" &&
                    booking.status !== "confirmed"
                ) {
                    return false;
                }

                const bookingStart = new Date(booking.startDate);
                const bookingEnd = new Date(booking.endDate);

                return (
                    selectedStart < bookingEnd &&
                    selectedEnd > bookingStart
                );
            });

            if (overlappingBooking) {
                setAvailability({
                    available: false,
                    message:
                        "Ye item selected dates par available nahi hai. Please different dates choose karein.",
                });
            } else {
                setAvailability({
                    available: true,
                    message: "Great! Item selected dates par available hai.",
                });
            }
        } catch (error) {
            console.error(error);

            setAvailability({
                available: false,
                message: "Availability check nahi ho paayi.",
            });
        } finally {
            setCheckingAvailability(false);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("Please login first.");
            navigate("/login");
            return;
        }

        if (!startDate || !endDate) {
            alert("Please select booking dates.");
            return;
        }

        if (totalDays <= 0) {
            alert("Please select valid dates.");
            return;
        }

        if (
            availability &&
            availability.available === false
        ) {
            alert(
                "Selected dates available nahi hain. Please different dates choose karein."
            );
            return;
        }

        try {
            setBookingLoading(true);

            const token = localStorage.getItem("token");

            if (!token) {
                alert("Session expired. Please login again.");
                navigate("/login");
                return;
            }

            const response = await fetch(
                "http://localhost:5000/api/bookings",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        rentalItem: id,
                        startDate,
                        endDate,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Booking create nahi ho paayi.");
                return;
            }

            alert("Booking successfully created 🎉");

            navigate("/my-bookings");
        } catch (error) {
            console.error("BOOKING ERROR:", error);
            alert("Booking create nahi ho paayi.");
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="booking-message">
                Loading...
            </div>
        );
    }

    if (!item) {
        return (
            <div className="booking-message">
                <h2>Rental item not found</h2>

                <Link to="/rentals">
                    ← Back to Rentals
                </Link>
            </div>
        );
    }

    return (
        <div className="booking-page">
            <div className="booking-container">

                <Link
                    to={`/rentals/${id}`}
                    className="booking-back-link"
                >
                    ← Back to Item
                </Link>

                <div className="booking-layout">

                    {/* LEFT SIDE */}

                    <div className="booking-item-card">

                        <div className="booking-item-image">
                            {item.image ? (
                                <img
                                    src={item.image}
                                    alt={item.title}
                                />
                            ) : (
                                <span>No Image</span>
                            )}
                        </div>

                        <div className="rental-booking-item-info">

                            <span className="booking-category">
                                {item.category}
                            </span>

                            <h1>{item.title}</h1>

                            <p className="booking-location">
                                📍 {item.location}
                            </p>

                            <div className="booking-item-price">
                                ₹{item.pricePerDay}
                                <span> / day</span>
                            </div>

                        </div>
                    </div>

                    {/* RIGHT SIDE */}

                    <div className="booking-form-card">

                        <h2>Book This Item</h2>

                        <p className="booking-subtitle">
                            Select your rental dates
                        </p>

                        <form onSubmit={handleBooking}>

                            <div className="date-fields">

                                <div className="date-field">
                                    <label>Start Date</label>

                                    <input
                                        type="date"
                                        value={startDate}
                                        min={getTodayDate()}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setStartDate(value);

                                            if (endDate) {
                                                checkAvailability(value, endDate);
                                            }
                                        }}
                                        required
                                    />
                                </div>

                                <div className="date-field">
                                    <label>End Date</label>

                                    <input
                                        type="date"
                                        value={endDate}
                                        min={startDate || getTodayDate()}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setEndDate(value);

                                            if (startDate) {
                                                checkAvailability(startDate, value);
                                            }
                                        }}
                                        required
                                    />
                                </div>
                                {checkingAvailability && (
                                    <div className="availability-message availability-checking">
                                        Checking availability...
                                    </div>
                                )}

                                {!checkingAvailability && availability && (
                                    <div
                                        className={`availability-message ${availability.available
                                            ? "availability-success"
                                            : "availability-error"
                                            }`}
                                    >
                                        {availability.available ? "✓ " : "⚠ "}
                                        {availability.message}
                                    </div>
                                )}

                            </div>

                            {/* PRICE SUMMARY */}

                            <div className="booking-summary">

                                <h3>Price Summary</h3>

                                <div className="summary-row">
                                    <span>
                                        ₹{item.pricePerDay} ×{" "}
                                        {totalDays || 0} days
                                    </span>

                                    <strong>
                                        ₹{item.pricePerDay.toLocaleString("en-IN")}
                                    </strong>
                                </div>

                                <div className="summary-divider"></div>

                                <div className="summary-total">
                                    <span>Total</span>

                                    <strong>
                                        ₹{item.pricePerDay.toLocaleString("en-IN")}
                                    </strong>
                                </div>

                            </div>

                            <button
                                type="submit"
                                className="confirm-booking-btn"
                                disabled={
                                    bookingLoading ||
                                    !startDate ||
                                    !endDate ||
                                    totalDays <= 0 ||
                                    !availability ||
                                    !availability.available ||
                                    checkingAvailability ||
                                    !item.available
                                }
                            >
                                {bookingLoading
                                    ? "Creating Booking..."
                                    : !item.available
                                        ? "Currently Unavailable"
                                        : checkingAvailability
                                            ? "Checking Availability..."
                                            : !startDate || !endDate
                                                ? "Select Rental Dates"
                                                : totalDays <= 0
                                                    ? "Select Valid Dates"
                                                    : !availability
                                                        ? "Check Availability"
                                                        : !availability.available
                                                            ? "Dates Not Available"
                                                            : "Confirm Booking"}
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Booking;