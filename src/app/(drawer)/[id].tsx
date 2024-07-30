import { Stack, useLocalSearchParams } from "expo-router";
import { FlatList, type ListRenderItem } from "react-native";
import { Image, Text, View, YStack } from "tamagui";
import MovieCard from "~/src/components/movie-card";
import type { Movie } from "~/src/constants/types";
import { useGetGenres } from "~/src/queries/get-genres";
import { useGetMovies } from "~/src/queries/get-movies-by-genre";

export default function GenrePage() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { data } = useGetGenres();

	const specificGenre = data?.genres?.find(
		(d) => d.id === Number.parseInt(id as string),
	);

	const {
		data: moviesData,
		fetchNextPage,
		hasNextPage,
	} = useGetMovies({
		genreId: `${id}`,
	});

	const movies = moviesData?.pages.flatMap((page) => page.results) || [];

	const keyExtractor = (item: Movie, index: number) => {
		const baseKey = `${item.id}-${item.title}`;
		const dateKey = item.release_date ? `-${item.release_date}` : "";
		return `${baseKey}${dateKey}-${index}`;
	};
	const renderItem: ListRenderItem<Movie> = ({ item }) => (
		<MovieCard
			title={item.title}
			imageSrc={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
			releaseYear={item.release_date.split("-")[0]}
			voteAverage={item.vote_average}
			movieId={item.id}
		/>
	);

	const handleLoadMore = async () => {
		if (hasNextPage) {
			await fetchNextPage();
		}
	};

	return (
		<>
			<Stack.Screen options={{ title: `Genre: ${specificGenre?.name}` }} />
			<YStack flex={1}>
				<FlatList
					data={movies}
					renderItem={renderItem}
					keyExtractor={keyExtractor}
					onEndReached={handleLoadMore}
					onEndReachedThreshold={0.5}
					numColumns={2}
					columnWrapperStyle={{
						justifyContent: "space-between",
						paddingHorizontal: 16,
						marginBottom: 16,
					}}
					contentContainerStyle={{
						paddingTop: 16,
					}}
				/>
			</YStack>
		</>
	);
}
