import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TamaguiProvider } from "tamagui";

import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import config from "../../tamagui.config";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	useReactQueryDevTools(queryClient);

	const [loaded] = useFonts({
		Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
		InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) return null;

	return (
		<QueryClientProvider client={queryClient}>
			<TamaguiProvider config={config}>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<Stack>
						<Stack.Screen name="(drawer)" options={{ headerShown: false }} />
					</Stack>
					{/*<Drawer drawerContent={CustomDrawerContent}>*/}
					{/*	<Drawer.Screen*/}
					{/*		name="index"*/}
					{/*		options={{*/}
					{/*			title: "Home",*/}
					{/*			drawerLabel: "Home",*/}
					{/*		}}*/}
					{/*	/>*/}
					{/*</Drawer>*/}
				</GestureHandlerRootView>
			</TamaguiProvider>
		</QueryClientProvider>
	);
}
