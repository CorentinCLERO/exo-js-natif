import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { movieApi } from "@/services/api";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MovieGrid } from "@/components/MovieGrid";
import { Pagination } from "@/components/Pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HomePage = () => {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["movies", page, filter, sortBy],
    queryFn: () => movieApi.getMovies(page, filter, sortBy),
  });

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container py-8">
        <section className="mb-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">
              Découvrez et réservez vos films préférés
            </h1>
            <p className="text-muted-foreground">
              Explorez les derniers films à l'affiche, réservez vos séances et
              profitez de l'expérience cinéma avec MovieBooker
            </p>
          </div>
        </section>

        <section>
          <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mb-6">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity.desc">Popularité ⬇️</SelectItem>
                <SelectItem value="popularity.asc">Popularité ⬆️</SelectItem>
                <SelectItem value="vote_average.desc">Note ⬇️</SelectItem>
                <SelectItem value="vote_average.asc">Note ⬆️</SelectItem>
                <SelectItem value="release_date.desc">
                  Date de sortie ⬇️
                </SelectItem>
                <SelectItem value="release_date.asc">
                  Date de sortie ⬆️
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <MovieGrid movies={movies} isLoading={isLoading} />

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
