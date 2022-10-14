import withTM from 'next-transpile-modules';
import bundleAnalyzer from '@next/bundle-analyzer';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));

// @link https://github.com/belgattitude/nextjs-monorepo-example/blob/main/apps/nextjs-app/next.config.js

/** @type {import('./config').ServerRuntimeConfig} */
const serverRuntimeConfig = {

}

/** @type {import('./config').PublicRuntimeConfig} */
const publicRuntimeConfig = {
    mode: process.env.NODE_ENV,
    api: process.env.API,
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    serverRuntimeConfig,
    publicRuntimeConfig,

    reactStrictMode: true,

    // @link https://nextjs.org/docs/advanced-features/compiler#minification
    swcMinify: true,

    // Standalone build
    // @link https://nextjs.org/docs/advanced-features/output-file-tracing#automatically-copying-traced-files-experimental
    output: 'standalone',

    typescript: {
        ignoreBuildErrors: true,
    },

    experimental: {

        browsersListForSwc: true,
        legacyBrowsers: false,

    },
}


const { dependencies, devDependencies } = JSON.parse(readFileSync(__dirname + '/package.json', 'utf8'));
const withDependencies = Object.entries({ ...dependencies, ...devDependencies })
    .filter(([name, version]) => version === '*')
    .map(([name]) => name);

const withModules = [
    ...withDependencies,

];


const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
    openAnalyzer: false,
})

export default withBundleAnalyzer(
    (withModules.length === 0)
        ? nextConfig
        : withTM(withModules, {
            resolveSymlinks: true
        })(nextConfig)
);
