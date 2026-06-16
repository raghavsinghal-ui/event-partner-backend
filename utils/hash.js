const bcrypt=require("bcrypt");
exports.generateHash = async (plainText) => {
    try {
        const saltRounds = 10;
        return await bcrypt.hash(plainText, saltRounds);
    } catch (err) {
        throw new Error("Hashing failed");
    }
};
exports.compareHash = async (plainText, hash) => {
    try {
        return await bcrypt.compare(plainText, hash);   
    } catch (err) {
        throw new Error("Hash comparison failed");
    }
};