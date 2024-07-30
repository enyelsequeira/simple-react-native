import { useInfiniteQuery } from "@tanstack/react-query";
import { APIKEY, EndPoints, getMovieAPI } from "~/src/constants";
import type { Movie } from "~/src/constants/types";

type Data = {
	page: number;
	results: Movie[];
	total_pages: number;
	total_results: number;
};
type Params = {
	page: number;
	genreId: number;
};

export const useGetMovies = ({ genreId }: { genreId: string }) => {
	return useInfiniteQuery({
		queryKey: ["movies", genreId],
		queryFn: async ({ pageParam = 1 }) => {
			const API = EndPoints.getMoviesByCategory;
			const res = await getMovieAPI().get<Data>(
				`${API}?with_genres=${genreId}&page=${pageParam}&api_key=${APIKEY}`,
			);

			return res.data;
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
		enabled: !!genreId,
	});
};
