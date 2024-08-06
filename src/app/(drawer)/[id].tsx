import { Stack, useLocalSearchParams } from "expo-router";
import { FlatList, type ListRenderItem } from "react-native";
import { Image, Text, View, YStack } from "tamagui";
import MovieCard from "~/src/components/movie-card";
import { renderMovieItem } from "~/src/components/render-item";
import { keyExtractor } from "~/src/constants";
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
					renderItem={renderMovieItem}
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
