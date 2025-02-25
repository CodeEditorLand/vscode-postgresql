// Collection of Non-localizable Constants
export const languageId = "sql";

export const extensionName = "pgsql";

export const extensionDisplayName = "PostgreSQL";

export const extensionConfigSectionName = "pgsql";

export const pgsqlProviderName = "PGSQL";

export const noneProviderName = "None";

export const connectionApplicationName = "vscode-pgsql";

export const outputChannelName = "PGSQL";

export const connectionConfigFilename = "settings.json";

export const connectionsArrayName = "connections";

export const cmdRunQuery = "extension.pgsql.runQuery";

export const cmdRunCurrentStatement = "extension.pgsql.runCurrentStatement";

export const cmdCancelQuery = "extension.pgsql.cancelQuery";

export const cmdConnect = "extension.pgsql.connect";

export const cmdDisconnect = "extension.pgsql.disconnect";

export const cmdChooseDatabase = "extension.pgsql.chooseDatabase";

export const cmdChooseLanguageFlavor = "extension.pgsql.chooseLanguageFlavor";

export const cmdShowReleaseNotes = "extension.showReleaseNotes";

export const cmdShowGettingStarted = "extension.pgsql.showGettingStarted";

export const cmdNewQuery = "extension.pgsql.newQuery";

export const cmdManageConnectionProfiles = "extension.pgsql.manageProfiles";

export const cmdRebuildIntelliSenseCache =
	"extension.pgsql.rebuildIntelliSenseCache";

export const postgresDbPrefix = ".postgres.database.azure.com";

export const defaultConnectionTimeout = 15;

export const azureSqlDbConnectionTimeout = 30;

export const azureDatabase = "Azure";

export const defaultPortNumber = 1433;

export const sqlAuthentication = "SqlLogin";

export const defaultDatabase = "master";

export const errorPasswordExpired = 18487;

export const errorPasswordNeedsReset = 18488;

export const errorLoginFailed = 18456;

export const maxDisplayedStatusTextLength = 50;

export const outputContentTypeRoot = "root";

export const outputContentTypeMessages = "messages";

export const outputContentTypeResultsetMeta = "resultsetsMeta";

export const outputContentTypeColumns = "columns";

export const outputContentTypeRows = "rows";

export const outputContentTypeConfig = "config";

export const outputContentTypeSaveResults = "saveResults";

export const outputContentTypeOpenLink = "openLink";

export const outputContentTypeCopy = "copyResults";

export const outputContentTypeEditorSelection = "setEditorSelection";

export const outputContentTypeShowError = "showError";

export const outputContentTypeShowWarning = "showWarning";

export const outputServiceLocalhost = "http://localhost:";

export const msgContentProviderSqlOutputHtml = "dist/html/sqlOutput.ejs";

export const contentProviderMinFile = "dist/js/app.min.js";

export const serviceCompatibleVersion = "1.0.0";

export const untitledSaveTimeThreshold = 10.0;

export const renamedOpenTimeThreshold = 10.0;

export const timeToWaitForLanguageModeChange = 10000.0;

// TODO: Update these
export const macOpenSslHelpLink =
	"https://github.com/Microsoft/vscode-postgresql/wiki/OpenSSL-Configuration";

export const gettingStartedGuideLink =
	"https://github.com/Microsoft/vscode-postgresql/blob/master/README.md";

export const releaseNotesLink =
	"https://github.com/Microsoft/vscode-postgresql/blob/master/CHANGELOG.md";

export const integratedAuthHelpLink =
	"https://aka.ms/vscode-pgsql-integratedauth";

export const sqlToolsServiceCrashLink =
	"https://github.com/Microsoft/vscode-postgresql/wiki/SqlToolsService-Known-Issues";

export const localizedTexts = "localizedTexts";

// Configuration Constants
export const copyIncludeHeaders = "copyIncludeHeaders";

export const configLogDebugInfo = "logDebugInfo";

export const configMyConnections = "connections";

export const configSaveAsCsv = "saveAsCsv";

export const configSaveAsJson = "saveAsJson";

export const configSaveAsExcel = "saveAsExcel";

export const configRecentConnections = "recentConnections";

export const configMaxRecentConnections = "maxRecentConnections";

export const configCopyRemoveNewLine = "copyRemoveNewLine";

export const configSplitPaneSelection = "splitPaneSelection";

export const configShowBatchTime = "showBatchTime";

export const extConfigResultKeys = ["shortcuts", "messagesDefaultOpen"];

export const sqlToolsServiceInstallDirConfigKey = "installDir";

export const sqlToolsServiceExecutableFilesConfigKey = "executableFiles";

export const sqlToolsServiceVersionConfigKey = "version";

export const sqlToolsServiceDownloadUrlConfigKey = "downloadUrl";

export const extConfigResultFontFamily = "resultsFontFamily";

export const extConfigResultFontSize = "resultsFontSize";

export const configApplyLocalization = "applyLocalization";

export const configPersistQueryResultTabs = "persistQueryResultTabs";

// ToolsService Constants
export const serviceInstallingTo = "Installing PostgreSQL tools service to";

export const serviceInstalling = "Installing";

export const serviceDownloading = "Downloading";

export const serviceInstalled = "PostgreSQL Tools Service installed";

export const serviceInstallationFailed =
	"Failed to install PostgreSQL Tools Service";

export const sqlToolsServiceCrashMessage =
	"PostgreSQL Tools Service component could not start.";

export const sqlToolsServiceCrashButton = "View Known Issues";

export const serviceInitializingOutputChannelName =
	"SqlToolsService Initialization";

export const serviceInitializing =
	"Initializing PostgreSQL tools service for the PostgreSQL extension.";

export const commandsNotAvailableWhileInstallingTheService =
	"Note: PostgreSQL commands will be available after installing the service.";

export const unsupportedPlatformErrorMessage = "The platform is not supported";

export const serviceLoadingFailed = "Failed to load PostgreSQL Tools Service";

export const invalidServiceFilePath =
	"Invalid file path for PostgreSQL Tools Service";

export const sqlToolsServiceName = "SQLToolsService";

export const serviceNotCompatibleError =
	"Client is not compatible with the service layer";

export const sqlToolsServiceConfigKey = "service";

export const v1SqlToolsServiceConfigKey = "v1Service";
