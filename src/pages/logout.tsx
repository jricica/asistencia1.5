import { fine } from "@/lib/fine";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function Logout() {
  if (!fine) return <Navigate to='/' />;

  // Define isPending and data, for example as state or from a hook
  // Here is a placeholder using useState; replace with your actual logic
  const [isPending, setIsPending] = React.useState(false);
  const [data, setData] = React.useState(null);

  useEffect(() => {
    if (!isPending && data) fine.auth.signOut();
  }, [isPending, data]);

  return !isPending && !data ? <Navigate to='/login' /> : null;
}
