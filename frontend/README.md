# Workday Vacuumers – Frontend

This is the **frontend** for the Workday Vacuumers single-page website.  
It is built with **React + Vite**, styled with **Tailwind CSS**, enhanced with **MUI (Material UI)** components, and animated using **Framer Motion**.  

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| **Vite** | Fast dev server & build pipeline with HMR |
| **React** | Component-based UI |
| **Tailwind CSS** | Utility-first styling |
| **MUI** | Polished, accessible UI blocks |
| **Framer Motion** | Declarative animations |

---

## Running the Project locally

```bash
# Clone the repository
git clone https://github.com/Tartsi/Fullstack-projekti

# Navigate to the frontend-folder from the root
cd frontend

# Install dependencies
npm install

# Start local dev server
npm run dev
```

---

## Linting & Formatting
ESLint shipped via the Vite React template.

Prettier for opinionated code formatting.
### Recommended VS Code Settings

To ensure consistent formatting and linting, add the following settings to your `.vscode/settings.json` file:

```jsonc
{
    "editor.formatOnSave": true,
    "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[javascriptreact]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    }
}
```

## License
For educational & portfolio purposes only.
© 2025 Workday Vacuumers
