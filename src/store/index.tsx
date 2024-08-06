import { atom } from "jotai/index";

export const Categories = [
	{
		label: "Upcoming",
		value: "upcoming",
	},
	{
		label: "Popular",
		value: "popular",
	},
	{
		label: "Top Rated",
		value: "top_rated",
	},
];

export const CategoriesStateAtom = atom({
	categories: Categories,
	selectedCategory: Categories[0],
	page: 0,
});
export type Category = (typeof Categories)[number];
export const SelectedCategoryAtom = atom(
	(get) => get(CategoriesStateAtom).selectedCategory,
	(get, set, newCategory: Category) => {
		const currentState = get(CategoriesStateAtom);
		if (
			currentState.categories.some((cat) => cat.value === newCategory.value)
		) {
			set(CategoriesStateAtom, {
				...currentState,
				selectedCategory: newCategory,
				page: 0,
			});
		}
	},
);
