import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function Rentals() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [category, setCategory] = useState("");
  const [location, setLocation] = useState(
    searchParams.get("location") || ""
  );

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/rentals"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        setItems(data);
      } catch (error) {
        console.error("Rental fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  // Get unique categories
  const categories = [
    ...new Set(
      items
        .map((item) => item.category)
        .filter(Boolean)
    ),
  ];

  // Get unique locations
  const locations = [
    ...new Set(
      items
        .map((item) => item.location)
        .filter(Boolean)
    ),
  ];

  // Filter rentals
  const filteredItems = items.filter((item) => {
    const searchText = search.toLowerCase().trim();
    const locationText = location.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      item.title?.toLowerCase().includes(searchText) ||
      item.description?.toLowerCase().includes(searchText) ||
      item.category?.toLowerCase().includes(searchText) ||
      item.location?.toLowerCase().includes(searchText);

    const matchesCategory =
      !category || item.category === category;

    const matchesLocation =
      !locationText ||
      item.location?.toLowerCase().includes(locationText);

    const matchesMinPrice =
      minPrice === "" ||
      Number(item.pricePerDay) >= Number(minPrice);

    const matchesMaxPrice =
      maxPrice === "" ||
      Number(item.pricePerDay) <= Number(maxPrice);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesLocation &&
      matchesMinPrice &&
      matchesMaxPrice
    );
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "price-low") {
      return Number(a.pricePerDay) - Number(b.pricePerDay);
    }

    if (sortBy === "price-high") {
      return Number(b.pricePerDay) - Number(a.pricePerDay);
    }

    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    return 0;
  });

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("");
  };

  return (
    <div className="rentals-page">
      <div className="rentals-header">
        <h1>Browse Rentals</h1>
        <p>
          Find useful products available for rent near you.
        </p>
      </div>

      {/* Filters */}
      <div className="rental-filters">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search rentals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-row">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>

            {categories.map((itemCategory) => (
              <option
                key={itemCategory}
                value={itemCategory}
              >
                {itemCategory}
              </option>
            ))}
          </select>

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">All Locations</option>

            {locations.map((itemLocation) => (
              <option
                key={itemLocation}
                value={itemLocation}
              >
                {itemLocation}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min="0"
          />

          <input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min="0"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>

          <button
            type="button"
            className="clear-filters-btn"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {loading ? (
        <p className="rentals-message">
          Loading rentals...
        </p>
      ) : filteredItems.length === 0 ? (
        <p className="rentals-message">
          {items.length === 0
            ? "Abhi koi rental item available nahi hai."
            : "No rentals match your filters."}
        </p>
      ) : (
        <div className="rental-grid">
          {sortedItems.map((item) => (
            <div
              className="rental-card"
              key={item._id}
            >
              <div className="rental-image">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                  />
                ) : (
                  <span>No Image</span>
                )}
              </div>

              <div className="rental-content">
                <span className="rental-category">
                  {item.category}
                </span>
                <span
                  className={`availability-badge ${item.available ? "available" : "unavailable"
                    }`}
                >
                  {item.available ? "Available" : "Unavailable"}
                </span>

                <h2>{item.title}</h2>

                <p className="rental-location">
                  📍 {item.location}
                </p>

                <p className="rental-description">
                  {item.description?.length > 100
                    ? item.description.slice(0, 100) + "..."
                    : item.description}
                </p>

                <div className="rental-bottom">
                  <strong>
                    ₹{item.pricePerDay}
                    <span> / day</span>
                  </strong>

                  <Link
                    to={`/rentals/${item._id}`}
                    className="view-rental-btn"
                  >
                    View Details <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Rentals;