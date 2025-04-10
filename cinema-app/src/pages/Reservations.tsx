import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reservationApi } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Film, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";

const ReservationsPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const { data: reservations, isLoading } = useQuery({
    queryKey: ["reservations"],
    queryFn: reservationApi.getReservations,
    enabled: isAuthenticated,
  });

  // Cancellation mutation
  const cancelReservationMutation = useMutation({
    mutationFn: (reservationId: number) =>
      reservationApi.deleteReservation(reservationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Réservation annulée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de l'annulation de la réservation");
    },
  });

  const handleCancelReservation = (reservationId: number) => {
    cancelReservationMutation.mutate(reservationId);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold flex items-center">
              <Film className="mr-2 h-6 w-6" />
              Mes Réservations
            </h1>

            <Button variant="outline" onClick={() => navigate("/")}>
              Découvrir plus de films
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Vos réservations de films</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !reservations || reservations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xl mb-4">Aucune réservation trouvée</p>
                  <p className="text-muted-foreground mb-6">
                    Vous n'avez pas encore réservé de films. Explorez notre
                    sélection et trouvez votre prochain film préféré.
                  </p>
                  <Button onClick={() => navigate("/")}>
                    Voir les films à l'affiche
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID Réservation</TableHead>
                        <TableHead>ID Film</TableHead>
                        <TableHead>Date et heure</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reservations.map((reservation) => (
                        <TableRow key={reservation.id}>
                          <TableCell className="font-medium">
                            {reservation.id}
                          </TableCell>
                          <TableCell>{reservation.movieId}</TableCell>
                          <TableCell>
                            {format(
                              new Date(reservation.reservationDate),
                              "dd MMMM yyyy 'à' HH:mm",
                              { locale: fr }
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  navigate(`/movies/${reservation.movieId}`)
                                }
                              >
                                <ExternalLink className="h-4 w-4" />
                                <span className="sr-only">Voir</span>
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                onClick={() =>
                                  handleCancelReservation(reservation.id)
                                }
                                disabled={cancelReservationMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Annuler</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReservationsPage;
