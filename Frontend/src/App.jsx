import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import Home from "./component/Home";
import SignIn from "./component/SignIn";
import Contest from "./component/Contest";

import SignUp from "./component/Signup";
import Table from "./component/Table";
import PrivateRoute from "./component/PrivateRoute";
import ProblemSet from "./component/Problemset";
import ProblemPage from "./component/ProblemPage"; // ✅ new import

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <div className="min-h-[80vh]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Table />
                </PrivateRoute>
              }
            />
            <Route path="/practice" element={<ProblemSet />} />
             <Route path="/problems/:id" element={<ProblemPage />} /> {/* ✅ Fix here */}
              <Route path="/contest" element={<Contest />} />
          </Routes>
        </div>
        <Footer />
       

      </Router>
    </Provider>
  );
}

export default App;
