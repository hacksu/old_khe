import { ColorScheme, DefaultMantineColor, MantineTheme, MantineThemeOverride, Tuple, useMantineTheme } from '@mantine/core';
import { CreateTheme } from '.';
import { createDarkTheme } from './themes/dark';
import { createLightTheme } from './themes/light';
export * from './provider';


/** Define custom color types in the theme */
export type CustomColors = 
    | 'background';


export const createTheme: CreateTheme = ($) => {
    const { theme, colorScheme } = $;

    /** Define Theme overrides
     * @see {@link https://mantine.dev/theming/theme-object/}
     */
    return {
        ...createLightTheme($),
        ...createDarkTheme($),

    }
}


