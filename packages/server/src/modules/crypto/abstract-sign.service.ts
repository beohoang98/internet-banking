export interface AbstractSignService {
    /**
     * Return signature string
     * @param data
     * @param privateKeyBuffer
     * @param passphrase
     */
    sign(
        data: string,
        privateKeyBuffer: Buffer,
        passphrase?: string,
    ): Promise<string>;

    /**
     * Return verify result
     * @param data
     * @param signature
     * @param clientPublicKeyBuffer
     */
    verify(
        data: string,
        signature: string,
        clientPublicKeyBuffer: Buffer,
    ): Promise<boolean>;

    /**
     * Return Buffer encrypted
     * @param data
     * @param privateKeyBuffer
     * @param publicKeyBuffer
     * @param passphrase
     * @param detached true if using for Encrypt&Sign
     */
    encrypt?: (
        data: string,
        privateKeyBuffer: Buffer,
        publicKeyBuffer: Buffer,
        passphrase?: string,
        detached?: boolean,
    ) => Promise<{ encrypted: string; signature: string }>;
}
