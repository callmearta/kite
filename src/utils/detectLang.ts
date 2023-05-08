const detectLang = (textToCheck: string) => (new Promise((resolve, reject) => {
    let text = textToCheck.replace(/\s/g, ''); //read input value, and remove "space" by replace \s 
    //Dictionary for Unicode range of the languages
    var langdic = {
        "jp": /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/,
        "kr": /[\u3131-\uD79D]/ugi,
        "ar": /[\u0600-\u06FF]/,
        "fa": /[\u0750-\u077F]/,
        "en": /^[a-zA-Z]+$/
    }
    //const keys = Object.keys(langdic); //read  keys
    //const keys = Object.values(langdic); //read  values
    const keys = Object.entries(langdic); // read  keys and values from the dictionary
    return Object.entries(langdic).forEach(([key, value]) => {  // loop to read all the dictionary items if not true
        if (value.test(text) == true) {   //Check Unicode to see which one is true
            return resolve(key);
        }
    });
}))

export default detectLang