// Base62 Encoding for maximum URL shortness
// Charset: 0-9, A-Z, a-z
const CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const BASE = 62;

// Helper: Number to Base62 String
function toBase62(num: number, minLength: number = 0): string {
    if (num === 0) return "0".padStart(minLength, CHARSET[0]);
    let result = "";
    while (num > 0) {
        result = CHARSET[num % BASE] + result;
        num = Math.floor(num / BASE);
    }
    return result.padStart(minLength, CHARSET[0]);
}

// Helper: Base62 String to Number
function fromBase62(str: string): number {
    let result = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        const val = CHARSET.indexOf(char);
        if (val === -1) return NaN; // Invalid char
        result = result * BASE + val;
    }
    return result;
}

export function encodeMilestoneData(dayCount: number, dateString: string): string {
    // dateString: YYYY-MM-DD -> Number YYYYMMDD
    const dateNum = parseInt(dateString.replace(/-/g, ''), 10);

    // Encode Date to fixed 5 chars (Max 99991231 fits in 5 chars of Base62)
    const dateEncoded = toBase62(dateNum, 5);

    // Encode Day Count (Variable length)
    const dayEncoded = toBase62(dayCount);

    return dateEncoded + dayEncoded;
}

export function decodeMilestoneData(encoded: string): { dayCount: number, dateString: string } | null {
    if (!encoded || encoded.length < 6) return null; // Min 5 date + 1 day

    // First 5 chars are Date
    const datePart = encoded.substring(0, 5);
    // Remaining are Milestone Day
    const dayPart = encoded.substring(5);

    const dateNum = fromBase62(datePart);
    const dayCount = fromBase62(dayPart);

    if (isNaN(dateNum) || isNaN(dayCount)) return null;

    // Expand Date Number back to String YYYY-MM-DD
    const dateStrRaw = dateNum.toString().padStart(8, '0'); // Ensure 8 digits (e.g. 02000101 if ancient?)
    // Basic validation: must be 8 digits effectively.
    if (dateStrRaw.length !== 8) return null;

    const dateString = `${dateStrRaw.substr(0, 4)}-${dateStrRaw.substr(4, 2)}-${dateStrRaw.substr(6, 2)}`;

    return { dayCount, dateString };
}
