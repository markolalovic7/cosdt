import React from 'react';

import styles from './DefaultSpinner.module.scss';

function DefaultSpinnerComponent() {

    return (
        <div className={styles.loader}>
            <div className={styles.loaderBar}>
            </div>
        </div>
    )
}

export default DefaultSpinnerComponent;