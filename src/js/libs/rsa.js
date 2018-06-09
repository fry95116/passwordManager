// Depends on jsbn.js and rng.js

// Version 1.1: support utf-8 encoding in pkcs1pad2

var BigInteger = require('./BigInteger.js')
var SecureRandom = require('./SecureRandom.js')
var base64 = require('./base64.js')
// "empty" RSA key constructor
class RSAKey {
    constructor() {
        this.n = null
        this.e = 0
        this.d = null
        this.p = null
        this.q = null
        this.dmp1 = null
        this.dmq1 = null
        this.coeff = null
    }

    getPublic() {
        return {
            n: this.n.toString(16),
            e: new Number(this.e).toString(16)
        }
    }

    /**
     * Set the public key fields N and e from hex strings
     * @param {string} N - arguement N(format: hex string)
     * @param {integer} E - argument E(format: hex string)
     */
    setPublic(N, E) {        
        if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = parseBigInt(N, 16)
            this.e = parseInt(E, 16)
        }
        else throw new Error("Invalid RSA public key")
    }

    /**
     * Perform raw public operation on "x": return x^e (mod n)
     * @param {BigInteger} x - operate number
     * @return {BigInteger} - x^e (mod n)
     */
    _doPublic(x) {
        return x.modPowInt(this.e, this.n)
    }

    /**
     * Return the PKCS#1 RSA encryption of "text" as an even-length hex string
     * @param {string} text - plaintext
     * @return {string} - chipertext(format: hex string)
     */
    encrypt(text) {
        var m = pkcs1pad2(text, (this.n.bitLength() + 7) >> 3)
        if (m == null) return null
        var c = this._doPublic(m)
        if (c == null) return null
        var h = c.toString(16)
        if ((h.length & 1) == 0) return h; else return "0" + h
    }

    // /**
    //  * Return the PKCS#1 RSA encryption of "text" as a Base64-encoded string
    //  * @param {string} text - plaintext
    //  * @return {string} - chipertext(format: base64 string)
    //  */
    // encrypt_base64(text) {
    //     var h = this.encrypt(text)
    //     if(h) return hex2b64(h); else return null
    // }

    /**
     * Set the private key fields N, e, and d from hex strings
     * @param {string} N - argument N(format: hex string)
     * @param {string} E - argument E(format: hex string)
     * @param {string} D - argument D(format: hex string)
     */
    setPrivate(N, E, D) {
        if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = parseBigInt(N, 16)
            this.e = parseInt(E, 16)
            this.d = parseBigInt(D, 16)
        }
        else
            alert("Invalid RSA private key")
    }

    /**
     * Set the private key fields N, e, d and CRT params from hex strings
     * @param {string} N argument N = P * Q (format: hex string)
     * @param {string} E argument E (format: hex string)
     * @param {string} D argument D = e modInverse ((p - 1)(q - 1)) (format: hex string)
     * @param {string} P argument P (format: hex string)
     * @param {string} Q argument Q (format: hex string)
     * @param {string} DP argument DP = D mod (P - 1) (format: hex string)
     * @param {string} DQ argument DQ = D mod (Q - 1) (format: hex string)
     * @param {string} C argument C = q modInverse (p) (format: hex string)
     */
    setPrivateEx(N, E, D, P, Q, DP, DQ, C) {
        if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = parseBigInt(N, 16)
            this.e = parseInt(E, 16)
            this.d = parseBigInt(D, 16)
            this.p = parseBigInt(P, 16)
            this.q = parseBigInt(Q, 16)
            this.dmp1 = parseBigInt(DP, 16)
            this.dmq1 = parseBigInt(DQ, 16)
            this.coeff = parseBigInt(C, 16)
        }
        else
            alert("Invalid RSA private key")
    }


    /**
     * get p, q, e witch for storage
     * @return {obejct} - format: {p: hex stirng, q: hex string, e: hex string}
     */
    getPrivate_minify(dataFormat){
        return {
            p: this.p.toString(16),
            q: this.q.toString(16),
            e: new Number(this.e).toString(16)
        }
    }

    /**
     * construct keygen from spec p, q, e
     * @param {string} p - argument p (format: hex string) 
     * @param {string} q - argument q (format: hex string) 
     * @param {string} e - argument e (format: hex string) 
     */
    setPrivate_minify(p, q, e){
        p = parseBigInt(p, 16)
        q = parseBigInt(q, 16)

        var ee = new BigInteger(e, 16)
        if (!(p.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) === 0 && p.isProbablePrime(10))) throw new Error('invalid p')
        if (!(q.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) === 0 && q.isProbablePrime(10))) throw new Error('invalid q')

        if (p.compareTo(q) <= 0) {
            var t = p
            p = q
            q = t
        }

        var p1 = p.subtract(BigInteger.ONE)
        var q1 = q.subtract(BigInteger.ONE)
        var phi = p1.multiply(q1)

        if (phi.gcd(ee).compareTo(BigInteger.ONE) !== 0) throw new Error('invalid e')
        
        this.n = p.multiply(q)
        this.e = parseInt(e, 16)
        this.d = ee.modInverse(phi)
        this.p = p
        this.q = q
        this.dmp1 = this.d.mod(p1)
        this.dmq1 = this.d.mod(q1)
        this.coeff = this.q.modInverse(this.p)
    }

    getPrivate_encrypted(){
        var p = this._doPrivate(this.p).toString(16)
        var q = this._doPrivate(this.q).toString(16)
        var e = new Number(this.e).toString(16)
        
        return base64.fromHex(p) + '_' + base64.fromHex(q) + '_' + e
    }

    setPrivate_encrypted(str){
        if(this.n === null || this.e === 0) throw new Error('no public key')
        var args = str.split('\n')
        if(args.length !== 3) throw new Error('invalid private key string')

        var p = parseBigInt(base64.toHex(args[0]), 16) //hex string->bigInteger
        var q = parseBigInt(base64.toHex(args[1]), 16)
        p = this._doPublic(p)
        q = this._doPublic(q)
        var e = args[2]

        var ee = new BigInteger(e, 16)
        if (!(p.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) === 0 && p.isProbablePrime(10))) throw new Error('invalid p')
        if (!(q.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) === 0 && q.isProbablePrime(10))) throw new Error('invalid q')

        if (p.compareTo(q) <= 0) {
            var t = p
            p = q
            q = t
        }

        var p1 = p.subtract(BigInteger.ONE)
        var q1 = q.subtract(BigInteger.ONE)
        var phi = p1.multiply(q1)

        if (phi.gcd(ee).compareTo(BigInteger.ONE) !== 0) throw new Error('invalid e')
        
        this.n = p.multiply(q)
        this.e = parseInt(e, 16)
        this.d = ee.modInverse(phi)
        this.p = p
        this.q = q
        this.dmp1 = this.d.mod(p1)
        this.dmq1 = this.d.mod(q1)
        this.coeff = this.q.modInverse(this.p)
    }

    test(){
        var t = this._doPrivate(this.p)
        var str_t = t.toString(16)
        var tt = parseBigInt(str_t, 16)
        var t2 = this._doPublic(tt)
        console.log(t2.compareTo(this.p))
    }


    /**
     * Generate a new random private key B bits long, using public expt E
     * @param {integer} B - keygen length(unit: bits)
     * @param {string} E - argument E (format: hex string)
     */
    generate(B, E) {
        var rng = new SecureRandom()
        var qs = B >> 1
        this.e = parseInt(E, 16)
        var ee = new BigInteger(E, 16)
        for (; ;) {
            for (; ;) {
                this.p = new BigInteger(B - qs, 1, rng)
                if (this.p.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.p.isProbablePrime(10)) break
            }
            for (; ;) {
                this.q = new BigInteger(qs, 1, rng)
                if (this.q.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.q.isProbablePrime(10)) break
            }
            if (this.p.compareTo(this.q) <= 0) {
                var t = this.p
                this.p = this.q
                this.q = t
            }
            var p1 = this.p.subtract(BigInteger.ONE)
            var q1 = this.q.subtract(BigInteger.ONE)
            var phi = p1.multiply(q1)
            if (phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
                this.n = this.p.multiply(this.q)
                this.d = ee.modInverse(phi)
                this.dmp1 = this.d.mod(p1)
                this.dmq1 = this.d.mod(q1)
                this.coeff = this.q.modInverse(this.p)
                break
            }
        }
    }

    /**
     * Perform raw private operation on "x": return x^d (mod n)
     * @param {BigInteger} x - operate number
     * @return {BigInteger} - x^d (mod n)
     */
    _doPrivate(x) {
        if (this.p == null || this.q == null)
            return x.modPow(this.d, this.n)

        // TODO: re-calculate any missing CRT params
        var xp = x.mod(this.p).modPow(this.dmp1, this.p)
        var xq = x.mod(this.q).modPow(this.dmq1, this.q)

        while (xp.compareTo(xq) < 0)
            xp = xp.add(this.p)
        return xp.subtract(xq).multiply(this.coeff).mod(this.p).multiply(this.q).add(xq)
    }

    /**
     * Return the PKCS#1 RSA decryption of "ctext".
     * "ctext" is an even-length hex string and the output is a plain string.
     * @param {string} ctext - chipertext(format: hex string)
     * @return {stirng} - plaintext
     */
    decrypt(ctext) {
        var c = parseBigInt(ctext, 16)
        var m = this._doPrivate(c)
        if (m == null) return null
        return pkcs1unpad2(m, (this.n.bitLength() + 7) >> 3)
    }

    // /**
    //  * Return the PKCS#1 RSA decryption of "ctext".
    //  * "ctext" is a Base64-encoded string and the output is a plain string.
    //  * @param {string} ctext - chipertext(format: base64 string)
    //  * @return {stirng} - plaintext
    //  */
    // decrypt_base64(ctext) {
    //     var h = b64tohex(ctext)
    //     if(h) return this.decrypt(h); else return null
    // }
}

