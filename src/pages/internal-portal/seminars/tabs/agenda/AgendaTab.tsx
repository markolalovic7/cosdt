import React, {useEffect, useState} from "react";
import {Route, useHistory, useRouteMatch} from "react-router-dom";
import {saveAs} from "file-saver";
import moment from "moment";
import {Button, Checkbox, Col, Divider, Modal, Row, Skeleton, Timeline,} from "antd";
import {DeleteOutlined, DownloadOutlined, EditOutlined, ExclamationCircleOutlined,} from "@ant-design/icons";

import styles from "./Agenda.module.scss";

import {api} from "../../../../../core/api";
import {Logger} from "../../../../../core/logger";
import {backLink, DefaultDateFormat, DefaultTimeFormat,} from "../../../../../core/Utils";
import {SeminarAgenda} from "../../../../../model/domain/classes/SeminarAgenda";
import {FetchStateEnum} from "../../../../../model/ui/enums/FetchStateEnum";
import {ApiParams} from "../../../../../model/ui/types/ApiParams";
import {FailNotification, SuccessNotification,} from "../../../../../shared/components/notifications/Notification";
import {UserProfile} from "../../../../../model/domain/classes/UserProfile";
import AgendaTabDetails from "./AgendaTabDetails";
import {CheckboxValueType} from "antd/es/checkbox/Group";
import {PaperClipOutlined} from "@ant-design/icons/lib";
import {GenderEnum} from "../../../../../model/domain/enums/GenderEnum";

const {confirm} = Modal;

