import { Link } from "react-router-dom";
import "./NotFoundPage.css";
export function NotFoundPage() {
  return (
    <div className="not-found-body">
      <div>
        {" "}
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </div>

      <div className="not-found-body-redirect">
        {" "}
        <Link to="/">Redirect to Home</Link>
      </div>
    </div>
  );
}
