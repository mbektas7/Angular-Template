import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector   : 'mirapi-nav-horizontal-item',
    templateUrl: './item.component.html',
    styleUrls  : ['./item.component.scss']
})
export class MirapiNavHorizontalItemComponent
{
    @HostBinding('class')
    classes = 'nav-item';

    @Input()
    item: any;

    /**
     * Constructor
     */
    constructor()
    {

    }
}
