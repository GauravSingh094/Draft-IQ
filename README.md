# Draft-IQ — Premium AI Article & Content Generator

Draft-IQ is an enterprise-grade content generation platform built with Next.js, Framer Motion, and Tailwind CSS. It leverages a server-side proxy to connect securely with a dynamic n8n AI agent workflow, allowing writers to create production-ready, SEO-optimized articles in seconds.

---

## 📊 Data Flow Diagram (DFD)

The diagram below illustrates the path of data from user parameters down through validation, remote webhook processing, content compilation, and export:

```mermaid
graph TD
    %% Entities
    User([User / Writer])
    BrowserStorage[(Browser LocalStorage)]
    n8nWebhook[n8n Webhook Endpoint]
    AIAgent[n8n AI Agent Workflow]

    %% Frontend App Boundary
    subgraph Frontend [Next.js App Runtime]
        Form[Article Form Component]
        Preview[Article Preview Component]
        RouteHandler[API Proxy Route: /api/generate]
        StatsTracker[Sidebar Statistics]
        ExportEngine[PDF & TXT Export Engine]
    end

    %% Flows
    User -->|1. Topic, Tone, WordCount| Form
    Form -->|2. POST Request Payload| RouteHandler
    
    %% Proxy and Webhook
    RouteHandler -->|3. Validates 300-3000 words & Proxies| n8nWebhook
    n8nWebhook -->|4. Dynamic Prompt Compilation| AIAgent
    AIAgent -->|5. Compiles Markdown Output| n8nWebhook
    n8nWebhook -->|6. Webhook Response| RouteHandler
    RouteHandler -->|7. Sends clean text| Preview

    %% Post-Process & Storage
    Preview -->|8. Save Draft payload| BrowserStorage
    BrowserStorage -->|Sync Count| StatsTracker
    Preview -->|9. Export request| ExportEngine
    ExportEngine -->|10. Download PDF / TXT| User
```

---

## 🚀 Key Features

*   **Dynamic Word Count Engine**: Request article lengths between `300` and `3000` words. The backend sanitizes inputs and forwards them directly to the AI agent prompts.
*   **Custom Parsing Engine**: Automatically formats dynamic structures:
    *   `[Heading]` → styled `<h2>` with modern border indicators.
    *   `{Subheading}` → styled bold `<h3>` sub-headers.
    *   `** bullet text` → dot list items (hides raw markdown formatting).
    *   Strips out `# / ## / ###` characters for human-grade copy visibility.
*   **Content-First UI**: Newly reordered viewer stacks the completed article at the top, putting analytics, keywords, and quality scorecards cleanly below.
*   **Local Persistence**: Fully persistent history browser built on top of LocalStorage, featuring stats counters, search options, and draft restoration.
*   **Production Handcrafted Aesthetics**: Custom glassmorphism cards, glowing radial mesh backdrops, floating keyframes, and full keyboard-navigable accessibility (ARIA).

---

## 🛠️ Tech Stack

*   **Framework**: Next.js 15 (App Router)
*   **Type Safety**: TypeScript 5
*   **Animations**: Framer Motion 12
*   **Styling**: Tailwind CSS 4 & PostCSS
*   **Document Generation**: jsPDF
*   **Integration**: n8n automation webhook (`/webhook/generate-article`)

---

## ⚙️ Development Setup

First, install local package dependencies:
```bash
npm install
```

Start the local development server:
```bash
npm run dev
```

Build the production-ready bundle (cleanly verified, type-checked):
```bash
npm run build
```
