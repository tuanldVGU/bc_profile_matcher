import { Network, EnvironmentType } from '@verida/client-ts';
import { VaultAccount, hasSession } from '@verida/account-web-vault';
import EventEmitter from 'events';


const { REACT_APP_LOGO_URL, REACT_APP_CONTEXT_NAME, REACT_APP_VERIDA_VAULT } = process.env;


class VeridaClientApi extends EventEmitter {
    context = null;
    account = null;
    did = null;
    error = {};
    profile = {};
    connected = false

    /**
     *  method for initializing this app
     */

    async initApp() {
        if (!this.connected) {
            await this.connect();
        }
    }

    hasSession() {
        return hasSession(REACT_APP_CONTEXT_NAME);
    }

    /**
     *  method for connecting to the vault
     */
    async connect() {
        this.account = new VaultAccount({
            request: {
                logoUrl: REACT_APP_LOGO_URL,
            }
        });

        this.context = await Network.connect({
            client: {
                environment: EnvironmentType.TESTNET
            },
            account: this.account,
            context: {
                name: REACT_APP_CONTEXT_NAME
            }
        });

        if (!this.context) {
            this.emit('authenticationCancelled');
            return;
        }

        this.connected = true

        this.did = await this.account.did();


        await this.initProfile();

        this.emit('initialized');
    }


    async initProfile() {
        const services = this;
        const client = await services.context.getClient();
        services.profileInstance = await client.openPublicProfile(services.did, REACT_APP_VERIDA_VAULT);
        const cb = async () => {
            const data = await services.profileInstance.getMany();
            services.profile = {
                name: data.name,
                country: data.country,
                avatar: data?.avatar?.uri,
                did: this.did
            };
            services.emit('profileChanged', services.profile);
        };
        services.profileInstance.listen(cb);
        await cb();
    }

    /**
     * Error emitter 
     * @param {*} error 
     */

    handleErrors(error) {
        this.error = error;
        this.emit('error', error);
    }

    async logout() {
        await this.context.getAccount().disconnect(REACT_APP_CONTEXT_NAME);
        this.context = null;
        this.account = null;
        this.did = null;
        this.error = {};
        this.profile = {};
        this.connected = false
    }
}

const VeridaClient = new VeridaClientApi();

export default VeridaClient;