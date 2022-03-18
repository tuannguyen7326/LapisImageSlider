import * as React from 'react';

import './Image.Normal.scss';
import './Image.Slider3D.scss';
import './Image.Card.scss';

export type TImageLocation = 'center' | 'left' | 'right' | 'behind';

export interface IImageProps {
    location?: TImageLocation,
    src?: string,
}

export default class Image extends React.PureComponent<IImageProps> {
    private makeStyle(): React.CSSProperties {
        if (!this.props.src) return {};

        return {
            backgroundImage: `url('${this.props.src}')`,
        };
    }

    public render() {
        return (
            <div className={`image-wrap ${this.props.location}`}>
                <div className='image' style={this.makeStyle()}>
                    {this.props.children /*The children is an image or something else*/}
                </div>
            </div>
        );
    }
}
