// Depends on jsbn.js and rng.js

// Version 1.1: support utf-8 encoding in pkcs1pad2
import SecureRandom from './rng'
import BigInteger from './jsbn'

export default class RSAKey{

  // "empty" RSA key constructor
  constructor(){
    this.algorithm = "RSA"
    this.n = null
    this.e = 0
    this.d = null
    this.p = null
    this.q = null
    this.dmp1 = null
    this.dmq1 = null
    this.coeff = null
  }

  // Perform raw public operation on "x": return x^e (mod n)
  doPublic(x) {
    return x.modPowInt(this.e, this.n);
  }

  // Perform raw private operation on "x": return x^d (mod n)
  doPrivate(x) {
    if(this.p == null || this.q == null)
      return x.modPow(this.d, this.n);

    // TODO: re-calculate any missing CRT params
    var xp = x.mod(this.p).modPow(this.dmp1, this.p);
    var xq = x.mod(this.q).modPow(this.dmq1, this.q);

    while(xp.compareTo(xq) < 0)
      xp = xp.add(this.p);
    return xp.subtract(xq).multiply(this.coeff).mod(this.p).multiply(this.q).add(xq);
  }

  getPublic() {
    return {
      N: this.n.toString(16),
      E: this.e.toString(16)
    }
  }

  getPrivate() {
    return {
      // bN: this.n.toString(16),
      E: this.e.toString(16),
      D: this.d.toString(16)
    } 
  }

  // Set the public key fields N and e from hex strings
  setPublic(N,E) {
    if(N != null && E != null && N.length > 0 && E.length > 0) {
      this.n = new BigInteger(N,16);
      this.e = parseInt(E,16);
    }
    else
      alert("Invalid RSA public key");
  }

  // Return the PKCS#1 RSA encryption of "text" as an even-length hex string
  encrypt(text) {
    var m = pkcs1pad2(text,(this.n.bitLength()+7)>>3);
    if(m == null) return null;
    var c = this.doPublic(m);
    if(c == null) return null;
    var h = c.toString(16);
    if((h.length & 1) == 0) return h; else return "0" + h;
  }

  // Set the private key fields N, e, and d from hex strings
  setPrivate(N,E,D) {
    if(N != null && E != null && N.length > 0 && E.length > 0) {
      this.n = new BigInteger(N,16);
      this.e = parseInt(E,16);
      this.d = new BigInteger(D,16);
    }
    else
      alert("Invalid RSA private key");
  }

  // Set the private key fields N, e, d and CRT params from hex strings
  setPrivateEx(N,E,D,P,Q,DP,DQ,C) {
    if(N != null && E != null && N.length > 0 && E.length > 0) {
      this.n = new BigInteger(N,16);
      this.e = parseInt(E,16);
      this.d = new BigInteger(D,16);
      this.p = new BigInteger(P,16);
      this.q = new BigInteger(Q,16);
      this.dmp1 = new BigInteger(DP,16);
      this.dmq1 = new BigInteger(DQ,16);
      this.coeff = new BigInteger(C,16);
    }
    else
      alert("Invalid RSA private key");
  }

  /** 
   * Generate a new random private key B bits long, using public expt E
   * @param {number} B - 秘钥位数
   * @param {string} E - 公开的基数（十六进制表示， 默认为'3'）
   * */
  generate(B,E = '3') {
    var rng = new SecureRandom();
    var qs = B>>1;
    this.e = parseInt(E,16);
    var ee = new BigInteger(E,16);
    for(;;) {
      for(;;) {
        this.p = new BigInteger(B-qs,1,rng);
        if(this.p.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.p.isProbablePrime(10)) break;
      }
      for(;;) {
        this.q = new BigInteger(qs,1,rng);
        if(this.q.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.q.isProbablePrime(10)) break;
      }
      if(this.p.compareTo(this.q) <= 0) {
        var t = this.p;
        this.p = this.q;
        this.q = t;
      }
      var p1 = this.p.subtract(BigInteger.ONE);
      var q1 = this.q.subtract(BigInteger.ONE);
      var phi = p1.multiply(q1);
      if(phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
        this.n = this.p.multiply(this.q);
        this.d = ee.modInverse(phi);
        this.dmp1 = this.d.mod(p1);
        this.dmq1 = this.d.mod(q1);
        this.coeff = this.q.modInverse(this.p);
        break;
      }
    }
  }

  /** 
   * 使用当前秘钥对象解密
   * @param {string} ctext - 密文（双字符16进制表示）
   * @return {string} - 解密后的字符串
   * */
  decrypt(ctext) {
    var c = new BigInteger(ctext, 16);
    var m = this.doPrivate(c);
    if(m == null) return null;
    return pkcs1unpad2(m, (this.n.bitLength()+7)>>3);
  } 
}

// PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
function pkcs1pad2(s,n) {
  if(n < s.length + 11) { // TODO: fix for utf-8
    alert("Message too long for RSA");
    return null;
  }
  var ba = new Array();
  var i = s.length - 1;
  while(i >= 0 && n > 0) {
    var c = s.charCodeAt(i--);
    if(c < 128) { // encode using utf-8
      ba[--n] = c;
    }
    else if((c > 127) && (c < 2048)) {
      ba[--n] = (c & 63) | 128;
      ba[--n] = (c >> 6) | 192;
    }
    else {
      ba[--n] = (c & 63) | 128;
      ba[--n] = ((c >> 6) & 63) | 128;
      ba[--n] = (c >> 12) | 224;
    }
  }
  ba[--n] = 0;
  var rng = new SecureRandom();
  var x = new Array();
  while(n > 2) { // random non-zero pad
    x[0] = 0;
    while(x[0] == 0) rng.nextBytes(x);
    ba[--n] = x[0];
  }
  ba[--n] = 2;
  ba[--n] = 0;
  return new BigInteger(ba);
}

// Undo PKCS#1 (type 2, random) padding and, if valid, return the plaintext
function pkcs1unpad2(d,n) {
  var b = d.toByteArray();
  var i = 0;
  while(i < b.length && b[i] == 0) ++i;
  if(b.length-i != n-1 || b[i] != 2)
    return null;
  ++i;
  while(b[i] != 0)
    if(++i >= b.length) return null;
  var ret = "";
  while(++i < b.length) {
    var c = b[i] & 255;
    if(c < 128) { // utf-8 decode
      ret += String.fromCharCode(c);
    }
    else if((c > 191) && (c < 224)) {
      ret += String.fromCharCode(((c & 31) << 6) | (b[i+1] & 63));
      ++i;
    }
    else {
      ret += String.fromCharCode(((c & 15) << 12) | ((b[i+1] & 63) << 6) | (b[i+2] & 63));
      i += 2;
    }
  }
  return ret;
}