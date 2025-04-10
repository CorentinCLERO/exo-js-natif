import React from "react";
import { useQuery } from "@tanstack/react-query";
import { userApi, reservationApi } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Film, LogOut, User } from "lucide-react";
import { Loader2 } from "lucide-react";

const ProfilePage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const { data: reservations, isLoading: isLoadingReservations } = useQuery({
    queryKey: ["reservations"],
    queryFn: reservationApi.getReservations,
    enabled: isAuthenticated,
  });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container py-16">
          <div className="text-center">
            <p className="mb-4">
              Vous devez être connecté pour accéder à cette page.
            </p>
            <Button onClick={() => navigate("/login")}>Se connecter</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 flex items-center">
            <User className="mr-2 h-6 w-6" />
            Mon Profil
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user?.email && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Email
                        </h3>
                        <p className="mt-1">{user.email}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        ID utilisateur
                      </h3>
                      <p className="mt-1">{user?.sub}</p>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full mt-4 text-red-500 hover:text-red-700 hover:bg-red-100"
                      onClick={logout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Mes réservations</CardTitle>
                  <CardDescription>
                    Liste des films que vous avez réservés
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingReservations ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : reservations && reservations.length > 0 ? (
                    <div className="space-y-4">
                      {reservations.map((reservation) => (
                        <div
                          key={reservation.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center">
                            <Film className="h-5 w-5 mr-3 text-primary" />
                            <div>
                              <p className="font-medium">
                                Film #{reservation.movieId}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(
                                  reservation.reservationDate
                                ).toLocaleDateString("fr-FR")}{" "}
                                à{" "}
                                {new Date(
                                  reservation.reservationDate
                                ).toLocaleTimeString("fr-FR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              navigate(`/movies/${reservation.movieId}`)
                            }
                          >
                            Voir
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Vous n'avez pas encore de réservations
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => navigate("/")}
                      >
                        Explorer les films
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
