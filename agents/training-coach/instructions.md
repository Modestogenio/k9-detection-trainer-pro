# K9 Training Coach Agent 🐕

Agente de IA para generar planes de entrenamiento personalizados de perros detectores.

## Requisitos

- [OpenCode](https://opencode.ai) instalado
- [Ollama](https://ollama.ai) ejecutándose
- Modelo DeepSeek V4 Flash descargado: `ollama pull deepseek-v4-flash`

## Uso

```bash
cd agents/training-coach

# Plan básico
opencode run training-coach --dog "Rocky" --breed "Pastor Belga Malinois" --level "intermedio" --odor "explosivos"

# Plan detallado con contexto
opencode run training-coach --dog "Max" --breed "Labrador" --level "avanzado" --odor "narcóticos" --age 4 --weaknesses "búsqueda en vehículos" --goal "certificación"
```

## Parámetros

| Parámetro | Descripción |
|-----------|-------------|
| `--dog` | Nombre del perro |
| `--breed` | Raza |
| `--level` | Nivel: básico, intermedio, avanzado, experto |
| `--odor` | Olor/especialidad: explosivos, narcóticos, etc. |
| `--age` | Edad en años (opcional) |
| `--weaknesses` | Debilidades detectadas (opcional) |
| `--goal` | Objetivo del plan (opcional) |

## ⚠️ Contenido Premium

Este agente es exclusivo para sponsors del proyecto.

👉 [Hazte sponsor](https://github.com/sponsors/Modestogenio) para obtener acceso.
