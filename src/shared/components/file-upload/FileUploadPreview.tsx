import { Button, Modal, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import styles from "./FileUpload.module.scss";

import { BrowserFile, BrowserFileType } from "./FileUpload";

import {
  DeleteOutlined,
  EyeOutlined,
  FilePdfOutlined,
  FileOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import DefaultSpinner from "../spinners/DefaultSpinner";

interface FileUploadPreviewProps {
  file: BrowserFile;
  onDelete(): void;
  showPreview: boolean;
}

function FileUploadPreviewComponent({
  file,
  onDelete,
  showPreview,
}: FileUploadPreviewProps) {
  const [preview, setPreview] = useState<string>();
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(true);

  useEffect(() => {
    loadPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPreview = async () => {
    if (file.type !== BrowserFileType.OTHER) {
      if (file.file) {
        setPreview(URL.createObjectURL(file.file));
      } else if (file.url) {
        setPreview(file.url);
      }
    }
    if (file.type !== BrowserFileType.IMAGE) setIsPreviewLoading(false);
  };

  const handleOpenPreview = () => {
    setShowPreviewModal(true);
  };

  const handleDownload = () => {
    let content;
    if (file.file) content = preview ? preview : URL.createObjectURL(file.file);
    else if (file.url) content = file.url;
    const a = document.createElement("a");
    if (content) a.setAttribute("href", content);
    a.setAttribute("download", file.name || "");
    a.target = "_blank";
    a.click();
  };

  return (
    <React.Fragment>
      <Tooltip title={file.name}>
        <div className={styles.filePreview}>
          {file.type === BrowserFileType.IMAGE && (
            <img
              src={preview}
              alt={file.name}
              onLoad={() => setIsPreviewLoading(false)}
            />
          )}
          {file.type === BrowserFileType.PDF && (
            <FilePdfOutlined className={styles.fileIcon} />
          )}
          {file.type === BrowserFileType.OTHER && (
            <FileOutlined className={styles.fileIcon} />
          )}
          {isPreviewLoading && (
            <div className={styles.spinnerPreview}>
              <DefaultSpinner />
            </div>
          )}
          <div className={styles.fileActions}>
            {preview && showPreview && !isPreviewLoading && (
              <Button
                icon={<EyeOutlined />}
                type="link"
                onClick={handleOpenPreview}
              />
            )}
            <Button
              icon={<DownloadOutlined />}
              type="link"
              onClick={handleDownload}
            />
            <Button icon={<DeleteOutlined />} type="link" onClick={onDelete} />
          </div>
        </div>
      </Tooltip>
      <Modal
        visible={showPreviewModal}
        className={"bigModal"}
        //closable={false}
        footer={<Button onClick={() => setShowPreviewModal(false)}>Ok</Button>}
      >
        <div className={styles.previewModalContainer}>
          {file.type === BrowserFileType.IMAGE && (
            <img src={preview} alt={file.name} />
          )}
          {file.type === BrowserFileType.PDF && (
            <embed src={preview} type="application/pdf" />
          )}
        </div>
      </Modal>
    </React.Fragment>
  );
}

export default FileUploadPreviewComponent;
