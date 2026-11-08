# Plataforma Web Interactiva de Estudio — Template Universitario de Diapositivas

Plantilla y motor web interactivo en **React + TypeScript + Vite** diseñado para transformar diapositivas de clase estáticas (PDFs, PPTs) y apuntes universitarios en una plataforma de estudio, presentación y práctica con visualizadores paso a paso, fórmulas LaTeX, bloques de código interactivos y pizarrón de ejercicios.

El proyecto viene precargado con una materia modelo viva y didáctica: **Barismo y Café de Especialidad** (Espressos, Filtrados con V60, Chemex, Origami, Prensa Francesa, Aeropress y Refractometría), sirviendo de ejemplo concreto de cómo adaptar el sistema a cualquier disciplina académica.

---

## 1. Arquitectura: Core Universal (`src/core/`) vs. Materia (`src/course/`)

El repositorio está estrictamente desacoplado en dos capas para que el motor principal sea **100% agnóstico a la materia** y pueda utilizarse en cualquier cátedra universitaria (Ingeniería, Ciencias Exactas, Humanidades, Medicina, etc.):

```text
clases-slides-templates/
├── teoria/                      # Archivos JSON base extraídos de apuntes/PDFs teóricos
│   ├── teoria_01_espressos.json # Módulo 1: Fundamentos a 9 bares, crema y clásicos
│   └── teoria_02_filtrados.json # Módulo 2: V60, Chemex, Origami, Prensa Francesa, Aeropress
├── ejercicios/                  # Archivos JSON base con guías prácticas y parciales
│   ├── ejercicios_manifest.json # Índice modular de ejercicios
│   └── ejercicios_barismo.json  # Casos de calibración, TDS y árboles de decisión
├── src/
│   ├── core/                    # MOTOR UNIVERSAL REUTILIZABLE (CON TESTS AUTOMATIZADOS)
│   │   ├── domain/              # Contratos base, procesador de JSONs (teoría/ejercicios),
│   │   │                        # armador de diapositivas, buscador global, temas y storage
│   │   └── ui/                  # Barra lateral con temas/subtemas, reproductor de slides,
│   │                            # bloques universales (texto, listas, LaTeX, tablas, callouts),
│   │                            # buscador global y espacio de práctica con pizarrón
│   ├── course/                  # CONTENIDO Y EXTENSIONES DE LA MATERIA ACTUAL
│   │   ├── data/                # Ingesta de JSONs, registro de módulos, subtemas y ejercicios
│   │   ├── components/          # Bloques específicos (IDE de código, anotaciones, recursos visuales)
│   │   ├── visualizers/         # Simuladores paso a paso (V60 Extraction Simulator con useVisualizerPlayback)
│   │   │   └── shared/          # Hook useVisualizerPlayback y subcards de métricas reutilizables
│   │   └── domain/              # Lógica de dominio específica (tokenizador de código, evaluadores)
│   ├── App.tsx                  # Coordinador principal que inyecta los datos de la materia en el Core
│   └── main.tsx                 # Entrada y montaje de la aplicación React
└── software_design_standards_for_agents.md # Estándar de diseño ejecutable para agentes de IA
```

### Invariantes Arquitectónicos Clave:
1. **Aislamiento Total del Core:** `src/core/` posee **cero imports o referencias** a `src/course/`.
2. **Extensibilidad Híbrida por Lookup Table:** `src/core/ui` incluye componentes por defecto para cualquier asignatura académica y recibe un registro tipado (`Record<BlockKind, Component>`) desde `src/course/components/courseBlockRegistry.tsx` para enchufar bloques propios de la materia.

---

## 2. Flujo de Trabajo para Cargar Teoría y Práctica (2 Fases)

Cada materia tiene particularidades pedagógicas. La carga de contenido sigue un flujo ordenado en **dos fases**:

```
           [Apuntes / PDFs de la Cátedra]
                         │
                         ▼ (Prompt Gemini / LLM)
          ┌───────────────────────────────┐
          │  Fase 1: Extracción a JSON   │
          │  - teoria/teoria_<n>.json     │
          │  - ejercicios/ejercicios.json │
          └──────────────┬────────────────┘
                         │ (Lectura automática por jsonCourseProcessor)
                         ▼
          ┌───────────────────────────────┐
          │  Fase 2: Curaduría en Course  │
          │  - src/course/data/           │
          │  - src/course/visualizers/    │
          └───────────────────────────────┘
```

