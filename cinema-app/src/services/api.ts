import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Helper function to handle fetch and errors consistently
const apiFetch = async (url: string, options: RequestInit = {}) => {
  try {
    // Add the base URL to the path
    const fullUrl = `${BASE_URL}${url}`;

    // Get the token from localStorage
    const token = localStorage.getItem("token");

    // Set up headers with authorization if token exists
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: "Une erreur s'est produite",
      }));

      // For 401 errors, notify the user they need to log in
      if (response.status === 401) {
        toast.error(
          "Vous devez être connecté pour accéder à cette fonctionnalité"
        );
      } else {
        toast.error(errorData.message || "Une erreur s'est produite");
      }

      throw new Error(errorData.message || "API Error");
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Movie related endpoints
export const movieApi = {
  getMovies: async (page = 1, search?: string, sortBy?: string) => {
    let query = `?page=${page}`;
    if (search) query += `&search=${encodeURIComponent(search)}`;
    if (sortBy) query += `&sort_by=${encodeURIComponent(sortBy)}`;

    return apiFetch(`/movies${query}`);
  },

  getMovieById: async (id: number | string) => {
    return apiFetch(`/movies/${id}`);
  },
};

// Reservation related endpoints
export const reservationApi = {
  getReservations: async () => {
    return apiFetch("/reservations");
  },

  createReservation: async (movieId: number, time: string) => {
    return apiFetch("/reservations", {
      method: "POST",
      body: JSON.stringify({ movieId, time }),
    });
  },

  deleteReservation: async (reservationId: number) => {
    return apiFetch(`/reservations/${reservationId}`, {
      method: "DELETE",
    });
  },
};

// User related endpoints
export const userApi = {
  getUserProfile: async () => {
    return apiFetch("/users/me");
  },
};
