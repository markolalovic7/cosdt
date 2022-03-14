import React, { HTMLAttributes } from 'react';

import { Resizable, ResizeCallbackData } from 'react-resizable';

export interface DataGridResizableHeaderProps extends HTMLAttributes<HTMLElement> {
  onResize?(e: React.SyntheticEvent<Element, Event>, data: ResizeCallbackData): void;
  width?: string | number;
  resizable?: boolean;
}

function DataGridResizableHeader({ onResize, width, resizable, ...restProps }: DataGridResizableHeaderProps) {
  
    if (!width || !resizable) {
      return <th {...restProps} />;
    }
  
    return (
      <Resizable
        width={parseFloat(`${width}`)}
        height={0}
        handle={
          <span
            className='react-resizable-handle'
            onClick={e => {
              e.stopPropagation();
            }}
          />
        }
        onResize={onResize}
        draggableOpts={{ enableUserSelectHack: false }}
      >
        <th {...restProps} />
      </Resizable>
    );
}

export default DataGridResizableHeader;