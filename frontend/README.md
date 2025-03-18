# E-Learning Platform Frontend

This is the frontend application for the E-Learning Platform, built with React and Material-UI.

## Features

- User authentication (login, register, logout)
- Role-based access control (student, instructor, admin)
- Dashboard for users
- Course browsing and enrollment
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```
   cd frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

### Running the Application

To start the development server:

```
npm start
```

or

```
yarn start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

To create a production build:

```
npm run build
```

or

```
yarn build
```

## Project Structure

- `src/components/auth`: Authentication-related components
- `src/components/common`: Common components used across the application
- `src/components/dashboard`: Dashboard components
- `src/services`: Service layer for API communication

## Technologies Used

- React
- React Router
- Material-UI
- Axios
1. **Code Organization**: Clear folder structure following Next.js conventions
2. **Component Design**: Reusable components with proper prop typing
3. **State Management**: Centralized state with Redux Toolkit and React Query for server state
4. **Responsive Design**: Mobile-first approach with Tailwind and Material UI
5. **Accessibility**: ARIA attributes and semantic HTML
6. **Performance**: Optimized rendering with React hooks
7. **TypeScript**: Strong typing throughout the application
8. **Error Boundaries**: Graceful error handling
9. **Code Splitting**: Automatic code splitting with Next.js
10. **CSS-in-JS**: Styling with Emotion and additional utility classes with Tailwind 