import React, { useState, useEffect } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import { ShoppingCart, Store, Home, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from '../../auth/auth'; // Ajusta la ruta si es necesario


interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAdmin } = useAuth();
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const navigate = useNavigate();


  // Manejo de scroll para ocultar barra
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [navVisible, setNavVisible] = useState(true);

  useEffect(() => {
    if (!showAdminMenu) return;
    const handleClick = () => setShowAdminMenu(false);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [showAdminMenu]);

  const handleSignOut = async () => {
    const auth = getAuth();
    await signOut(auth);
    window.location.reload(); // Refresca para limpiar el estado
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setNavVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const NavigationItems = () => (
    <>
      <Link
        to="/"
        className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <Home className="h-5 w-5" />
        <span>Home</span>
      </Link>

      <Link
        to="/products"
        className="text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Products
      </Link>



      

      {!isAdmin ? (
        <Link to="/admin-login">
          <button className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700 transition">
            Admin
          </button>
        </Link>
      ) : (
        <div className="relative">
          <button
            className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700 transition"
            onClick={e => {
              e.stopPropagation();
              setShowAdminMenu(v => !v);
            }}
          >
            Admin
          </button>
          {showAdminMenu && (
              <div
                className="absolute right-0 mt-2 w-40 bg-white border rounded shadow transition-all animate-slide-down z-50"
                onClick={e => e.stopPropagation()}
              >
                <button
                  className="w-full px-4 py-2 text-gray-800 hover:bg-gray-100 text-left"
                  onClick={() => {
                    setShowAdminMenu(false);
                    navigate("/admin");
                  }}
                >
                  Editar productos
                </button>
                <button
                  className="w-full px-4 py-2 text-red-600 hover:bg-gray-100 text-left"
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              </div>
            )}
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <nav
        className={`bg-white shadow-md sticky top-0 z-50 border-b border-border transition-transform duration-300 ${
          navVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-foreground">
              <img src="/MAC-app.png" alt="Logo MAC" className="h-10 w-auto" />
              <span>{/* Texto opcional junto a la imagen */}</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <NavigationItems />
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <div className="flex flex-col space-y-6 mt-8">
                    <NavigationItems />
                  </div>
                </SheetContent>
                
              </Sheet>
            </div>
          </div>
          
        </div>
        
      </nav>

      

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {children}
      </main>

    </div>
  );
};

export default Layout;
