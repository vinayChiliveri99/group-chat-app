import { Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import WelcomePage from './components/WelcomePage';

function Views() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />}></Route>
      <Route path="/signup" element={<SignUp />}></Route>
      <Route path="/welcome" element={<WelcomePage />}></Route>
    </Routes>
  );
}

export default Views;
