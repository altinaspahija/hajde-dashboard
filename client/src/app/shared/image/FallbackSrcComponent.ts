import {Directive, ElementRef, HostBinding, HostListener, Input} from '@angular/core';

@Directive({
    selector: '[fallbackSrc]'
})
export class FallbackSrc {
    constructor(private el: ElementRef) { }

    @Input()
    public fallbackSrc: string;

    @HostListener('error')
    onError() {
        this.el.nativeElement.src = this.fallbackSrc;
    }
}