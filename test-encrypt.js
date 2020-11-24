const DashSecureMessage = require("dash-secure-message");


const privateBob = "80d809e667663b24d259441901bee271659ba222c4b2c505a7f60d10ef537290";
const publicBob = "A4bZidQmmnMMuYtvqtsn20jnVlZrm63Bb2HDaZ6fofOZ";
const privateCarol = "6b097917b5625a8cac9ad00d61ef3858999be39cb724a796ce04536fa3550728";
const publicCarol = "A0Tv1evLdiIGdPrqHUMWgWuFxlb28MmojJeZIIEXduqc";
const privateDave= "9d1a602fce58d69e96ea50157bff052da187ae806bbc14a059e7507e1f3ea9aa";
const publicDave="AmKYlq3kcetqNSFql+yU0oupawWnulBKJQ+eC6JSNGHm";

const msg = "test";
const options = {binary: false};

const encrypted = DashSecureMessage.encrypt(privateBob, msg, publicCarol, options);
const encryptedForGroup = DashSecureMessage.encrypt(privateBob, msg, [publicCarol, publicDave], options);
console.log('encrypted message:', encrypted);
console.log('encrypted group message:', encryptedForGroup);

//console.log(encrypted[0][1]==encrypted[1][1]);


const decrypted = DashSecureMessage.decrypt(privateCarol, encrypted, publicBob, options);
console.log('decrypted message:', decrypted)


let encryptedGroupMessage = encryptedForGroup;

if (!options.binary) {
    const encryptedArray = encryptedForGroup.map(m => { return m[1] });
    console.log('encrypted message array:', encryptedArray);
    encryptedGroupMessage = encryptedArray;
    
}


//TEST GROUP ENCRYPTION


//carol can encrypt using her key
const decryptedForGroupCarol = DashSecureMessage.decrypt(privateCarol, encryptedGroupMessage, publicBob, options);
console.log('decrypted group message for carol:', decryptedForGroupCarol)


//dave can decrypt using his key
const decryptedForGroupDave = DashSecureMessage.decrypt(privateDave, encryptedGroupMessage, publicBob, options);
console.log('decrypted group message for dave:', decryptedForGroupDave)


// should be false
console.log(decryptedForGroupCarol[0][0]==decryptedForGroupDave[0][0])

// should be true
console.log(decryptedForGroupCarol[0][1]==decryptedForGroupDave[0][1])

