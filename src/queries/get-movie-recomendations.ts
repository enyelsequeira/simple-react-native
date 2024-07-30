import { useQuery } from "@tanstack/react-query";
import { APIKEY, getMovieAPI } from "~/src/constants";

export interface Root {
	page: number;
	results: Result[];
	total_pages: number;
	total_results: number;
}

export interface Result {
	adult: boolean;
	backdrop_path: string;
	genre_ids: number[];
	id: number;
	original_language: string;
	original_title: string;
	overview: string;
	release_date: string;
	poster_path: string | null;
	popularity: number;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
}

type Params = {
	movieId: string;
};
const getMoviesRecommendations = async ({ movieId }: Params) => {
	const API_POINT = `movie/${movieId}/recommendations?api_key=${APIKEY}`;
	try {
		const res = await getMovieAPI().get<Root>(API_POINT);
		return res.data.results.slice(0, 12);
	} catch (e) {
		console.log({ e });
		throw e;
	}
};

export const useGetMovieRecommendations = ({ movieId }: Params) => {
	return useQuery({
		queryKey: ["get-movie-recommendations", { movieId }],
		queryFn: async () => await getMoviesRecommendations({ movieId }),
		enabled: !!movieId,
	});
};
