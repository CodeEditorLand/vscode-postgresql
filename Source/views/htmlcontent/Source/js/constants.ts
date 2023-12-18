/** Note: The new constants in this file should be added to localization\xliff\constants\localizedConstants.enu.xlf so the localized texts get loaded here */

/** Results Pane Labels */
export const maximizeLabel = "Maximize";
export const restoreLabel = "Restore";
export const saveCSVLabel = "Save as CSV";
export const saveJSONLabel = "Save as JSON";
export const saveExcelLabel = "Save as Excel";
export const resultPaneLabel = "Results";
export const selectAll = "Select all";
export const copyLabel = "Copy";
export const copyWithHeadersLabel = "Copy with Headers";

/** Messages Pane Labels */
export const executeQueryLabel = "Executing query...";
export const messagePaneLabel = "Messages";
export const lineSelectorFormatted = "Line {0}";
export const elapsedTimeLabel = "Total execution time: {0}";

/** Warning message for save icons */
export const msgCannotSaveMultipleSelections =
	"Save results command cannot be used with multiple selections.";

export const loadLocalizedConstant = (key: string, value: string) => {
	// Update the value of the property with the name equal to key in this file
	this[key] = value;
};