function AgendaTab() {
    const [records, setRecords] = useState<Array<SeminarAgenda>>([]);
    const [loading, setLoading] = useState<FetchStateEnum>(FetchStateEnum.NONE);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [nextTime, setNextTime] = useState<string>();
    const [indeterminate, setIndeterminate] = React.useState(false);
    const [checkedList, setCheckedList] = useState<CheckboxValueType[] | undefined>([]);
    const [checkAll, setCheckAll] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    let {params, url, isExact, path} = useRouteMatch<SeminarParams>();
    let history = useHistory();

    const getLecturers = () => {
        let array: any = [];
        // eslint-disable-next-line array-callback-return
        records.map((item) => {
            // eslint-disable-next-line array-callback-return
            item.profiles.map((single) => {
                array.push({
                    value: single.id,
                    label: single.firstName + " " + single.lastName,
                });
            });
        });
        //@ts-ignore
        let uniqueArray = Array.from(new Set(array.map(JSON.stringify))).map(
            //@ts-ignore
            JSON.parse
        );
        let values: CheckboxValueType[] = [];
        // eslint-disable-next-line array-callback-return
        uniqueArray.map((item) => {
            values.push(item.value);
        });
        const onCheckAllChange = (e: any) => {
            e.target.checked ? setCheckedList(values) : setCheckedList(undefined);
            setIndeterminate(false);
            setCheckAll(e.target.checked);
        };
        const onGroupChange = (checkedList: any) => {
            if (values.length > checkedList.length && checkedList.length > 0) {
                setIndeterminate(true);
            }
            if (values.length === checkedList.length) {
                setCheckAll(true);
                setIndeterminate(false);
            }
            if (checkedList.length === 0) {
                setCheckAll(false);
                setIndeterminate(false);
            }
            setCheckedList(checkedList);
        };
        return (
            <>
                <Checkbox
                    indeterminate={indeterminate}
                    checked={checkAll}
                    onChange={onCheckAllChange}
                >
                    Check all
                </Checkbox>
                <Divider/>
                <Checkbox.Group
                    name="checkbox-group"
                    options={uniqueArray}
                    onChange={onGroupChange}
                    value={checkedList}
                    style={{display: "flex", flexDirection: "column"}}
                />
            </>
        );
    };

    async function handleDownload(ids: any, seminarId: number) {
        try {
            const data = await api.seminarAttendee.downloadCertificateForLecturers(
                ids,
                [seminarId],
            );
            let blob = new Blob([data], {type: "application/zip"});
            saveAs(blob, `certificates.zip`);
            SuccessNotification("Download started.");
        } catch (error) {
            FailNotification("Download error.");
            Logger.error(error);
        } finally {
            setLoading(FetchStateEnum.LOADED);
        }
    }

    useEffect(() => {
        (isExact || loading === FetchStateEnum.NONE) && loadData();
        api.seminar.get(parseInt(params.seminarId)).then((res) => {
            setIsLocked(res.locked);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isExact]);

    function showConfirm(id: number) {
        confirm({
            title: "Are you sure?",
            icon: <ExclamationCircleOutlined/>,
            // content: "Some descriptions",
            onOk: async () => handleDelete(id),
        });
    }

    function calculateDuration(record: SeminarAgenda) {
        const duration = moment.duration(
            moment(record.end).diff(moment(record.start))
        );

        return `${duration.hours()}h ${duration.minutes()}m`;
    }

    async function loadData() {
        try {
            setLoading(FetchStateEnum.LOADING);
            const apiParams: ApiParams = {
                "seminarId.equals": params.seminarId,
            };
            let data = await api.seminarAgenda.getAll(apiParams);
            //@ts-ignore
            data.sort((a, b) => (a.start < b.start ? 1 : b.start < a.start ? -1 : 0));
            setRecords(data);
            //@ts-ignore
            setLoading(FetchStateEnum.LOADED);
            // @ts-ignore
            data.length > 0 && setNextTime(data[0].end);
            history.push("agenda");
        } catch (error) {
            FailNotification("Loading data error. Check the logs.");
            Logger.error(error);
            setLoading(FetchStateEnum.FAILED);
        }
    }

    async function handleUpdate(id: number): Promise<void> {
        const rootUrl = params.id ? backLink(url) : url;
        history.replace(`${rootUrl}/${id}`);
    }

    async function handleDelete(id: number) {
        try {
            setLoading(FetchStateEnum.LOADING);
            await api.seminarAgenda.delete(id);
            let data = [...records];
            const recordIndex = data.findIndex((rec) => rec.id === id);
            data.splice(recordIndex, 1);
            setRecords(data);
            data.length > 0 && setNextTime(data[0].end);
            SuccessNotification("Agenda item deleted.");
        } catch (error) {
            FailNotification("Deleting error.");
            Logger.error(error);
        } finally {
            setLoading(FetchStateEnum.LOADED);
        }
    }

    async function getDocx(id: number, name: string) {
        try {
            //setLoading(FetchStateEnum.LOADING);
            const data = await api.seminarAgenda.getDocx(id);
            let blob = new Blob([data], {type: "application/docx"});
            saveAs(blob, `${name}.docx`);
            SuccessNotification("Download started.");
        } catch (error) {
            FailNotification("Download error.");
            Logger.error(error);
        } finally {
            setLoading(FetchStateEnum.LOADED);
        }
    }

    async function getPdf(id: number, name: string) {
        try {
            //setLoading(FetchStateEnum.LOADING);
            const data = await api.seminarAgenda.getPdf(id);
            let blob = new Blob([data], {type: "application/pdf"});
            saveAs(blob, `${name}.pdf`);
            SuccessNotification("Download started.");
        } catch (error) {
            FailNotification("Download error.");
            Logger.error(error);
        } finally {
            setLoading(FetchStateEnum.LOADED);
        }
    }

    return (
        <React.Fragment>
            <div style={{display: "flex"}}>
                <h1>Agenda</h1>
                {isLocked && (
                    <Button
                        type="primary"
                        onClick={() => {
                            setShowModal(true);
                        }}
                    >
                        Lecturers
                    </Button>
                )}
            </div>
            <main className={styles.mainContentWrap}>
                <div className={"agendaWrap"}>
                    <Row className="agenda-row">
                        <Col span={12} className="agenda-col">
                            <div>
                                <div className={styles.agendaDownload}>
                                    <Button
                                        type="default"
                                        icon={<DownloadOutlined/>}
                                        onClick={() => getPdf(parseInt(params.seminarId), "agenda")}
                                        style={{marginRight: "10px"}}
                                    >
                                        PDF
                                    </Button>
                                    <Button
                                        type="default"
                                        icon={<DownloadOutlined/>}
                                        onClick={() =>
                                            getDocx(parseInt(params.seminarId), "agenda")
                                        }
                                        style={{marginRight: "-25px"}}
                                    >
                                        Word
                                    </Button>

                                </div>
                                <br/>
                                {loading === FetchStateEnum.LOADING && <Skeleton active/>}
                                {loading === FetchStateEnum.LOADED && (
                                    <Timeline mode={"left"} className={styles.timelineAgenda}>
                                        {records.map((record: SeminarAgenda) => (
                                            <Timeline.Item
                                                key={record.id}
                                                label={moment(record.start).format(
                                                    `${DefaultDateFormat} ${DefaultTimeFormat}`
                                                )}
                                            >
                                                <p className={styles.agendaItem}>
                                                    <b>
                                                        {/* <FileTextOutlined /> */}
                                                        Theme:
                                                    </b>
                                                    <span>{record.name}</span>
                                                </p>
                                                {record.description && (
                                                    <p className={styles.agendaItem}>
                                                        <b>
                                                            {/* <FileTextOutlined /> */}
                                                            Description:
                                                        </b>
                                                        <span>{record.description}</span>
                                                    </p>
                                                )}
                                                {record.profiles.length > 0 && <div className={styles.agendaItem}>
                                                    <b>
                                                        {/* <UserSwitchOutlined /> */}
                                                        Lecturers:
                                                    </b>
                                                    <div>
                                                        {record.profiles.map((profile: UserProfile) => (
                                                            <span key={profile.id}>
                                  {`${profile.firstName} ${profile.lastName}; ${profile.gender === GenderEnum.MALE ? profile.function?.name : profile.gender === GenderEnum.FEMALE ? profile.function?.namef + " -" : ""} ${profile.institution?.name ? profile.institution?.name : ""} `}<br/>
                              </span>
                                                        ))}
                                                    </div>
                                                </div>}
                                                <p className={styles.agendaItem}>
                                                    <b>
                                                        {/* <ClockCircleOutlined /> */}
                                                        End:
                                                    </b>
                                                    <span>
                            {moment(record.end).format(DefaultTimeFormat)} h
                          </span>
                                                </p>
                                                <p
                                                    className={styles.agendaItem}
                                                    style={{marginBottom: "0"}}
                                                >
                                                    <b>
                                                        {/* <ClockCircleOutlined /> */}
                                                        Duration:
                                                    </b>
                                                    <span>{calculateDuration(record)}</span>
                                                </p>
                                                {record.fileId &&
                                                <a/* href={api.seminarMaterial.getFileUrl(record.fileId)}*/>

                                                    <PaperClipOutlined style={{color: "#1a64fb"}}/> Attachment</a>}
                                                <div className={styles.agendaActions}>
                                                    <Button
                                                        type={"link"}
                                                        icon={<EditOutlined/>}
                                                        onClick={() => handleUpdate(record.id)}
                                                    />
                                                    <Button
                                                        danger
                                                        type={"link"}
                                                        icon={<DeleteOutlined/>}
                                                        onClick={() => showConfirm(record.id)}
                                                    />
                                                </div>
                                            </Timeline.Item>
                                        ))}
                                    </Timeline>
                                )}
                            </div>
                        </Col>
                        <Col span={12} className={styles.agendaRight} style={{height: '100vh'}}>
                            <Route path={`${path}/:id?`}>
                                <AgendaTabDetails onFinish={loadData}
                                                  nextTime={nextTime}
                                />
                            </Route>
                        </Col>
                    </Row>
                </div>
            </main>
            <Modal
                title="Lecturers"
                className="smallModal"
                visible={showModal}
                destroyOnClose={true}
                okText="Download Certificates"
                onOk={() => handleDownload(checkedList, parseInt(params.seminarId))}
                onCancel={() => setShowModal(false)}
                forceRender
            >
                {getLecturers()}
            </Modal>
        </React.Fragment>
    );
}

export default AgendaTab;
