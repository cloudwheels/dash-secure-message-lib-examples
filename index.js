const Dash = require("dash");
const DashPlatformUser = require("dash-platform-user");
const DashSecureMessage = require("dash-secure-message");

(async () => {
    try {

        //test data for retriveing private keys (subject to change)
        //v0.15
        const aliceMnemonic = 'hidden offer message develop mirror learn barely marble expose lend fish jelly';
        const bobMnemonic = 'magic group often spot grief powder educate dune village craft polar enrich';

        const aliceIdentity = 'GVaLeZt84ft5vPwefVUKJrzDkGsFbf7T4b2JkBoPAdwC'

        // USING QUERY LEVEL (TOP LEVEL) OPTIONS

        // pass an instance of the client
        const client = new Dash.Client({
            wallet: { mnemonic: aliceMnemonic },
            apps: {
                tutorialContract: {
                    contractId: 'E3CuxaB7ZrxQA889nWhJV4vCwLEbD6Zq6heesGq7hMfp'
                }
            }
        });

        const options1 = { client: client, returnType: DashPlatformUser.returnTypes.JSON };

        //pass connection parameter options
        const options2 = {
            connection_options:
                { network: 'evonet', }
        };

        //pass a mnemonic to retrieve private key
        const options3 = {
            connection_options:
                { wallet: { mnemonic: aliceMnemonic } }
            //client: client, returnType: DashPlatformUser.returnTypes.JSON 
        }


        // QUERIES WITHOUT QUERY LEVEL (TOP LEVEL) OPTIONS
        // THE TOP LEVEL OPTIONS ABOVE CAN BE PASSED As A SECOND PARAMETER

        // if setting options.returnPrivateKey:true as a user level option, the wallet.mnemonic must be passed in 
        // either the client instance or as connection_options.mnemonic

        // - * dashjs is required as an external dependency if client instance is not passed as a top level option * 
        // - create internal client connection (to testnet) using default seeds, apps & other options
        // - outputs user result as returnType: Object (DashPlatformUser.returnTypes.OBJECT) 

        let foundUser = '';

        //UNCOMMENT EXAMPLES TO TEST

        // Different Query Types (No options)
        // Single user as string
        console.log("find user Bob...")
        foundUser = await DashPlatformUser.findByName('bob');

        // Single user as object (with user level options)
        //foundUser = await DashPlatformUser.findByName({name:'alice', { returnPrivateKey: false });

        // Array of string queries
        //foundUser = await DashPlatformUser.findByName(['bob','alice']);

        // Array of Object queries 
        //foundUser = await DashPlatformUser.findByName([{name:'alice', options:{ returnPrivateKey: false }}, {name:'bob',options: { returnPrivateKey: false }}]);

        // Single user string passed as an array
        //foundUser = await DashPlatformUser.findByName('bob');

        // Array of mixed String and Object queries 
        //foundUser = await DashPlatformUser.findByName([{ name: 'alice', options: { returnPrivateKey: true } }, 'bob', 'nob'], options3);

        //user doesn't exist:
        //single user
        //foundUser = await DashPlatformUser.findByName('nob');

        // array of strings with a non-existant user
        //foundUser = await DashPlatformUser.findByName(['bob', 'nob']);

        console.dir(foundUser);

        //ENCRYPTION EXAMPLE USING Dash Secure Message Library

        const msg = "test"
        let keys = {};

        const senderGetsKeys = await DashPlatformUser.findByName([{ name: 'alice', options: { returnPrivateKey: true } }, 'bob'],
            { connection_options: { wallet: { mnemonic: aliceMnemonic } } });

        senderGetsKeys.map(u => {
            if (u.query == 'alice') keys.senderKey = u.results.privateKey;
            if (u.query == 'bob') keys.recipientKey = u.results.publicKey;
        })

        console.log("sending keys:")
        console.dir(JSON.stringify(keys));





        const encrypted = DashSecureMessage.encrypt(keys.senderKey, msg, keys.recipientKey, true);

        console.log('encrypted message:', encrypted)

        // store the binary encrypted result in a document
        let storedDocId;

        const submitNoteDocument = async function () {
            console.log('attempting to store encrypted bytes...')
            const platform = client.platform;

            try {
                const identity = await platform.identities.get(aliceIdentity);


                const testMessage = "encrypted bytes below" //"eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6WzMsMTY0LDc5LDE0OSw0OCwxNzgsMjA3LDc3LDExMiw1MywxMDYsMTI5LDgzLDI0OCw3MCwyMTcsMTI3LDE5NywxNjQsMTc0LDIyOCw3MywxNjIsMTU4LDE1LDE0OCwxMTQsMTk5LDExNiwxNTUsNjksMjAzLDc1LDc3LDExMiw0MiwxMjgsNSwxMTksMTUsODcsMTc0LDE0NSw3OSwzLDIxLDIzOCw4NSw5OSw0NCwxMDksMiwyMjEsNDgsNDcsMjUzLDE4MSwyMTIsMjUsMTY3LDM3LDIyOCwxMTQsMjEsMTg3LDYyLDMyLDY4LDQ0LDIxNSwyMzgsMjIwLDE0Myw0MiwyMDksNTEsMjEzLDIwMywxNjAsOTUsNTEsMTYyLDI3LDQ4LDYyLDY4LDIxOCwxMzYsMTU0LDYwLDI0NCwxNTQsNjAsMTgxLDIyNCw2OCwxODZdfQ=="

                const docProperties = {
                    message: testMessage,
                    binary_message: encrypted
                }

                // Create the note document
                const noteDocument = await platform.documents.create(
                    'tutorialContract.note',
                    identity,
                    docProperties,
                );

                // set storedDocId to retirve result
                console.log("note document:");
                console.dir(noteDocument);

                storedDocId = noteDocument.id;

                const documentBatch = {
                    create: [noteDocument],
                    replace: [],
                    delete: [],
                }
                // Sign and submit the document(s)
                await platform.documents.broadcast(documentBatch, identity);
                console.log("document was broadcast!");
                return;
            } catch (e) {
                console.error('Something went wrong storing document data:', e);
            } finally {
                client.disconnect();
            }
        };

        await submitNoteDocument();

        let docsRetrieved;

        const getDocuments = async function () {
            try {
                const queryOpts = {
                    limit: 1, // Only retrieve 1 document
                    where: [
                        [
                            "$id",
                            "==",
                            storedDocId
                        ]
                    ]
                };
                docsRetrieved = await client.platform.documents.get(
                    'tutorialContract.note',
                    queryOpts
                );
                console.log("docs retrieved:");
                console.dir(docsRetrieved);
                return;
            } catch (e) {
                console.error('Something went wrong:', e);
            } finally {
                client.disconnect();
            }
        };

        await getDocuments();

        const recipientGetsKeys = await DashPlatformUser.findByName([{ name: 'bob', options: { returnPrivateKey: true } }, 'alice'],
            { connection_options: { wallet: { mnemonic: bobMnemonic } } });

        recipientGetsKeys.map(u => {
            if (u.query == 'bob') keys.recipientKey = u.results.privateKey;
            if (u.query == 'alice') keys.senderKey = u.results.publicKey;
        })

        console.log("receiving keys:")
        console.dir(JSON.stringify(keys));

        const toDecrypt = docsRetrieved[0].data.binary_message; //encrypted;

        const decrypted = DashSecureMessage.decrypt(keys.recipientKey, toDecrypt, keys.senderKey, true);
        console.log('decrypted message:', decrypted)



        return;


    }
    catch (e) {
        console.log(`error: ${e}`);
    }
}
)()