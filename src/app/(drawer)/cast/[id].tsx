import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";
import {
	H1,
	H2,
	Image,
	Paragraph,
	ScrollView,
	Separator,
	Spinner,
	Text,
	XStack,
	YStack,
} from "tamagui";
import MovieCard from "~/src/components/movie-card";
import {
	useCastInfo,
	useFetchCastRecommendation,
} from "~/src/queries/use-cast-info";

const AnimatedYStack = Animated.createAnimatedComponent(YStack);

const CastInformation = () => {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const { data, isLoading } = useCastInfo({
		castId: `${id}`,
	});
	const { data: castRecommendations } = useFetchCastRecommendation({
		castId: `${id}`,
	});
	console.log({
		castRecommendations,
	});

	const opacity = useSharedValue(0);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!isLoading && data) {
			opacity.value = withTiming(1, { duration: 1000 });
		}
	}, [isLoading, data]);

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
	}));

	if (isLoading || !data) {
		return (
			<YStack flex={1} justifyContent="center" alignItems="center">
				<Spinner size="large" color="$blue10" />
			</YStack>
		);
	}

	const {
		name,
		profile_path,
		biography,
		birthday,
		place_of_birth,
		known_for_department,
		credits,
	} = data;

	const baseImageUrl = "https://image.tmdb.org/t/p/w500";

	return (
		<>
			<Stack.Screen
				options={{
					title: name,
					headerStyle: { backgroundColor: "#f0f0f0" },
				}}
			/>
			<ScrollView backgroundColor="$gray2">
				<AnimatedYStack style={animatedStyle} padding="$4" space="$4">
					<XStack space="$4" alignItems="center">
						<Image
							source={{ uri: `${baseImageUrl}${profile_path}` }}
							width={120}
							height={180}
							borderRadius={10}
							alt={name}
						/>
						<YStack flex={1} space="$2">
							<H1 color="$gray12" fontSize={24} fontWeight="bold">
								{name}
							</H1>
							<Text color="$gray11">
								<MaterialIcons name="cake" size={16} color="$gray11" />{" "}
								{birthday}
							</Text>
							<Text color="$gray11">
								<MaterialIcons name="place" size={16} color="$gray11" />{" "}
								{place_of_birth}
							</Text>
							<Text color="$gray11">
								<MaterialIcons name="work" size={16} color="$gray11" />{" "}
								{known_for_department}
							</Text>
						</YStack>
					</XStack>

					<YStack space="$2">
						<H2 color="$gray12" fontSize={20} fontWeight="bold">
							Biography
						</H2>
						<Paragraph color="$gray11" fontSize={16}>
							{biography}
						</Paragraph>
					</YStack>

					<Separator />

					<YStack space="$2">
						<H2 color="$gray12" fontSize={20} fontWeight="bold">
							Notable Works
						</H2>
						<ScrollView horizontal showsHorizontalScrollIndicator={false}>
							<XStack space="$2">
								{castRecommendations?.map((movie) => (
									<MovieCard
										key={movie.id}
										title={movie.title}
										imageSrc={
											movie.poster_path
												? `${baseImageUrl}${movie.poster_path}`
												: "https://via.placeholder.com/500x750"
										}
										releaseYear={new Date(movie.release_date)
											.getFullYear()
											.toString()}
										voteAverage={movie.vote_average}
										movieId={movie.id}
									/>
								))}
							</XStack>
						</ScrollView>
					</YStack>
				</AnimatedYStack>
			</ScrollView>
		</>
	);
};

export default CastInformation;
