import { useEffect, useState } from "react";
import Navbar from "../navbar/navbar";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../footer/footer";
import SideMenu, { getMenuItems } from "../menu/menu";

interface LayoutProps {
  menuItems: any[];
}

function Layout({ menuItems }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    setProgress(40);
    setShowSidebar(true);
    setTimeout(() => setProgress(100), 300);
  }, [location.pathname]);

  const items = getMenuItems(menuItems);

  return (
    <>
      <Navbar
        onClickHamburger={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        progress={progress}
        setProgress={setProgress}
      />
      <div className="mt-16 w-full min-h-[100vh] flex justify-center">
        <main className="w-full max-w-[85rem] flex flex-col md:flex-row relative border">
          {showSidebar ? (
            <>
              <section
                className={`z-10 h-full w-full md:w-[10rem] lg:w-[15rem] absolute left-0 ${
                  isSidebarOpen ? "translate-x-0 w-[80%]" : "-translate-x-full"
                } md:translate-x-0 transition-transform duration-300 ease-in-out`}
              >
                <SideMenu items={items} menuItems={menuItems} />
              </section>

              <section className="w-full md:ml-[10rem] lg:ml-[16rem] relative">
                <Outlet />
              </section>
            </>
          ) : (
            <div className="h-full w-full p-5">
              <></>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}

export default Layout;
