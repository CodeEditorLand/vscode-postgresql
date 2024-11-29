"use strict";

// This code is originally from https://github.com/DonJayamanne/bowerVSCode
// License: https://github.com/DonJayamanne/bowerVSCode/blob/master/LICENSE
import { window } from "vscode";

import EscapeException from "../utils/EscapeException";
import Prompt from "./prompt";

export default class ListPrompt extends Prompt {
	constructor(question: any, ignoreFocusOut?: boolean) {
		super(question, ignoreFocusOut);
	}

	public render(): any {
		const choices = this._question.choices.reduce((result, choice) => {
			result[choice.name || choice] = choice.value || choice;

			return result;
		}, {});

		let options = this.defaultQuickPickOptions;

		options.placeHolder = this._question.message;

		return window
			.showQuickPick(Object.keys(choices), options)
			.then((result) => {
				if (result === undefined) {
					throw new EscapeException();
				}

				return choices[result];
			});
	}
}
