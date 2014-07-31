var fs = require('fs');
var binary = require('binary');

var iso = ['AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AW', 'AX', 'AZ',
    'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS',
    'BT', 'BV', 'BW', 'BY', 'BZ', 'CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN',
    'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE',
    'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FM', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF',
    'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HM',
    'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IR', 'IS', 'IT', 'JE', 'JM',
    'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KP', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC',
    'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MK',
    'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA',
    'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG',
    'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT', 'PW', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW',
    'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS',
    'ST', 'SV', 'SX', 'SY', 'SZ', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO',
    'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'UM', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI',
    'VN', 'VU', 'WF', 'WS', 'YE', 'YT', 'ZA', 'ZM', 'ZW', 'XA', 'YU', 'CS', 'AN', 'AA', 'EU', 'AP'
];

var nullbuff = new Buffer([0x00]);
const offset = 16777215;


function tabgeoBs(arrdata, ip, step) {
    var start = 0,
        end = arrdata.length - 1,
        mid, unpack, unpackPrev;

    while (true) {
        mid = Math.floor((start + end) / 2);
        unpack = step ?
            binary.parse(Buffer.concat([nullbuff, arrdata[mid]])).word32bu('offset').word8('ip').word8('ccid').vars :
            binary.parse(arrdata[mid]).word8('ip').word8('ccid').vars;

        if (unpack['ip'] == ip) return unpack;
        if (end - start < 0) return ip > unpack['ip'] ? unpack : unpackPrev;
        if (unpack['ip'] > ip) {
            end = mid - 1;
        } else {
            start = mid + 1;
        }

        unpackPrev = unpack;
    }
}

function buffsplit(buff, length) {
    var res = [];
    for (var i = 0, l = buff.length / length; i < l; i++) {
        res.push(buff.slice(i * length, length * (i + 1)));
    }
    return res;
}

module.exports = function (pathdat) {
    var datbuff = fs.readFileSync(pathdat);
    var datlength = datbuff.length;

    return function (ip) {
        var arrip = ip.split('.').map(function (item) {
                return parseInt(item)
            }),
            indexbuff, index, slcstart, bin, data;

        slcstart = (arrip[0] * 256 + arrip[1]) * 4;
        indexbuff = Buffer.concat([nullbuff, datbuff.slice(slcstart, slcstart + 4)]);
        index = binary.parse(indexbuff).word32bu('offset').word8('length').vars;

        if (index.offset == offset) return iso[index.length];

        slcstart = index.offset * 5 + 262144;
        bin = datbuff.slice(slcstart, slcstart + (index.length + 1) * 5);

        data = tabgeoBs(buffsplit(bin, 5), arrip[2], true);
        if (data.offset == offset) return iso[data.ccid];

        if (arrip[2] > data.ip) arrip[3] = 255;

        slcstart = datlength - ((data.offset + 1 + data.ccid) * 2);
        bin = datbuff.slice(slcstart, slcstart + (data.ccid + 1) * 2);
        data = tabgeoBs(buffsplit(bin, 2), arrip[3], false);
        return iso[data.ccid];
    };
};