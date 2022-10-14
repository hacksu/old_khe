import { ColorScheme, ColorSchemeProvider, DefaultMantineColor, MantineProvider, MantineTheme, MantineThemeOverride, Tuple, useMantineTheme } from '@mantine/core';
import { getCookie, setCookie } from 'cookies-next';
import { merge } from 'lodash';
import { NextComponentType } from 'next';
import App, { AppContext, AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useMemo, useState, useEffect } from 'react';

import { createTheme, CustomColors } from '.';

export type CreateTheme = ($: { theme: MantineTheme, colorScheme: ColorScheme }) => MantineThemeOverride | void;

declare module '@mantine/core' {
    export interface MantineThemeColorsOverride {
        colors: Record<DefaultMantineColor | CustomColors, Tuple<string, 10>>;
    }
}

var dynamicColorScheme = false;
export function ThemeProvider(props: { theme: Omit<MantineThemeOverride, 'colorScheme'>, colorScheme: ColorScheme, children: any }) {
    const router = useRouter();
    const [colorScheme, setColorScheme] = useState(props.colorScheme);
    const toggleColorScheme = (value?: ColorScheme) => {
        const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
        if (!getCookie('color-scheme')) {
            requestAnimationFrame(() => {
                setColorScheme(nextColorScheme);
            });
        } else setColorScheme(nextColorScheme);
        setCookie('color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30, });
    };

    const preferredColorScheme: ColorScheme = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';
    const desiredColorScheme = useMemo<ColorScheme>(() => {
        const desired = getCookie('color-scheme');
        if (desired === 'dark') return 'dark';
        if (desired === 'light') return 'light';
        return preferredColorScheme;
    }, [preferredColorScheme]);
    if (typeof window !== 'undefined' && !dynamicColorScheme) {
        dynamicColorScheme = true;
        if (colorScheme !== desiredColorScheme) {
            toggleColorScheme(desiredColorScheme);
        }
    }

    const defaultTheme = useMantineTheme();
    const $theme = useMemo(() => merge({}, defaultTheme, props.theme), []);

    // const themes: Record<ColorScheme, MantineThemeOverride> = {
    //     light: {
    //         colors: {
    //             // background: $theme.colors.gray.reverse() as any,
    //         }
    //     },
    //     dark: {
    //         colors: {
    //             // background: $theme.colors.dark.reverse() as any,
    //         }
    //     }
    // }

    const themes: Record<ColorScheme, MantineThemeOverride> = {
        light: {},
        dark: {},
    }

    const overrides = createTheme({ theme: $theme, colorScheme, });

    const theme: MantineThemeOverride = merge({ ...props.theme }, { colorScheme, ...themes[colorScheme], ...overrides });

    return <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
            {props.children}
        </MantineProvider>
    </ColorSchemeProvider>
}

ThemeProvider.getInitialProps = ({ ctx }: AppContext) => {
    const colorScheme: ColorScheme = getCookie('color-scheme', ctx) === 'dark' ? 'dark' : 'light';
    return {
        colorScheme,
    }
}


function useMediaQuery(query: string): boolean {
    const getMatches = (query: string): boolean => {
        // Prevents SSR issues
        if (typeof window !== 'undefined') {
            return window.matchMedia(query).matches
        }
        return false
    }

    const [matches, setMatches] = useState<boolean>(getMatches(query))

    function handleChange() {
        setMatches(getMatches(query))
    }

    useEffect(() => {
        const matchMedia = window.matchMedia(query)

        // Triggered at the first client-side load and if query changes
        handleChange()

        // Listen matchMedia
        if (matchMedia.addListener) {
            matchMedia.addListener(handleChange)
        } else {
            matchMedia.addEventListener('change', handleChange)
        }

        return () => {
            if (matchMedia.removeListener) {
                matchMedia.removeListener(handleChange)
            } else {
                matchMedia.removeEventListener('change', handleChange)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query])

    return matches
}


export type MantineInitialProps = Awaited<ReturnType<typeof ThemeProvider.getInitialProps>>;
export function withMantine<T extends NextComponentType<any, any, any>>(app: T) {
    const nestedGetInitialProps = app.getInitialProps || (() => ({}));
    // @ts-ignore
    const func: NextComponentType<any, any, any> = function(...args: Parameters<T>) {
        if (typeof app !== 'function') throw new Error('Not an App');
        // @ts-ignore
        return app(...args);
    }
    func.getInitialProps = function(...args) {
        return {
            ...nestedGetInitialProps(...args),
            ...ThemeProvider.getInitialProps(...args),
        }
    }
    return func;
}