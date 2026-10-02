# 🗺️ Stenrik

Stenrik is an interactive map of Swedish ancient monuments and archaeological sites. It pulls its data from the public API of [Riksantikvarieämbetet](https://www.raa.se/) (the Swedish National Heritage Board) and plots every site as a marker on the map. Logged-in users can save their favorite locations.

## Features

- **Interactive map:** ancient monuments rendered as markers, positioned using the coordinates from Riksantikvarieämbetet's API
- **User accounts:** sign up and log in with Supabase Authentication
- **Favorites:** logged-in users can save locations they want to remember or revisit
- **Native Web Components:** the UI is built from custom elements, with no frontend framework
- **Documented code:** JSDoc-generated documentation of the codebase

## Tech Stack

| Area | Technology |
| --- | --- |
| Map | [Leaflet](https://leafletjs.com/) |
| UI | JavaScript with native [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) (Custom Elements) |
| Data source | [Riksantikvarieämbetet](https://www.raa.se/) public API |
| Database & authentication | [Supabase](https://supabase.com/) |
| Documentation | [JSDoc](https://jsdoc.app/) |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) and npm
- A free [Supabase](https://supabase.com/) project (see [Supabase Setup](#supabase-setup))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/davidallert/stenrik.git
   cd stenrik
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure the app**

   Add your Supabase project URL and public (anon) key in `config.js`:

   ```js
   // config.js
   export const SUPABASE_URL = "https://your-project.supabase.co";
   export const SUPABASE_ANON_KEY = "your-anon-key";
   ```

4. **Start the app**

   ```bash
   npm run dev
   ```

## Supabase Setup

Stenrik uses Supabase for both authentication and storing users' favorites.

1. Create a project at [supabase.com](https://supabase.com/).
2. Under **Authentication**, enable the sign-in method(s) the app uses.
3. Create the table(s) the app needs for saved favorites.
4. Enable **Row Level Security** and add policies so users can only read and modify their own data. This matters because the anon key is visible in client-side code.
5. Copy your **Project URL** and **anon public key** (under **Project Settings → API**) into `config.js`.

## Project Structure

```
stenrik/
├── assets/images/   # Static images
├── components/      # Native Web Components (custom elements)
├── dist/            # Build output
├── docs/            # Generated JSDoc documentation
├── models/          # Data models and API / database access
├── style/           # Stylesheets
├── util/            # Helper functions
├── views/           # Application views
├── config.js        # App configuration
├── index.html       # Entry point
├── jsdoc.json       # JSDoc configuration
└── main.js          # Application bootstrap
```

## Roadmap

- [ ] User-provided images for each location
- [ ] Reviews
- [ ] Ratings

## Data & Acknowledgements

- Heritage data is provided by [Riksantikvarieämbetet](https://www.raa.se/), the Swedish National Heritage Board, through its public API. See their terms for details on usage and attribution.
- Maps are powered by [Leaflet](https://leafletjs.com/).
- Authentication and database by [Supabase](https://supabase.com/).

## Author

**David Allert**: [@davidallert](https://github.com/davidallert)
