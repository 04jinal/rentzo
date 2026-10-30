import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Rentals from "./pages/Rentals";
import ListItem from "./pages/ListItem";
import RentalDetails from "./pages/RentalDetails";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import OwnerDashboard from "./pages/OwnerDashboard";
import EditRental from "./pages/EditRental";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/rentals" element={<Rentals />} />

        <Route path="/about" element={<About />} />

        <Route path="/how-it-works" element={<HowItWorks />} />

        <Route path="/rentals/:id" element={<RentalDetails />}/>

        <Route path="/rentals/:id/book" element={<Booking />}/>

        <Route path="/my-bookings" element={<MyBookings />}/>

        <Route path="/owner-dashboard" element={<OwnerDashboard />}/>

        <Route path="/owner-dashboard/edit/:id" element={<EditRental />}/>

        <Route path="/list-item" element={<ListItem />}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;