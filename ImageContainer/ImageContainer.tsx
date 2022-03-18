import * as React from 'react';

import { IImageProps, TImageLocation } from '../Image/Image';

import './ImageContainer.scss';
import './ImageContainer.Normal.scss';


export interface IImageContainerProps {
    focus: number;
}

class ImageContainer extends React.PureComponent<IImageContainerProps> {
    private imageContainerElmnt: React.RefObject<HTMLDivElement>;

    public constructor(props: IImageContainerProps) {
        super(props);

        this.imageContainerElmnt = React.createRef();
    }

    private renderNewChildren() {
        if (!this.props.children) return undefined;

        const childLength = this.countNumberOfChildren();

        const makeLocationFromIndex = (index: number): TImageLocation => {
            // center
            if (index === this.props.focus) return 'center';

            // right
            let right: number = this.props.focus + 1;
            if (right >= childLength) right = 0;

            if (index === right) return 'right';

            // left
            let left: number = this.props.focus - 1;
            if (left < 0) left = childLength - 1;

            if (index === left) return 'left';

            // default
            return 'behind';
        };

        const newChildren = React.Children.map(this.props.children, (child, index) => {
            if (!React.isValidElement(child)) return null;

            const childProps: React.Attributes & IImageProps = {
                location: makeLocationFromIndex(index),
            };

            return React.cloneElement(child, childProps);
        });

        return newChildren;
    }

    public countNumberOfChildren = (): number => {
        if (!this.props.children) return 0;

        if (!Array.isArray(this.props.children)) return 1;

        return this.props.children.length;
    };

    public render() {
        return (
            <div
                ref={this.imageContainerElmnt}
                className='image-container'
                children={this.renderNewChildren()}
            ></div>
        );
    }
}

export default ImageContainer;
