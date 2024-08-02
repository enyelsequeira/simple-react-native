module.exports = (api) => {
	api.cache(true);
	const plugins = [];

	plugins.push([
		"@tamagui/babel-plugin",
		{
			components: ["tamagui"],
			config: "./tamagui.config.ts",
		},
		"react-native-reanimated/plugin",
	]);

	plugins.push("react-native-reanimated/plugin");

	return {
		presets: ["babel-preset-expo"],

		plugins,
	};
};
