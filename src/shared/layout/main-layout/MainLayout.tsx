import React from "react";

import FooterComponent from "../footer/Footer";
import styles from "./MainLayout.module.scss";
import HeaderComponent from "../header/Header";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";

interface MainLayoutProps extends React.HTMLAttributes<HTMLElement> {
  style?: React.CSSProperties;
}

function MainLayoutComponent({ style = {}, children }: MainLayoutProps) {
  return (
    <>
      <HeaderComponent />
      <div className={styles.mainLayout}>
        <main className={styles.mainContentWrap} style={style}>
          <div className={styles.breadcrumbsWrap}>
            <Breadcrumbs />
          </div>
          {children}
        </main>
        <FooterComponent />
      </div>
    </>
  );
}

export default MainLayoutComponent;
