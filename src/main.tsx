import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import './i18n'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import LoginPage from './admin/LoginPage'
import AdminLayout from './admin/AdminLayout'
import ContentEditor from './admin/ContentEditor'
import BlogList from './admin/BlogList'
import BlogPostForm from './admin/BlogPostForm'
import AdminPreviewPage from './admin/AdminPreviewPage'
import BlogPostPage from './pages/BlogPostPage'

const lang = localStorage.getItem('lang') ?? 'en'
document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr'
document.documentElement.lang = lang

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/admin/preview" element={<AdminPreviewPage />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<ContentEditor />} />
            <Route path="content" element={<ContentEditor />} />
            <Route path="contenido" element={<ContentEditor />} />
            <Route path="blog" element={<BlogList />} />
            <Route path="blog/new" element={<BlogPostForm />} />
            <Route path="blog/nuevo" element={<BlogPostForm />} />
            <Route path="blog/:id" element={<BlogPostForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
)
