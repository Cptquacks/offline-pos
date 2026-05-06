// src/services/licenseService.js

class LicenseService {
    // Secret constants (must match the C generator exactly)
    CIPHER_KEY = 0xA5F3;
    MODULO = 1679616; // 36^4

    CHK_MUL_A = 7;
    CHK_MUL_B = 13;
    CHK_ADD_DAY = 31;
    CHK_ADD_MONTH = 59;
    CHK_ADD_YEAR = 97;
    CHK_CONST = 12345;

    _decodeBase36_4(str) {
        let val = 0;
        const s = str.toUpperCase();
        for (let i = 0; i < 4; i++) {
            const c = s.charCodeAt(i);
            if (c >= 48 && c <= 57) val = val * 36 + (c - 48);
            else if (c >= 65 && c <= 90) val = val * 36 + (c - 55);
            else throw new Error(`Invalid base36 char: ${str[i]}`);
        }
        return val;
    }

    _decryptZ(blockZ) {
        const E = this._decodeBase36_4(blockZ);
        const K = this.CIPHER_KEY & 0xFF;
        const yymmdd = (E - K) ^ this.CIPHER_KEY;

        if (yymmdd < 0 || yymmdd > 999999) return null;

        const day = yymmdd % 100;
        const month = Math.floor((yymmdd / 100)) % 100;
        const yearShort = Math.floor(yymmdd / 10000);
        const fullYear = 2000 + yearShort;

        if (month < 1 || month > 12 || day < 1 || day > 31) return null;

        const daysInMonth = new Date(fullYear, month, 0).getDate();
        if (day > daysInMonth) return null;

        return { year: fullYear, month, day };
    }

    _computeChecksum(numA, numB, day, month, year) {
        const sum = numA * this.CHK_MUL_A +
            numB * this.CHK_MUL_B +
            day * this.CHK_ADD_DAY +
            month * this.CHK_ADD_MONTH +
            year * this.CHK_ADD_YEAR +
            this.CHK_CONST;
        return sum % this.MODULO;
    }

    verifyLicense(code) {
        try {
            const clean = code.replace(/-/g, '').toUpperCase();
            if (clean.length !== 16) return false;

            const blockA = clean.substring(0, 4);
            const blockB = clean.substring(4, 8);
            const blockC = clean.substring(8, 12);
            const blockZ = clean.substring(12, 16);

            const numA = this._decodeBase36_4(blockA);
            const numB = this._decodeBase36_4(blockB);
            const numC = this._decodeBase36_4(blockC);

            const expDate = this._decryptZ(blockZ);
            if (!expDate) return false;

            const expectedC = this._computeChecksum(numA, numB, expDate.day, expDate.month, expDate.year);
            if (numC !== expectedC) return false;

            const now = new Date();
            const expiration = new Date(expDate.year, expDate.month - 1, expDate.day);
            return now <= expiration;
        } catch (e) {
            console.error('License verification error:', e);
            return false;
        }
    }

    getExpirationDate(code) {
        try {
            const clean = code.replace(/-/g, '').toUpperCase();
            if (clean.length !== 16) return null;
            const blockZ = clean.substring(12, 16);
            const fecha = this._decryptZ(blockZ);
            if (!fecha) return null;
            const y = fecha.year;
            const m = String(fecha.month).padStart(2, '0');
            const d = String(fecha.day).padStart(2, '0');
            return `${y}-${m}-${d}`;
        } catch (e) {
            console.error(e)
            return null;
        }
    }
}

export default LicenseService;