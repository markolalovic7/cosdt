import React from "react";
import {Route, Switch} from "react-router-dom";
import {useRecoilValue} from 'recoil';

import "antd/dist/antd.css";
import "./assets/css/App.scss";
import NavigationComponent from "./shared/layout/navigation/Navigation";
import HomePage from "./pages/home/HomePage";
import AdminPage from "./pages/admin/AdminPage";
import {MainRoutesEnum} from "./model/ui/routes/MainRoutesEnum";
import SamplePage from "./pages/sample/SamplePage";
import MainLayoutComponent from "./shared/layout/main-layout/MainLayout";
import SamplePageDetails from "./pages/sample/SamplePageDetails";
import SamplePageAjax from "./pages/sample/SamplePageAjax";
import InternalPortalPage from "./pages/internal-portal/InternalPortalPage";
import ELibraryPage from "./pages/e-library/ELibraryPage";
import SuccessPage from "./pages/templates/SuccessPage";
import ErrorPage from "./pages/templates/ErrorPage";
import Initializer from "./shared/components/initializer/Initializer";
import {UserProfileAtom} from "./shared/recoil/UserProfileAtom";
import ProtectedRoute from "./shared/components/protected-route/ProtectedRoute";
import {GlobalPermissionEnum} from "./model/domain/enums/UserPermissionEnum";
import CalendarManagementPage from "./pages/internal-portal/calendar/CalendarManagementPage";
import ElectronicBookLibraryDetailsPage from "./pages/admin/electronic-book-library/ElectronicBookLibraryDetailsPage";
import AttendeesSurveyFormDetails from "./pages/internal-portal/seminars/tabs/attendees/custom/AttendeesSurveyForm";
import SurveyForm from "./pages/internal-portal/survey-management/survey-builder/SurveyForm";
import { matchPath, useLocation } from 'react-router';

function App() {
  const profile = useRecoilValue(UserProfileAtom);
  const location = useLocation();
  const isPublic = !!matchPath(
    location.pathname,
    '/s/:seminar'
  );
  return (
    <div className="app-container">
      {!isPublic && <Initializer/>}
      {profile &&
        <>
      <NavigationComponent/>
      <Switch>
          <Route exact path={MainRoutesEnum.HOME} component={HomePage}/>
          <Route exact path={`/take-survey/:id/:seminarId/start`} component={AttendeesSurveyFormDetails}/>
          <ProtectedRoute permission={GlobalPermissionEnum.ROLE_ADMIN_PANEL} path={MainRoutesEnum.ADMIN_PANEL}
                          component={AdminPage}/>
          <ProtectedRoute
              permission={GlobalPermissionEnum.ROLE_INTERNAL_PORTAL}
              path={MainRoutesEnum.INTERNAL_PORTAL}
              component={InternalPortalPage}
          />
          <ProtectedRoute
              path={MainRoutesEnum.CALENDAR}
              permission={GlobalPermissionEnum.ROLE_GENERAL}
          >
              <MainLayoutComponent>
                  <CalendarManagementPage profileId={profile.id}/>
              </MainLayoutComponent>
          </ProtectedRoute>
          <ProtectedRoute
              permission={GlobalPermissionEnum.ROLE_GENERAL}
              path={MainRoutesEnum.E_LEARNING_PORTAL}
          >
              <ELibraryPage/>
              <Route
                  path={`${MainRoutesEnum.E_LEARNING_PORTAL}/:id`}
                  component={ElectronicBookLibraryDetailsPage}
              />
          </ProtectedRoute>
          <Route exact path={"/sampleajax"}>
              <MainLayoutComponent>
                  <SamplePageAjax/>
                  <Route path={"/sampleajax/:id"} component={SamplePageDetails}/>
              </MainLayoutComponent>
          </Route>
          <Route path={"/sample"}>
              <MainLayoutComponent>
                  <SamplePage/>
                  <Route path={"/sample/:id"} component={SamplePageDetails}/>
              </MainLayoutComponent>
          </Route>
        {/**  fallback route 404 **/}
          <Route component={ErrorPage}/>
      </Switch>
      </>
      }
      {!profile &&
      <Switch>
        <Route exact path={`${MainRoutesEnum.SURVEY}/:seminar`}>
          <SurveyForm/>
        </Route>
        <Route
          path={`${MainRoutesEnum.SUCCESS_TEMPLATE}/HVALA/`}
          component={SuccessPage}
        />
        <Route
          path={`${MainRoutesEnum.ERROR_TEMPLATE}/GREŠKA/:description`}
          component={ErrorPage}
        />
      </Switch>}
    </div>
  );
}

export default App;
