# mentalHealthGPT

mentalHealthGPT is a free, AI-powered platform that provides mental health advice and resources. Our mission is to offer a safe space where users can chat with an AI to receive mental health guidance and support.

## Features

- **AI-Powered Chat**: Engage in natural language conversations with an AI built on the Llama 3.1 (70B params) model via the Groq free API.
- **Free Mental Health Resources**: Get advice and access to valuable mental health information.
- **Secure Authentication**:
  - **Google OAuth2**: Seamlessly log in using your Google account (powered by PassportJS).
  - **JWT Authentication**: Alternatively, sign in using traditional JWT-based authentication.
- **Real-Time Interactions**: Enjoy responsive and dynamic chat sessions supported by our robust backend.

## Tech Stack

### Backend

- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Input Validation**: [Zod](https://github.com/colinhacks/zod)
- **Authentication**:
  - [PassportJS](http://www.passportjs.org/) (Google OAuth2)
  - JWT (JSON Web Tokens)
- **AI Model**: Powered by the Groq free API for [Llama 3.1 70B Params Model](https://llama.ai/)

### Frontend

- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Library**: [React.js](https://reactjs.org/)
- **State Management**: [RecoilJS](https://recoiljs.org/)
- **Bundler**: [Vite](https://vitejs.dev/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or above)
- [PostgreSQL](https://www.postgresql.org/)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/arrancy/mentalHealthGPT.git
   cd mentalHealthGPT
   cd server
   npm i
   npm run dev
   -- now open another terminal window
   cd ../client
   npm i
   npm run dev

   ```
