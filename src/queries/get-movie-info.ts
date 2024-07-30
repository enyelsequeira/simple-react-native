import { useQuery } from "@tanstack/react-query";
import { APIKEY, EndPoints, getMovieAPI } from "~/src/constants";
import type { MovieInfoResponse } from "~/src/constants/types";

export const fetchMovieInfo = async (movieId: string) => {
	const APIPOINT = EndPoints.getMovieInfo;
	const res = await getMovieAPI().get<MovieInfoResponse>(
		`${APIPOINT}/${movieId}?append_to_response=videos,credits,images&api_key=${APIKEY}`,
	);
	return res.data;
};
export const useGetMovieInfo = ({ movieId }: { movieId: string }) => {
	return useQuery({
		queryKey: ["movie-info", movieId],
		queryFn: () => fetchMovieInfo(movieId),
		enabled: !!movieId,
	});
};
