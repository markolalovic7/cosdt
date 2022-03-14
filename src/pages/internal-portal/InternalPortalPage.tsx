import React from "react";
import {Route, Switch} from "react-router-dom";
import {InternalPortalRoutesEnum} from "../../model/ui/routes/InternalPortalRoutesEnum";
import {MainRoutesEnum} from "../../model/ui/routes/MainRoutesEnum";

import MainLayoutComponent from "../../shared/layout/main-layout/MainLayout";
import InternalPortalPageMenu from "./InternalPortalPageMenu";
import SeminarsPage from "./seminars/SeminarsPage";
import SeminarsPageDetails from "./seminars/SeminarsPageDetails";
import CalendarManagementPage from "./calendar/CalendarManagementPage";
import SupportingMaterialsTabDetails from "./seminars/tabs/supporting-materials/SupportingMaterialsTabDetails";
import ContractTabDetails from "./seminars/tabs/contract/ContractTabDetails";
import CostSheetTabDetails from "./seminars/tabs/cost-sheet/CostSheetTabDetails";
import FormsBuilderPageDetails from "./forms-management/FormsBuilderPageDetails";
import FormsBuilderPage from "./forms-management/FormsBuilderPage";
import {SeminarRoutesEnum} from "../../model/ui/routes/SeminarRoutesEnum";
import SeminarPageDetailsModal from "./seminars/SeminarsPageDetailsModal";
import AttendeesSurveyFormDetails from "./seminars/tabs/attendees/custom/AttendeesSurveyForm";
import TrainingCampPage from "./training-camp/TrainingCampPage";
import TrainingCampPageDetails from "./training-camp/TrainingCampPageDetails";
import ExamsPageDetails from "./exams/ExamsPageDetails";
import ExamsPage from "./exams/ExamsPage";
import ExamsPageDetailsModal from "./exams/ExamsPageDetailsModal";
import TrainingPageDetailsModal from "./training-camp/TrainingPageDetailsModal";
import ScheduleTabDetails from "./training-camp/tabs/schedule/ScheduleTabDetails";
import LectureMaterialsTab from "./training-camp/tabs/schedule/lecture-materials/LectureMaterialsTab";
import ExamMaterialsTabDetails from "./exams/tabs/exam-materials/ExamMaterialsTabDetails";
import ProtectedRoute from "../../shared/components/protected-route/ProtectedRoute";
import {InternalPortalPermissionEnum} from "../../model/domain/enums/InternalPortalPermissionEnum";
import SurveyBuilderPage from "./survey-management/FormsBuilderPage";
import SurveyBuilderPageDetails from "./survey-management/FormsBuilderPageDetails";
import CostSheetPage from "./cost-sheet/CostSheetPage";
import ReportsMain from "./reports/ReportsMain";
import {AdminPanelPermissionEnum} from "../../model/domain/enums/AdminPanelPermissionEnum";
import {AdminRoutesEnum} from "../../model/ui/routes/AdminRoutesEnum";
import UserProfilesPage from "../admin/user-profiles/UserProfilesPage";

