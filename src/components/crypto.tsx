import { isValidKey } from '@/util/commonUtil';
import CryptoJs from 'crypto-js';

class Crypto {
    methodsCnMap = {
        md5: 'MD5',
        sha1: 'SHA1',
        sha256: 'SHA256',
        sha224: 'SHA224',
        sha512: 'SHA512',
        sha384: 'SHA384',
        sha3: 'SHA3',
        ripemd160: 'RIPEMD160',
        hmacMd5: 'HMACMD5',
        hmacSha1: 'HMACSHA1',
        hmacSha256: 'HMACSHA256',
        hmacSha224: 'HMACSHA224',
        hmacSha512: 'HMACSHA512',
        hmacSha384: 'HMACSHA384',
        hmacSha3: 'HMACSHA3',
        hmacRipemd160: 'HMACRIPEMD160',
        pbkdf2: 'PBKDF2',
        aes: 'AES',
        tripledes: 'TRIPLEDES',
        rc4: 'RC4',
        rabbit: 'RABBIT',
        rabbitLegacy: 'RABBITLEGACY',
        evpkdf: 'EVPKDF',
        formatOpenssl: 'FORMATOPENSSL',
        formatHex: 'FORMATHEX',
        encLatin1: 'ENCLATIN1',
        encUtf8: 'ENCUTF8',
        encHex: 'ENCHEX',
        encUtf16: 'ENCUTF16',
        encBase64: 'ENCBASE64',
        modeCfb: 'MODECFB',
        modeCtr: 'MODECTR',
        modeCtrGladman: 'MODECTRGLADMAN',
        modeOfb: 'MODEOFB',
        modeEcb: 'MODEECB',
        padPkcs7: 'PADPKCS7',
        padAnsix923: 'PADANSIX923',
        padIso10126: 'PADISO10126',
        padIso97971: 'PADISO97971',
        padZeropadding: 'PADZEROPADDING',
        padNopadding: 'PADNOPADDING',
        desEncrypt: 'DES加密',
        desDecrypt: 'DES解密',
        tripleDesEncrypt: '3DES加密',
        tripleDesDecrypt: '3DES解密',
        aesEncrypt: 'AES加密',
        aesDecrypt: 'AES解密',
    };

    md5(input: string): string {
        return CryptoJs.MD5(input).toString();
    }
    
    sha1(input: string): string {
        return CryptoJs.SHA1(input).toString();
    }

    sha256(input: string): string {
        return CryptoJs.SHA256(input).toString();
    }

    sha512(input: string): string {
        return CryptoJs.SHA512(input).toString();
    }

    hmacMd5(input: string, key: string): string {
        
        return CryptoJs.HmacMD5(input, key).toString();
    }

    commonEncrypt(message: string, cfg: any, cipherHelper: typeof CryptoJs.DES){
        const {mode, padding, key, iv, encode, charset} = cfg

        if (!isValidKey(mode, CryptoJs.mode)) {
            console.error('未知模式', mode)
            return '';
        }

        if (!isValidKey(padding, CryptoJs.pad)) {
            console.error('未知填充', mode)
            return '';
        }
        
        if (!isValidKey(charset, CryptoJs.enc)) {
            console.error('未知字符集', mode)
            return '';
        }

        const charCoder: typeof CryptoJs.enc.Utf8 = CryptoJs.enc[charset];
        const useMode = CryptoJs.mode[mode];
        const usePad = CryptoJs.pad[padding];
        const useIV = iv ? iv : key;

        const waMessage = charCoder.parse(message);
        const waKey = charCoder.parse(key);
        const waIV =  charCoder.parse(useIV);
        const waResult = cipherHelper.encrypt(
            waMessage, 
            waKey, 
            { mode: useMode, padding: usePad, iv: waIV })
            .ciphertext;

        if (encode === 'Base64') {
            return CryptoJs.enc.Base64.stringify(waResult);
        } 
        return waResult.toString();
    }

    commonDecrypt(ciphertext: string, cfg: any, cipherHelper: typeof CryptoJs.DES) {
        const {mode, padding, key, iv, encode, charset} = cfg

        if (!isValidKey(mode, CryptoJs.mode)) {
            console.error('未知模式', mode)
            return '';
        }

        if (!isValidKey(padding, CryptoJs.pad)) {
            console.error('未知填充', mode)
            return '';
        }
        
        if (!isValidKey(charset, CryptoJs.enc)) {
            console.error('未知字符集', charset)
            return '';
        }

        if (!isValidKey(encode, CryptoJs.enc)) {
            console.error('未知编码', encode)
            return '';
        }

        debugger;
        const charCoderEnc: typeof CryptoJs.enc.Utf8 = CryptoJs.enc[encode];
        const charCoderChr: typeof CryptoJs.enc.Utf8 = CryptoJs.enc[charset];
        const useMode = CryptoJs.mode[mode];
        const usePad = CryptoJs.pad[padding];
        const useIV = iv ? iv : key;
        const waCiphertext = CryptoJs.lib.CipherParams.create({
            ciphertext: charCoderEnc.parse(ciphertext)
        });
        const waKey = charCoderChr.parse(key);
        const waIV =  charCoderChr.parse(useIV);
        const waResult = cipherHelper.decrypt(
            waCiphertext,
            waKey, 
            { mode: useMode, padding: usePad }
        );

        return waResult.toString(charCoderChr)
    }

    desEncrypt(message: string, cfg: any){
        return this.commonEncrypt(message, cfg, CryptoJs.DES);
    }

    desDecrypt(ciphertext: string, cfg: any){
        return this.commonDecrypt(ciphertext, cfg, CryptoJs.DES);
    }

    tripleDesEncrypt(message: string, cfg: any){
        if (!cfg.key.length){
            throw new Error('密钥key不能为空，且至少要5位');
        }

        return this.commonEncrypt(message, cfg, CryptoJs.TripleDES);
    }

    tripleDesDecrypt(message: string, cfg: any){
        if (!cfg.key.length){
            throw new Error('密钥key不能为空，且至少要5位');
        }
        return this.commonDecrypt(message, cfg, CryptoJs.TripleDES);
    }

    aesEncrypt(message: string, cfg: any) {
        return this.commonEncrypt(message, cfg, CryptoJs.AES);
    }

    aesDecrypt(message: string, cfg: any) {
        return this.commonDecrypt(message, cfg, CryptoJs.AES);
    }

}

export default Crypto;
