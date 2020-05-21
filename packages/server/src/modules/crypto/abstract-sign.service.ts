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
}
