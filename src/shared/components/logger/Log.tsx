import React, { useState } from 'react';

import styles from './Log.module.scss';
import { Logger, LogLevel, LogMessage } from '../../../core/logger';

function LogComponent() {
    const [logs, setLogs] = useState<Array<LogMessage>>([]);

    Logger.setLevel(LogLevel.DEBUG);
    Logger.onLog = (msg) => {
        setLogs((prevLogs) => [msg, ...prevLogs]);
    };
    Logger.onClearLog = () => {
        setLogs([])
    };

    return (
        <div className={styles.logContainer}>
            {logs.map((logEntry, index) => (
                <div className={styles.logEntry} key={index}>
                    <span>&gt;</span>
                    <span className={styles.entryTime}>{logEntry.time.toLocaleString()}</span> :
                    <span className={styles.entryType}>{LogLevel[logEntry.type]}</span> ||
                    <span className={styles.entryMsg} dangerouslySetInnerHTML={{ __html: logEntry.message.replace('\n', '<br />') }}></span>
                </div>
            ))}
        </div>
    );
}

export default LogComponent;
