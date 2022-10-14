import { NotificationsProvider } from '@mantine/notifications';
import { MantineThemeOverride } from '@mantine/core';
import { AppContext, AppProps } from 'next/app';
import { MantineInitialProps, ThemeProvider, withMantine } from '../theme';
import { trpc } from '@khe~/api/trpc';


export function App(props) {
    const { Component, pageProps } = props;

    const theme: MantineThemeOverride = {
        
    }

    return <ThemeProvider theme={theme} colorScheme={props.colorScheme}>
        <NotificationsProvider>
            <Component {...pageProps} />
        </NotificationsProvider>
    </ThemeProvider>

}

export default withMantine(
    trpc.withTRPC(App)
);





