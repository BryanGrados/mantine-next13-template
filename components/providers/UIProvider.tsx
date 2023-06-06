"use client";

import { Inter } from "next/font/google";
import { ColorScheme, ColorSchemeProvider, MantineProvider, useEmotionCache } from "@mantine/core";
import { useServerInsertedHTML } from "next/navigation";
import { CSSProperties, ReactNode, useState } from "react";
import { setCookie } from "cookies-next";

const inter: unknown = Inter({ subsets: ["latin"] });

const UIProvider = ({ children, theme }: { children: ReactNode; theme: ColorScheme }) => {
	const [colorScheme, setColorScheme] = useState<ColorScheme>(theme);

	const cache = useEmotionCache();
	cache.compat = true;

	useServerInsertedHTML(() => (
		<style
			key={cache.key}
			data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`}
			// rome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
			dangerouslySetInnerHTML={{
				__html: Object.values(cache.inserted).join(" "),
			}}
		/>
	));

	const toggleColorScheme = (value?: ColorScheme) => {
		const nextColorScheme = value || (colorScheme === "dark" ? "light" : "dark");
		setColorScheme(nextColorScheme);
		// when color scheme is updated save it to cookie
		setCookie("scheme-mode", nextColorScheme, {
			maxAge: 60 * 60 * 24 * 30,
			sameSite: "strict",
		});
	};

	return (
		<ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
			<MantineProvider
				withGlobalStyles
				theme={{
					colorScheme,
					fontFamily: inter as CSSProperties["fontFamily"],
				}}
			>
				{children}
			</MantineProvider>
		</ColorSchemeProvider>
	);
};

export default UIProvider;
