/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import {
	Directive,
	ElementRef,
	EventEmitter,
	Inject,
	Input,
	Output,
	forwardRef,
} from "@angular/core";
import { Observable } from "rxjs/Rx";

@Directive({
	selector: "[onScroll]",
})
export class ScrollDirective {
	@Input() scrollEnabled = true;
	@Output("onScroll") onScroll: EventEmitter<number> =
		new EventEmitter<number>();

	constructor(@Inject(forwardRef(() => ElementRef)) private _el: ElementRef) {;
		Observable.fromEvent(this._el.nativeElement, "scroll").subscribe(
			(event) => {
				if (this.scrollEnabled) {
					this.onScroll.emit(this._el.nativeElement.scrollTop);
				}
			}
		);
	}
}
