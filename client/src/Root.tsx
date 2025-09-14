import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { HomePage } from './components/HomePage';
import { SuperheroDetails } from './components/SuperheroDetails';

export const Root = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<HomePage />} />
        <Route path={':superheroNickname'} element={<SuperheroDetails />} />
      </Route>
    </Routes>
  </Router>
)