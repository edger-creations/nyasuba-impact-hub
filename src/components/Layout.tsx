
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAOSRefresh } from "@/hooks/useAOSRefresh";

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

const Layout = ({ children, showFooter = true }: LayoutProps) => {
  const location = useLocation();
  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(location.pathname);
  
  // Use our custom hook to refresh AOS animations on route changes
  useAOSRefresh();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar minimal={isAuthPage} />
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
