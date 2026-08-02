import { BrowserRouter,Routes,Route } from "react-router-dom";
import Homepage from "./pages/indexpage.jsx";
import Loginpage from "./pages/loginpage.jsx";
import Search from "./pages/flightssearchpage.jsx";
import Flightresutls from "./pages/resultspage.jsx";
import Seatselection from "./components/seatselection.jsx";
import Passenger_details from "./pages/passengerdetails";
import Payment from "./pages/paymentpage.jsx";
import Ticket from "./pages/ticketpage.jsx"
import Reset_password from './pages/password-resetpage.jsx';
import Profile from "./pages/profile.jsx";
import Mybookings from "./pages/myboookings.jsx";

function App()
{
    return(
    <BrowserRouter>
         
         <Routes>
              
              <Route
                   path="/"
                   element={<Homepage/>}
              />

              <Route
                  path="/loginpage"
                  element={<Loginpage/>}
              />

              <Route
                 path="/flightssearchpage"
                 element={<Search/>}
              />

              <Route
                 path="/flightresutls"
                 element={<Flightresutls/>}
              />

              <Route
                  path="/seatselection"
                  element={<Seatselection/>}
              />

              <Route
                  path="/passengerdetails"
                  element={<Passenger_details/>}
              />

              <Route
                  path="/payment"
                  element={<Payment/>}
              />

              <Route
                  path="/ticket"
                  element={<Ticket/>}
              />

              <Route
                  path="/reset_password"
                  element={<Reset_password/>}
              />

              <Route
                  path="/profile"
                  element={<Profile/>}
              />

              <Route
                  path="/mybookings"
                  element={<Mybookings/>}
              />
         </Routes>
    
    
    </BrowserRouter>
    );
}

export default App;