### Fase 1: Extracción Base desde PDFs/Apuntes a `teoria/` y `ejercicios/`
1. A partir de los PDFs o diapositivas originales de la cátedra, se utilizan los **Prompts de Extracción con Gemini** (Sección 5) para obtener archivos JSON estructurados.
2. Los archivos generados se guardan en las carpetas raíz:
   * `teoria/teoria_<numero>_<slug>.json`
   * `ejercicios/ejercicios_<tema>.json`
3. El procesador del **Core** (`src/core/domain/jsonCourseProcessor.ts`) lee esos archivos JSON y construye automáticamente los módulos, subtemas, diapositivas y banco de ejercicios sin necesidad de codificar componentes a mano.

### Fase 2: Curaduría y Refinamiento en `src/course/`
Una vez que la base JSON ya renderiza en pantalla:
* Se refinan diapositivas con anotaciones de código o dobles subtítulos en `src/course/data/`.
* Se crean o enlazan simuladores interactivos paso a paso en `src/course/visualizers/` (como el simulador de extracción V60 con balanza y cronómetro digital).
* Se configuran los filtros y categorías en `src/course/data/examExercisesData.ts` y `src/App.tsx`.

---

## 3. Esquemas JSON Esperados (`teoria/` y `ejercicios/`)

### 3.1 Esquema de Teoría (`teoria/teoria_<n>_<slug>.json`)

```json
{
  "modulo": "01_nombre_modulo",
  "titulo_general": "Nombre de la Materia - Título del Módulo",
  "institucion": "Nombre de la Universidad / Facultad",
  "catedra": "Nombre de la Cátedra",
  "profesor": "Nombre del Profesor o Equipo Docente",
  "descripcion": "Resumen general de los conceptos abordados en esta unidad.",
  "secciones": [
    {
      "id": "identificador_seccion",
      "tipo": "teoria_formal",
      "titulo": "Título de la Sección Principal",
      "subtemas": [
        {
          "id": "identificador_subtema",
          "titulo": "Título del Concepto o Subtema",
          "teoria": "- **Punto clave 1**: Explicación con fórmulas LaTeX inline como $EY = \\frac{TDS \\times M_{\\text{taza}}}{D_{\\text{seco}}}$.\n- **Punto clave 2**: Segunda viñeta conceptual explicativa.",
          "animaciones": null,
          "pseudocodigo": "algoritmo Calibrar(dosis : Real) -> Real\n    devolver dosis * 2",
          "codigo": {
            "lenguaje": "java",
            "codigo_fuente": "public static double calibrar(double dosis) {\n    return dosis * 2;\n}",
            "correcciones_realizadas": "Opcional: erratas corregidas del apunte original."
          },
          "analisis_complejidad": {
            "temporal": "O(1)",
            "espacial": "O(1)",
            "desglose_asintotico": [
              {
                "linea": "Cálculo de ratio 1:2",
                "costo": "O(1)"
              }
            ],
            "teorema_aplicado": "Ley de Darcy para lechos porosos",
            "observaciones": "Justificación del tiempo y flujo de extracción."
          }
        }
      ]
    }
  ]
}
```

> [!NOTE]
> Para materias teóricas que no requieran código, los campos `pseudocodigo`, `codigo` y `analisis_complejidad` pueden colocarse en `null`. El procesador del Core se adapta dinámicamente y renderizará diapositivas conceptuales puras.

### 3.2 Esquema de Ejercicios (`ejercicios/ejercicios_<tema>.json`)

```json
{
  "modulo": "identificador_tema",
  "titulo": "Banco de Ejercicios: Nombre del Tema",
  "descripcion": "Colección de problemas prácticos, consignas de examen y autoevaluación.",
  "total_ejercicios": 1,
  "fecha_actualizacion": "2026-11-08",
  "ejercicios": [
    {
      "id_tema": 1,
      "id_global": 1,
      "tema": "identificador_tema",
      "titulo": "Título descriptivo del ejercicio",
      "enunciado": "Texto completo e íntegro del enunciado, incluyendo sub-ítems a), b), c) y fórmulas en LaTeX.",
      "recurso_visual": {
        "tipo": "mermaid",
        "formato": "mermaid",
        "codigo": "graph TD\n    A[Inicio] --> B[Proceso]\n    B --> C[Fin]"
      },
      "fuente_original": "Guía Práctica N° 1 / Parcial 2026",
      "es_ejercicio_propuesto_diapositivas": true,
      "resolucion_propuesta": [
        {
          "fuente_propuesta": "Módulo 01 - Diapositiva 12",
          "clasificacion": "identificador_tema",
          "complejidad_esperada": "1:2 \\text{ en } 28\\text{ s}",
          "estrategia_sugerida": "Explicación clara del procedimiento e invariantes de resolución."
        }
      ]
    }
  ]
}
```

