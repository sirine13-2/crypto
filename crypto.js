
// Fonctions de chiffrement classiques
function process(mode) {
    const text = document.getElementById("input").value.toUpperCase();
    const algo = document.getElementById("algo").value;
    const key = document.getElementById("key").value.toUpperCase();
    let result = "";

    switch (algo) {
        case "albam":
            result = text.replace(/[A-Z]/g, c => String.fromCharCode(155 - c.charCodeAt(0)));
            break;
        case "atbah":
        case "atbash":
            result = text.replace(/[A-Z]/g, c => String.fromCharCode(155 - c.charCodeAt(0)));
            break;
        case "alberti":
            result = alberti(text, key, mode);
            break;
        case "polybe":
            result = polybe(text, mode);
            break;
        case "substitution":
            result = substitutionSimple(text, key, mode);
            break;
        case "cesar":
            const shift = parseInt(key) || 3;
            result = text.replace(/[A-Z]/g, c =>
                String.fromCharCode(((c.charCodeAt(0) - 65 + (mode === 'encrypt' ? shift : 26 - shift)) % 26) + 65)
            );
            break;
        case "vigenere":
            result = vigenere(text, key, mode);
            break;
        case "trithemius":
            result = trithemius(text, mode);
            break;
        case "autokey":
            result = autokey(text, key, mode);
            break;
        case "porta":
            result = porta(text, key, mode);
            break;
        case "beaufort":
            result = beaufort(text, key);
            break;
        case "vernam":
            result = vernam(text, key);
            break;
        default:
            result = "Algorithme non reconnu.";
    }

    document.getElementById("output").innerText = result;
}

function vigenere(text, key, mode) {
    if (!key) return "Clé requise pour Vigenère.";
    let result = "";
    for (let i = 0, j = 0; i < text.length; i++) {
        let c = text[i];
        if (c >= 'A' && c <= 'Z') {
            const shift = key.charCodeAt(j % key.length) - 65;
            const base = c.charCodeAt(0) - 65;
            const newChar = mode === 'encrypt'
                ? String.fromCharCode(((base + shift) % 26) + 65)
                : String.fromCharCode(((base - shift + 26) % 26) + 65);
            result += newChar;
            j++;
        } else {
            result += c;
        }
    }
    return result;
}

function trithemius(text, mode) {
    let result = "";
    for (let i = 0; i < text.length; i++) {
        const c = text.charCodeAt(i);
        if (c >= 65 && c <= 90) {
            const shift = i % 26;
            const base = c - 65;
            result += String.fromCharCode(((mode === 'encrypt' ? base + shift : base - shift + 26) % 26) + 65);
        } else {
            result += text[i];
        }
    }
    return result;
}

function autokey(text, key, mode) {
    if (!key) return "Clé requise pour Autokey.";
    let result = "";
    key = key.toUpperCase();
    let fullKey = key;
    if (mode === "encrypt") fullKey += text;
    for (let i = 0, j = 0; i < text.length; i++) {
        let c = text[i];
        if (c >= 'A' && c <= 'Z') {
            const k = fullKey.charCodeAt(j) - 65;
            const base = c.charCodeAt(0) - 65;
            const newChar = mode === 'encrypt'
                ? String.fromCharCode(((base + k) % 26) + 65)
                : String.fromCharCode(((base - k + 26) % 26) + 65);
            result += newChar;
            j++;
        } else {
            result += c;
        }
    }
    return result;
}

function porta(text, key, mode) {
    if (!key) return "Clé requise pour Porta.";
    const pairs = "AZBYCXDWEVFUGTHSIRJQKPLOMN";
    let result = "";
    for (let i = 0, j = 0; i < text.length; i++) {
        let c = text[i];
        if (c >= 'A' && c <= 'Z') {
            const ki = key[j % key.length].charCodeAt(0) - 65;
            const pair = pairs.slice((ki % 13) * 2, (ki % 13) * 2 + 2);
            const index = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c);
            result += pair[index % 2 === 0 ? 1 : 0];
            j++;
        } else {
            result += c;
        }
    }
    return result;
}

function beaufort(text, key) {
    if (!key) return "Clé requise pour Beaufort.";
    let result = "";
    for (let i = 0, j = 0; i < text.length; i++) {
        let c = text[i];
        if (c >= 'A' && c <= 'Z') {
            const k = key.charCodeAt(j % key.length) - 65;
            const base = c.charCodeAt(0) - 65;
            result += String.fromCharCode(((k - base + 26) % 26) + 65);
            j++;
        } else {
            result += c;
        }
    }
    return result;
}

function vernam(text, key) {
    if (!key || key.length < text.length) return "Clé de même longueur requise pour Vernam.";
    let result = "";
    for (let i = 0; i < text.length; i++) {
        let c = text[i];
        if (c >= 'A' && c <= 'Z') {
            const t = c.charCodeAt(0) - 65;
            const k = key.charCodeAt(i) - 65;
            result += String.fromCharCode(((t ^ k) % 26) + 65);
        } else {
            result += c;
        }
    }
    return result;
}

function substitutionSimple(text, key, mode) {
    if (!key || key.length !== 26) return "Clé de 26 lettres requise.";
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const map = {};
    for (let i = 0; i < 26; i++) {
        map[mode === "encrypt" ? alphabet[i] : key[i]] = mode === "encrypt" ? key[i] : alphabet[i];
    }
    return text.replace(/[A-Z]/g, c => map[c] || c);
}

function polybe(text, mode) {
    const square = [
        ["A","B","C","D","E"],
        ["F","G","H","I","K"],
        ["L","M","N","O","P"],
        ["Q","R","S","T","U"],
        ["V","W","X","Y","Z"]
    ];
    const coords = {};
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            coords[square[i][j]] = `${i+1}${j+1}`;
        }
    }
    if (mode === "encrypt") {
        return text.replace(/[A-Z]/g, c => coords[c === "J" ? "I" : c] || c);
    } else {
        let result = "";
        for (let i = 0; i < text.length; i += 2) {
            const row = parseInt(text[i]) - 1;
            const col = parseInt(text[i+1]) - 1;
            result += square[row][col];
        }
        return result;
    }
}

function alberti(text, key, mode) {
    if (!key) return "Clé requise pour Alberti.";
    const outer = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const inner = key + outer;
    const uniqueInner = [...new Set(inner)].slice(0, 26).join("");
    let result = "";
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        const index = mode === "encrypt" ? outer.indexOf(c) : uniqueInner.indexOf(c);
        result += index !== -1 ? (mode === "encrypt" ? uniqueInner[index] : outer[index]) : c;
    }
    return result;
}
