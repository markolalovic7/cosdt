import React from "react";
import {Link} from "react-router-dom";
import {useRecoilValue} from 'recoil';
import styles from "./HomePage.module.scss";
import {logoWhite} from "../../assets/images/";
import {
  CalendarOutlined,
  SettingOutlined,
  DesktopOutlined,
  RobotOutlined,
  UserSwitchOutlined,
  TeamOutlined,
  GlobalOutlined,
  BookOutlined,
} from "@ant-design/icons";
import {MainRoutesEnum} from "../../model/ui/routes/MainRoutesEnum";
import MainLayoutComponent from "../../shared/layout/main-layout/MainLayout";
import {AdminRoutesEnum} from "../../model/ui/routes/AdminRoutesEnum";
import {GlobalPermissionEnum} from "../../model/domain/enums/UserPermissionEnum";
import {UserProfileAtom} from "../../shared/recoil/UserProfileAtom";
import ProtectedContent from "../../shared/components/protected-route/ProtectedContent";

function HomePage() {
  const profile = useRecoilValue(UserProfileAtom);


  return (
    <MainLayoutComponent>
      <div className={styles.contentHeader}>
        <div className={styles.contentImg}>
          <img alt="COSDT logo" src={logoWhite}/>
        </div>
        <div className={styles.contentInfo}>
          <div>
            <h1>COSDT</h1>
            <p>
              {" "}
              <b>Centar za obuku u sudstvu i državnom tužilaštvu. </b>
              Centar za edukaciju sudija i Državno tužilaštvo (pravni sledbenik
              Centra za edukaciju sudija) organizuju i sprovode obuku sudija i
              državnih tužilaca, kao i drugih pravosudnih profesija, u skladu sa
              posebnim programima obuke, obučavaju predavače i mentore, kao i savjetnike,
              službenike i pripravnike u sudovima i državnim tužilaštvima,
              uspostavlja međunarodnu saradnju sa domaćim i međunarodnim organizacijama i
              institucijama i obavlja druge poslove propisane
              <b> Zakonom o Centru za obuku sudija i Državnom tužilaštvu
              </b>
            </p>
          </div>
        </div>
      </div>
      <div className={"container"}>
        <ProtectedContent permission={GlobalPermissionEnum.ROLE_GENERAL}>
          <h3>Info portal</h3>
          <div className={styles.gridContainer}>
            <Link to={MainRoutesEnum.CALENDAR}>
              <div className={styles.calendar}>
                <CalendarOutlined/>
                <h2>Kalendar</h2>
                <p>Pogledajte i unesite zakazane događaje, treninge, seminare...</p>
              </div>
            </Link>
            <Link to={MainRoutesEnum.E_LEARNING_PORTAL}>
              <div className={styles.eLearningPortal}>
                <BookOutlined/>
                <h2>E-biblioteka</h2>
                <p>Platforma za E-learning</p>
              </div>
            </Link>
            <Link
              to={`${MainRoutesEnum.ADMIN_PANEL}${AdminRoutesEnum.USER_PROFILES}/${profile?.id}/${profile?.username}/attendance`}
            >
              <div className={styles.basicInfo}>
                <RobotOutlined/>
                <h2>Prisustvo</h2>
                <p>Prisustvo seminarima</p>
              </div>
            </Link>
            <Link
              to={`${MainRoutesEnum.ADMIN_PANEL}${AdminRoutesEnum.USER_PROFILES}/${profile?.id}/${profile?.username}/seminar-lectures`}
            >
              <div className={styles.basicInfo}>
                <TeamOutlined/>
                <h2>Predavanja</h2>
                <p>Predavanja na seminarima</p>
              </div>
            </Link>
            <Link
              to={`${MainRoutesEnum.ADMIN_PANEL}${AdminRoutesEnum.USER_PROFILES}/${profile?.id}/${profile?.username}/mentorship`}
            >
              <div className={styles.basicInfo}>
                <UserSwitchOutlined/>
                <h2>Mentorstvo</h2>
                <p>
                  Smjernice koje pruža mentor, posebno iskusano
                  lice u preduzeću ili obrazovnoj ustanovi
                </p>
              </div>
            </Link>
            <Link
              to={`${MainRoutesEnum.ADMIN_PANEL}${AdminRoutesEnum.USER_PROFILES}/${profile?.id}/${profile?.username}/lectures`}
            >
              <div className={styles.basicInfo}>
                <TeamOutlined/>
                <h2>Predavanja</h2>
                <p>Aktivna / Završena</p>
              </div>
            </Link>
            <Link
              to={`${MainRoutesEnum.ADMIN_PANEL}${AdminRoutesEnum.USER_PROFILES}/${profile?.id}/${profile?.username}/elearning`}
            >
              <div className={styles.basicInfo}>
                <GlobalOutlined/>
                <h2>E-Learning</h2>
                <p>Online učenje</p>
              </div>
            </Link>
          </div>
        </ProtectedContent>
        <h3>Administration</h3>
        <div className={styles.gridContainer}>
          <ProtectedContent permission={GlobalPermissionEnum.ROLE_INTERNAL_PORTAL}>
            <Link to={MainRoutesEnum.INTERNAL_PORTAL}>
              <div className={styles.internalPortal}>
                <DesktopOutlined/>
                <h2>Internal portal</h2>
                <p>Internal portal for COSuser users</p>
              </div>
            </Link>
          </ProtectedContent>
          <ProtectedContent permission={GlobalPermissionEnum.ROLE_ADMIN_PANEL}>
            <Link to={MainRoutesEnum.ADMIN_PANEL}>
              <div className={styles.adminPanel}>
                <SettingOutlined/>
                <h2>Admin panel</h2>
                <p>Admin panel</p>
              </div>
            </Link>
          </ProtectedContent>
        </div>
      </div>
    </MainLayoutComponent>
  );
}

export default HomePage;
