import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import type React from "react";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";
import {
	Button,
	Card,
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
	styled,
} from "tamagui";
import MovieCard from "~/src/components/movie-card";
import MovieInfoCarrousel from "~/src/components/movie-info-carrousel";
import { useGetMovieInfo } from "~/src/queries/get-movie-info";
import { useGetMovieRecommendations } from "~/src/queries/get-movie-recomendations";

const baseImageUrl = "https://image.tmdb.org/t/p/w500";

const StyledCard = styled(Card, {
	elevation: 1,
	borderWidth: 1,
	borderRadius: 10,
	backgroundColor: "white",
});

const IconText = styled(XStack, {
	space: "$2",
	alignItems: "center",
	padding: "$2",
});

const ReadMoreText = styled(Text, {
	color: "$blue10",
	fontWeight: "bold",
	marginTop: "$2",
});

const Movie: React.FC = () => {
	const router = useRouter();
	const { id } = useLocalSearchParams<{ id: string }>();
	const { data, isLoading } = useGetMovieInfo({
		movieId: `${id}`,
	});
	const { data: movieRecommendations } = useGetMovieRecommendations({
		movieId: `${id}`,
	});
	const [expanded, setExpanded] = useState(false);

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

	if (isLoading) {
		return (
			<YStack flex={1} justifyContent="center" alignItems="center">
				<Spinner size="large" color="$blue10" />
			</YStack>
		);
	}

	if (!data) return null;

	const {
		title,
		vote_average,
		runtime,
		release_date,
		overview,
		genres,
		credits,
		images,
	} = data;

	const truncateText = (text: string, maxLength: number): string => {
		if (text.length <= maxLength) return text;
		return `${text.slice(0, maxLength)}...`;
	};

	return (
		<>
			<Stack.Screen
				options={{
					title: title || "Movie Details",
					headerStyle: { backgroundColor: "#f0f0f0" },
				}}
			/>
			<ScrollView backgroundColor="$gray2">
				<Animated.View style={animatedStyle}>
					<MovieInfoCarrousel images={images.backdrops.slice(0, 5)} />
					<YStack padding="$4" space="$4">
						<XStack justifyContent="space-between" alignItems="center">
							<H1 color="$gray12" fontSize={24} fontWeight="bold">
								{title}
							</H1>
							<Button
								icon={
									<MaterialIcons name="arrow-back" size={24} color="$gray12" />
								}
								circular
								onPress={() => router.back()}
								backgroundColor="$gray4"
							/>
						</XStack>

						<XStack space="$4" justifyContent="space-around">
							<StyledCard>
								<IconText>
									<MaterialIcons name="star" size={20} color="#FFD700" />
									<Text color="$gray11" fontSize={16} fontWeight="bold">
										{vote_average.toFixed(1)}
									</Text>
								</IconText>
							</StyledCard>
							<StyledCard>
								<IconText>
									<MaterialIcons name="access-time" size={20} color="$gray11" />
									<Text color="$gray11" fontSize={16} fontWeight="bold">
										{runtime} min
									</Text>
								</IconText>
							</StyledCard>
							<StyledCard>
								<IconText>
									<MaterialIcons name="event" size={20} color="$gray11" />
									<Text color="$gray11" fontSize={16} fontWeight="bold">
										{new Date(release_date).getFullYear()}
									</Text>
								</IconText>
							</StyledCard>
						</XStack>

						<YStack
							space="$2"
							backgroundColor="white"
							padding="$3"
							borderRadius={10}
						>
							<H2 color="$gray12" fontSize={20} fontWeight="bold">
								Synopsis
							</H2>
							<Paragraph color="$gray11" fontSize={16}>
								{expanded ? overview : truncateText(overview, 200)}
							</Paragraph>
							{overview.length > 200 && (
								<Pressable onPress={() => setExpanded(!expanded)}>
									<ReadMoreText>
										{expanded ? "Read Less" : "Read More"}
									</ReadMoreText>
								</Pressable>
							)}
						</YStack>

						<YStack space="$2">
							<H2 color="$gray12" fontSize={20} fontWeight="bold">
								Genres
							</H2>
							<XStack flexWrap="wrap" space="$2">
								{genres.map((genre) => (
									<StyledCard
										key={genre.id}
										paddingHorizontal="$2"
										paddingVertical="$1"
										onPress={() => {
											router.push(`/${genre.id}`);
										}}
									>
										<Text color="$gray11" fontSize={14}>
											{genre.name}
										</Text>
									</StyledCard>
								))}
							</XStack>
						</YStack>

						<Separator />

						<YStack space="$2">
							<H2 color="$gray12" fontSize={20} fontWeight="bold">
								Cast
							</H2>
							<ScrollView horizontal showsHorizontalScrollIndicator={false}>
								<XStack space="$2">
									{credits.cast.slice(0, 10).map((actor) => (
										<StyledCard
											key={actor.id}
											width={120}
											marginRight="$2"
											onPress={() => {
												router.push(`/cast/${actor.id}`);
											}}
										>
											<YStack space="$1" alignItems="center">
												<Image
													source={{
														uri: actor.profile_path
															? `${baseImageUrl}${actor.profile_path}`
															: "https://via.placeholder.com/80",
													}}
													width={80}
													height={80}
													borderRadius={40}
													alt={actor.name}
												/>
												<Text
													color="$gray11"
													fontSize={14}
													fontWeight="500"
													textAlign="center"
												>
													{actor.name}
												</Text>
												<Text color="$gray10" fontSize={12} textAlign="center">
													{truncateText(actor.character, 20)}
												</Text>
											</YStack>
										</StyledCard>
									))}
								</XStack>
							</ScrollView>
						</YStack>

						<Button
							theme="active"
							size="$5"
							icon={
								<MaterialIcons name="local-activity" size={24} color="white" />
							}
							backgroundColor="$blue10"
							color="white"
							fontWeight="bold"
						>
							Book Tickets
						</Button>

						{movieRecommendations && movieRecommendations.length > 0 && (
							<YStack space="$2">
								<H2 color="$gray12" fontSize={20} fontWeight="bold">
									Recommended Movies
								</H2>
								<ScrollView horizontal showsHorizontalScrollIndicator={false}>
									<XStack space="$2">
										{movieRecommendations.map((movie) => (
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
						)}
					</YStack>
				</Animated.View>
			</ScrollView>
		</>
	);
};

export default Movie;
