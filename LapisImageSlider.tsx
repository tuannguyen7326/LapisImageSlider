import * as React from 'react';

import ButtonContainer from './ButtonContainer';
import { TButtonType } from './ButtonContainer/ButtonContainer';
import ImageContainer from './ImageContainer';
import NavContainer from './NavContainer';

import './ImageSlider.scss';
import './ImageSlider.Normal.scss';
import './ImageSlider.Slider3D.scss';
import './ImageSlider.Card.scss';


const createLapisImageSliderID = (()=> {
    let id:number = 1;
    return () => {
        return `lapisImageSliderImage${id++}`;
    };
})();

export enum ELapisImageSliderTheme {
    Normal='normal',
    Slider3D='slider-3d',
    Card='card',
}

export interface ILapisImageSliderFocusChangeEventData{
    preventDefault: () => void,
    index:number,
}

export interface ILapisImageSliderProps {
    className?: string,
    width?: string,
    height?:string,
    imageFocusStart?: number,
    interval?: number,
    theme?: ELapisImageSliderTheme,
    onFocusChange?:(e:ILapisImageSliderFocusChangeEventData)=>void,
}

export interface ILapisImageSliderState {
    imageFocus: number;
}

export default class LapisImageSlider extends React.PureComponent<
    ILapisImageSliderProps,
    ILapisImageSliderState
> {
    private length: number = this.countNumberOfChildren();
    private loopId?: NodeJS.Timer;

    private id:string = createLapisImageSliderID();

    public constructor(props: ILapisImageSliderProps) {
        super(props);

        this.state = {
            imageFocus: this.props.imageFocusStart ?? 0,
        };
    }

    private changeCssVariable(){
        let myElement = document.getElementById(this.id);

        if(!myElement) return;

        if(this.props.width){
            myElement.style.setProperty('--image-slider-width', this.props.width);
        }

        if(this.props.height){
            myElement.style.setProperty('--image-slider-height', this.props.height);
        }
    }

    private countNumberOfChildren(): number {
        if (!this.props.children) return 0; // children is undefined

        if (!Array.isArray(this.props.children)) return 1; // the children has an element

        return this.props.children.length;
    }

    // return index of next image from list image
    private nextNumber = (): number => {
        const n = this.state.imageFocus + 1;
        if (n >= this.length) return 0;
        return n;
    };

    // return index of pre image from list image
    private preNumber = (): number => {
        const n = this.state.imageFocus - 1;
        if (n < 0) return this.length - 1;
        return n;
    };

    // EVENT HANDLE
    private buttonContainerHandleClick = (buttonType: TButtonType) => {
        const index:number = buttonType === 'left' ? this.preNumber() : this.nextNumber();
        this.goTo(index);
    };

    private imageSliderHandleMouseEnter = () => {
        this.stopLoop();
    };

    private imageSliderHandleMouseLeave = () => {
        this.startLoop();
    };

    private navHandleClick = (index: number) => {
        this.goTo(index);
    }

    // LOOP
    private stopLoop = () => {
        if (!this.loopId) return;
        clearInterval(this.loopId);
    };

    private startLoop = () => {
        this.loopId = setInterval(this.loop, this.props.interval ?? 3000);
    };

    private loop = () => {
        this.goTo(this.nextNumber());
    };

    private goTo(index:number){
        let isPreventDefault = false;

        let preventDefault = () => {
            isPreventDefault = true;
        }

        if(this.props.onFocusChange){
            this.props.onFocusChange({
                preventDefault,
                index
            });
        }


        if(isPreventDefault) return;
        
        this.setState({
            imageFocus: index,
        });
    }

    //
    public componentDidMount() {
        this.startLoop();

        this.changeCssVariable();
    }

    public componentWillUnmount() {
        this.stopLoop();
    }

    public componentDidUpdate(){
        this.length = this.countNumberOfChildren();

        this.changeCssVariable();
    }

    public render() {
        const renderButtonContainer = () => {
            if(this.props.theme === ELapisImageSliderTheme.Card){
                return undefined;
            }

            return (
                <ButtonContainer
                    buttonType='both'
                    onClick={this.buttonContainerHandleClick}
                />
            );
        }

        const renderNavContainer = () => {
            if(this.props.theme === ELapisImageSliderTheme.Card){
                return undefined;
            }

            return (
                <NavContainer
                    focus={this.state.imageFocus}
                    length={this.countNumberOfChildren()}
                    onClick={this.navHandleClick}
                />
            );
        }

        const renderClassName = ():string => {
            let className:string = 'lapis-image-slider';

            if(this.props.theme){
                className += ` ${this.props.theme}`;
            }

            if(this.props.className){
                className += ` ${this.props.className}`;
            }

            return className;
        }

        return (
            <div
                id={this.id}
                className={renderClassName()}
                onMouseEnter={this.imageSliderHandleMouseEnter}
                onMouseLeave={this.imageSliderHandleMouseLeave}
            >
                {renderButtonContainer()}

                <ImageContainer
                    focus={this.state.imageFocus}
                    children={this.props.children}
                />

                {renderNavContainer()}
                  
            </div>
        );
    }
}
