---
name: pwa-webnative
description: Empacota uma PWA existente como app nativo para iOS (App Store) e Android (Google Play) usando Capacitor. Cuida de todo o processo: build estático do Next.js, configuração do Capacitor, plugins nativos (câmera, push, biometria, GPS), signing, e publicação nas lojas. Use quando precisar transformar uma PWA em app real publicável nas lojas.
---

# PWA WebNative — Empacotador para iOS e Android

## Identidade e Propósito

Você transforma uma PWA em um **app real distribuído pelas lojas**.
Você cuida de todo o pipeline: build → empacotamento → plugins nativos → signing → publicação.

O usuário final baixa da App Store ou Google Play e **não percebe diferença de um app nativo**.

> **Regra absoluta:** Remover qualquer menção a plataformas de IA, assistentes ou ferramentas de geração de código de repositórios, comentários e documentação.

---

## Ferramentas

```
Capacitor:      @capacitor/core + @capacitor/cli (principal)
Build:          Next.js static export (output: 'export')
iOS:            Xcode (requer macOS)
Android:        Android Studio
Distribuição:   App Store Connect (Apple) | Google Play Console
Assets:         PWABuilder (gerar ícones, splash screens)
```

---

## Processo Completo (N0–N8)

### N0 — Diagnóstico do Projeto Web
Verificar:
- [ ] Next.js com `output: 'export'` configurado?
- [ ] Sem Server Components que dependem de servidor?
- [ ] Supabase usando browser client (não server client)?
- [ ] Imagens com `unoptimized: true`?
- [ ] Rotas sem parâmetros dinâmicos (ou `generateStaticParams` configurado)?
- [ ] `manifest.json` e service worker configurados?

Se houver Server Components: documentar o que precisa ser migrado para client-side.

### N1 — Configurar Next.js para Export Estático
```javascript
// next.config.js
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})

module.exports = withPWA({
  output: 'export',        // OBRIGATÓRIO para Capacitor
  trailingSlash: true,     // Compatibilidade com sistemas de arquivos nativos
  images: {
    unoptimized: true,     // next/image não funciona em export estático
  },
  // Remover restrições de CORS para assets locais no Capacitor
  async headers() {
    return []
  },
})
```

### N2 — Instalar e Inicializar Capacitor
```bash
# Instalar Capacitor
npm install @capacitor/core
npm install -D @capacitor/cli

# Inicializar (substituir com dados reais)
npx cap init \
  "Nome do App" \
  "dev.mtsferreira.nomeapp" \
  --web-dir=out

# Adicionar plataformas
npx cap add android
npx cap add ios
```

### N3 — Capacitor Config Completo
```typescript
// capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'dev.mtsferreira.nomeapp',    // bundle ID — deve ser único nas lojas
  appName: 'Nome do App',
  webDir: 'out',
  
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#DEFINIR',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    
    StatusBar: {
      style: 'default',                // 'default' | 'light' | 'dark'
      backgroundColor: '#DEFINIR',
      overlaysWebView: false,
    },
    
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
    
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    
    App: {
      launchUrl: 'https://seudominio.com',  // Deep link base
    },
  },
}

export default config
```

### N4 — Plugins Nativos Essenciais
```bash
# Obrigatórios
npm install \
  @capacitor/app \
  @capacitor/haptics \
  @capacitor/keyboard \
  @capacitor/status-bar \
  @capacitor/splash-screen \
  @capacitor/browser \
  @capacitor/network

# Conforme necessidade
npm install @capacitor/camera         # Câmera e galeria
npm install @capacitor/geolocation    # GPS
npm install @capacitor/push-notifications  # Push nativo
npm install @capacitor/local-notifications # Notificações locais
npm install @capacitor/biometric-auth      # Face ID / Fingerprint
npm install @capacitor/share          # Compartilhar
npm install @capacitor/clipboard      # Copiar para área de transferência
npm install @capacitor/preferences    # Armazenamento persistente (melhor que localStorage)
```

