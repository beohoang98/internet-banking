export interface AbstractSignService {
    /**
     * Return signature string
     * @param data
     * @param privateKeyBuffer
     */
    sign(data: string, privateKeyBuffer: Buffer): Promise<string>;

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
