import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
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
import { useGetMovieInfo } from "~/src/queries/get-movie-info";
import { useGetMovieRecommendations } from "~/src/queries/get-movie-recomendations";

const StyledCard = styled(Card, {
	elevate: true,
	bordered: true,
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

const Movie = () => {
	const router = useRouter();
	const { id } = useLocalSearchParams<{ id: string }>();
	const { data, isLoading } = useGetMovieInfo({
		movieId: `${id}`,
	});
	const { data: movieRecommendations } = useGetMovieRecommendations({
		movieId: `${id}`,
	});
	const [expanded, setExpanded] = useState(false);

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
		poster_path,
		backdrop_path,
		vote_average,
		runtime,
		release_date,
		overview,
		genres,
		credits,
	} = data;

	const baseImageUrl = "https://image.tmdb.org/t/p/w500";

	const truncateText = (text: string, maxLength: number) => {
		if (text.length <= maxLength) return text;
		return `${text.substr(0, maxLength)}...`;
	};

	return (
		<>
			<Stack.Screen
				options={{
					title: title,
					headerStyle: { backgroundColor: "#f0f0f0" },
				}}
			/>
			<ScrollView backgroundColor="$gray2">
				<YStack flex={1}>
					<Image
						source={{ uri: `${baseImageUrl}${backdrop_path || poster_path}` }}
						width="100%"
						height={250}
						resizeMode="cover"
						alt={`${title} Poster`}
					/>
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
							<StyledCard elevate>
								<IconText>
									<MaterialIcons name="star" size={20} color="#FFD700" />
									<Text color="$gray11" fontSize={16} fontWeight="bold">
										{vote_average.toFixed(1)}
									</Text>
								</IconText>
							</StyledCard>
							<StyledCard elevate>
								<IconText>
									<MaterialIcons name="access-time" size={20} color="$gray11" />
									<Text color="$gray11" fontSize={16} fontWeight="bold">
										{runtime} min
									</Text>
								</IconText>
							</StyledCard>
							<StyledCard elevate>
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
								<TouchableOpacity onPress={() => setExpanded(!expanded)}>
									<ReadMoreText>
										{expanded ? "Read Less" : "Read More"}
									</ReadMoreText>
								</TouchableOpacity>
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
										<StyledCard key={actor.id} width={120} marginRight="$2">
											<YStack space="$1" alignItems="center">
												<Image
													source={{
														uri: `${baseImageUrl}${actor.profile_path}`,
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
												imageSrc={`${baseImageUrl}${movie.poster_path}`}
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
				</YStack>
			</ScrollView>
		</>
	);
};

export default Movie;
