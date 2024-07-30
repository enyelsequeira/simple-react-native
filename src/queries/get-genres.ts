import { useQuery } from "@tanstack/react-query";
import { EndPoints, getMovieAPI } from "~/src/constants";
import type { Genre } from "~/src/constants/types";

type Data = {
	genres: Genre[];
};
export const useGetGenres = () => {
	return useQuery({
		queryKey: ["get-genres"],
		queryFn: async () => {
			try {
				const res = await getMovieAPI().get<Data>(EndPoints.getGenres);
				return res.data;
			} catch (e) {
				console.log({ e });
				throw e;
			}
		},
	});
};
