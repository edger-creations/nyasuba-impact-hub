
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

interface NavbarProps {
  minimal?: boolean;
}

const Navbar = ({ minimal = false }: NavbarProps) => {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, isRegistered, logout, user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { title: "Home", path: "/" },
    { title: "Programs", path: "/programs" },
    { title: "About", path: "/about" },
    { title: "Gallery", path: "/gallery" },
    { title: "Volunteer", path: "/volunteer" },
    { title: "Reviews", path: "/reviews" },
    { title: "Contact", path: "/contact" },
  ];

  // Helper function to handle navigation with authentication checks
  const handleNavigation = (path: string) => {
    if (path === "/") return navigate(path);
    
    if (!isAuthenticated) {
      navigate("/login");
      return false;
    }
    
    if (!isRegistered) {
      navigate("/signup");
      return false;
    }
    
    return true;
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo size={40} showText={!minimal} />
        </Link>

        {!minimal ? (
          <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={(e) => {
                    if (item.path !== "/" && !isAuthenticated) {
                      e.preventDefault();
                      navigate("/login");
                    } else if (item.path !== "/" && isAuthenticated && !isRegistered) {
                      e.preventDefault();
                      navigate("/signup");
                    }
                  }}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-enf-green dark:hover:text-enf-light-green",
                    location.pathname === item.path
                      ? "text-enf-green dark:text-enf-light-green"
                      : "text-foreground"
                  )}
                >
                  {item.title}
                </Link>
              ))}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  {user?.name && (
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Hi, {user.name}
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="text-sm font-medium"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm" className="bg-enf-green hover:bg-enf-dark-green">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </nav>

            {/* Mobile Navigation Toggle */}
            <div className="flex items-center md:hidden gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </>
        ) : (
          // Minimal Navbar for Auth Pages
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && !minimal && (
        <div className="md:hidden bg-background dark:bg-gray-900 border-b shadow-sm">
          <div className="container mx-auto px-4 py-3 flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={(e) => {
                  if (item.path !== "/" && !isAuthenticated) {
                    e.preventDefault();
                    navigate("/login");
                  } else if (item.path !== "/" && isAuthenticated && !isRegistered) {
                    e.preventDefault();
                    navigate("/signup");
                  }
                }}
                className={cn(
                  "py-2 text-sm font-medium transition-colors hover:text-enf-green dark:hover:text-enf-light-green",
                  location.pathname === item.path
                    ? "text-enf-green dark:text-enf-light-green"
                    : "text-foreground"
                )}
              >
                {item.title}
              </Link>
            ))}
            {isAuthenticated ? (
              <Button
                variant="ghost"
                onClick={logout}
                className="justify-start px-0 text-sm font-medium py-2"
              >
                Logout
              </Button>
            ) : (
              <div className="flex flex-col gap-2 py-2">
                <Link to="/login">
                  <Button variant="outline" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="w-full bg-enf-green hover:bg-enf-dark-green">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
