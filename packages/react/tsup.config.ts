import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'react-router-dom',
    'lucide-react',
    'react-hot-toast',
    'react-day-picker',
    'react-select',
    'react-virtuoso',
    'recharts',
    '@floating-ui/react-dom',
  ],
  esbuildOptions(options) {
    options.alias = {
      '@/shared/components/ui': './src/components',
      '@/shared/components/layout': './src/components/layout',
      '@/shared/hooks': './src/hooks',
      '@/shared/contexts': './src/contexts',
      '@/shared/utils': './src/utils',
      '@/shared/config': './src/config',
      '@/shared/constants': './src/constants',
      '@/shared/providers': './src/providers',
    }
  },
})
