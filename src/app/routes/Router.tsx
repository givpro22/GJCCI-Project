import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';
import { LandingPage } from '@/pages/landing';
import { ROUTES } from '@/shared/config';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.landing} element={<LandingPage />} />
          {/* <Route path={ROUTES.home} element={<HomePage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
