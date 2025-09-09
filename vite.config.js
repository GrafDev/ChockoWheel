import { defineConfig, loadEnv } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { VERSION } from './version.js'

export default defineConfig(({ mode }) => {
    const publicEnv = loadEnv('public', process.cwd(), '')
    const privateEnv = loadEnv('private', process.cwd(), '')
    
    let region = 'eu'
    let isPlayable = false
    
    if (mode && mode !== 'development') {
        const parts = mode.split('-')
        if (parts[0] === 'playable') {
            isPlayable = true
            region = 'eu' // Only EU region
        }
    }
    
    const currentSettings = {
        VITE_REGION: region,
        VITE_IS_PLAYABLE: isPlayable
    }
    
    const mergedEnv = { ...publicEnv, ...privateEnv, ...currentSettings }
    
    return {
        base: './',
        server: {
            open: true,
            port: 5174
        },
        resolve: {
            alias: {
                '@': '/src',
                '@assets': '/src/assets',
                '@images': '/src/assets/images',
                '@js': '/src/assets/js',
                '@css': '/src/assets/css'
            }
        },
        plugins: isPlayable ? [viteSingleFile()] : [],
        build: {
            outDir: isPlayable ? 'dist/playable-eu' : 'dist/chocko-wheel-eu',
            assetsDir: isPlayable ? '' : 'assets',
            cssCodeSplit: !isPlayable,
            cssMinify: true,
            rollupOptions: {
                input: {
                    main: '/index.html'
                },
                output: isPlayable ? {
                    manualChunks: undefined,
                    inlineDynamicImports: true
                } : {
                    assetFileNames: (assetInfo) => {
                        let extType = assetInfo.name.split('.')[1];
                        if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                            return `assets/images/[name]-${VERSION}-[hash][extname]`;
                        }
                        return `assets/${extType}/[name]-${VERSION}-[hash][extname]`;
                    },
                    chunkFileNames: `assets/js/[name]-${VERSION}-[hash].js`,
                    entryFileNames: `assets/js/[name]-${VERSION}-[hash].js`
                }
            }
        },
        css: {
            devSourcemap: true
        },
        define: {
            __APP_VERSION__: JSON.stringify(VERSION),
            ...Object.keys(mergedEnv).reduce((prev, key) => {
                if (key.startsWith('VITE_')) {
                    prev[`import.meta.env.${key}`] = JSON.stringify(mergedEnv[key])
                }
                return prev
            }, {})
        }
    }
})