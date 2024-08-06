import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
	type DrawerContentComponentProps,
	DrawerContentScrollView,
	DrawerItem,
} from "@react-navigation/drawer";
import { useNavigation, usePathname, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useAtom } from "jotai";
import React from "react";
import { useGetGenres } from "~/src/queries/get-genres";
import {
	Categories,
	CategoriesStateAtom,
	SelectedCategoryAtom,
} from "~/src/store";

const DrawerLayout = () => {
	const [{ selectedCategory }] = useAtom(CategoriesStateAtom);

	return (
		<Drawer drawerContent={CustomDrawerContent}>
			<Drawer.Screen
				name="index"
				options={{
					headerTitle: selectedCategory.label,
					drawerLabel: "Home",
					drawerIcon: ({ size, color }) => (
						<Ionicons name="home-outline" size={size} color={color} />
					),
				}}
			/>
		</Drawer>
	);
};

export default DrawerLayout;
const CustomDrawerContent = (props: DrawerContentComponentProps) => {
	const router = useRouter();
	const navigation = useNavigation();
	const pathname = usePathname();
	const { data: genresData, isLoading } = useGetGenres();
	const [{ categories }, setCategoriesState] = useAtom(CategoriesStateAtom);
	const [selectedCategory, setSelectedCategory] = useAtom(SelectedCategoryAtom);
	const isHomeActive = pathname === "/";

	const getIsActive = (categoryValue: string) => {
		return isHomeActive && categoryValue === selectedCategory.value;
	};

	const getIsGenreActive = (genreId: number) => {
		return pathname === `/${genreId}`;
	};

	const resetToInitialState = () => {
		setCategoriesState({
			categories: Categories,
			selectedCategory: Categories[0],
			page: 0,
		});
		setSelectedCategory(Categories[0]);
		router.push("/");
	};

	return (
		<DrawerContentScrollView {...props}>
			<DrawerItem
				label={"Native Movies"}
				onPress={resetToInitialState}
				icon={() => <MaterialIcons name="live-tv" size={30} color="black" />}
			/>

			{categories?.map((category) => {
				const isActive = getIsActive(category.value);
				return (
					<DrawerItem
						key={category.value}
						label={category.label}
						onPress={() => {
							setSelectedCategory(category);
							router.push("/");
						}}
						labelStyle={{
							fontWeight: isActive ? "bold" : "normal",
							color: isActive ? "blue" : "black",
						}}
					/>
				);
			})}
			{genresData?.genres?.map((genre) => {
				const isActive = getIsGenreActive(genre.id);
				return (
					<DrawerItem
						key={genre.id}
						label={genre.name}
						onPress={() => router.push(`/${genre.id}`)}
						labelStyle={{
							fontWeight: isActive ? "bold" : "normal",
							color: isActive ? "blue" : "black",
						}}
					/>
				);
			})}
		</DrawerContentScrollView>
	);
};
