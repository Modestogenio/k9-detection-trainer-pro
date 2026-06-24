# K9 Detection Trainer Pro 🐕

**Versión profesional** de la app de tracking para entrenamiento de perros detectores.

Construida con **Svelte 5 + Chart.js + Dexie.js + PWA + jsPDF**.

---

## ✨ Características Pro

| Feature | Free | Pro |
|---------|------|-----|
| Registro de perros | ✅ | ✅ |
| Registro de sesiones | ✅ | ✅ |
| Estadísticas básicas | ✅ | ✅ |
| **Gráficos Chart.js** | ❌ | ✅ |
| **Exportación PDF** | ❌ | ✅ |
| **PWA (instalar en celular)** | ❌ | ✅ |
| **Base de datos IndexedDB** | ❌ | ✅ |
| **Agente AI Training Coach** | ❌ | ✅ (Sponsor) |
| **Soporte prioritario** | ❌ | ✅ |

## 🚀 Demo

👉 **[k9-pro.vercel.app](https://Modestogenio.github.io/k9-detection-trainer-pro)** 

## 🧠 Stack Tecnológico

| Tecnología | Versión |
|------------|---------|
| Svelte 5 | ^5.56 |
| Vite | ^8.1 |
| Chart.js | ^4.5 |
| Dexie.js (IndexedDB) | ^4.4 |
| jsPDF | ^4.2 |
| html2canvas | ^1.4 |
| PWA (vite-plugin-pwa) | ^1.3 |

## 💰 Apoyar el Desarrollo

Este proyecto se mantiene gracias a donaciones y sponsors:

| Método | Link |
|--------|------|
| **PayPal** (donación única) | [![PayPal](https://img.shields.io/badge/Donar-PayPal-00457C?logo=paypal)](https://paypal.me/marcelocorales) |
| **GitHub Sponsors** (mensual) | [![Sponsors](https://img.shields.io/badge/Sponsor-GitHub-ea4aaa?logo=github)](https://github.com/sponsors/Modestogenio) |

### Planes de Sponsor

| Plan | Precio | Beneficios |
|------|--------|------------|
| 🥉 Básico | $3/mes | App Pro funcional + agradecimiento |
| 🥈 Pro | $10/mes | Todo + **Agente AI Training Coach** + reportes PDF |
| 🥇 Enterprise | $25/mes | Todo + agentes personalizados + consultoría |

## 📦 Instalación

```bash
git clone https://github.com/Modestogenio/k9-detection-trainer-pro.git
cd k9-detection-trainer-pro
npm install
npm run dev
```

## 🏗️ Build Producción

```bash
npm run build
npm run preview
```

## 🤖 Agente AI (Premium)

El agente `training-coach` genera planes personalizados usando **OpenCode + Ollama + DeepSeek V4 Flash**.

```bash
cd agents/training-coach
opencode run training-coach --dog "Rocky" --level "intermedio" --odor "explosivos"
```

*Acceso exclusivo para sponsors Pro y Enterprise.*

## 📄 Licencia

MIT - Ver [LICENSE](LICENSE)

---

<p align="center">
  <b>¿Te gusta K9 Detection Trainer Pro?</b><br>
  <a href="https://paypal.me/marcelocorales">☕ Invítame un café</a> |
  <a href="https://github.com/sponsors/Modestogenio">⭐ Hazte sponsor</a>
</p>
