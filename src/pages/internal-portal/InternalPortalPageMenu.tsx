import React from "react";
import {Link, useRouteMatch} from "react-router-dom";

import {
  CalendarOutlined,
  FormOutlined,
  BarChartOutlined,
  LaptopOutlined,
  RocketOutlined,
  BookOutlined,
} from "@ant-design/icons";

import styles from "./InternalPortalPage.module.scss";
import {InternalPortalRoutesEnum} from "../../model/ui/routes/InternalPortalRoutesEnum";
import ProtectedContent from "../../shared/components/protected-route/ProtectedContent";
import {InternalPortalPermissionEnum} from "../../model/domain/enums/InternalPortalPermissionEnum";
import {PieChartOutlined, UsergroupAddOutlined} from "@ant-design/icons/lib";
import {AdminPanelPermissionEnum} from "../../model/domain/enums/AdminPanelPermissionEnum";
import {AdminRoutesEnum} from "../../model/ui/routes/AdminRoutesEnum";
import {MainRoutesEnum} from "../../model/ui/routes/MainRoutesEnum";

function InternalPortalPageMenu() {
  let {url} = useRouteMatch();

  return (
    <div className={"container"}>
      <div className={styles.contentHeader}>
        {/* <div className={styles.contentImg}>
                    <img alt="COSDT logo" src={logo} />
                </div> */}
        <div className={styles.contentInfo}>
          <h1>Internal portal</h1>
          <p>
            Internal portal for COSDT users is section where advanced internal
            users are able to review and manage calendar events. Also, users can
            review, create, edit or delete seminars using facilities provided in
            this application section
          </p>
        </div>
      </div>

      <h3>Main entities</h3>
      <div className={styles.gridContainer}>
        <ProtectedContent permission={InternalPortalPermissionEnum.INTERNAL_SEMINAR_MANAGEMENT}>
          <Link to={`${url}${InternalPortalRoutesEnum.SEMINARS}`}>
            <div className={styles.internalPortal}>
              <LaptopOutlined/>
              <h2>Seminar management</h2>
              <p>
                Review, create, edit and delete seminar. Manage seminar attendees
                and generate certificates of participation. Manage cost sheets for
                seminars
              </p>
            </div>
          </Link>
        </ProtectedContent>

        <ProtectedContent permission={InternalPortalPermissionEnum.INTERNAL_CALENDAR_MANAGEMENT}>
          <Link to={`${url}${InternalPortalRoutesEnum.CALENDAR_MANAGEMENT}`}>
            <div className={styles.internalPortal}>
              <CalendarOutlined/>
              <h2>Calendar management</h2>
              <p>
                Review and manage events (seminars and other events) using
                calendar visualization
              </p>
            </div>
          </Link>
        </ProtectedContent>

        <ProtectedContent permission={InternalPortalPermissionEnum.INTERNAL_EXAMS_MANAGEMENT}>
          <Link to={`${url}${InternalPortalRoutesEnum.EXAMS}`}>
            <div className={styles.internalPortal}>
              <BookOutlined/>
              <h2>eLearning Exams management</h2>
              <p>Review, create, edit and delete exmas. Manage exam attendees.</p>
            </div>
          </Link>
        </ProtectedContent>

        <ProtectedContent permission={InternalPortalPermissionEnum.INTERNAL_JOURNAL_CANDIDATES}>
          <Link to={`${url}${InternalPortalRoutesEnum.JOURNAL_OF_CANDIDATES}`}>
            <div className={styles.internalPortal}>
              <RocketOutlined/>
              <h2>Journal of Initial candidates</h2>
              <p>Organized period of training at a particular place</p>
            </div>
          </Link>
        </ProtectedContent>

        <ProtectedContent permission={InternalPortalPermissionEnum.INTERNAL_REPORTS}>
          <Link to={`${url}${InternalPortalRoutesEnum.REPORTS}`}>
            <div className={styles.internalPortal}>
              <BarChartOutlined/>
              <h2>Reports</h2>
              <p>Information presented in an organized format.</p>
            </div>
          </Link>
        </ProtectedContent>

        <ProtectedContent permission={InternalPortalPermissionEnum.INTERNAL_REPORTS}>
          <Link to={`${url}${InternalPortalRoutesEnum.COST_SHEET}`}>
            <div className={styles.internalPortal}>
              <PieChartOutlined />
              <h2>Cost Sheet Management</h2>
              <p>Information about costs presented in an organized format.</p>
            </div>
          </Link>
        </ProtectedContent>
        <ProtectedContent permission={AdminPanelPermissionEnum.ADMIN_USER_PROFILES}>
          <Link to={`${MainRoutesEnum.ADMIN_PANEL}${AdminRoutesEnum.USER_PROFILES}`}>
            <div className={styles.internalPortal}>
              <UsergroupAddOutlined />
              <h2>User profiles</h2>
              <p>Manage user profiles. Review and change user profile data.</p>
            </div>
          </Link>
        </ProtectedContent>
      </div>

      <h3>Forms</h3>
      <div className={styles.gridContainer}>
        <ProtectedContent permission={InternalPortalPermissionEnum.INTERNAL_FORMS_BUILDER}>
          <Link to={`${url}${InternalPortalRoutesEnum.FORMS_BUILDER}`}>
            <div className={styles.theJournalOfInitialCandidates}>
              <FormOutlined/>
              <h2>Exams builder</h2>
              <p>
                Build and manage dynamic forms used for eLearning
              </p>
            </div>
          </Link>
        </ProtectedContent>

        <ProtectedContent permission={InternalPortalPermissionEnum.INTERNAL_FORMS_BUILDER}>
          <Link to={`${url}${InternalPortalRoutesEnum.SURVEY_BUILDER}`}>
            <div className={styles.theJournalOfInitialCandidates}>
              <FormOutlined/>
              <h2>Survey builder</h2>
              <p>
                Build and manage dynamic forms used for seminar survey
              </p>
            </div>
          </Link>
        </ProtectedContent>
      </div>
    </div>
  );
}

export default InternalPortalPageMenu;
