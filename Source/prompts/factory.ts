"use strict";

// This code is originally from https://github.com/DonJayamanne/bowerVSCode
// License: https://github.com/DonJayamanne/bowerVSCode/blob/master/LICENSE
import CheckboxPrompt from "./checkbox";
import ConfirmPrompt from "./confirm";
import ExpandPrompt from "./expand";
import InputPrompt from "./input";
import ListPrompt from "./list";
import PasswordPrompt from "./password";
import Prompt from "./prompt";

export default class PromptFactory {
	public static createPrompt(
		question: any,
		ignoreFocusOut?: boolean,
	): Prompt {
		/**
		 * TODO:
		 *   - folder
		 */
		switch (question.type || "input") {
			case "string":
			case "input":
				return new InputPrompt(question, ignoreFocusOut);

			case "password":
				return new PasswordPrompt(question, ignoreFocusOut);

			case "list":
				return new ListPrompt(question, ignoreFocusOut);

			case "confirm":
				return new ConfirmPrompt(question, ignoreFocusOut);

			case "checkbox":
				return new CheckboxPrompt(question, ignoreFocusOut);

			case "expand":
				return new ExpandPrompt(question, ignoreFocusOut);

			default:
				throw new Error(
					`Could not find a prompt for question type ${question.type}`,
				);
		}
	}
}
