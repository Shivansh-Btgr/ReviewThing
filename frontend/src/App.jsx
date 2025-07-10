

import ReviewForm from "./components/review/ReviewForm";
import ReviewsPage from "./components/review/ReviewsPage";



const App = () => {
  const page = window.location.pathname === "/add-review" ? "add-review" : "reviews";
  return page === "add-review" ? <ReviewForm /> : <ReviewsPage />;
};

export default App;
