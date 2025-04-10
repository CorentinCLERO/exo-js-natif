
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { movieApi, reservationApi } from "@/services/api";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Clock, Star, Calendar as CalendarIcon2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const MovieDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);

  // Available times for booking
  const availableTimes = ["10:00", "12:30", "15:00", "17:30", "20:00", "22:30"];

  const { data: movie, isLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => (id ? movieApi.getMovieById(id) : null),
  });

  // Reservation mutation
  const reservationMutation = useMutation({
    mutationFn: (data: { movieId: number; time: string }) => 
      reservationApi.createReservation(data.movieId, data.time),
    onSuccess: () => {
      toast.success("Réservation effectuée avec succès!");
      navigate("/reservations");
    },
    onError: (error) => {
      toast.error("Erreur lors de la réservation, veuillez réessayer.");
      console.error("Reservation error:", error);
    }
  });

  const handleReservation = () => {
    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour réserver");
      navigate("/login");
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error("Veuillez sélectionner une date et une heure");
      return;
    }

    // Format date and time for API
    const formattedDateTime = `${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}:00Z`;

    reservationMutation.mutate({
      movieId: Number(id),
      time: formattedDateTime
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container py-16">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse w-full max-w-4xl">
              <div className="h-8 bg-muted rounded-md mb-4 w-1/3"></div>
              <div className="h-72 bg-muted rounded-md mb-4"></div>
              <div className="h-4 bg-muted rounded-md mb-2 w-full"></div>
              <div className="h-4 bg-muted rounded-md mb-2 w-full"></div>
              <div className="h-4 bg-muted rounded-md w-2/3"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Film non trouvé</h1>
            <p className="mb-8">Le film que vous recherchez n'existe pas ou a été supprimé.</p>
            <Button onClick={() => navigate("/")}>Retour à l'accueil</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Format release date
  const releaseDate = new Date(movie.release_date);
  const formattedReleaseDate = format(releaseDate, "dd MMMM yyyy", { locale: fr });

  // Poster URL
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero section with backdrop */}
        <div 
          className="w-full h-[50vh] bg-cover bg-center relative"
          style={{
            backgroundImage: movie.poster_path 
              ? `url(https://image.tmdb.org/t/p/original${movie.poster_path})`
              : "none",
            backgroundPosition: "center 20%"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <div className="container py-8 -mt-32 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Movie poster */}
            <div className="perspective-1000">
              <div className="poster-3d-effect shadow-xl rounded-lg overflow-hidden">
                <img 
                  src={posterUrl} 
                  alt={`${movie.title} poster`}
                  className="w-full h-auto"
                />
              </div>
            </div>
            
            {/* Movie details */}
            <div className="md:col-span-2 text-foreground">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
              
              <div className="flex flex-wrap gap-2 items-center mb-4">
                <Badge variant="outline" className="text-sm py-1">
                  {formattedReleaseDate}
                </Badge>
                
                <div className="flex items-center text-cinema-gold">
                  <Star className="h-4 w-4 fill-cinema-gold stroke-cinema-gold mr-1" />
                  <span>{movie.vote_average?.toFixed(1) || "N/A"}</span>
                </div>
              </div>
              
              <p className="text-lg mb-8">{movie.overview}</p>
              
              {/* Reservation card */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Réserver une séance</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="text-sm font-medium block mb-2">Sélectionnez une date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? (
                              format(selectedDate, "dd MMMM yyyy", { locale: fr })
                            ) : (
                              "Choisir une date"
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-2">Sélectionnez une heure</label>
                      <div className="flex flex-wrap gap-2">
                        {availableTimes.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                            className="flex-1"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleReservation}
                    disabled={!selectedDate || !selectedTime || reservationMutation.isPending}
                  >
                    {reservationMutation.isPending ? "En cours..." : "Réserver maintenant"}
                  </Button>
                  
                  {!isAuthenticated && (
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      Vous devez être connecté pour réserver
                    </p>
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

export default MovieDetailsPage;
