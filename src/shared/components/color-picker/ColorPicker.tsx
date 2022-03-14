import { Popover } from 'antd';
import React, { useState } from 'react'
import { ColorResult, SketchPicker } from 'react-color';

import styles from './ColorPicker.module.scss';

interface ColorPickerProps {
    value?: string;
    onChange?(c: string): void;
}

function ColorPickerComponent({value, onChange}: ColorPickerProps) {
    const [color, setColor] = useState<string | undefined>(value);

    const triggerChange = (color: ColorResult) => {
        onChange && onChange(color.hex);
    };

    const handleChange = (color: ColorResult) => {
        setColor(color.hex);
    };

    return (
        <Popover
            trigger="click"
            overlayClassName={styles.popOver}
            getPopupContainer={(trigger) => trigger}
            content={
                <SketchPicker color={ color } onChange={ handleChange } onChangeComplete={triggerChange}/>
            }
        >
            <div className={styles.swatch}>
                <div className={ styles.color } style={{background: color}}/>
            </div>
        </Popover>
    )
}

export default ColorPickerComponent;