import React from "react";
import { useRecoilValue } from 'recoil';
import { Link, Route } from "react-router-dom";
import { LogoutOutlined, IdcardOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import { Configuration } from "../../../core/Configuration";
import styles from "./Header.module.scss";
import { api } from "../../../core/api";
import { AdminRoutesEnum } from "../../../model/ui/routes/AdminRoutesEnum";
import { UserProfileAtom } from "../../recoil/UserProfileAtom";
import avatar from "../../../assets/images/avatar.jpg"
const routes = [
  {
    path: "/",
    exact: true,
    sidebar: () => <div/>,
    main: () => <h3>Home</h3>,
  },
  {
    path: "/admin-panel",
    exact: true,
    sidebar: () => <div/>,
    main: () => <h3>Admin panel</h3>,
  },
  {
    path: "/calendar",
    exact: true,
    sidebar: () => <div/>,
    main: () => <h3>Kalendar</h3>,
  },
  {
    path: "/internal-portal",
    exact: true,
    sidebar: () => <div/>,
    main: () => <h3>Internal portal</h3>,
  },
  {
    path: "/internal-portal/calendar-management",
    exact: true,
    sidebar: () => <div/>,
    main: () => <h3>Internal portal</h3>,
  },
  {
    path: "/internal-portal/seminars",
    exact: true,
    sidebar: () => <div/>,
    main: () => <h3>Internal portal</h3>,
  },
  {
    path: "/internal-portal/seminars/:id/:seminarName/:key",
    exact: true,
    sidebar: () => <div/>,
    main: () => <h3>Internal portal</h3>,
  },
  {
    path: "/internal-portal/seminars/:id/:seminarName",
    exact: true,
    sidebar: () => <div/>,
    main: () => <h3>Internal portal</h3>,
  },
  {
    path: "/informational-portal",
    exact: true,
    sidebar: () => <div/>,
    main: () => <h3>Info portal</h3>,
  },
  {
    path: "/internal-portal/training-camp",
    exact: true,
    sidebar: () => <div/>,
    main: () => <h3>Info portal</h3>,
  },
  {
    path: "/internal-portal/training-camp/:id",
    exact: true,
    sidebar: () => <div/>,
    main: () => <h3>Info portal</h3>,
  },
  {
    path: "/e-learning-portal",
    exact: true,
    sidebar: () => <div/>,
    main: () => <h3>E-Library</h3>,
  },
  {
    path: "/the-journal-of-initial-candidates",
    exact: true,
    sidebar: () => <div/>,
    main: () => <h3>Journal of Initial candidates</h3>,
  },
  {
    path: "/admin-panel/seminar-cats-and-subcats",
    sidebar: () => <p>Seminar categories and subcategories</p>,
    main: () => <h3>Admin panel</h3>,
  },
  {
    path: "/admin-panel/book-cats-and-subcats",
    sidebar: () => <p>Book Categories and Subcategories</p>,
    main: () => <h3>Admin panel</h3>,
  },
  {
    path: "/admin-panel/activity-log",
    sidebar: () => <p>Activity logs</p>,
    main: () => <h3>Admin panel</h3>,
  },
  {
    path: "/admin-panel/institutions",
    sidebar: () => <p>Institutions</p>,
    main: () => <h3>Admin panel</h3>,
  },
  {
    path: "/admin-panel/functions",
    sidebar: () => <p>Functions</p>,
    main: () => <h3>Admin panel</h3>,
  },
  {
    path: "/admin-panel/organizers",
    sidebar: () => <p>Organizers</p>,
    main: () => <h3>Admin panel</h3>,
  },
  {
    path: "/admin-panel/locations",
    sidebar: () => <p>Locations</p>,
    main: () => <h3>Admin panel</h3>,
  },
  {
    path: "/admin-panel/data-vault",
    sidebar: () => <p>DataVault</p>,
    main: () => <h3>Admin panel</h3>,
  },
  {
    path: "/admin-panel/electronic-book-library",
    sidebar: () => <p>E-book library</p>,
    main: () => <h3>Admin panel</h3>,
  },
  {
    path: "/admin-panel/user-profiles",
    sidebar: () => (
      <>
        <p>User profiles</p>
      </>
    ),
    main: () => <h3>Admin panel</h3>,
  },
  // {
  //   path: '/admin-panel/user-profiles/:userProfileId',
  //   sidebar: () => <p className={styles.userId}>Username</p>,
  //   //sidebar2: () => <p>{path}</p>,
  //   //main: () => <h3>Admin panel</h3>
  // },
  {
    path: "/admin-panel/user-classes",
    sidebar: () => <p>User classes</p>,
    main: () => <h3>Admin panel</h3>,
  },
  {
    path: "/admin-panel/seminar-cats",
    sidebar: () => <p>Seminar categories & subcategories</p>,
    main: () => <h3>Admin panel</h3>,
  },
  {
    path: "/admin-panel/book-cats",
    sidebar: () => <p>Book categories & subcategories</p>,
    main: () => <h3>Admin panel</h3>,
  },
  {
    path: "/admin-panel/cost-cats",
    sidebar: () => <p>Cost categories & subcategories</p>,
    main: () => <h3>Admin panel</h3>,
  },
  {
    path: "/admin-panel/forms-management",
    sidebar: () => <p>Forms management</p>,
    main: () => <h3>Admin panel</h3>,
  },
];

function HeaderComponent() {
  const profile = useRecoilValue(UserProfileAtom);

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Link
          to={`/admin-panel${AdminRoutesEnum.USER_PROFILES}/${profile?.id}/${profile?.username}`}
        >
          <IdcardOutlined />
          {profile?.firstName} {profile?.lastName} / Profile
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">
        <a href={`${Configuration.apiUrl}/logout`}>
          <LogoutOutlined />
          Logout
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.headerBreadcrumbsWrap}>
      <header>
        <div className={styles.breadcrumbs}>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.main}
            />
          ))}
        </div>
        <div className={styles.logout} id="login-wrap">
          <Dropdown
            getPopupContainer={(trigger) => trigger}
            overlay={menu}
            placement="bottomRight"
          >
            <div
              style={{
                backgroundImage: profile?.photo
                  ? `url(${api.userProfile.getProfilePhotoUrl(
                    profile.photo as string
                  )})`
                  : `url(${avatar})`,
              }}
              className={styles.profilePhoto}
            />
          </Dropdown>
        </div>
      </header>
    </div>
  );
}

export default HeaderComponent;
