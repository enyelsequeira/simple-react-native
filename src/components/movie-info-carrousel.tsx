import type React from "react";
import { useEffect, useRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
	Extrapolation,
	interpolate,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";
import { Image, ScrollView } from "tamagui";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CAROUSEL_HEIGHT = 250;

const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

interface ImageData {
	file_path: string;
}

type ImageCarouselProps = {
	images: ImageData[];
};

const MovieInfoCarrousel: React.FC<ImageCarouselProps> = ({ images }) => {
	const scrollX = useSharedValue(0);
	const scrollViewRef = useRef<Animated.ScrollView | null>(null);

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			scrollX.value = event.contentOffset.x;
		},
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const interval = setInterval(() => {
			if (scrollViewRef.current) {
				const nextIndex = Math.floor(scrollX.value / SCREEN_WIDTH) + 1;
				if (nextIndex < images.length) {
					scrollViewRef.current.scrollTo({
						x: nextIndex * SCREEN_WIDTH,
						animated: true,
					});
				} else {
					scrollViewRef.current.scrollTo({ x: 0, animated: false });
				}
			}
		}, 3000);

		return () => clearInterval(interval);
	}, [images.length]);

	return (
		<View style={styles.carouselContainer}>
			<AnimatedScrollView
				ref={scrollViewRef}
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				onScroll={scrollHandler}
				scrollEventThrottle={16}
			>
				{images.map((image, index) => {
					const inputRange = [
						(index - 1) * SCREEN_WIDTH,
						index * SCREEN_WIDTH,
						(index + 1) * SCREEN_WIDTH,
					];

					const animatedStyle = useAnimatedStyle(() => {
						const scale = interpolate(
							scrollX.value,
							inputRange,
							[0.8, 1, 0.8],
							Extrapolation.CLAMP,
						);
						const opacity = interpolate(
							scrollX.value,
							inputRange,
							[0.5, 1, 0.5],
							Extrapolation.CLAMP,
						);
						return {
							transform: [{ scale }],
							opacity,
						};
					});

					return (
						<AnimatedImage
							key={`image-${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								index
							}`}
							source={{
								uri: `https://image.tmdb.org/t/p/w500${image.file_path}`,
							}}
							style={[styles.carouselImage, animatedStyle]}
							resizeMode="cover"
						/>
					);
				})}
			</AnimatedScrollView>
			<View style={styles.pagination}>
				{images.map((_, index) => {
					const animatedStyle = useAnimatedStyle(() => {
						const inputRange = [
							(index - 1) * SCREEN_WIDTH,
							index * SCREEN_WIDTH,
							(index + 1) * SCREEN_WIDTH,
						];
						const width = interpolate(
							scrollX.value,
							inputRange,
							[8, 16, 8],
							Extrapolation.CLAMP,
						);
						const opacity = interpolate(
							scrollX.value,
							inputRange,
							[0.5, 1, 0.5],
							Extrapolation.CLAMP,
						);
						return { width, opacity };
					});

					return (
						<Animated.View
							key={`dot-${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								index
							}`}
							style={[styles.paginationDot, animatedStyle]}
						/>
					);
				})}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	carouselContainer: {
		height: CAROUSEL_HEIGHT,
	},
	carouselImage: {
		width: SCREEN_WIDTH,
		height: CAROUSEL_HEIGHT,
	},
	pagination: {
		flexDirection: "row",
		position: "absolute",
		bottom: 20,
		alignSelf: "center",
	},
	paginationDot: {
		height: 8,
		borderRadius: 4,
		backgroundColor: "white",
		marginHorizontal: 4,
	},
});

export default MovieInfoCarrousel;
