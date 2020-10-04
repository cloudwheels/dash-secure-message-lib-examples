const DashSecureMessage = require("dash-secure-message");

const privateAlice = "f2f774d88cd8478eb65a3cd3bba2b74ee235465c4d526cda7c9020c6cda416c4";
const publicAlice = "A6RPlTCyz01wNWqBU/hG2X/FpK7kSaKeD5Ryx3SbRctL";
const privateBob = "afe0a80e7bd5ec64a656e1fd65dc0951f0704e3c05465d8e8194a5ef419ea45c";
const publicBob = "A2QdE/f4DIpTuxPkGYFQYzqqZ9ytGy0hMwT6ccth17L4";
const privateCarol = "89cbe055cab9db46eeb57790b62d5b9a421e3627e4cb62fefb10cc8f4dad85c6";
const publicCarol = "A6+8q1NoaYsmuRNzpoNiUMvDpXEBOYG/yMn3qDXjYNLg"

const msg = "test";
const options = {} // {binary: false};

const encrypted = DashSecureMessage.encrypt(privateAlice, msg, publicCarol, options);
const encryptedForGroup = DashSecureMessage.encrypt(privateAlice, msg, [publicBob, publicCarol], options);
console.log('encrypted message:', encrypted);
console.log('encrypted group message:', encryptedForGroup);

//console.log(encrypted[0][1]==encrypted[1][1]);


const decrypted = DashSecureMessage.decrypt(privateCarol, encrypted, publicAlice, options);
console.log('decrypted message:', decrypted)

let encryptedGroupMessage = encryptedForGroup;

if (!options.binary) {
    const encryptedArray = encryptedForGroup.map(m => { return m[1] });
    console.log('encrypted message array:', encryptedArray);
    encryptedGroupMessage = encryptedArray;
    
}

//bob can decrypt using his key
const decryptedForGroupBob = DashSecureMessage.decrypt(privateBob, encryptedGroupMessage, publicAlice, options);
console.log('decrypted group message for bob:', decryptedForGroupBob)

//carol can encrypt using her key
//const decryptedForGroupCarol = DashSecureMessage.decrypt(privateCarol, encryptedGroupMessage, publicAlice, binary);
//console.log('decrypted group message for carol:', decryptedForGroupCarol)


//console.log(decryptedForGroupBob[0][0]==decryptedForGroupCarol[0][0])

