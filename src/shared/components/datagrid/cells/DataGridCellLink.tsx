import React from 'react';
import { Link } from 'react-router-dom';

interface DataGridCellLinkProps extends React.HTMLAttributes<HTMLElement> {
    url: string;
    external?: boolean;
    target?: 'push' | 'replace';
}

function DataGridCellLinkComponent({url, external, target = 'replace', children} : DataGridCellLinkProps) {

    return (
        <>
            {external 
                ? <a href={url} rel="noopener noreferrer" target='_blank'>{children}</a>
                : <Link to={url} replace={target === 'replace'}>{children}</Link>
            }
        </>
    );
}


export default React.memo(DataGridCellLinkComponent);