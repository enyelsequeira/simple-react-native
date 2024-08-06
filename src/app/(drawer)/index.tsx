import { Stack } from "expo-router";
import { useAtom } from "jotai";
import React from "react";
import { FlatList } from "react-native";
import { YStack } from "tamagui";
import { renderMovieItem } from "~/src/components/render-item";
import { keyExtractor } from "~/src/constants";
import { useFetchInitialMovies } from "~/src/queries/get-initial-page-movies";
import { CategoriesStateAtom } from "~/src/store";

function Home() {
	const [{ selectedCategory }] = useAtom(CategoriesStateAtom);
	const {
		data: moviesData,
		hasNextPage,
		fetchNextPage,
	} = useFetchInitialMovies({
		categories: selectedCategory.value,
	});

	const movies = moviesData?.pages.flatMap((page) => page.results) || [];

	const handleLoadMore = async () => {
		if (hasNextPage) {
			await fetchNextPage();
		}
	};

	return (
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
	);
}

export default Home;
