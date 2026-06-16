import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Shell } from "./components/Shell.jsx";
import { StoreProvider } from "./lib/store.jsx";
import { Automation } from "./pages/Automation.jsx";
import { Consumables } from "./pages/Consumables.jsx";
import { Contracts } from "./pages/Contracts.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { DeviceDetail } from "./pages/DeviceDetail.jsx";
import { Devices } from "./pages/Devices.jsx";
import { Infrastructure } from "./pages/Infrastructure.jsx";
import { KbArticle, KbList } from "./pages/Kb.jsx";
import { Planning } from "./pages/Planning.jsx";
import { ProblemDetail } from "./pages/ProblemDetail.jsx";
import { Problems } from "./pages/Problems.jsx";
import { Reservations } from "./pages/Reservations.jsx";
import { Roles } from "./pages/Roles.jsx";
import { Settings } from "./pages/Settings.jsx";
import { Software } from "./pages/Software.jsx";
import { TicketDetail } from "./pages/TicketDetail.jsx";
import { Tickets } from "./pages/Tickets.jsx";
import { UserDetail } from "./pages/UserDetail.jsx";
import { UsersPage } from "./pages/Users.jsx";

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route element={<Shell />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/tickets/:id" element={<TicketDetail />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/problems/:id" element={<ProblemDetail />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/kb" element={<KbList />} />
            <Route path="/kb/:id" element={<KbArticle />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/devices/:id" element={<DeviceDetail />} />
            <Route path="/software" element={<Software />} />
            <Route path="/consumables" element={<Consumables />} />
            <Route path="/contracts" element={<Contracts />} />
            <Route path="/infrastructure" element={<Infrastructure />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/automation" element={<Automation />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
