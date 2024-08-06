import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { APIKEY, EndPoints, getMovieAPI } from "~/src/constants";
import type { Movie } from "~/src/constants/types";

type Params = {
	categories: string;
};

export interface Root {
	page: number;
	results: Movie[];
	total_pages: number;
	total_results: number;
}

export const useFetchInitialMovies = ({ categories }: Params) => {
	return useInfiniteQuery({
		queryKey: ["initial-page", categories],
		queryFn: async ({ pageParam = 1 }) => {
			try {
				const APIPOINT = `${EndPoints.generalMovie}/${categories}?page=${pageParam}&api_key=${APIKEY}`;
				const res = await getMovieAPI().get<Root>(APIPOINT);
				return res.data;
			} catch (e) {
				console.log({ e });
				throw e;
			}
		},
		enabled: !!categories,
		initialPageParam: 1,
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
	});
};
