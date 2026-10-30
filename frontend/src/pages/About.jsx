import { Link } from "react-router-dom";

function About() {
  return (
    <div className="about-page">

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-badge">ABOUT RENTZO</span>

          <h1>
            Rent Smart.
            <br />
            Earn More.
          </h1>

          <p>
            Rentzo is a community-powered rental marketplace where
            people can rent the things they need and earn from the
            things they already own.
          </p>

          <div className="about-hero-buttons">
            <Link to="/rentals" className="about-primary-btn">
              Browse Rentals
            </Link>

            <Link to="/how-it-works" className="about-secondary-btn">
              How It Works
            </Link>
          </div>
        </div>
      </section>


      {/* About Intro */}
      <section className="about-intro">
        <div className="about-intro-grid">

          <div className="about-intro-text">
            <span className="about-section-label">
              OUR MISSION
            </span>

            <h2>
              Making renting simple,
              <br />
              affordable and accessible.
            </h2>

            <p>
              We believe you shouldn't have to buy something just
              because you need it for a short period of time.
            </p>

            <p>
              Rentzo connects people who need products with people
              who have products sitting unused. From cameras and
              laptops to gaming consoles, tools and more, our goal
              is to make access easier while helping owners earn
              extra income.
            </p>
          </div>

          <div className="about-intro-card">
            <div className="about-card-icon">🤝</div>

            <h3>Community Powered</h3>

            <p>
              Rent from people around you and help your unused
              items generate value.
            </p>
          </div>

        </div>
      </section>


      {/* Values */}
      <section className="about-values">
        <div className="about-section-heading">
          <span>WHAT WE BELIEVE</span>

          <h2>Built Around People</h2>

          <p>
            Rentzo is designed to make the rental experience
            easier for both renters and item owners.
          </p>
        </div>

        <div className="about-values-grid">

          <div className="about-value-card">
            <div className="about-value-icon">💰</div>

            <h3>Save Money</h3>

            <p>
              Rent the things you need instead of spending more
              money buying them for occasional use.
            </p>
          </div>

          <div className="about-value-card">
            <div className="about-value-icon">📦</div>

            <h3>Use What You Need</h3>

            <p>
              Get access to useful products without the commitment
              of owning everything yourself.
            </p>
          </div>

          <div className="about-value-card">
            <div className="about-value-icon">🚀</div>

            <h3>Earn From Your Items</h3>

            <p>
              Turn unused cameras, electronics, tools and other
              products into an additional source of income.
            </p>
          </div>

          <div className="about-value-card">
            <div className="about-value-icon">🌱</div>

            <h3>Reduce Waste</h3>

            <p>
              Give products more use and reduce unnecessary
              purchases by sharing resources within the community.
            </p>
          </div>

        </div>
      </section>


      {/* How Rentzo Works Preview */}
      <section className="about-process">

        <div className="about-section-heading">
          <span>THE RENTZO WAY</span>

          <h2>Simple From Start to Finish</h2>

          <p>
            Finding and renting an item should never feel complicated.
          </p>
        </div>

        <div className="about-process-grid">

          <div className="about-process-card">
            <span>01</span>
            <div>🔍</div>
            <h3>Discover</h3>
            <p>
              Find products available for rent near you.
            </p>
          </div>

          <div className="about-process-card">
            <span>02</span>
            <div>📅</div>
            <h3>Book</h3>
            <p>
              Select your dates and send a booking request.
            </p>
          </div>

          <div className="about-process-card">
            <span>03</span>
            <div>🎉</div>
            <h3>Enjoy</h3>
            <p>
              Use the item and return it on time.
            </p>
          </div>

        </div>

        <div className="about-process-button">
          <Link to="/how-it-works">
            Learn How It Works →
          </Link>
        </div>

      </section>


      {/* CTA */}
      <section className="about-cta">
        <div>
          <span>READY TO GET STARTED?</span>

          <h2>
            Rent something useful.
            <br />
            Or start earning from what you own.
          </h2>

          <div className="about-cta-buttons">
            <Link to="/rentals">
              Browse Rentals
            </Link>

            <Link to="/owner-dashboard">
              + List Your Item
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default About;