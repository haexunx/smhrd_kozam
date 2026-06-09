import { Header } from "@/shared/ui/header";
import { Outlet } from "react-router-dom";

const AppMainLayout = () => {
  return (
    <div className="app-main-layout">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AppMainLayout;
