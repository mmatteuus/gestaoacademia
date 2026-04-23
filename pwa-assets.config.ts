import {
  defineConfig,
  minimal2023Preset as preset,
  createAppleSplashScreens,
  combinePresetAndAppleSplashScreens,
} from '@vite-pwa/assets-generator/config'

const appleSplashScreens = createAppleSplashScreens(
  {
    padding: 0.3,
    resizeOptions: { background: '#0a0a0a', fit: 'contain' },
    darkResizeOptions: { background: '#0a0a0a', fit: 'contain' },
    linkMediaOptions: {
      log: false,
      addMediaScreen: true,
      basePath: '/',
      xhtml: true,
    },
    png: { compressionLevel: 9, quality: 90 },
  },
  // Resoluções iPhone/iPad mais comuns — cobre maioria dos devices ativos.
  ['iPad Mini', 'iPad Air', 'iPad Pro 11', 'iPad Pro 12.9', 'iPhone 15 Pro Max', 'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14', 'iPhone 13 mini', 'iPhone SE', 'iPhone 8'],
)

export default defineConfig({
  headLinkOptions: {
    preset: '2023',
  },
  preset: combinePresetAndAppleSplashScreens(preset, appleSplashScreens),
  images: ['public/icons/icon.svg'],
})
