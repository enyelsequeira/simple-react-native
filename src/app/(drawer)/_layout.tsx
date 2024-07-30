import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
	type DrawerContentComponentProps,
	DrawerContentScrollView,
	DrawerItem,
} from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { useGetGenres } from "~/src/queries/get-genres";

const DrawerLayout = () => (
	<Drawer drawerContent={CustomDrawerContent}>
		<Drawer.Screen
			name="index"
			options={{
				headerTitle: "Home",
				drawerLabel: "Home",
				drawerIcon: ({ size, color }) => (
					<Ionicons name="home-outline" size={size} color={color} />
				),
			}}
		/>
	</Drawer>
);

export default DrawerLayout;

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
	const router = useRouter();
	const { data: genresData, isLoading } = useGetGenres();

	return (
		<DrawerContentScrollView {...props}>
			<DrawerItem
				label={""}
				onPress={() => router.push("/")}
				icon={() => <MaterialIcons name="live-tv" size={30} color="black" />}
				style={{
					borderStyle: "solid",
					borderWidth: 2,
				}}
			/>

			{genresData?.genres?.map((g) => {
				return (
					<DrawerItem
						key={g.id}
						label={g.name}
						onPress={() => router.push(`/${g.id}`)}
					/>
				);
			})}
		</DrawerContentScrollView>
	);
};