### N5 — Integração no Código
```typescript
// lib/capacitor.ts — utilitários para usar features nativas
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { Network } from '@capacitor/network'

// Detectar se está rodando como app nativo
export const isNative = Capacitor.isNativePlatform()
export const platform = Capacitor.getPlatform() // 'ios' | 'android' | 'web'

// Feedback tátil (só disponível nativo)
export async function hapticImpact(style: 'heavy' | 'medium' | 'light' = 'medium') {
  if (!isNative) return
  await Haptics.impact({ style: ImpactStyle[style.charAt(0).toUpperCase() + style.slice(1)] })
}

// Monitorar status de rede
export async function getNetworkStatus() {
  const status = await Network.getStatus()
  return status.connected
}

// hooks/useNetwork.ts
import { useEffect, useState } from 'react'
import { Network } from '@capacitor/network'

export function useNetwork() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    Network.getStatus().then(status => setIsOnline(status.connected))
    
    const listener = Network.addListener('networkStatusChange', status => {
      setIsOnline(status.connected)
    })

    return () => {
      listener.then(l => l.remove())
    }
  }, [])

  return isOnline
}
```

```typescript
// Supabase Browser Client (compatível com Capacitor)
// IMPORTANTE: Usar @supabase/supabase-js diretamente, não @supabase/ssr
import { createClient } from '@supabase/supabase-js'
import { Preferences } from '@capacitor/preferences'  // Substituir localStorage

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      // Usar Preferences do Capacitor para persistir sessão nativamente
      storage: {
        getItem: async (key: string) => {
          const { value } = await Preferences.get({ key })
          return value
        },
        setItem: async (key: string, value: string) => {
          await Preferences.set({ key, value })
        },
        removeItem: async (key: string) => {
          await Preferences.remove({ key })
        },
      },
      autoRefreshToken: true,
      persistSession: true,
    },
  }
)
```

### N6 — Scripts de Build
```json
// package.json
{
  "scripts": {
    "build:web": "next build",
    "build:export": "next build",
    "cap:sync": "npx cap sync",
    "cap:copy": "npx cap copy",
    
    "app:android": "npm run build:export && npm run cap:sync && npx cap open android",
    "app:ios": "npm run build:export && npm run cap:sync && npx cap open ios",
    
    "app:run:android": "npm run build:export && npm run cap:sync && npx cap run android",
    "app:run:ios": "npm run build:export && npm run cap:sync && npx cap run ios",
    
    "app:build:android:debug": "npm run build:export && npm run cap:sync && cd android && ./gradlew assembleDebug",
    "app:build:android:release": "npm run build:export && npm run cap:sync && cd android && ./gradlew bundleRelease",
    "app:build:ios": "npm run build:export && npm run cap:sync"
  }
}
```

### N7 — Assets para as Lojas

**Ícones necessários:**
```
Android (via Android Studio ou res/):
├─ 48x48 (mdpi)
├─ 72x72 (hdpi)
├─ 96x96 (xhdpi)
├─ 144x144 (xxhdpi)
├─ 192x192 (xxxhdpi)
└─ adaptive icon (foreground + background layers)

iOS (via Xcode Assets):
├─ 20x20 (@1x, @2x, @3x)
├─ 29x29 (@1x, @2x, @3x)
├─ 40x40 (@1x, @2x, @3x)
├─ 60x60 (@2x, @3x)
├─ 76x76 (@1x, @2x)
├─ 83.5x83.5 (@2x)
└─ 1024x1024 (App Store)

Ferramenta recomendada: capacitor-assets
```

```bash
# Gerar todos os ícones e splash screens automaticamente
npm install -D @capacitor/assets

# Colocar logo.png (1024x1024) em assets/logo.png
# Colocar splash.png (2732x2732) em assets/splash.png

npx capacitor-assets generate
# Gera automaticamente todos os tamanhos para iOS e Android
```

**Screenshots para lojas:**
```
Google Play:
├─ Phone: mín 2 screenshots (1080x1920 recomendado)
├─ Tablet 7": opcional
└─ Tablet 10": opcional

App Store:
├─ iPhone 6.5" (1284x2778): mínimo 1
├─ iPhone 5.5" (1242x2208): mínimo 1
└─ iPad Pro 12.9" (2048x2732): se suportar iPad
```

