export default class CryptoUtils {

    /**
     * @param {"SHA-1"|"SHA-256"|"SHA-384"|"SHA-512"} algorithm https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
     * @param {string|Blob} data
     */
    static async getDataHash(algorithm, data) {
        let msgUint8;
        if (data instanceof Blob) {
            const arrayBuffer = await data.arrayBuffer();
            msgUint8 = new Uint8Array(arrayBuffer);
        } else {
            const encoder = new TextEncoder();
            msgUint8 = encoder.encode(data);
        }

        return await CryptoUtils._getHashFromUint8(algorithm, msgUint8);
    }

    /**
     * https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
     * @param {"SHA-1"|"SHA-256"|"SHA-384"|"SHA-512"} algorithm https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
     * @param msgUint8
     */
    static async _getHashFromUint8(algorithm, msgUint8) {
        const hashBuffer = await crypto.subtle.digest(algorithm, msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, "0")).join(""); // convert bytes to hex string
    }
}