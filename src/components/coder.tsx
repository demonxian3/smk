import urlcoder from "urlencode";

class Coder {
    specialSigns = {
        b: String.fromCharCode(8),
        f: String.fromCharCode(12),
        t: String.fromCharCode(9),
        n: String.fromCharCode(10),
        r: String.fromCharCode(13),
        '"': String.fromCharCode(34),
        "&": String.fromCharCode(38),
        "'": String.fromCharCode(39),
        "": String.fromCharCode(92),
    };

    methodsCnMap = {
        urlencode: "Url编码",
        urldecode: "Url解码",
        base64encode: "Base64编码",
        base64decode: "Base64解码",
        hexencode: "Hex编码",
        hexdecode: "Hex解码",
        binencode: "Bin编码",
        bindecode: "Bin解码",
        unicodeencode: "Unicode编码",
        unicodedecode: "Unicode解码",
        entityencode: "实体编码",
        entitydecode: "实体解码",
        toTimestamp: "转时间戳",
        toDatetime: "转日期时间",
        jsonParse: "json格式化",
        jsonCompress: "json压缩",
        escape: "转义",
        unescape: "去转义",
        addBackslash: "加反斜杆",
        delBackslash: "去反斜杆",
        paramSplit: "参数分行",
        paramJoinl: "参数并行",
    };

    urlencode(input: string, charset = "utf8"): string {
        console.log(charset);
        const str = urlcoder(input, charset);
        let output = "";
        let i = 0;
        while (i < str.length) {
            if (str[i] === "%") {
                output += str[i] + str[i + 1] + str[i + 2];
                i += 3;
                continue;
            }

            const ascii = str[i].charCodeAt(0);
            if (ascii >= 0 && ascii < 128) {
                output += "%" + ascii.toString(16).toUpperCase();
            }
            i++;
        }

        return output;
    }

    urldecode(input: string, charset = "utf8"): string {
        return urlcoder.decode(input, charset);
    }

    base64encode(input: string): string {
        return Buffer.from(input).toString("base64");
    }

    base64decode(input: string): string {
        return Buffer.from(input, "base64").toString("utf8");
    }

    hexencode(input: string): string {
        return Buffer.from(input).toString("hex");
    }

    hexdecode(input: string): string {
        return Buffer.from(input, "hex").toString("utf8");
    }

    unicodeencode(input: string): string {
        return escape(input).replace(/%/g, "\\").toLowerCase();
    }

    unicodedecode(input: string): string {
        return unescape(input.replace(/\\/g, "%"));
    }

    entityencode(input: string, radix = 1) {
        let arr = input.split("");
        let output = arr
            .map((item) => `&#${radix ? "x" + item.charCodeAt(0).toString(16) : item.charCodeAt(0)};`)
            .join("");
        return output;
    }

    entitydecode(input: string) {
        let entities = input.split(";");
        entities.pop();
        let output = entities
            .map((item) => String.fromCharCode(item[2] === "x" ? parseInt(item.slice(3), 16) : parseInt(item.slice(2))))
            .join("");
        return output;
    }

    toTimestamp(input: string): string {
        return (new Date(input).getTime() / 1000).toString();
    }

    toDatetime(input: string): string {
        let tmp = input;
        if (input.length === 10) {
            tmp += "000";
        }
        const d = new Date(parseInt(tmp, 10));
        return `${d.getFullYear()}-${
            d.getMonth() + 1
        }-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    }

    jsonParse(input: string) {
        return JSON.stringify(JSON.parse(input), null, 4);
    }

    jsonCompress(input: string) {
        return JSON.stringify(JSON.parse(input), null, 0);
    }

    escape(input: string, signs: string[] = []): string {
        let signsFilter = signs.length ? signs : Object.keys(this.specialSigns);
        let output = this.hexencode(input);
        const specialSigns = this.specialSigns;
        for (let key of signsFilter) {
            const sign = specialSigns[key as keyof typeof specialSigns];
            const hex = this.hexencode(sign);
            if (!key) continue;
            const rep = this.hexencode("\\" + key);
            output = output.replace(new RegExp(hex, "gm"), rep);
        }

        return this.hexdecode(output);
    }

    unescape(input: string, signs: string[] = []): string {
        let signsFilter = signs.length ? signs : Object.keys(this.specialSigns);
        let output = input;
        const specialSigns = this.specialSigns;
        for (let key of signsFilter) {
            const sign = specialSigns[key as keyof typeof specialSigns];
            output = output.replace(new RegExp("\\\\" + key, "gm"), sign);
        }
        return output;
    }

    addBackslash(input: string): string {
        return input.replace(/\\/gm, "\\\\");
    }

    delBackslash(input: string): string {
        const single = /\\/gm;
        const double = /\\\\/gm;

        if (double.test(input)) {
            return input.replace(double, "\\");
        } else {
            return input.replace(single, "");
        }
    }

    paramSplit(input: string): string {
        return input.replace(/([?&])/gm, "\n$1");
    }

    paramJoinl(input: string): string {
        return input.replace(/\n([?&])/gm, "$1");
    }
}

export default Coder;
