import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as React from 'react';

interface IEditFieldProps {
    update: (value: string) => void,
    value: string;
}

interface IEditFieldState {
    editing: boolean;
    value: string;
}

export class EditField extends React.Component<IEditFieldProps, IEditFieldState> {

    constructor (props: IEditFieldProps) {
        super(props);
        this.state = {
            editing: false,
            value: '',
        }
    }

    public render() {
        if (this.state.editing) {
            return <span>
                <input type="text" value={this.state.value} onChange={e => this.setState({value: e.target.value})} />
                <a onClick={() => this.save()}>
                    <FontAwesomeIcon icon="save" />
                </a>
            </span>;
        } else {
            return <span>
                {this.props.value || '-'}
                <a onClick={() => this.edit()}>
                    <FontAwesomeIcon icon="edit" />
                </a>
            </span>;
        }
    }

    private edit() {
        this.setState({
            editing: true,
            value: this.props.value,
        })
    }

    private save() {
        this.setState({
            editing: false,
        });
        this.props.update(this.state.value);
    }
}