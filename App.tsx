import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store';
import { useSocket } from './services/socket';

// Layout Components
import Layout from './components/Layout/Layout';
import AuthLayout from './components/Layout/AuthLayout';

// Auth Pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

// Main Pages
import HomePage from './pages/Home/HomePage';
import ExplorePage from './pages/Explore/ExplorePage';
import ProfilePage from './pages/Profile/ProfilePage';
import ProfileEditPage from './pages/Profile/ProfileEditPage';
import NotificationsPage from './pages/Notifications/NotificationsPage';

// Character Pages
import CharactersPage from './pages/Characters/CharactersPage';
import CharacterDetailPage from './pages/Characters/CharacterDetailPage';
import CharacterCreatePage from './pages/Characters/CharacterCreatePage';

// World Pages
import WorldsPage from './pages/Worlds/WorldsPage';
import WorldDetailPage from './pages/Worlds/WorldDetailPage';
import WorldCreatePage from './pages/Worlds/WorldCreatePage';

// Story Pages
import StoriesPage from './pages/Stories/StoriesPage';
import StoryDetailPage from './pages/Stories/StoryDetailPage';
import StoryCreatePage from './pages/Stories/StoryCreatePage';

// Community Pages
import CommunitiesPage from './pages/Communities/CommunitiesPage';
import CommunityDetailPage from './pages/Communities/CommunityDetailPage';

// Party Pages
import PartiesPage from './pages/Parties/PartiesPage';
import PartyDetailPage from './pages/Parties/PartyDetailPage';

// Spark Clash Pages
import SparkClashPage from './pages/SparkClash/SparkClashPage';
import BattlePage from './pages/SparkClash/BattlePage';

// Workshop/Creation Pages
import WorkshopPage from './pages/Workshop/WorkshopPage';

// Messaging
import MessagesPage from './pages/Messages/MessagesPage';

// Settings
import SettingsPage from './pages/Settings/SettingsPage';

// 404 Page
import NotFoundPage from './pages/NotFoundPage';

// Loading Components
import LoadingSpinner from './components/UI/LoadingSpinner';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Public Route Component (redirect to home if authenticated)
function PublicRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Socket Connection Component
function SocketConnectionManager() {
  useSocket(); // This will handle the socket connection
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <SocketConnectionManager />
          
          <Routes>
            {/* Public Auth Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <AuthLayout>
                    <LoginPage />
                  </AuthLayout>
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <AuthLayout>
                    <RegisterPage />
                  </AuthLayout>
                </PublicRoute>
              }
            />

            {/* Protected Main Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <HomePage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/explore"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ExplorePage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Profile Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProfilePage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:username"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProfilePage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProfileEditPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Character Routes */}
            <Route
              path="/characters"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CharactersPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/characters/create"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CharacterCreatePage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/characters/:characterId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CharacterDetailPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* World Routes */}
            <Route
              path="/worlds"
              element={
                <ProtectedRoute>
                  <Layout>
                    <WorldsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/worlds/create"
              element={
                <ProtectedRoute>
                  <Layout>
                    <WorldCreatePage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/worlds/:worldId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <WorldDetailPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Story Routes */}
            <Route
              path="/stories"
              element={
                <ProtectedRoute>
                  <Layout>
                    <StoriesPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/stories/create"
              element={
                <ProtectedRoute>
                  <Layout>
                    <StoryCreatePage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/stories/:storyId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <StoryDetailPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Community Routes */}
            <Route
              path="/communities"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CommunitiesPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/communities/:communityId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CommunityDetailPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Party Routes */}
            <Route
              path="/parties"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PartiesPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/parties/:partyId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PartyDetailPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Spark Clash Routes */}
            <Route
              path="/spark-clash"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SparkClashPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/spark-clash/battle/:battleId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <BattlePage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Workshop Route */}
            <Route
              path="/workshop"
              element={
                <ProtectedRoute>
                  <Layout>
                    <WorkshopPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Messages Route */}
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MessagesPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Notifications Route */}
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Layout>
                    <NotificationsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Settings Route */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SettingsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route
              path="*"
              element={
                <Layout>
                  <NotFoundPage />
                </Layout>
              }
            />
          </Routes>

          {/* Global Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: 'bg-gray-800 text-white',
              style: {
                background: '#1f2937',
                color: '#ffffff',
                border: '1px solid #374151',
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;