function InternalPortalPage() {
  const path = MainRoutesEnum.INTERNAL_PORTAL;
  const seminarPath = `${path}${InternalPortalRoutesEnum.SEMINARS}`;
  const classPath = `${path}${InternalPortalRoutesEnum.JOURNAL_OF_CANDIDATES}`;
  const examPath = `${path}${InternalPortalRoutesEnum.EXAMS}`;

  return (
    <MainLayoutComponent>
      <Switch>
        {/** Menu route */}
        <Route exact path={path} component={InternalPortalPageMenu}/>

        {/** Calendar management route */}
        <ProtectedRoute
          path={`${path}${InternalPortalRoutesEnum.CALENDAR_MANAGEMENT}`}
          component={CalendarManagementPage}
          permission={InternalPortalPermissionEnum.INTERNAL_CALENDAR_MANAGEMENT}
        />

        {/** Exam builder route */}
        <ProtectedRoute
          exact
          path={`${path}${InternalPortalRoutesEnum.FORMS_BUILDER}`}
          permission={InternalPortalPermissionEnum.INTERNAL_FORMS_BUILDER}
        >
          <FormsBuilderPage/>
        </ProtectedRoute>
        <ProtectedRoute
          path={`${path}${InternalPortalRoutesEnum.FORMS_BUILDER}/:id`}
          permission={InternalPortalPermissionEnum.INTERNAL_FORMS_BUILDER}
        >
          <FormsBuilderPageDetails/>
        </ProtectedRoute>
        {/** Survey builder route */}
        <ProtectedRoute
          exact
          path={`${path}${InternalPortalRoutesEnum.SURVEY_BUILDER}`}
          permission={InternalPortalPermissionEnum.INTERNAL_SURVEY_BUILDER}
        >
          <SurveyBuilderPage/>
        </ProtectedRoute>
        <ProtectedRoute
          path={`${path}${InternalPortalRoutesEnum.SURVEY_BUILDER}/:id`}
          permission={InternalPortalPermissionEnum.INTERNAL_SURVEY_BUILDER}
        >
          <SurveyBuilderPageDetails/>
        </ProtectedRoute>

        {/** Seminars route */}
        <ProtectedRoute
          path={`${seminarPath}/:seminarId/:seminarName/:tab?`}
          permission={InternalPortalPermissionEnum.INTERNAL_SEMINAR_MANAGEMENT}
        >
          <SeminarsPageDetails tabPath={seminarPath}/>
          <Route
            path={`${seminarPath}${SeminarRoutesEnum.ATTENDEES}/survey/:id`}
            component={AttendeesSurveyFormDetails}
          />
          <Route
            path={`${seminarPath}${SeminarRoutesEnum.SUPPORTING_MATERIALS}/:id`}
            component={SupportingMaterialsTabDetails}
          />
          <Route
            path={`${seminarPath}${SeminarRoutesEnum.CONTRACTS}/:id`}
            component={ContractTabDetails}
          />
          <Route
            path={`${seminarPath}${SeminarRoutesEnum.COST_SHEET}/:id`}
            component={CostSheetTabDetails}
          />
        </ProtectedRoute>

        <ProtectedRoute
          path={`${seminarPath}`}
          permission={InternalPortalPermissionEnum.INTERNAL_SEMINAR_MANAGEMENT}
        >
          <SeminarsPage/>
          <Route
            exact
            path={`${seminarPath}/new`}
            component={SeminarPageDetailsModal}
          />
        </ProtectedRoute>

        {/** Exams route */}
        <ProtectedRoute
          path={`${examPath}/:examId/:examName/:tab?`}
          permission={InternalPortalPermissionEnum.INTERNAL_EXAMS_MANAGEMENT}
        >
          <ExamsPageDetails tabPath={examPath}/>
          <Route
            exact
            path={`${examPath}/:examId/:examName/materials/new`}
            component={ExamMaterialsTabDetails}
          />
        </ProtectedRoute>
        <ProtectedRoute
          path={`${examPath}`}
          permission={InternalPortalPermissionEnum.INTERNAL_EXAMS_MANAGEMENT}
        >
          <ExamsPage/>
          <Route
            exact
            path={`${examPath}/new`}
            component={ExamsPageDetailsModal}
          />
        </ProtectedRoute>
        <ProtectedRoute
            permission={AdminPanelPermissionEnum.ADMIN_USER_PROFILES}
            exact
            path={`${MainRoutesEnum.ADMIN_PANEL}${AdminRoutesEnum.USER_PROFILES}`}
            component={UserProfilesPage}
        />

        {/** Training camp route */}
        <ProtectedRoute
          path={`${classPath}/:classId/:className/:tab?`}
          permission={InternalPortalPermissionEnum.INTERNAL_JOURNAL_CANDIDATES}
        >
          <TrainingCampPageDetails tabPath={classPath}/>
          <Route
            exact
            path={`${classPath}/:classId/:className/schedule/:id`}
            component={ScheduleTabDetails}
          />
          <Route
            exact
            path={`${classPath}/:classId/:className/schedule/:id/materials`}
            component={LectureMaterialsTab}
          />
        </ProtectedRoute>
        <ProtectedRoute
          path={`${classPath}`}
          permission={InternalPortalPermissionEnum.INTERNAL_JOURNAL_CANDIDATES}
        >
          <TrainingCampPage/>
          <Route
            exact
            path={`${classPath}/:classId`}
            component={TrainingPageDetailsModal}
          />
        </ProtectedRoute>

        <ProtectedRoute
          path={`${path}${InternalPortalRoutesEnum.REPORTS}`}
          permission={InternalPortalPermissionEnum.INTERNAL_REPORTS}
        >
          <ReportsMain/>
        </ProtectedRoute>
        <ProtectedRoute
          path={`${path}${InternalPortalRoutesEnum.COST_SHEET}`}
          permission={InternalPortalPermissionEnum.INTERNAL_COST_SHEET}
        >
          <CostSheetPage/>
        </ProtectedRoute>
      </Switch>
    </MainLayoutComponent>
  );
}

export default InternalPortalPage;
