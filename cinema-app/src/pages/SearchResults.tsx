import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { movieApi } from "@/services/api";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MovieGrid } from "@/components/MovieGrid";
import { Pagination } from "@/components/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query") || "";

  const [page, setPage] = useState(1);

  // Reset page when search query changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const { data, isLoading } = useQuery({
    queryKey: ["movies", page, searchQuery],
    queryFn: () => movieApi.getMovies(page, searchQuery),
    enabled: searchQuery.length > 0,
  });

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;
  const totalResults = data?.total_results || 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container py-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Résultats pour "{searchQuery}"
          </h1>
          {data && (
            <p className="text-muted-foreground">
              {totalResults} film{totalResults > 1 ? "s" : ""} trouvé
              {totalResults > 1 ? "s" : ""}
            </p>
          )}
        </section>

        <section>
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

export default SearchResultsPage;
