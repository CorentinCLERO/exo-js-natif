import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/context/AuthContext";
import { Film, Search, User, LogOut, LogIn, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <Film className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">MovieBooker</span>
          </Link>
        </div>

        {isMobile ? (
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSearch} className="relative w-1/3">
              <Input
                type="search"
                placeholder="Rechercher un film..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>

            <NavigationMenu>
              <NavigationMenuList className="flex items-center gap-2">
                <NavigationMenuItem>
                  <Link to="/">
                    <Button variant="ghost">Accueil</Button>
                  </Link>
                </NavigationMenuItem>

                {isAuthenticated ? (
                  <>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Mon Compte</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="w-56 p-2">
                          <div className="mb-2 px-2 py-1.5 text-sm font-medium">
                            Connecté en tant que {user?.email}
                          </div>
                          <Link to="/profile">
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                            >
                              <User className="mr-2 h-4 w-4" />
                              Profil
                            </Button>
                          </Link>
                          <Link to="/reservations">
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                            >
                              <Film className="mr-2 h-4 w-4" />
                              Mes Réservations
                            </Button>
                          </Link>
                          <Button
                            onClick={logout}
                            variant="ghost"
                            className="w-full justify-start text-red-500"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Déconnexion
                          </Button>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </>
                ) : (
                  <NavigationMenuItem>
                    <Link to="/login">
                      <Button>
                        <LogIn className="mr-2 h-4 w-4" />
                        Connexion
                      </Button>
                    </Link>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </>
        )}
      </div>

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div className="container pb-4 animate-fade-in">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Rechercher un film..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </form>

          <nav className="flex flex-col space-y-2">
            <Link to="/" onClick={toggleMenu}>
              <Button variant="ghost" className="w-full justify-start">
                Accueil
              </Button>
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={toggleMenu}>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </Button>
                </Link>
                <Link to="/reservations" onClick={toggleMenu}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Film className="mr-2 h-4 w-4" />
                    Mes Réservations
                  </Button>
                </Link>
                <Button
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                  variant="ghost"
                  className="w-full justify-start text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
              </>
            ) : (
              <Link to="/login" onClick={toggleMenu}>
                <Button className="w-full">
                  <LogIn className="mr-2 h-4 w-4" />
                  Connexion
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
