import * as React from 'react';

import './NavContainer.Normal.scss';
import './NavContainer.Slider3D.scss';
import './NavContainer.Card.scss'

export interface INavContainerProps {
    length: number,
    focus: number,
    onClick?: (index: number)=>void,
}

export default class NavContainer extends React.PureComponent<INavContainerProps> {
    private makeHandleClick = (index:number) => {
        return () => {
            if(!this.props.onClick) return;
            this.props.onClick(index);
        }
    }
    private renderLi(): JSX.Element[] {
        const elmnts:JSX.Element[] = [];
        for(let i:number = 0; i < this.props.length; i++){
            const className = i === this.props.focus ? 'focus' : '';
            elmnts.push(
                <li
                    key={i}
                    className={className}
                    onClick={this.makeHandleClick(i)}
                ></li>
            );
        }
        return elmnts;
    }

    public render() {
        
        return (<div className='nav-container'>
            <ol>
                {this.renderLi()}
            </ol>
        </div>);
    }
}
