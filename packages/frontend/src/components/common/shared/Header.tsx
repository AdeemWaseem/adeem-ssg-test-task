import { useAuthContext } from "@/context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Header = () => {
  const { isLogin, setLoginStatus } = useAuthContext();

  const handleLogout = async () => {
    try {
      // Call the logout API
      const response = await fetch("http://localhost:4000/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: 1, // Replace with the actual user ID as needed
        }),
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setLoginStatus(false); // Update login status to logged out
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="flex items-center justify-between bg-green-500 p-4 text-white">
      <h1 className="text-xl font-bold ml-5"><FontAwesomeIcon icon="bars-progress" /> SSG Task Management</h1>
      {isLogin && (
        <div className="flex items-center space-x-4">
          <button onClick={handleLogout} className="text-sm bg-red-500 px-2 py-1 rounded">
            <FontAwesomeIcon icon="sign-out-alt" />
          </button>
        </div>
      )}
    </header>
  );
};