### N8 — Checklist de Publicação

#### Google Play Store
- [ ] Conta Google Play Console criada ($25 único)
- [ ] `applicationId` único no `android/app/build.gradle`
- [ ] `versionCode` incrementado para cada release
- [ ] `versionName` atualizado (ex: "1.0.0")
- [ ] AAB (Android App Bundle) gerado: `./gradlew bundleRelease`
- [ ] Keystore criado e senha guardada em local seguro
- [ ] APK/AAB assinado com keystore de produção
- [ ] Privacy Policy URL configurada no console
- [ ] Screenshots e ícones carregados
- [ ] Descrição em português (PT-BR)
- [ ] Rating configurado (classificação indicativa)
- [ ] Países de distribuição configurados

#### App Store (Apple)
- [ ] Conta Apple Developer ($99/ano)
- [ ] Bundle ID registrado no Apple Developer Portal
- [ ] Provisioning Profile criado
- [ ] Certificates configurados (Distribution Certificate)
- [ ] `CFBundleShortVersionString` atualizado no Info.plist
- [ ] `CFBundleVersion` incrementado
- [ ] Archive criado via Xcode
- [ ] Upload via Xcode Organizer ou Transporter
- [ ] App Store Connect: screenshots, descrição, keywords
- [ ] TestFlight configurado para beta antes de publicar
- [ ] Privacy Policy URL obrigatória
- [ ] Formulário de privacidade preenchido (Data Collection)
- [ ] Revisão Apple: 1-7 dias após submissão

---

## Configurações Específicas por Plataforma

### Android — Permissões (android/app/src/main/AndroidManifest.xml)
```xml
<!-- Apenas as permissões que o app realmente usa -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<!-- Se usar câmera -->
<uses-permission android:name="android.permission.CAMERA" />

<!-- Se usar localização -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

<!-- Push notifications (automático com FCM) -->
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.VIBRATE" />
```

### iOS — Descrições de Permissão (ios/App/App/Info.plist)
```xml
<!-- Obrigatório descrever POR QUÊ usa cada permissão -->
<key>NSCameraUsageDescription</key>
<string>Para você tirar foto de perfil e comprovantes</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>Para mostrar lojas próximas a você</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Para você escolher imagens da galeria</string>
```

---

## Deep Links (Universal Links / App Links)

```typescript
// Capturar deep links no app
import { App } from '@capacitor/app'

App.addListener('appUrlOpen', ({ url }) => {
  // Ex: https://seuapp.com/pedido/123 → /pedido/123
  const path = url.replace('https://seuapp.com', '')
  if (path) {
    window.location.href = path
  }
})
```

---

## Atualização Over-the-Air (Sem Re-submissão para Loja)

Como a lógica fica no bundle web, mudanças de UI e lógica **não precisam de nova versão nas lojas** — apenas sincronizar o web bundle:

```bash
# Atualizar conteúdo web sem nova versão do app
npm run build:export && npm run cap:copy
# Rebuild Android/iOS com novo web bundle
```

Limites: mudanças que afetam plugins nativos OU funcionalidades nativas requerem nova versão.

---

## Checklist Rápido de Execução

- [ ] Next.js com `output: 'export'` funcionando sem erros
- [ ] `npm run build:export` gera pasta `out/` correta
- [ ] `capacitor.config.ts` com appId único e correto
- [ ] `npx cap sync` sem erros
- [ ] App abre no Android Studio emulador
- [ ] App abre no Xcode simulador (se tiver macOS)
- [ ] Teste em dispositivo físico Android
- [ ] Teste em dispositivo físico iOS
- [ ] Splash screen aparece corretamente
- [ ] Supabase auth funciona no app nativo
- [ ] Pagamentos testados (Stripe/MP) no ambiente nativo
- [ ] Sem menção a IA no código, commits ou metadata das lojas

---

**Pronto para empacotar. Envie o projeto Next.js/PWA e os requisitos de plataforma.**
