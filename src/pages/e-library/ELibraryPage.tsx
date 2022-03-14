import React from "react";
import MainLayoutComponent from "../../shared/layout/main-layout/MainLayout";
import ComingSoonComponent from "../../shared/components/coming-soon/ComingSoon";
import ElectronicBookLibraryPage from "../admin/electronic-book-library/ElectronicBookLibraryPage";

function ELibraryPage() {
  return (
    <MainLayoutComponent>
      <ElectronicBookLibraryPage />
    </MainLayoutComponent>
  );
}

export default ELibraryPage;
