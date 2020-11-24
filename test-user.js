const DashPlatformUser = require("dash-platform-user");

(async () => {
    try {

        const bobMnemonic = 'remain ordinary replace fruit work fortune general stone more enjoy bubble entry';
        const carolMnemonic = 'bridge report million quantum degree burst devote door truly afford pride visa';
        const daveMnemonic = 'globe vague enrich habit volume notable churn mention exist grow theory any';

        const options = {
            connection_options:
                { wallet: { mnemonic: daveMnemonic } }
        }

        let foundUser = '';
        foundUser = await DashPlatformUser.findByName({ name: 'dave', options: { returnPrivateKey: true } }, options);

        console.dir(foundUser);
        return;


    }
    catch (e) {
        console.log(`error: ${e}`);
    }
}
)()