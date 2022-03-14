import React from "react";
import { Route, Switch } from "react-router-dom";
import { AdminRoutesEnum } from "../../model/ui/routes/AdminRoutesEnum";
import { MainRoutesEnum } from "../../model/ui/routes/MainRoutesEnum";

import MainLayoutComponent from "../../shared/layout/main-layout/MainLayout";
import ActivityLogPage from "./activity-log/ActivityLogPage";
import AdminPageMenu from "./AdminPageMenu";
import DataVaultPage from "./data-vault/DataVaultPage";
import FunctionsPage from "./functions/FunctionsPage";
import InstitutionsPage from "./institutions/InstitutionsPage";
import OrganizersPage from "./organizers/OrganizersPage";

import UserProfilesPage from "./user-profiles/UserProfilesPage";
import ElectronicBookLibraryPage from "./electronic-book-library/ElectronicBookLibraryPage";
import ProfileClassesPage from "./profile-classes/ProfileClassesPage";
import BookCategoryPage from "./book-categories/BookCategoryPage";
import SeminarCategoryPage from "./seminar-categories/SeminarCategoryPage";
import CostCategoryPage from "./cost-categories/CostCategoryPage";
import InstitutionDetailsPage from "./institutions/InstitutionDetailsPage";
import ProfileClassDetailsPage from "./profile-classes/ProfileClassDetailsPage";
import OrganizerDetailsPage from "./organizers/OrganizerDetailsPage";
import LocationDetailsPage from "./locations/LocationDetailsPage";
import FunctionDetailsPage from "./functions/FunctionDetailsPage";
import ElectronicBookLibraryDetailsPage from "./electronic-book-library/ElectronicBookLibraryDetailsPage";
import BookCategoryDetailsPage from "./book-categories/BookCategoryDetailsPage";
import CostCategoryDetailsPage from "./cost-categories/CostCategoryDetailsPage";
import SeminarCategoryDetailsPage from "./seminar-categories/SeminarCategoryDetailsPage";
import UserProfileDetailsPage from "./user-profiles/UserProfileDetailsPage";
import SeminarSubCategoryDetailsPage from "./seminar-categories/SeminarSubCategoryDetailsPage";
import CostSubCategoryDetailsPage from "./cost-categories/CostSubCategoryDetailsPage";
import BookSubCategoryDetailsPage from "./book-categories/BookSubCategoryDetailsPage";
import UserContractTabDetails from "./user-profiles/tabs/user-contracts/UserContractsTabDetails";
import ReportDefinitionsDetailsPage from "./reports/ReportDefinitionsDetailsPage";
import ReportDefinitionsPage from "./reports/ReportDefinitionsPage";
import LocationsPage from "./locations/LocationPage";
import ModulesDetailPage from "./modules/ModulesDetailPage";
import ModulesPage from "./modules/ModulesPage";
import ExamCategoryDetailsPage from "./exam-categories/ExamCategoryDetailsPage";
import ExamSubCategoryDetailsPage from "./exam-categories/ExamSubCategoryDetailsPage";
import ExamCategoryPage from "./exam-categories/ExamCategoryPage";
import WordTemplatesPage from "./word-templates/WordTemplatesPage";
import LecturesDiaryTab from "./user-profiles/tabs/lectures/LecturesDiaryTab";
import ExamForm from "./exam-form/ExamForm";
import { AdminPanelPermissionEnum } from "../../model/domain/enums/AdminPanelPermissionEnum";
import ProtectedRoute from "../../shared/components/protected-route/ProtectedRoute";
import ResultPage from "./exam-form/ResultPage";
import GradesDiaryTab from "./user-profiles/tabs/lectures/GradesDiaryTab";

