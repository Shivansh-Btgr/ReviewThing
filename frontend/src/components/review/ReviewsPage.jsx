import { useEffect, useState } from "react";

const fetchReviews = async () => {
  const res = await fetch("http://127.0.0.1:5000/api/reviews");
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
};

const StarRating = ({ rating }) => (
  <span style={{ color: "#FFD600", fontSize: 20, letterSpacing: 1 }}>
    {Array.from({ length: 5 }, (_, i) =>
      i < rating ? "★" : <span key={i} style={{ color: "#C7C7C7" }}>★</span>
    )}
  </span>
);

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [starFilter, setStarFilter] = useState(0);
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" or "desc"

  useEffect(() => {
    fetchReviews()
      .then(setReviews)
      .catch(() => setError("Could not load reviews."))
      .finally(() => setLoading(false));
  }, []);

  let filteredReviews = starFilter > 0 ? reviews.filter(r => r.rating === starFilter) : reviews;
  filteredReviews = [...filteredReviews].sort((a, b) =>
    sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating
  );

  // Pagination logic
  const REVIEWS_PER_PAGE = 3;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE) || 1;
  const paginatedReviews = filteredReviews.slice((page - 1) * REVIEWS_PER_PAGE, page * REVIEWS_PER_PAGE);

  return (
    <div className="login-container" style={{ maxWidth: 600, margin: "2rem auto" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 className="form-title" style={{ marginBottom: 0 }}>All School Reviews</h2>
        <button
          className="login-button"
          style={{ width: 'auto', height: 40, padding: '0 1.2rem', fontSize: 16, margin: 0 }}
          onClick={() => window.location.pathname = "/add-review"}
        >
          Add New Review
        </button>
      </div>
      <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 500 }}>Filter by stars:</span>
        {[0,1,2,3,4,5].map(star => (
          <button
            key={star}
            style={{
              background: starFilter === star ? '#FFD600' : '#f7f7fa',
              color: star === 0 ? '#232526' : (starFilter === star ? '#232526' : '#FFD600'),
              border: '1px solid #bfb3f2',
              borderRadius: 6,
              fontSize: 18,
              padding: '2px 10px',
              cursor: 'pointer',
              fontWeight: 600,
              outline: 'none',
              minWidth: 36,
              transition: 'background 0.2s',
            }}
            onClick={() => setStarFilter(star)}
          >
            {star === 0 ? 'All' : Array.from({ length: star }, () => '★').join('')}
          </button>
        ))}
        <button
          className="login-button"
          style={{ marginLeft: 16, width: 'auto', height: 36, padding: '0 1.1rem', fontSize: 15, background: '#5F41E4', color: '#fff', border: 'none' }}
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          Sort: {sortOrder === "asc" ? "Lowest First" : "Highest First"}
        </button>
      </div>
      {loading && <div>Loading reviews...</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && filteredReviews.length === 0 && (
        <div className="empty-msg">No reviews yet.</div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {paginatedReviews.map((review) => (
          <div
            key={review.id}
            style={{
              background: "#fff",
              borderRadius: 8,
              boxShadow: "0 2px 8px 0 rgba(0,0,0,0.07)",
              padding: "1.5rem 1.2rem",
              borderLeft: `6px solid #FFD600`,
              position: "relative",
            }}
          >
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: "1.2rem" }}>{review.school_name}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "0.3rem 0 0.7rem 0" }}>
              <StarRating rating={review.rating} />
            </div>
            <div style={{ fontSize: "1.08rem", color: "#232526", marginBottom: 8, whiteSpace: "pre-line" }}>
              {review.comment.length > 300 ? (
                <span>{review.comment.slice(0, 300)}... <span style={{ color: '#5F41E4', cursor: 'pointer' }}>Read more</span></span>
              ) : (
                review.comment
              )}
            </div>
            <div style={{ fontSize: "0.98rem", color: "#888", fontStyle: "italic" }}>
              Reviewed by {review.reviewer_name}
            </div>
          </div>
        ))}
      </div>
      {/* Pagination Controls */}
      {!loading && !error && filteredReviews.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 24 }}>
          <button
            className="login-button"
            style={{ width: 36, height: 36, padding: 0, fontSize: 18, borderRadius: 6, background: page === 1 ? '#e0e0e0' : '#5F41E4', color: '#fff', border: 'none', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            &#8592;
          </button>
          <span style={{ fontWeight: 500, fontSize: 16 }}>
            Page {page} of {totalPages}
          </span>
          <button
            className="login-button"
            style={{ width: 36, height: 36, padding: 0, fontSize: 18, borderRadius: 6, background: page === totalPages ? '#e0e0e0' : '#5F41E4', color: '#fff', border: 'none', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            &#8594;
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
