import { Link } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";

export default function NotFound() {
  return (
    <div>
      <PageHeader title="Page not found" description="That route doesn't exist in Context Rot Lab." />
      <Link to="/">Back to Overview</Link>
    </div>
  );
}
