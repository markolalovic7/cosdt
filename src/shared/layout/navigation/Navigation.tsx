import React, { useState, useRef, useEffect } from "react";
import { Menu, Button } from "antd";
import { Link } from "react-router-dom";
import {
  SettingOutlined,
  HomeOutlined,
  DesktopOutlined,
  SolutionOutlined,
  ReadOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { logoJPG } from "../../../assets/images/";
import styles from "./Navigation.module.scss";
import { MainRoutesEnum } from "../../../model/ui/routes/MainRoutesEnum";
import ProtectedContent from "../../components/protected-route/ProtectedContent";
import { InternalPortalPermissionEnum } from "../../../model/domain/enums/InternalPortalPermissionEnum";
import { GlobalPermissionEnum } from "../../../model/domain/enums/UserPermissionEnum";
import {useRecoilValue} from "recoil";
import {UserProfileAtom} from "../../recoil/UserProfileAtom";

function NavigationComponent() {
  const [width, setWidth] = useState(40);
  // const history = useHistory();
  // const handleOnClick = useCallback(() => history.push('/admin-panel'), [history]);

  // function adminRoute(route: AdminRoutesEnum): string {
  //     return `${MainRoutesEnum.ADMIN_PANEL}${route}`;
  // }
  const profile = useRecoilValue(UserProfileAtom);

  function handleNavMenu() {
    setWidth(300);
  }

  function handleNavMenuClose() {
    setWidth(40);
  }

  /**
   * Component that alerts if you click outside of it
   */
  function OutsideAlerter(props: any) {
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);
    /**
     * Hook that alerts clicks outside of the passed ref
     */
    function useOutsideAlerter(ref: any) {
      useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event: any) {
          if (ref.current && !ref.current.contains(event.target)) {
            setWidth(40);
          }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          // Unbind the event listener on clean up
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [ref]);
    }
    return <div ref={wrapperRef}>{props.children}</div>;
  }

  return (
    <>
      <Button
        type="link"
        className={styles.menuIcon}
        icon={<MenuOutlined />}
        onClick={handleNavMenu}
      ></Button>
      <OutsideAlerter>
        <div className={styles.navigation} style={{ width: `${width}px` }}>
          <Link to="/" className={styles.logo_wrap}>
            <div className={styles.logo}>
              <img alt="COSDT logo" src={logoJPG} />
            </div>
            <span>COSDT</span>
            <Button
              icon={<CloseOutlined />}
              className={styles.closeMenu}
              type={"link"}
              onClick={handleNavMenuClose}
            ></Button>
          </Link>
          {profile && <Menu
            className={styles.navigationMenu}
            defaultSelectedKeys={["1"]}
            mode="inline"
          >
            <Menu.Item key="1" icon={<HomeOutlined />}>
              <Link to={MainRoutesEnum.HOME}>Home</Link>
            </Menu.Item>

            {/* <Menu.Item key="3" icon={<InfoCircleOutlined />}>
              <Link to={MainRoutesEnum.INFORMATIONAL_PORTAL}>Info portal</Link>
            </Menu.Item> */}
            <Menu.Item key="4">
              <ProtectedContent permission={GlobalPermissionEnum.ROLE_GENERAL}>
                <SolutionOutlined />
                <Link to={MainRoutesEnum.E_LEARNING_PORTAL}>E-Library</Link>
              </ProtectedContent>
            </Menu.Item>

            <Menu.Item key="5">
              <ProtectedContent permission={InternalPortalPermissionEnum.INTERNAL_JOURNAL_CANDIDATES}>
                <ReadOutlined />
                <Link to={MainRoutesEnum.JOURNAL_OF_CANDIDATES}>
                  Journal of Initial candidates
                </Link>
              </ProtectedContent>
            </Menu.Item>

            <Menu.Item key="2">
              <ProtectedContent permission={GlobalPermissionEnum.ROLE_INTERNAL_PORTAL}>
                <DesktopOutlined />
                <Link to={MainRoutesEnum.INTERNAL_PORTAL}>Internal portal</Link>
              </ProtectedContent>
            </Menu.Item>

            <Menu.Item key="6">
              <ProtectedContent permission={GlobalPermissionEnum.ROLE_ADMIN_PANEL}>
                <SettingOutlined />
                <Link to={MainRoutesEnum.ADMIN_PANEL}>Admin panel</Link>
              </ProtectedContent>
            </Menu.Item>
          </Menu>}
        </div>
      </OutsideAlerter>
    </>
  );
}

export default NavigationComponent;
