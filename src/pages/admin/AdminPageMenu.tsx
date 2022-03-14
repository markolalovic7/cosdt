import React from "react";
import { Link, useRouteMatch } from "react-router-dom";

import styles from "./AdminPage.module.scss";
import {
  ApartmentOutlined,
  AppstoreOutlined,
  BankOutlined,
  ToolOutlined,
  DatabaseOutlined,
  BookOutlined,
  BarChartOutlined,
  CrownOutlined,
  EnvironmentOutlined,
  ContactsOutlined,
  UsergroupAddOutlined,
  UserSwitchOutlined,
  FileWordOutlined,
} from "@ant-design/icons";
import { AdminRoutesEnum } from "../../model/ui/routes/AdminRoutesEnum";
import { AdminPanelPermissionEnum } from "../../model/domain/enums/AdminPanelPermissionEnum";
import ProtectedContent from "../../shared/components/protected-route/ProtectedContent";

function AdminPageMenu() {
  let { url } = useRouteMatch();

  return (
    <div className={"container"}>
      <div className={styles.contentHeader}>
        {/* <div className={styles.contentImg}>
                    <img alt="COSDT logo" src={logo} />
                </div> */}
        <div className={styles.contentInfo}>
          <h1>Admin panel</h1>
          <p>
            Admin panel is a control Panel that contains tools for system
            administrators and advanced users. Here you can manage users,
            categories, eLibrary data vault, activity log...
          </p>
        </div>
      </div>

      <h3>Glavni entiteti</h3>
      <div className={styles.gridContainer}>
        <ProtectedContent permission={AdminPanelPermissionEnum.ADMIN_DATA_VALUT}>
          <Link to={`${url}${AdminRoutesEnum.DATA_VAULT}`}>
            <div className={styles.eLearningPortal}>
              <DatabaseOutlined />
              <h2>DataVault</h2>
              <p>List of uploaded files on the system</p>
            </div>
          </Link>
        </ProtectedContent>
        <ProtectedContent permission={AdminPanelPermissionEnum.ADMIN_E_LIBRARY}>
          <Link to={`${url}${AdminRoutesEnum.EBL}`}>
            <div className={styles.theJournalOfInitialCandidates}>
              <BookOutlined />
              <h2>E-Library</h2>
              <p>E-library management</p>
            </div>
          </Link>
        </ProtectedContent>
        <ProtectedContent permission={AdminPanelPermissionEnum.ADMIN_ACTIVITY_LOG}>
          <Link to={`${url}${AdminRoutesEnum.ACTIVITY_LOG}`}>
            <div className={styles.adminPanel}>
              <AppstoreOutlined />
              <h2>Activity logs</h2>
              <p>Activity</p>
            </div>
          </Link>
        </ProtectedContent>
      </div>

      <h3>User management</h3>
      <div className={styles.gridContainer}>
        <ProtectedContent permission={AdminPanelPermissionEnum.ADMIN_USER_PROFILES}>
          <Link to={`${url}${AdminRoutesEnum.USER_PROFILES}`}>
            <div className={styles.internalPortal}>
              <UsergroupAddOutlined />
              <h2>User profiles</h2>
              <p>Manage user profiles. Review and change user profile data.</p>
            </div>
          </Link>
        </ProtectedContent>

        <ProtectedContent permission={AdminPanelPermissionEnum.ADMIN_USER_CLASSES}>
          <Link to={`${url}${AdminRoutesEnum.USER_CLASSES}`}>
            <div className={styles.internalPortal}>
              <UserSwitchOutlined />
              <h2>User classes</h2>
              <p>
                Manage user classes. Create, update or delate user classifications
                that are available in the system.
            </p>
            </div>
          </Link>
        </ProtectedContent>
      </div>

      <h3>Categories & Subcategories</h3>
      <div className={styles.gridContainer}>
        <ProtectedContent permission={AdminPanelPermissionEnum.ADMIN_SEMINAR_CATS}>
          <Link to={`${url}${AdminRoutesEnum.SEMINAR_CATS}`}>
            <div className={styles.internalPortal}>
              <ApartmentOutlined />
              <h2>Seminar C&S</h2>
              <p>Manage seminar categories and sub-categories</p>
            </div>
          </Link>
        </ProtectedContent>

        <ProtectedContent permission={AdminPanelPermissionEnum.ADMIN_BOOK_CATS}>
          <Link to={`${url}${AdminRoutesEnum.BOOK_CATS}`}>
            <div className={styles.informationalPortal}>
              <ApartmentOutlined />
              <h2>Book C&S</h2>
              <p>Manage book categories and sub-categories</p>
            </div>
          </Link>
        </ProtectedContent>

        <ProtectedContent permission={AdminPanelPermissionEnum.ADMIN_COST_CATS}>
          <Link to={`${url}${AdminRoutesEnum.COST_CATS}`}>
            <div>
              <ApartmentOutlined />
              <h2>Cost C&S</h2>
              <p>Manage cost categories and sub-categories</p>
            </div>
          </Link>
        </ProtectedContent>

        <ProtectedContent permission={AdminPanelPermissionEnum.ADMIN_EXAM_CATS}>
          <Link to={`${url}${AdminRoutesEnum.EXAM_CATS}`}>
            <div className={styles.eLearningPortal}>
              <ApartmentOutlined />
              <h2>Exam C&S</h2>
              <p>Manage exam categories and sub-categories</p>
            </div>
          </Link>
        </ProtectedContent>
      </div>

      <h3>Dictionaries</h3>
      <div className={styles.gridContainer}>
        <ProtectedContent permission={AdminPanelPermissionEnum.ADMIN_INSTITUTIONS}>
          <Link to={`${url}${AdminRoutesEnum.INSTITUTIONS}`}>
            <div className={styles.theJournalOfInitialCandidates}>
              <BankOutlined />
              <h2>Institutions</h2>
              <p>Administer your institution list</p>
            </div>
          </Link>
        </ProtectedContent>

        <ProtectedContent permission={AdminPanelPermissionEnum.ADMIN_FUNCTIONS}>
          <Link to={`${url}${AdminRoutesEnum.FUNCTIONS}`}>
            <div className={styles.theJournalOfInitialCandidates}>
              <CrownOutlined />
              <h2>Functions</h2>
              <p>Administer your functions list</p>
            </div>
          </Link>
        </ProtectedContent>

        <ProtectedContent permission={AdminPanelPermissionEnum.ADMIN_ORGANIZERS}>
          <Link to={`${url}${AdminRoutesEnum.ORGANIZERS}`}>
            <div className={styles.theJournalOfInitialCandidates}>
              <ToolOutlined />
              <h2>Organizers</h2>
              <p>Administer your organizers list</p>
            </div>
          </Link>
        </ProtectedContent>

        <ProtectedContent permission={AdminPanelPermissionEnum.ADMIN_LOCATIONS}>
          <Link to={`${url}${AdminRoutesEnum.LOCATIONS}`}>
            <div className={styles.theJournalOfInitialCandidates}>
              <EnvironmentOutlined />
              <h2>Locations</h2>
              <p>Administer your locations list</p>
            </div>
          </Link>
        </ProtectedContent>

        <ProtectedContent permission={AdminPanelPermissionEnum.ADMIN_CLASS_MODULES}>
          <Link to={`${url}${AdminRoutesEnum.MODULES}`}>
            <div className={styles.theJournalOfInitialCandidates}>
              <ContactsOutlined />
              <h2>Class modules</h2>
              <p>Administer your class modules</p>
            </div>
          </Link>
        </ProtectedContent>
      </div>
      <h3>Other</h3>
      <div className={styles.gridContainer}>
        <ProtectedContent permission={AdminPanelPermissionEnum.ADMIN_REPORT_DEFINITONS}>
          <Link to={`${url}${AdminRoutesEnum.REPORT_DEFINITIONS}`}>
            <div className={styles.informationalPortal}>
              <BarChartOutlined />
              <h2>Report definitions</h2>
              <p>Information presented in an organized format</p>
            </div>
          </Link>
        </ProtectedContent>

        <ProtectedContent permission={AdminPanelPermissionEnum.ADMIN_WORD_TEMPLATES}>
          <Link to={`${url}${AdminRoutesEnum.WORD_TEMPLATES}`}>
            <div className={styles.informationalPortal}>
              <FileWordOutlined />
              <h2>Certificates word templates</h2>
              <p>Upload templates for certificates</p>
            </div>
          </Link>
        </ProtectedContent>
      </div>
    </div>
  );
}

export default AdminPageMenu;
