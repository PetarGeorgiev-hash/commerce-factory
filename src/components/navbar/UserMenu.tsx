import { authConfig } from "@/server/auth/config";
import { getServerSession } from "next-auth";

export const UserMenu = async () => {
  const session = await getServerSession(authConfig);

  if (!session) return <div>Please log in</div>;

  return (
    <div>
      <p>Welcome, {session.user.name}</p>
      <form action="/api/auth/signout" method="post">
        <button type="submit">Sign Out</button>
      </form>
    </div>
  );
};