> [!TIP]
> El campo `recurso_visual` admite cuatro tipos nativos:
> - `"tipo": "mermaid"`: Diagramas de flujo, grafos, secuencias o árboles de decisión.
> - `"tipo": "markdown_tabla"`: Tablas de datos comparativas en Markdown.
> - `"tipo": "latex"`: Fórmulas matemáticas destacadas en bloque.
> - `"tipo": "svg"`: Gráficos vectoriales SVG directos.
> Si el ejercicio no requiere recurso visual, indicar `null`.

---

## 4. Estrategia de Ejecución en Múltiples Sesiones con Agentes (Antigravity / Gemini)

La digitalización completa de una cátedra extensa genera miles de líneas estructuradas. **Intentar procesar una materia completa en un solo mensaje satura la ventana de contexto y los límites de respuesta**, provocando truncamientos y pérdida de precisión.

Por eso, el trabajo debe planificarse y ejecutarse en **sesiones acotadas e incrementales**.

### 4.1 Recomendación Clave: Usar "Tarea" (Task) en vez de "Chat"
- **No utilices sesiones de Chat tradicionales** para la carga masiva o refactorización. En el chat, las respuestas largas se truncan y no se persisten directamente en el disco.
- **Creá una Tarea (Task)**: En modo tarea, el agente dispone de acceso autónomo a herramientas de lectura/escritura (`read_file`, `write_file`, `edit_file`), ejecuta validaciones automáticas (`npm test`, `npm run build`), escribe directamente en disco y mantiene un registro de progreso persistente.

### 4.2 Instrucciones para Iniciar el Plan de Trabajo
Antes de extraer datos o implementar código, iniciá una primera tarea con el siguiente prompt para que el agente elabore la hoja de ruta en `EXTRACTION_PLAN.md`:

```markdown
Actuá como arquitecto de software y docente universitario. Necesito digitalizar el contenido completo de la materia [Nombre de la Materia] en esta plataforma web.
Examiná la arquitectura en `README.md`, los templates en `teoria/` y `ejercicios/`, y las reglas de diseño en `software_design_standards_for_agents.md`.

Creá un archivo `EXTRACTION_PLAN.md` estructurado en sesiones independientes y auto-contenidas (máximo 1 o 2 unidades por sesión):
1. Para cada sesión, definí:
   - Fuentes de entrada exactas (apuntes, PDFs, guías de ejercicios).
   - Archivos JSON de salida esperados en `teoria/` y `ejercicios/`.
   - Componentes o visualizadores requeridos en `src/course/`.
   - Criterios de aceptación verificables (compilación, renderizado, tests).
2. Dejá para la última sesión una fase de auditoría final y depuración exhaustiva que valide `npm test`, `npm run build` y el cumplimiento del estándar de diseño.
No implementes código aún; únicamente redactá el plan detallado.
```

### 4.3 Prompts para Cada Sesión de Trabajo

#### Prompt para Sesión de Extracción (Fase 1: JSON Base)
```markdown
Leé `EXTRACTION_PLAN.md` y `software_design_standards_for_agents.md`.
Vamos a ejecutar la Sesión X: [Nombre del Módulo o Tema].

Instrucciones:
1. Extraé el contenido teórico de los apuntes adjuntos y creá `teoria/teoria_<n>_<slug>.json` respetando el esquema oficial sin omitir teoremas ni demostraciones.
2. Extraé todos los ejercicios y problemas de examen relacionados y creá `ejercicios/ejercicios_<tema>.json`.
3. Verificá que el procesador universal (`src/core/domain/jsonCourseProcessor.ts`) cargue ambos archivos sin arrojar errores.
4. Actualizá el estado de la Sesión X en `EXTRACTION_PLAN.md` como completada.
```

