import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Card, type CardProps, H4, Image, Text, XStack, YStack } from "tamagui";

type Props = {
	title: string;
	imageSrc: string;
	releaseYear: string;
	voteAverage: number;
	movieId: number;
} & CardProps;

const MovieCard = ({
	title,
	imageSrc,
	releaseYear,
	voteAverage,
	movieId,
	...rest
}: Props) => {
	const router = useRouter();
	return (
		<Card
			elevate
			size="$4"
			{...rest}
			width={160}
			height={300}
			overflow="hidden"
			backgroundColor="$blue2"
			borderColor="$blue6"
			borderWidth={1}
			onPress={() => {
				router.push(`/movie/${movieId}`);
			}}
		>
			<Image
				source={{ uri: imageSrc }}
				width="100%"
				height={240}
				resizeMode="cover"
			/>
			<YStack padding="$2" flex={1} justifyContent="space-between">
				<H4 numberOfLines={1} fontSize="$4" color="white">
					{title}
				</H4>
				<XStack justifyContent="space-between" alignItems="center">
					<Text color="$blue10" fontSize="$2">
						{releaseYear}
					</Text>
					<XStack
						alignItems="center"
						space="$1"
						backgroundColor="$blue5"
						paddingHorizontal="$1"
						borderRadius="$1"
					>
						<MaterialIcons name="star-border" size={14} color="white" />
						<Text fontWeight="bold" fontSize="$2" color="$blue11">
							{voteAverage.toFixed(1)}
						</Text>
					</XStack>
				</XStack>
			</YStack>
		</Card>
	);
};

export default MovieCard;
