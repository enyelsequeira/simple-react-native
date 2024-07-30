import { Stack } from "expo-router";
import { ScreenContent } from "~/src/components/ScreenContent";
import { Container } from "~/tamagui.config";

export default function Home() {
	return (
		<>
			<Stack.Screen options={{ title: "Home" }} />
			<Container>
				<ScreenContent path="app/(drawer)/index.tsx" title="Home" />
			</Container>
		</>
	);
}