#### Prompt para Sesión de Curaduría y Visualizadores (Fase 2: Componentes)
```markdown
Leé `EXTRACTION_PLAN.md` y `software_design_standards_for_agents.md`.
Vamos a ejecutar la Sesión Y: Curaduría y Visualizadores de [Módulo / Temática].

Instrucciones:
1. Refiná las diapositivas de `src/course/data/` que requieran desgloses didácticos especiales o anotaciones específicas.
2. Si la unidad requiere simuladores paso a paso, implementalos en `src/course/visualizers/` utilizando el hook reutilizable `useVisualizerPlayback` y los componentes de `src/course/visualizers/shared/`.
3. Registrá los nuevos bloques en `src/course/components/courseBlockRegistry.tsx`.
4. Respetá estrictamente `software_design_standards_for_agents.md`: paradigma funcional puro, uso de Lookup Tables en lugar de `switch`, cero `useEffect` secundarios para mutar estados locales y cero comentarios explicativos en el código.
5. Verificá que `npm run build` finalice con 0 errores de tipado TypeScript.
```

#### Prompt para Sesión de Revisión, Auditoría y Cierre Final
```markdown
Leé `software_design_standards_for_agents.md` y `EXTRACTION_PLAN.md`.
Vamos a ejecutar la Sesión Final: Auditoría, Depuración y Cierre.

Instrucciones:
1. Revisá integralmente el código implementado y ejecutá una auditoría automática:
   - Invariante arquitectónico: Verificá que `src/core/` tenga 0 imports desde `src/course/`.
   - Paradigma funcional puro: 0 declaraciones `class` en TypeScript.
   - Lookup Tables: 0 bloques `switch` en todo el proyecto.
   - Efectos secundarios: 0 `useEffect` que reaccionen a estados locales para mutaciones o redirecciones.
   - Código auto-documentado: 0 comentarios explicativos u organizativos (`//` o `/* */`) en archivos `.ts`, `.tsx` o `.css`.
   - Modularidad: Verificá que ningún visualizador supere ~350 líneas, extrayendo datos estáticos pesados a archivos `*Data.ts`.
2. Ejecutá la suite de pruebas unitarias: `npm test` y asegurá que todos los tests del Core pasen.
3. Ejecutá el empaquetado de producción: `npm run build` y asegurá 0 errores de tipado.
4. Al verificar que todo esté en orden, eliminá el archivo temporal `EXTRACTION_PLAN.md`.
```

---

## 5. Prompts de Gemini para Extraer Datos desde PDFs / Diapositivas

### Prompt A: Extracción de un Módulo Teórico a JSON
Adjuntá el PDF del apunte teórico o las diapositivas en Gemini y usá este prompt:

```markdown
Actuá como un extractor experto de contenido académico universitario. Tu objetivo es convertir los documentos adjuntos de este módulo en un único archivo JSON válido que respete exactamente el esquema indicado abajo, sin omitir definiciones, teoremas, fórmulas matemáticas, ejemplos ni demostraciones.

Reglas de extracción:
1. Fidelidad total: No resumas de forma superficial. Conservá todas las definiciones formales, propiedades, demostraciones e intuiciones en el campo `teoria` usando listas Markdown y notación LaTeX entre signos `$` (escapando las barras invertidas como `\\` dentro del JSON).
2. Si el subtema incluye pseudocódigo o código fuente, extraelo completo en `pseudocodigo` y `codigo`. Si no aplica a la materia o al subtema, colocá `null`.
3. Si hay análisis de costo o fórmulas clave, estructuralo en `analisis_complejidad` (o dejalo en `null` si no aplica).
4. Devolvé únicamente el bloque JSON válido siguiendo esta estructura:

{
  "modulo": "<numero_y_slug>",
  "titulo_general": "<titulo>",
  "institucion": "<institucion>",
  "catedra": "<catedra>",
  "profesor": "<profesor>",
  "descripcion": "<descripcion_general>",
  "secciones": [
    {
      "id": "<slug_seccion>",
      "tipo": "teoria_formal",
      "titulo": "<titulo_seccion>",
      "subtemas": [
        {
          "id": "<slug_subtema>",
          "titulo": "<titulo_subtema>",
          "teoria": "<markdown_con_latex>",
          "animaciones": null,
          "pseudocodigo": null,
          "codigo": null,
          "analisis_complejidad": null
        }
      ]
    }
  ]
}
```

### Prompt B: Extracción de Guías de Ejercicios y Parciales a JSON
Adjuntá las guías prácticas, exámenes y ejercicios propuestos en Gemini y usá este prompt:

```markdown
Actuá como un recopilador académico riguroso. Extraé absolutamente todos los ejercicios prácticos, problemas de examen y ejercicios propuestos en las diapositivas adjuntas correspondientes a este tema, y consolidalos en un único archivo JSON válido.

