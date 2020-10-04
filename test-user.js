const DashPlatformUser = require("dash-platform-user");

(async () => {
    try {

        const aliceMnemonic = 'hidden offer message develop mirror learn barely marble expose lend fish jelly';
        const bobMnemonic = 'magic group often spot grief powder educate dune village craft polar enrich';
        const carolMnemonic = 'copper eager curious happy dignity wash acquire tip busy love urge piano';

        const options = {
            connection_options:
                { wallet: { mnemonic: carolMnemonic } }
        }

        let foundUser = '';
        foundUser = await DashPlatformUser.findByName({ name: 'carol', options: { returnPrivateKey: true } }, options);

        console.dir(foundUser);
        return;


    }
    catch (e) {
        console.log(`error: ${e}`);
    }
}
)()