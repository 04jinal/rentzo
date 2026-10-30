
import { Link } from "react-router-dom";

function HowItWorks() {
  return (
    <div className="how-page">

      {/* Hero */}
      <section className="how-hero">
        <div className="how-hero-content">
          <span className="how-badge">HOW RENTZO WORKS</span>

          <h1>
            Renting Made
            <br />
            Simple.
          </h1>

          <p>
            Rent what you need, when you need it. Or list the things
            you own and start earning from them.
          </p>

          <div className="how-hero-buttons">
            <Link to="/rentals" className="how-primary-btn">
              Browse Rentals
            </Link>

            <Link to="/owner-dashboard" className="how-secondary-btn">
              List Your Item
            </Link>
          </div>
        </div>
      </section>

      {/* Renter Section */}
      <section className="how-renter">
        <div className="how-section-heading">
          <span>FOR RENTERS</span>
          <h2>Find. Book. Enjoy.</h2>
          <p>
            Everything you need to rent an item is just a few simple steps away.
          </p>
        </div>

        <div className="how-steps">

          <div className="how-step-card">
            <div className="how-step-number">01</div>
            <div className="how-step-icon">🔍</div>

            <h3>Find an Item</h3>

            <p>
              Browse through cameras, electronics, gaming consoles,
              tools and other items available for rent.
            </p>
          </div>

          <div className="how-step-card">
            <div className="how-step-number">02</div>
            <div className="how-step-icon">📅</div>

            <h3>Choose Your Dates</h3>

            <p>
              Select the dates you need the item and check its
              availability before booking.
            </p>
          </div>

          <div className="how-step-card">
            <div className="how-step-number">03</div>
            <div className="how-step-icon">✅</div>

            <h3>Book the Item</h3>

            <p>
              Send your booking request and wait for the owner
              to confirm your rental.
            </p>
          </div>

          <div className="how-step-card">
            <div className="how-step-number">04</div>
            <div className="how-step-icon">🎉</div>

            <h3>Enjoy Your Rental</h3>

            <p>
              Pick up or receive the item, use it during your
              rental period and return it on time.
            </p>
          </div>

        </div>
      </section>

      {/* Owner Section */}
      <section className="how-owner">

        <div className="how-owner-content">
          <span>FOR ITEM OWNERS</span>

          <h2>
            Turn Your Unused
            <br />
            Items Into Income.
          </h2>

          <p>
            Have a camera, laptop, gaming console, tool or other
            useful item sitting unused? List it on Rentzo and
            let someone else put it to good use.
          </p>

          <Link to="/owner-dashboard" className="how-owner-btn">
            Start Listing →
          </Link>
        </div>

        <div className="how-owner-card">

          <div className="owner-card-top">
            <span>Your Rental Item</span>
            <span className="owner-active">● Active</span>
          </div>

          <h3>Canon EOS Camera</h3>

          <div className="owner-price">
            ₹800 <span>/ day</span>
          </div>

          <div className="owner-stats">
            <div>
              <strong>12</strong>
              <span>Bookings</span>
            </div>

            <div>
              <strong>4.9</strong>
              <span>Rating</span>
            </div>

            <div>
              <strong>₹9.6K</strong>
              <span>Earned</span>
            </div>
          </div>

        </div>

      </section>

      {/* Simple Process */}
      <section className="how-process">

        <div className="how-section-heading">
          <span>THE RENTZO EXPERIENCE</span>

          <h2>Simple From Start to Finish</h2>

          <p>
            We keep the rental process straightforward so you can
            focus on getting things done.
          </p>
        </div>

        <div className="how-process-grid">

          <div className="how-process-item">
            <div>🔎</div>
            <h3>Discover</h3>
            <p>
              Search for useful items available around you.
            </p>
          </div>

          <div className="how-process-line"></div>

          <div className="how-process-item">
            <div>📋</div>
            <h3>Request</h3>
            <p>
              Select your dates and submit a booking request.
            </p>
          </div>

          <div className="how-process-line"></div>

          <div className="how-process-item">
            <div>🤝</div>
            <h3>Connect</h3>
            <p>
              Coordinate with the owner and get your item.
            </p>
          </div>

          <div className="how-process-line"></div>

          <div className="how-process-item">
            <div>🎯</div>
            <h3>Return</h3>
            <p>
              Enjoy the item and return it after your rental period.
            </p>
          </div>

        </div>

      </section>

      {/* FAQ */}
      <section className="how-faq">

        <div className="how-section-heading">
          <span>COMMON QUESTIONS</span>
          <h2>Things You Should Know</h2>
        </div>

        <div className="how-faq-grid">

          <div className="how-faq-card">
            <h3>How do I rent an item?</h3>
            <p>
              Browse available rentals, open the item you want,
              select your dates and submit a booking request.
            </p>
          </div>

          <div className="how-faq-card">
            <h3>Can I list my own items?</h3>
            <p>
              Yes. Owners can add their items, set rental prices
              and manage their listings from the owner dashboard.
            </p>
          </div>

          <div className="how-faq-card">
            <h3>Can I cancel a booking?</h3>
            <p>
              You can cancel a booking according to its current
              booking status and the rules of the rental.
            </p>
          </div>

          <div className="how-faq-card">
            <h3>How do owners manage bookings?</h3>
            <p>
              Owners can view incoming booking requests and manage
              their rental items from the owner dashboard.
            </p>
          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="how-cta">
        <span>READY TO GET STARTED?</span>

        <h2>
          Your next rental
          <br />
          is just a few clicks away.
        </h2>

        <div className="how-cta-buttons">
          <Link to="/rentals">Browse Rentals</Link>

          <Link to="/about">Learn About Rentzo</Link>
        </div>
      </section>

    </div>
  );
}

export default HowItWorks;
