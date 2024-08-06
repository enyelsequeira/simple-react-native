import React from "react";
import type { ListRenderItem } from "react-native";
import MovieCard from "~/src/components/movie-card";
import type { Movie } from "~/src/constants/types";

export const renderMovieItem: ListRenderItem<Movie> = ({ item }) => (
	<MovieCard
		title={item.title}
		imageSrc={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
		releaseYear={item.release_date.split("-")[0]}
		voteAverage={item.vote_average}
		movieId={item.id}
	/>
);