Reglas de extracción:
1. Copiá el `enunciado` íntegro palabra por palabra, manteniendo sub-ítems (a, b, c) y fórmulas en LaTeX.
2. Si un ejercicio aparece repetido entre la guía y las diapositivas, unificalo y documentá la pista o estrategia de las diapositivas dentro de `resolucion_propuesta`.
3. Si el ejercicio requiere un grafo, tabla o figura del PDF para entenderse, modelalo en `recurso_visual` usando "mermaid", "markdown_tabla" o "latex" (o `null` si es solo texto).
4. Devolvé únicamente el JSON con esta estructura:

{
  "modulo": "<slug_tema>",
  "titulo": "Banco de Ejercicios: <Nombre del Tema>",
  "descripcion": "<descripcion>",
  "total_ejercicios": <cantidad>,
  "fecha_actualizacion": "<YYYY-MM-DD>",
  "ejercicios": [
    {
      "id_tema": 1,
      "id_global": 1,
      "tema": "<slug_tema>",
      "titulo": "<titulo_corto_identificatorio>",
      "enunciado": "<enunciado_completo>",
      "recurso_visual": null,
      "fuente_original": "<guia_o_slide_origen>",
      "es_ejercicio_propuesto_diapositivas": false,
      "resolucion_propuesta": [
        {
          "fuente_propuesta": "<origen>",
          "clasificacion": "<slug_tema>",
          "complejidad_esperada": "<cota_o_objetivo>",
          "estrategia_sugerida": "<idea_de_resolucion>"
        }
      ]
    }
  ]
}
```

---

## 6. Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo en http://localhost:5173
npm run dev

# Ejecutar la suite de pruebas unitarias automatizadas (exclusivas del Core)
npm test

# Chequear tipos con TypeScript
npm run typecheck

# Compilar para producción (genera ./dist)
npm run build
```

---

## 7. Despliegue Automatizado en GitHub Pages

El proyecto incluye un pipeline automatizado de integración y entrega continua (CI/CD) mediante **GitHub Actions** en [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

### 7.1 Pasos de Configuración en GitHub (Única vez)
1. Abrí el repositorio en GitHub y navegá a **Settings** (pestaña superior).
2. En el menú lateral izquierdo, seleccioná **Pages**.
3. En la sección **Build and deployment** $\to$ **Source**, cambiá la opción a **GitHub Actions** (en lugar de *"Deploy from a branch"*).

### 7.2 Flujo de Despliegue
* **Automático:** Cada `git push` a la rama `main` ejecuta la instalación limpia (`npm ci`), las pruebas unitarias (`npm test`), la compilación TypeScript (`npm run build`) y publica el directorio `./dist` en GitHub Pages.
* **Manual:** Podés disparar un despliegue desde la pestaña **Actions** $\to$ **Deploy to GitHub Pages** $\to$ **Run workflow**.

> [!NOTE]
> La configuración de Vite en [vite.config.ts](vite.config.ts) utiliza `base: './'`. Esto asegura que todos los assets empaquetados se resuelvan con rutas relativas, permitiendo que la web funcione tanto en la raíz de un dominio como en una subcarpeta (`https://<usuario>.github.io/<repositorio>/`) sin errores 404.

---

## 8. Guía de Personalización Rápida para una Nueva Materia

Para adaptar este template a cualquier otra asignatura:

1. **Título e Institución:** Modificá `courseTitle` y `courseDepartment` en [src/App.tsx](src/App.tsx) y el `<title>` en [index.html](index.html).
2. **Carga de Contenido:** Agregá tus archivos JSON en `teoria/` y `ejercicios/`, y registralos en [src/course/data/courseModulesData.ts](src/course/data/courseModulesData.ts) y [src/course/data/examExercisesData.ts](src/course/data/examExercisesData.ts).
3. **Subtemas de Navegación:** Ajustá los accesos directos de la barra lateral en [src/course/data/moduleSubtopicsData.ts](src/course/data/moduleSubtopicsData.ts).
4. **Visualizadores Interactivos:** Podés tomar como referencia [src/course/visualizers/V60ExtractionVisualizer.tsx](src/course/visualizers/V60ExtractionVisualizer.tsx) para crear simuladores propios de tu disciplina con el hook [useVisualizerPlayback.ts](src/course/visualizers/shared/useVisualizerPlayback.ts) y registrarlos en [src/course/components/courseBlockRegistry.tsx](src/course/components/courseBlockRegistry.tsx).
5. **Paletas de Colores y Temas:** Las clases de estilos por módulo se definen en [src/core/domain/sectionThemes.ts](src/core/domain/sectionThemes.ts) (temas esmeralda, ámbar, violeta, zafiro, etc.).
