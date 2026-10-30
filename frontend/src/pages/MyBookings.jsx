import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function MyBookings() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const getStatusLabel = (status) => {
    if (status === "pending") return "Pending";
    if (status === "confirmed") return "Confirmed";
    if (status === "cancelled") return "Cancelled";
    if (status === "completed") return "Completed";

    return status;
  };

  const getStatusClass = (status) => {
    if (status === "pending") return "pending";
    if (status === "confirmed") return "confirmed";
    if (status === "cancelled") return "cancelled";
    if (status === "completed") return "completed";

    return "pending";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  const handleCancelBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            status: "cancelled",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
          "Booking cancel nahi ho paayi"
        );
        return;
      }

      alert("Booking cancelled successfully ✅");

      window.location.reload();
    } catch (error) {
      console.error(error);

      alert(
        "Server se connect nahi ho pa raha."
      );
    }
  };

  const handleContactOwner = async (bookingId) => {
    // Browser popup blocker se bachne ke liye
    // click hote hi ek blank tab open karo
    const whatsappTab = window.open("", "_blank");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        whatsappTab?.close();
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/owner-contact`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        whatsappTab?.close();
        alert(data.message || "Owner contact nahi mil paaya");
        return;
      }

      // India country code +91
      const digits = String(data.whatsappNumber || "").replace(/\D/g, "");
      const phone = digits.length === 10 ? `91${digits}` : digits;

      if (!/^[1-9]\d{7,14}$/.test(phone)) {
        whatsappTab?.close();
        alert("Owner ka WhatsApp number valid nahi hai.");
        return;
      }

      const message = `Hi ${data.ownerName}, I booked your rental item on Rentzo. My booking ID is ${bookingId}. I would like to discuss the rental details.`;

      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

      if (whatsappTab) {
        whatsappTab.location.href = whatsappUrl;
      } else {
        window.location.href = whatsappUrl;
      }
    } catch (error) {
      whatsappTab?.close();
      console.error("CONTACT OWNER ERROR:", error);
      alert("Server se connect nahi ho pa raha.");
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Token nahi mila");
          navigate("/login");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/bookings/user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("MY BOOKINGS STATUS:", response.status);
        console.log("MY BOOKINGS DATA:", data);

        if (!response.ok) {
          throw new Error(
            data.message || "Bookings fetch nahi ho paayi"
          );
        }

        setBookings(data);
      } catch (error) {
        console.error("FETCH BOOKINGS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.id]);

  if (!user) {
    return (
      <div className="my-bookings-message">
        <h2>Please login first</h2>

        <Link to="/login">
          Login to view your bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="my-bookings-page">
      <div className="my-bookings-container">

        <div className="my-bookings-header">
          <div>
            <h1>My Bookings</h1>
            <p>
              View and manage your rental bookings.
            </p>
          </div>

          <Link
            to="/rentals"
            className="browse-more-btn"
          >
            Browse Rentals
          </Link>
        </div>

        {loading ? (
          <div className="my-bookings-empty">
            <p>Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="my-bookings-empty">
            <div className="empty-booking-icon">
              📦
            </div>

            <h2>No bookings yet</h2>

            <p>
              You haven't booked any rental items yet.
            </p>

            <Link
              to="/rentals"
              className="browse-rentals-btn"
            >
              Browse Rentals
            </Link>
          </div>
        ) : (
          <div className="booking-list">

            {bookings.map((booking) => (
              <div
                className="booking-card"
                key={booking._id}
              >

                <div className="booking-card-image">
                  {booking.rentalItem?.image ? (
                    <img
                      src={booking.rentalItem.image}
                      alt={booking.rentalItem.title}
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </div>

                <div className="booking-card-content">

                  <div className="booking-card-top">

                    <div>
                      <span className="booking-card-category">
                        {booking.rentalItem?.category}
                      </span>

                      <h2>
                        {booking.rentalItem?.title}
                      </h2>

                      <p className="booking-card-location">
                        📍 {booking.rentalItem?.location}
                      </p>
                    </div>

                    <span
                      className={`booking-status ${getStatusClass(booking.status)}`}
                    >
                      {getStatusLabel(booking.status)}
                    </span>

                  </div>

                  <div className="booking-card-details">

                    <div>
                      <span>Start Date</span>
                      <strong>
                        {formatDate(booking.startDate)}
                      </strong>
                    </div>

                    <div>
                      <span>End Date</span>
                      <strong>
                        {formatDate(booking.endDate)}
                      </strong>
                    </div>

                    <div>
                      <span>Total Days</span>
                      <strong>
                        {booking.totalDays} days
                      </strong>
                    </div>

                    <div>
                      <span>Total Amount</span>
                      <strong className="booking-amount">
                        ₹{formatAmount(booking.totalAmount)}
                      </strong>
                    </div>

                  </div>

                  <div className="booking-card-actions">

                    {booking.rentalItem?._id && (
                      <Link
                        to={`/rentals/${booking.rentalItem._id}`}
                        className="view-booking-item"
                      >
                        View Item →
                      </Link>
                    )}

                    {booking.status === "confirmed" && (
                      <button
                        type="button"
                        className="contact-owner-btn"
                        onClick={() => handleContactOwner(booking._id)}
                      >
                        Contact Owner on WhatsApp ↗
                      </button>
                    )}

                    {(booking.status === "pending" ||
                      booking.status === "confirmed") && (
                        <button
                          type="button"
                          className="cancel-booking-btn"
                          onClick={() =>
                            handleCancelBooking(booking._id)
                          }
                        >
                          Cancel Booking
                        </button>
                      )}

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;