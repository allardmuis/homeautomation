import * as React from 'react';

export const ContentBody = (props: { children: React.ReactChild }) => (
    <div className="col-lg-10">
        <div className="container-fluid">
            {props.children}
        </div>
    </div>
);

