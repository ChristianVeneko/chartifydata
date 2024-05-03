# Chartify Data: Visualizing Spotify User Data

## Introduction

Chartify Data is a Nuxt.js web application that allows users to visualize their listening habits and preferences on Spotify. By connecting their Spotify account, users can view their top artists, songs, and albums based on different time ranges. The application provides a sleek and intuitive user interface, displaying data in a card-based format with album covers and links to listen on Spotify.

## Intended Use Cases

The primary use case for Chartify Data is to enable Spotify users to gain insights into their personal music tastes and listening behaviors. By visualizing their top artists, songs, and albums, users can better understand their musical preferences and discover new artists or genres they might enjoy.

Additionally, Chartify Data aims to provide an engaging and visually appealing experience for users to explore their listening data. The card-based layout, album covers, and direct links to Spotify create a seamless integration with the Spotify platform, enhancing the overall user experience.

## Key Features

### User Authentication

Chartify Data leverages the Spotify API's Authorization Code Flow to authenticate users and obtain access tokens for making API requests on their behalf. The application follows industry-standard practices for securing user data and API credentials, such as using the `state` parameter to prevent CSRF attacks and storing access tokens and refresh tokens securely on the server-side.

### Data Visualization

The core functionality of Chartify Data is visualizing users' top music data from Spotify. Users can select the type of data they want to display (top artists, top songs, or top albums) and the time range (last 4 weeks, last 6 months, or all-time). The application then fetches the corresponding data from the Spotify API and processes it to create a visually appealing representation.

### Responsive Design

Chartify Data is designed to provide an optimal user experience across different devices and screen sizes. The user interface is built with responsive web design principles, ensuring that the application adapts seamlessly to various viewport dimensions.

## Technical Implementation

Chartify Data is built using the Nuxt.js framework, which is based on Vue.js and provides server-side rendering, file-based routing, and other features out of the box. The application follows a modular and component-based architecture, with a clear separation of concerns between different parts of the codebase.

The application consists of several key components:

- **Authentication Components**: These components handle the Spotify API authentication flow, including initiating the login process, handling the redirect after user authorization, and managing the application's authentication state.
- **Data Fetching and Processing**: A dedicated `Music` class encapsulates the logic for interacting with the Spotify API, fetching user data, and processing it into a format suitable for visualization.
- **UI Components**: Various Vue.js components are responsible for rendering the user interface, including the login form, music form, and result components for displaying top artists, songs, and albums.
- **Utility Functions**: The application includes several utility functions for tasks such as generating random strings (used in the authentication flow) and handling access token validation and refresh.

The application adheres to best practices for Vue.js and Nuxt.js development, including reactive data management, prop validation, and code modularity.

## Conclusion

Chartify Data is a well-designed and implemented web application that leverages the Spotify API to provide users with valuable insights into their personal music tastes and listening behaviors. By offering a visually appealing and user-friendly interface, Chartify Data aims to enhance the overall experience of exploring and discovering music on Spotify.

Please note that this documentation is intended to provide a general overview of the application's features and technical implementation. For more detailed information or specific queries, please refer to the codebase or contact the application developers.

# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

Create a .env file in the root directory and provide the required environment variables, such as your Spotify client ID, client secret, and redirect URI:

    NUXT_CLIENT_ID=clientid
    NUXT_CLIENT_SECRET=clientsecret
    NUXT_REDIRECT_URI=http://localhost:3000/api/callback
    NUXT_PUBLIC_CLIENT_ID=publicClientId
    NUXT_PUBLIC_BASE_URL= http://localhost:3000
    NUXT_PUBLIC_TEST=AAAAAAAAAAAAAAAAAA

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
