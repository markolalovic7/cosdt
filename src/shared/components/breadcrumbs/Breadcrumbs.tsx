import React from "react";
import { Link } from "react-router-dom";
import withBreadcrumbs from "react-router-breadcrumbs-hoc";
import { AdminRoutesEnum } from "../../../model/ui/routes/AdminRoutesEnum";
import { InternalPortalRoutesEnum } from "../../../model/ui/routes/InternalPortalRoutesEnum";
import styles from "./Breadcrumbs.module.scss";

// define custom breadcrumbs for certain routes.
// breadcumbs can be components or strings.

const DynamicUserBreadcrumb = ({ match }: { match: any }) => (
  <span>{match.params.userName}</span>
);

const routes = [
  {
    path: `/admin-panel${AdminRoutesEnum.USER_PROFILES}/:id/:userName`,
    breadcrumb: DynamicUserBreadcrumb,
  },
];

const PureBreadcrumbs = ({ breadcrumbs }: { breadcrumbs: any }) => {
  return (
    <div className={styles.breadcrumbs}>
      {breadcrumbs.map(
        ({ breadcrumb, match }: { breadcrumb: any; match: any }) => (
          <div className={styles.bc} key={match.url}>
            <Link to={match.url || "/home"}>{breadcrumb}</Link>
            <span>/</span>
          </div>
        )
      )}
    </div>
  );
};

export default withBreadcrumbs(routes, {
  excludePaths: [
    "/",
    `/admin-panel${AdminRoutesEnum.USER_PROFILES}/:id`,
    `/admin-panel${AdminRoutesEnum.EBL}/:id`,
    `/admin-panel${AdminRoutesEnum.USER_CLASSES}/:id`,
    `/admin-panel${AdminRoutesEnum.INSTITUTIONS}/:id`,
    `/admin-panel${AdminRoutesEnum.FUNCTIONS}/:id`,
    `/admin-panel${AdminRoutesEnum.ORGANIZERS}/:id`,
    `/admin-panel${AdminRoutesEnum.LOCATIONS}/:id`,
    `/admin-panel${AdminRoutesEnum.SEMINAR_CATS}/:id`,
    `/admin-panel${AdminRoutesEnum.SEMINAR_CATS}/:id${AdminRoutesEnum.SEMINAR_SUB_CATS}`,
    `/admin-panel${AdminRoutesEnum.SEMINAR_CATS}/:id${AdminRoutesEnum.SEMINAR_SUB_CATS}/:id`,
    `/admin-panel${AdminRoutesEnum.BOOK_CATS}/:id`,
    `/admin-panel${AdminRoutesEnum.BOOK_CATS}/:id${AdminRoutesEnum.BOOK_SUB_CATS}`,
    `/admin-panel${AdminRoutesEnum.BOOK_CATS}/:id${AdminRoutesEnum.BOOK_SUB_CATS}/:id`,
    `/admin-panel${AdminRoutesEnum.COST_CATS}/:id`,
    `/admin-panel${AdminRoutesEnum.COST_CATS}/:id${AdminRoutesEnum.COST_SUB_CATS}`,
    `/admin-panel${AdminRoutesEnum.COST_CATS}/:id${AdminRoutesEnum.COST_SUB_CATS}/:id`,
    `/internal-portal${InternalPortalRoutesEnum.SEMINARS}/:id`,
    `/internal-portal${InternalPortalRoutesEnum.EXAMS}/:id`,
    `/internal-portal${InternalPortalRoutesEnum.TRAINING_CAMP}/:id`,
  ],
})(PureBreadcrumbs);
