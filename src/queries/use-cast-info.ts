import { useQuery } from "@tanstack/react-query";
import { APIKEY, getMovieAPI } from "~/src/constants";
import type { Credits, Images } from "~/src/constants/types";

export const getCastInfo = async ({ castId }: { castId: string }) => {
	const API = `/person/${castId}?append_to_response=videos,credits,images&api_key=${APIKEY}`;
	try {
		const res = await getMovieAPI().get<CastType>(API);
		return res.data;
	} catch (e) {
		console.log({ e });
		throw e;
	}
};

export const getCastRecommendation = async ({ castId }: { castId: string }) => {
	const API = `/discover/movie?with_cast=${castId}&page=1&api_key=${APIKEY}`;
	const res = await getMovieAPI().get<MovieWithCast>(API);
	const response = res.data.results.slice(0, 12);
	return response;
};
export const useFetchCastRecommendation = ({ castId }: { castId: string }) => {
	return useQuery({
		queryKey: ["cast-recommendation", { castId }],
		queryFn: async () => getCastRecommendation({ castId }),
		enabled: !!castId,
	});
};

export const useCastInfo = ({ castId }: { castId: string }) => {
	return useQuery({
		queryKey: ["cast-info", castId],
		queryFn: async () => getCastInfo({ castId }),
		enabled: !!castId,
	});
};

export interface CastType {
	adult: boolean;
	also_known_as: string[];
	biography: string;
	birthday: string;
	deathday: any;
	gender: number;
	homepage: string;
	id: number;
	imdb_id: string;
	known_for_department: string;
	name: string;
	place_of_birth: string;
	popularity: number;
	profile_path: string;
	credits: Credits;
	images: Images;
}

export interface MovieWithCast {
	results: MovieWithCastResult[];
}

export interface MovieWithCastResult {
	adult: boolean;
	backdrop_path: string;
	genre_ids: number[];
	id: number;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	release_date: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
}