function AdminPage() {
  let path = MainRoutesEnum.ADMIN_PANEL;

  return (
    <MainLayoutComponent>
      <Switch>
        <Route exact path={path} component={AdminPageMenu} />
        <ProtectedRoute
          permission={AdminPanelPermissionEnum.ADMIN_ACTIVITY_LOG}
          path={`${path}${AdminRoutesEnum.ACTIVITY_LOG}`}
          component={ActivityLogPage}
        />
        <ProtectedRoute
          permission={AdminPanelPermissionEnum.ADMIN_DATA_VALUT}
          path={`${path}${AdminRoutesEnum.DATA_VAULT}`}
        >
          <DataVaultPage />
          {/* <Route
            path={`${path}${AdminRoutesEnum.DATA_VAULT}/:id`}
            component={DataVaultDetailsPage}
          /> */}
        </ProtectedRoute>
        <ProtectedRoute
          permission={AdminPanelPermissionEnum.ADMIN_E_LIBRARY}
          path={`${path}${AdminRoutesEnum.EBL}`}
        >
          <ElectronicBookLibraryPage />
          <Route
            path={`${path}${AdminRoutesEnum.EBL}/:id`}
            component={ElectronicBookLibraryDetailsPage}
          />
        </ProtectedRoute>
        <ProtectedRoute
          permission={AdminPanelPermissionEnum.ADMIN_FUNCTIONS}
          path={`${path}${AdminRoutesEnum.FUNCTIONS}`}
        >
          <FunctionsPage />
          <Route
            path={`${path}${AdminRoutesEnum.FUNCTIONS}/:id`}
            component={FunctionDetailsPage}
          />
        </ProtectedRoute>
        <ProtectedRoute
          permission={AdminPanelPermissionEnum.ADMIN_INSTITUTIONS}
          path={`${path}${AdminRoutesEnum.INSTITUTIONS}`}
        >
          <InstitutionsPage />
          <Route
            path={`${path}${AdminRoutesEnum.INSTITUTIONS}/:id`}
            component={InstitutionDetailsPage}
          />
        </ProtectedRoute>
        <ProtectedRoute
          permission={AdminPanelPermissionEnum.ADMIN_ORGANIZERS}
          path={`${path}${AdminRoutesEnum.ORGANIZERS}`}
        >
          <OrganizersPage />
          <Route
            path={`${path}${AdminRoutesEnum.ORGANIZERS}/:id`}
            component={OrganizerDetailsPage}
          />
        </ProtectedRoute>
        <ProtectedRoute
          permission={AdminPanelPermissionEnum.ADMIN_LOCATIONS}
          path={`${path}${AdminRoutesEnum.LOCATIONS}`}
        >
          <LocationsPage />
          <Route
            path={`${path}${AdminRoutesEnum.LOCATIONS}/:id`}
            component={LocationDetailsPage}
          />
        </ProtectedRoute>
        <ProtectedRoute
          permission={AdminPanelPermissionEnum.ADMIN_CLASS_MODULES}
          path={`${path}${AdminRoutesEnum.MODULES}`}
        >
          <ModulesPage />
          <Route
            path={`${path}${AdminRoutesEnum.MODULES}/:id`}
            component={ModulesDetailPage}
          />
        </ProtectedRoute>
        <ProtectedRoute
          permission={AdminPanelPermissionEnum.ADMIN_REPORT_DEFINITONS}
          path={`${path}${AdminRoutesEnum.REPORT_DEFINITIONS}`}
        >
          <ReportDefinitionsPage />
          <Route
            path={`${path}${AdminRoutesEnum.REPORT_DEFINITIONS}/:id`}
            component={ReportDefinitionsDetailsPage}
          />
        </ProtectedRoute>
        <ProtectedRoute
          permission={AdminPanelPermissionEnum.ADMIN_WORD_TEMPLATES}
          exact
          path={`${path}${AdminRoutesEnum.WORD_TEMPLATES}`}
          component={WordTemplatesPage}
        />
        <ProtectedRoute
          permission={AdminPanelPermissionEnum.ADMIN_USER_PROFILES}
          exact
          path={`${path}${AdminRoutesEnum.USER_PROFILES}`}
          component={UserProfilesPage}
        />
        <ProtectedRoute
          permission={AdminPanelPermissionEnum.ADMIN_USER_PROFILES}
          path={`${path}${AdminRoutesEnum.USER_PROFILES}/:id/:userName/:tab?`}
        >
          <UserProfileDetailsPage
            tabPath={`${path}${AdminRoutesEnum.USER_PROFILES}`}
          />
          <Route
            path={`${path}${AdminRoutesEnum.USER_PROFILES}/:id/:userName/contracts/:contractId`}
            component={UserContractTabDetails}
          />
          <Route
            path={`${path}${AdminRoutesEnum.USER_PROFILES}/:id/:userName/lectures/diary/:lectureId`}
            component={LecturesDiaryTab}
          />
          <Route
            path={`${path}${AdminRoutesEnum.USER_PROFILES}/:id/:userName/lectures/grades/:lectureId`}
            component={GradesDiaryTab}
          />
        </ProtectedRoute>
        <ProtectedRoute
          permission={AdminPanelPermissionEnum.ADMIN_USER_CLASSES}
          path={`${path}${AdminRoutesEnum.USER_CLASSES}`}
        >
          <ProfileClassesPage />
          <Route
            path={`${path}${AdminRoutesEnum.USER_CLASSES}/:id`}
            component={ProfileClassDetailsPage}
          />
        </ProtectedRoute>
        <ProtectedRoute
          permission={AdminPanelPermissionEnum.ADMIN_BOOK_CATS}
          path={`${path}${AdminRoutesEnum.BOOK_CATS}`}
        >
          <BookCategoryPage />
          <Route
            exact
            path={`${path}${AdminRoutesEnum.BOOK_CATS}/:id`}
            component={BookCategoryDetailsPage}
          />
          <Route
            exact
            path={`${path}${AdminRoutesEnum.BOOK_CATS}/:parentId${AdminRoutesEnum.BOOK_SUB_CATS}/:id`}
            component={BookSubCategoryDetailsPage}
          />
        </ProtectedRoute>
        <ProtectedRoute
          permission={AdminPanelPermissionEnum.ADMIN_COST_CATS}
          path={`${path}${AdminRoutesEnum.COST_CATS}`}
        >
          <CostCategoryPage />
          <Route
            exact
            path={`${path}${AdminRoutesEnum.COST_CATS}/:id`}
            component={CostCategoryDetailsPage}
          />
          <Route
            exact
            path={`${path}${AdminRoutesEnum.COST_CATS}/:parentId${AdminRoutesEnum.COST_SUB_CATS}/:id`}
            component={CostSubCategoryDetailsPage}
          />
        </ProtectedRoute>
        <ProtectedRoute
          permission={AdminPanelPermissionEnum.ADMIN_SEMINAR_CATS}
          path={`${path}${AdminRoutesEnum.SEMINAR_CATS}`}
        >
          <SeminarCategoryPage />
          <Route
            exact
            path={`${path}${AdminRoutesEnum.SEMINAR_CATS}/:id`}
            component={SeminarCategoryDetailsPage}
          />
          <Route
            exact
            path={`${path}${AdminRoutesEnum.SEMINAR_CATS}/:parentId${AdminRoutesEnum.SEMINAR_SUB_CATS}/:id`}
            component={SeminarSubCategoryDetailsPage}
          />
        </ProtectedRoute>
        <ProtectedRoute
          permission={AdminPanelPermissionEnum.ADMIN_EXAM_CATS}
          path={`${path}${AdminRoutesEnum.EXAM_CATS}`}
        >
          <ExamCategoryPage />
          <Route
            exact
            path={`${path}${AdminRoutesEnum.EXAM_CATS}/:id`}
            component={ExamCategoryDetailsPage}
          />
          <Route
            exact
            path={`${path}${AdminRoutesEnum.EXAM_CATS}/:parentId${AdminRoutesEnum.EXAM_SUB_CATS}/:id`}
            component={ExamSubCategoryDetailsPage}
          />
        </ProtectedRoute>
        <Route
          exact path={`${path}${AdminRoutesEnum.EXAM_FORM}`}
        >
          <ExamForm />
        </Route>
        <Route
          path={`${path}/result`}
        >
          <ResultPage />
        </Route>
      </Switch>
    </MainLayoutComponent>
  );
}

export default AdminPage;
