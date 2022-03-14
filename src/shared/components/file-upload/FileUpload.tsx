import React, { ChangeEvent, useRef } from 'react';
import { Button } from 'antd';
import styles from './FileUpload.module.scss';
import FileUploadPreviewComponent from './FileUploadPreview';

import {
  UploadOutlined
} from '@ant-design/icons';

interface FileUploadProps {
  file?: Array<BrowserFile> | BrowserFile,
  onChange?: Function,
  multiple?: boolean,
  accept?: string,
  preview?: boolean;
}

export interface BrowserFile {
  name: string;
  type: BrowserFileType;
  file?: File;
  url?: string;
}

export enum BrowserFileType {
  IMAGE = "IMAGE",
  PDF = "PDF",
  OTHER = "OTHER"
}

const getFileType = (mime: string): BrowserFileType => {
  if(mime.includes('image/'))
    return BrowserFileType.IMAGE;
  else if(mime.includes('/pdf'))
    return BrowserFileType.PDF;
  else
    return BrowserFileType.OTHER;
}

const FileUploadComponent = ({file, onChange, multiple = true, accept, preview = true}: FileUploadProps) => {
  const input = useRef<HTMLInputElement>(null);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if(selectedFiles?.length) {
      if(!multiple) {
        let file = selectedFiles[0];
        onChange && onChange({
          name: file.name,
          type: getFileType(file.type),
          file: file
        });
      }
      else {
        const files: Array<BrowserFile> = [];
        for(let file of selectedFiles) {
          files.push({
            name: file.name,
            type: getFileType(file.type),
            file: file
          })
        }
        onChange && onChange(files);
      }
    }
  }

  const handleDelete = (index?: number) => {
    if(multiple) {
      index && onChange && onChange([...file].splice(index, 1));
    }
    else {
      onChange && onChange(null);
    }
  }

  const handleClick = () => {
    input.current!.value = "";
    input.current?.click();
  };

  return (
    <div className={styles.fileList}>
      { multiple
        ? (file as Array<BrowserFile>).map((file, index) =>
            <FileUploadPreviewComponent
              key={index}
              file={file}
              onDelete={() => handleDelete(index)}
              showPreview={preview}
            />
          )
        : file && <FileUploadPreviewComponent
            file={file as BrowserFile}
            onDelete={() => handleDelete()}
            showPreview={preview}
          />
      }
      {(multiple || !file) &&
      <Button onClick={handleClick} className={`${styles.filePreview} ${styles.uploadNew}`}>
        <UploadOutlined  />
        <div>Odaberi</div>
      </Button>}
      <input
        ref={input}
        onChange={handleChange}
        type="file"
        style={{display:'none'}}
        multiple={multiple}
        accept={accept}
      />
    </div>
  );
}

export default FileUploadComponent;
