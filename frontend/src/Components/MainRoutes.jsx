import { Route, Routes } from "react-router-dom"
import Dashboard from "./Dashboard"
import Register from "./auth/Register.jsx"
import Login from "./auth/Login.jsx"
import Profile from "./auth/Profile.jsx"
import DriversList from "./DriversList.jsx"
import Favorites from "./Favorites.jsx"
import Fantasy from "./Fantasy.jsx"
import Races from "./Races.jsx"
import Race from "./Race.jsx"
import AdminResults from "./AdminResults.jsx"
import MyChampionship from "./MyChampionship.jsx"
import RealChampionship from "./RealChampionship.jsx"

const MainRoutes = () => {
    return (
        <div className="main-routes">
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/drivers" element={<DriversList />} />
                <Route path="/favoritos" element={<Favorites />} />
                <Route path="/races" element={<Races />} />
                <Route path="/race/:round" element={<Race />} />
                <Route path="/fantasy" element={<Fantasy />} />
                <Route path="/fantasy/:round" element={<Fantasy />} />
                <Route path="/fantasy/draft/:round" element={<Fantasy />} />
                <Route path="/results" element={<AdminResults />} />
                <Route path="/championship" element={<RealChampionship />} />
                <Route path="/my-championship" element={<MyChampionship />} />
            </Routes>
        </div>
    )
}

export default MainRoutes