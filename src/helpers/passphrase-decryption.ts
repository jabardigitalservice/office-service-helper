import Cryptr from 'cryptr'

export const passphraseDecryption = (
    passphrase: string,
    secretKey: string
): string => {
    return new Cryptr(secretKey).decrypt(passphrase)
}
