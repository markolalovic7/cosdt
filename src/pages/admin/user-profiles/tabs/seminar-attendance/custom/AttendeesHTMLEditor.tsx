import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import {
  ContentState,
  EditorState,
  convertFromHTML,
  convertToRaw,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { api } from "../../../../../../core/api";
import { Logger } from "../../../../../../core/logger";
import { FetchStateEnum } from "../../../../../../model/ui/enums/FetchStateEnum";
import { FailNotification } from "../../../../../../shared/components/notifications/Notification";

interface AttendeesHTMLEditorProps {
  confirmText?: string;
  onOk(invitationHtml: string): Promise<void>;
  onCancel(): void;
  userName?: string;
  template: "certificate" | "invitation";
}

function AttendeesHTMLEditorComponent({
  onOk,
  onCancel,
  confirmText,
  userName = "",
  template = "invitation",
}: AttendeesHTMLEditorProps) {
  const textToConvert = getTemplate();
  const blocksFromHTML = convertFromHTML(textToConvert);
  const mentionConfig = {
    separator: " ",
    trigger: "@",
  };

  const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
  const [templates, setTemplates] = useState<Array<string>>([]);
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(
      ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      )
    )
  );

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getTemplate() {
    if (template === "certificate") return `Cert template: Dragi ${userName},`;
    else if (template === "invitation")
      return `Invitation template: Dragi ${userName},`;
    else return "";
  }

  function getModalTitle() {
    if (template === "certificate") return `Send certificate`;
    else if (template === "invitation") return `Send invitation`;
    else return "";
  }

  function onEditorStateChange(editorState: EditorState) {
    setEditorState(editorState);
  }

  async function loadData() {
    try {
      setLoading(FetchStateEnum.LOADING);
      setTemplates(await api.seminar.getTemplateOptions());
      setLoading(FetchStateEnum.LOADED);
    } catch (error) {
      FailNotification("Loading data error. Check the logs.");
      Logger.error(error);
      setLoading(FetchStateEnum.FAILED);
    }
  }

  async function handleOk() {
    try {
      setLoading(FetchStateEnum.LOADING);
      const rawContentState = convertToRaw(editorState.getCurrentContent());
      await onOk(draftToHtml(rawContentState, mentionConfig));
      onCancel();
    } catch (e) {
      setLoading(FetchStateEnum.LOADED);
    }
  }

  return (
    <Modal
      visible={true}
      className={"bigModal"}
      okText={confirmText || "Send"}
      title={getModalTitle()}
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnClose
      //confirmLoading={loading === FetchStateEnum.LOADING}
      maskClosable={false}
    >
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={onEditorStateChange}
        mention={{
          ...mentionConfig,
          suggestions: templates.map((template) => ({
            text: template,
            value: template,
          })),
        }}
      />
    </Modal>
  );
}

export default AttendeesHTMLEditorComponent;
