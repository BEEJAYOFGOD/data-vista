import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";

const Sidebar = () => {
    const { user, handleLogout } = useAuth();

    return (
        <aside>
            helllo, <p>{user?.email}</p>
            <Button onClick={handleLogout}>Log Out</Button>
        </aside>
    );
};

export default Sidebar;
