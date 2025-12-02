import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UploadDocumentPage from "./pages/UploadDocumentPage";
import DocumentsToSignPage from "./pages/DocumentsToSignPage";
import ActivityLogPage from "./pages/ActivityLogPage";
import UserFAQFeedback from "./pages/UserFAQFeedback"; // File user
import AdminInsightsHub from "./pages/AdminInsightsHub"; // File admin
import UserLayout from "@/layouts/UserLayout";
import ChatPage from "@/pages/ChatPage";
import DocumentVerificationPage from "./pages/DocumentVerificationPage";
import DocumentManagementPage from "./pages/DocumentManagementPage";
import UserManagementPage from "./pages/UserManagementPage";
import ReportsPage from "./pages/ReportsPage";
import EditProfilePage from "./pages/EditProfilePage";
import UserDashboard from "./pages/user/UserDashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="esign/upload" element={<UploadDocumentPage />} />
          <Route path="esign/pending" element={<DocumentsToSignPage />} />
          <Route path="activity-log" element={<ActivityLogPage />} />
          <Route path="help-center" element={<AdminInsightsHub />} /> {/* Halaman Admin */}
          <Route path="live-chat" element={<ChatPage />} />
          <Route path="document-validator" element={<DocumentVerificationPage />} />
          <Route path="document-management" element={<DocumentManagementPage />} />
          <Route path="user-management" element={<UserManagementPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="edit-profile" element={<EditProfilePage />} />
        </Route>

        {/* User Routes */}
        <Route path="/user" element={<UserLayout />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="esign/upload" element={<UploadDocumentPage />} />
          <Route path="esign/pending" element={<DocumentsToSignPage />} />
          <Route path="activity-log" element={<ActivityLogPage />} />
          <Route path="help-center" element={<UserFAQFeedback />} /> {/* Halaman User */}
          <Route path="live-chat" element={<ChatPage />} />
          <Route path="document-validator" element={<DocumentVerificationPage />} />
          <Route path="edit-profile" element={<EditProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
}