import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/app/router/ProtectedRoute";
import { WebContent, AppWrapper, AppMainLayout } from "@/shared/ui/layouts";
import Login from "@/pages/login/ui/Login";
import SnoreMonitoring from "@/pages/snore-monitoring";
import MyPage from "@/pages/my-page/ui/MyPage";
import SleepingHistory from "@/pages/sleeping-history/ui/SleepingHistory";
import "@/app/styles/App.css";

function App() {
  return (
    <div className="app">
      <div className="app-content">
        <WebContent />
        <BrowserRouter>
          <Routes>
            <Route element={<AppWrapper />}>
              <Route path="/login" element={<Login />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<AppMainLayout />}>
                  <Route path="/" element={<SnoreMonitoring />} />
                  <Route
                    path="/history/:reportId?"
                    element={<SleepingHistory />}
                  />
                  <Route path="/mypage" element={<MyPage />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
