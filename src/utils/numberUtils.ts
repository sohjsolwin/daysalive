export const isPrime = (num: number): boolean => {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
};

export const isSequence = (num: number): boolean => {
    const str = num.toString();
    if (str.length < 3) return false;
    const first = parseInt(str[0]);
    for (let i = 1; i < str.length; i++) {
        if (parseInt(str[i]) !== first + i) return false;
    }
    return true;
};

export const isPalindrome = (num: number): boolean => {
    const str = num.toString();
    return str === str.split('').reverse().join('');
};

export const isMilestone = (num: number, multiple: number = 500): boolean => {
    return num > 0 && num % multiple === 0;
};
