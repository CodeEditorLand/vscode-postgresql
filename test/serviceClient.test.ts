import * as TypeMoq from 'typemoq';
import assert = require('assert');
import ServerProvider from '../src/languageservice/server';
import SqlToolsServiceClient from '../src/languageservice/serviceclient';
import {Logger} from '../src/models/logger';
import {PlatformInformation} from '../src/models/platform';
import StatusView from './../src/views/statusView';
import * as LanguageServiceContracts from '../src/models/contracts/languageService';
import { IConfig } from '../src/languageservice/interfaces';
import ExtConfig from  '../src/configurations/extConfig';
import VscodeWrapper from '../src/controllers/vscodeWrapper';

interface IFixture {
    platformInfo: PlatformInformation;
    installedServerPath: string;
    downloadedServerPath: string;
}

suite('Service Client tests', () => {

    let testConfig: TypeMoq.IMock<IConfig>;
    let testServiceProvider: TypeMoq.IMock<ServerProvider>;
    let logger = new Logger(text => console.log(text));
    let testStatusView: TypeMoq.IMock<StatusView>;
    let vscodeWrapper: TypeMoq.IMock<VscodeWrapper>;

    setup(() => {
        testConfig = TypeMoq.Mock.ofType(ExtConfig, TypeMoq.MockBehavior.Loose);
        testServiceProvider = TypeMoq.Mock.ofType(ServerProvider, TypeMoq.MockBehavior.Strict);
        testStatusView = TypeMoq.Mock.ofType(StatusView);
        vscodeWrapper = TypeMoq.Mock.ofType(VscodeWrapper);
    });

    function setupMocks(fixture: IFixture): void {
        testServiceProvider.setup(x => x.downloadServerFiles(fixture.platformInfo.runtimeId)).returns(() => {
            return Promise.resolve(fixture.downloadedServerPath);
        });
        testServiceProvider.setup(x => x.getServerPath(fixture.platformInfo.runtimeId)).returns(() => {
            return Promise.resolve(fixture.installedServerPath);
        });
    }

    test('initializeForPlatform should not install the service if already exists', () => {
        let fixture: IFixture = {
            installedServerPath: 'already installed service',
            downloadedServerPath: undefined,
            platformInfo: new PlatformInformation('win32', 'x86_64', undefined)
        };

        setupMocks(fixture);
        let serviceClient = new SqlToolsServiceClient(testConfig.object, testServiceProvider.object, logger, testStatusView.object, vscodeWrapper.object);

        return serviceClient.initializeForPlatform(fixture.platformInfo, undefined).then( result => {
            assert.notEqual(result, undefined);
            assert.equal(result.serverPath, fixture.installedServerPath);
            assert.equal(result.installedBeforeInitializing, false);
        });
    });

    test('initializeForPlatform should install the service if not exists', () => {
        let fixture: IFixture = {
            installedServerPath: undefined,
            downloadedServerPath: 'downloaded service',
            platformInfo: new PlatformInformation('win32', 'x86_64', undefined)
        };

        setupMocks(fixture);
        let serviceClient = new SqlToolsServiceClient(testConfig.object, testServiceProvider.object, logger, testStatusView.object, vscodeWrapper.object);

        return serviceClient.initializeForPlatform(fixture.platformInfo, undefined).then( result => {
            assert.notEqual(result, undefined);
            assert.equal(result.serverPath, fixture.downloadedServerPath);
            assert.equal(result.installedBeforeInitializing, true);
        });
    });

    test('initializeForPlatform should fail given unsupported platform', () => {
        let fixture: IFixture = {
            installedServerPath: 'already installed service',
            downloadedServerPath: undefined,
            platformInfo: new PlatformInformation('invalid platform', 'x86_64', undefined)
        };

        setupMocks(fixture);
        let serviceClient = new SqlToolsServiceClient(testConfig.object, testServiceProvider.object, logger, testStatusView.object, vscodeWrapper.object);

        return serviceClient.initializeForPlatform(fixture.platformInfo, undefined).catch( error => {
            return assert.equal(error, 'Invalid Platform');
        });
    });

    test('handleLanguageServiceStatusNotification should change the UI status', (done) => {
        return new Promise((resolve, reject) => {
            let fixture: IFixture = {
                installedServerPath: 'already installed service',
                downloadedServerPath: undefined,
                platformInfo: new PlatformInformation('win32', 'x86_64', undefined)
            };
            const testFile = 'file:///my/test/file.sql';
            const status = 'new status';

            setupMocks(fixture);
            let serviceClient = new SqlToolsServiceClient(testConfig.object, testServiceProvider.object, logger, testStatusView.object, vscodeWrapper.object);
            let statusChangeParams = new LanguageServiceContracts.StatusChangeParams();
            statusChangeParams.ownerUri = testFile;
            statusChangeParams.status = status;
            serviceClient.handleLanguageServiceStatusNotification().call(serviceClient, statusChangeParams);
            testStatusView.verify(x => x.languageServiceStatusChanged(testFile, status), TypeMoq.Times.once());
            done();
        });
    });
});
