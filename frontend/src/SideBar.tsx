import * as React from 'react';

export const SideBar = (props: { children: any }) => (
    <div className="col-lg-2 bg-dark sidebar">
        <ul className="nav nav-pills flex-column">
            {props.children}
        </ul>
    </div>
);