if(module.exports) module.exports = RSAKey
else if(windows) window.RSAKey = RSAKey

// convert a (hex) string to a bignum object
function parseBigInt(str, r) {
    return new BigInteger(str, r)
}

function linebrk(s, n) {
    var ret = ""
    var i = 0
    while (i + n < s.length) {
        ret += s.substring(i, i + n) + "\n"
        i += n
    }
    return ret + s.substring(i, s.length)
}

function byte2Hex(b) {
    if (b < 0x10)
        return "0" + b.toString(16)
    else
        return b.toString(16)
}

// PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
function pkcs1pad2(s, n) {
    if (n < s.length + 11) { // TODO: fix for utf-8
        alert("Message too long for RSA")
        return null
    }
    var ba = new Array()
    var i = s.length - 1
    while (i >= 0 && n > 0) {
        var c = s.charCodeAt(i--)
        if (c < 128) { // encode using utf-8
            ba[--n] = c
        }
        else if ((c > 127) && (c < 2048)) {
            ba[--n] = (c & 63) | 128
            ba[--n] = (c >> 6) | 192
        }
        else {
            ba[--n] = (c & 63) | 128
            ba[--n] = ((c >> 6) & 63) | 128
            ba[--n] = (c >> 12) | 224
        }
    }
    ba[--n] = 0
    var rng = new SecureRandom()
    var x = new Array()
    while (n > 2) { // random non-zero pad
        x[0] = 0
        while (x[0] == 0) rng.nextBytes(x)
        ba[--n] = x[0]
    }
    ba[--n] = 2
    ba[--n] = 0
    return new BigInteger(ba)
}

function pkcs1unpad2(d, n) {
    var b = d.toByteArray()
    var i = 0
    while (i < b.length && b[i] == 0)++i
    if (b.length - i != n - 1 || b[i] != 2)
        return null
    ++i
    while (b[i] != 0)
        if (++i >= b.length) return null
    var ret = ""
    while (++i < b.length) {
        var c = b[i] & 255
        if (c < 128) { // utf-8 decode
            ret += String.fromCharCode(c)
        }
        else if ((c > 191) && (c < 224)) {
            ret += String.fromCharCode(((c & 31) << 6) | (b[i + 1] & 63))
            ++i
        }
        else {
            ret += String.fromCharCode(((c & 15) << 12) | ((b[i + 1] & 63) << 6) | (b[i + 2] & 63))
            i += 2
        }
    }
    return ret
}
