export const isSpecialCharacter = (char: string | null) => {
    if(!char) return false
    // eslint-disable-next-line no-useless-escape
    const pattern: RegExp = /[+\-.*()^\/]/;
    return pattern.test(char);
}

export const removeSpecialCharacter = (word: string) => word.replace(/[^\w\s]/g, '');

export const getLastCharacter = (str: string) => {
    if (str.length > 0) {
      return str.charAt(str.length - 1);
    } else {
      return null;
    }
  }