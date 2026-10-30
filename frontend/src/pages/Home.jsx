import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const homeRef = useRef(null);

  useEffect(() => {
    const sections = homeRef.current?.querySelectorAll(
      ".categories, .rentals, .how-it-works, .earn-section, .testimonials, .final-cta"
    );

    if (!sections?.length) return;

    // Reduced motion preference ko respect karega
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
      }
    );

    sections.forEach((section) => {
      section.classList.add("rentzo-reveal");
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
      sections.forEach((section) => {
        section.classList.remove("rentzo-reveal", "is-visible");
      });
    };
  }, []);
  const [popularRentals, setPopularRentals] = useState([]);
  const [rentalsLoading, setRentalsLoading] = useState(true);


  useEffect(() => {
    const fetchPopularRentals = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/rentals"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Rentals fetch nahi ho paayi");
        }

        const availableRentals = data.filter(
          (item) => item.available !== false
        );

        setPopularRentals(availableRentals.slice(0, 3));
      } catch (error) {
        console.error("HOME RENTALS ERROR:", error);
      } finally {
        setRentalsLoading(false);
      }
    };

    fetchPopularRentals();
  }, []);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (location.trim()) {
      params.set("location", location.trim());
    }

    navigate(`/rentals?${params.toString()}`);
  };

  return (
    <div ref={homeRef} className="rentzo-home">
      <main className="hero">
        <div className="hero-content">
          <p className="hero-badge">INDIA'S RENTAL MARKETPLACE</p>

          <h1>
            Rent What You Need.
            <br />
            Earn From What You Own.
          </h1>

          <p className="hero-description">
            Discover amazing products available for rent near you.
            Save money, earn more, and rent smarter.
          </p>

          <div className="search-box">

            <div className="search-item">
              <span>🔍</span>

              <div>
                <small>What are you looking for?</small>

                <input
                  type="text"
                  placeholder="Search cameras, laptops, etc..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="search-item location">
              <span>📍</span>

              <div>
                <small>Location</small>

                <input
                  type="text"
                  placeholder="Choose your city"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <button
              className="search-btn"
              onClick={handleSearch}
            >
              Search
            </button>

          </div>

          <div className="hero-buttons">
            <button
              className="browse-btn"
              onClick={() => navigate("/rentals")}
            >
              Browse Rentals
            </button>

            <button
              className="list-btn"
              onClick={() => navigate("/list-item")}
            >
              + List Your Item
            </button>
          </div>
        </div>
      </main>
      <section className="categories">
        <div className="section-heading">
          <p>EXPLORE</p>
          <h2>Popular Categories</h2>
          <span>Find everything you need to rent.</span>
        </div>

        <div className="category-grid">
          <div
            className="category-card"
            onClick={() => navigate("/rentals?search=camera")}
          >
            <div className="category-icon">📷</div>
            <h3>Cameras</h3>
            <p>120+ items</p>
          </div>

          <div
            className="category-card"
            onClick={() => navigate("/rentals?search=electronics")}
          >
            <div className="category-icon">💻</div>
            <h3>Electronics</h3>
            <p>250+ items</p>
          </div>

          <div
            className="category-card"
            onClick={() => navigate("/rentals?search=gaming")}
          >
            <div className="category-icon">🎮</div>
            <h3>Gaming</h3>
            <p>90+ items</p>
          </div>

          <div
            className="category-card"
            onClick={() => navigate("/rentals?search=tools")}
          >
            <div className="category-icon">🔧</div>
            <h3>Tools</h3>
            <p>180+ items</p>
          </div>

          <div
            className="category-card"
            onClick={() => navigate("/rentals?search=music")}
          >
            <div className="category-icon">🎸</div>
            <h3>Music</h3>
            <p>70+ items</p>
          </div>

          <div
            className="category-card"
            onClick={() => navigate("/rentals?search=party")}
          >
            <div className="category-icon">🎉</div>
            <h3>Party</h3>
            <p>110+ items</p>
          </div>
        </div>
      </section>
      {/* Popular Rentals Section */}
      <section className="rentals">
        <div className="section-top">
          <div>
            <p>DISCOVER</p>
            <h2>Popular Rentals</h2>
            <span>Top-rated items available near you.</span>
          </div>

          <button
            className="view-all-btn"
            onClick={() => navigate("/rentals")}
          >
            View All →
          </button>
        </div>

        <div className="rental-grid">

          {rentalsLoading ? (
            <p>Loading rentals...</p>
          ) : popularRentals.length === 0 ? (
            <p>No rentals available.</p>
          ) : (
            popularRentals.map((item) => (
              <div
                className="rental-card"
                key={item._id}
              >

                <div className="product-image">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                    />
                  ) : (
                    <span>📦</span>
                  )}
                </div>

                <div className="rental-info">

                  <span className="category-label">
                    {item.category}
                  </span>

                  <h3>{item.title}</h3>

                  <p className="location-text">
                    📍 {item.location}
                  </p>

                  <div className="price-row">

                    <div>
                      <strong>
                        ₹{item.pricePerDay}
                      </strong>

                      <span>/day</span>
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/rentals/${item._id}`)
                      }
                    >
                      View Details
                    </button>

                  </div>

                </div>

              </div>
            ))
          )}

        </div>
      </section>
      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-heading">
          <p>HOW IT WORKS</p>
          <h2>Rent in 3 Simple Steps</h2>
          <span>Getting what you need has never been easier.</span>
        </div>

        <div className="steps-container">

          <div className="step-card" onClick={() => navigate("/rentals")}>
            <div className="step-number">01</div>
            <div className="step-icon">🔍</div>
            <h3>Search</h3>
            <p>
              Find the perfect item you need from people
              near you.
            </p>
          </div>

          <div className="step-card" onClick={() => navigate("/rentals")}>
            <div className="step-number">02</div>
            <div className="step-icon">📅</div>
            <h3>Book</h3>
            <p>
              Select your rental dates and send a booking
              request.
            </p>
          </div>

          <div className="step-card" onClick={() => navigate("/my-bookings")}>
            <div className="step-number">03</div>
            <div className="step-icon">🎉</div>
            <h3>Enjoy</h3>
            <p>
              Pick up the item, enjoy using it, and return
              it on time.
            </p>
          </div>

        </div>
      </section>
      {/* Earn Section */}
      <section className="earn-section">
        <div className="earn-content">

          <div className="earn-text">
            <p className="earn-label">FOR ITEM OWNERS</p>

            <h2>
              Turn Your Unused Items
              <br />
              Into Extra Income
            </h2>

            <p className="earn-description">
              Have a camera, laptop, gaming console, tools, or
              anything else sitting unused? List it on Rentzo
              and start earning from it.
            </p>

            <div className="earn-benefits">
              <div>
                <span>✓</span>
                <p>Easy listing process</p>
              </div>

              <div>
                <span>✓</span>
                <p>Set your own rental price</p>
              </div>

              <div>
                <span>✓</span>
                <p>Connect with renters near you</p>
              </div>
            </div>

            <button
              className="earn-btn"
              onClick={() => navigate("/list-item")}
            >
              + List Your Item
            </button>
          </div>

          <div className="earn-card">
            <div className="earn-icon">💰</div>

            <h3>Start Earning Today</h3>

            <p>
              Your unused items can become an
              extra source of income.
            </p>

            <div className="earn-example">
              <span>Example earning</span>
              <strong>₹15,000+</strong>
              <small>per month</small>
            </div>
          </div>

        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="section-heading">
          <p>WHAT PEOPLE SAY</p>
          <h2>Loved by Renters & Owners</h2>
          <span>See what our community has to say.</span>
        </div>

        <div className="testimonial-grid">

          <div className="testimonial-card">
            <div className="stars">★★★★★</div>

            <p>
              "I needed a camera for a weekend trip and found
              exactly what I wanted nearby. The whole process
              was simple and affordable."
            </p>

            <div className="user-info">
              <div className="user-avatar">A</div>
              <div>
                <h4>Arjun Mehta</h4>
                <span>Renter</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="stars">★★★★★</div>

            <p>
              "I had a gaming console sitting unused. Listing
              it on Rentzo helped me earn some extra money
              without much effort."
            </p>

            <div className="user-info">
              <div className="user-avatar">P</div>
              <div>
                <h4>Priya Shah</h4>
                <span>Item Owner</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="stars">★★★★★</div>

            <p>
              "Renting instead of buying expensive equipment
              makes so much sense for occasional use. I love
              the idea behind Rentzo."
            </p>

            <div className="user-info">
              <div className="user-avatar">R</div>
              <div>
                <h4>Rahul Patel</h4>
                <span>Renter</span>
              </div>
            </div>
          </div>

        </div>
      </section>
      {/* Final CTA */}
      <section className="final-cta">
        <div className="cta-content">
          <h2>Ready to Rent Smarter?</h2>

          <p>
            Find what you need or start earning from
            the things you already own.
          </p>

          <div className="cta-buttons">
            <button onClick={() => navigate("/rentals")}>
              Browse Rentals
            </button>

            <button onClick={() => navigate("/list-item")}>
              + List Your Item
            </button>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">

          <div className="footer-brand">
            <h2>rentzo</h2>
            <p>Rent Smart. Earn More.</p>
            <span>
              India's community-powered rental marketplace.
            </span>
          </div>

          <div className="footer-column">
            <h3>Explore</h3>
            <a href="/rentals">Browse Rentals</a>
            <a href="#">Categories</a>
            <a href="#">How It Works</a>
          </div>

          <div className="footer-column">
            <h3>For Owners</h3>
            <a href="/list-item">List Your Item</a>
            <a href="/owner-dashboard">Owner Dashboard</a>
            <a href="#">Earnings</a>
          </div>

          <div className="footer-column">
            <h3>Support</h3>
            <a href="#">Help Center</a>
            <a href="#">Safety</a>
            <a href="#">Contact Us</a>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© 2026 Rentzo. All rights reserved.</p>

          <div>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;