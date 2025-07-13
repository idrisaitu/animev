export interface Genre {
  id: string;
  name: string;
}

export interface Anime {
  id: string;
  malId: number;
  title: string;
  originalTitle?: string;
  description: string;
  type: string;
  status: 'ONGOING' | 'COMPLETED' | 'UPCOMING' | 'CANCELLED';
  releaseDate: string;
  rating: number;
  episodes: number;
  duration: number;
  image: string;
  trailer: string;
  createdAt: string;
  updatedAt: string;
  genres: Genre[];
}
