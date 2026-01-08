const CHU_SO = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
const TEN_LOP = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

function docSo3ChuSo(baso: number, lop: boolean): string {
    let text = "";
    const tram = Math.floor(baso / 100);
    const chuc = Math.floor((baso % 100) / 10);
    const donvi = baso % 10;

    if (tram === 0 && chuc === 0 && donvi === 0) return "";

    if (lop) {
        text += CHU_SO[tram] + " trăm ";
        if (chuc === 0 && donvi !== 0) text += "linh ";
    } else {
        if (tram !== 0) {
            text += CHU_SO[tram] + " trăm ";
            if (chuc === 0 && donvi !== 0) text += "linh ";
        }
    }

    if (chuc !== 0 && chuc !== 1) {
        text += CHU_SO[chuc] + " mươi ";
        if (chuc === 0 && donvi !== 0) text += "linh ";
    }

    if (chuc === 1) text += "mười ";

    switch (donvi) {
        case 1:
            if (chuc !== 0 && chuc !== 1) text += "mốt ";
            else text += CHU_SO[donvi] + " ";
            break;
        case 5:
            if (chuc === 0) text += CHU_SO[donvi] + " ";
            else text += "lăm ";
            break;
        default:
            if (donvi !== 0) text += CHU_SO[donvi] + " ";
            break;
    }

    return text.trim();
}

export function numberToVietnameseText(numberStr: string): string {
    // Remove dots/commas to parse number
    const cleanStr = numberStr.replace(/\./g, '').replace(/,/g, '');
    const num = parseInt(cleanStr, 10);

    if (isNaN(num)) return "";
    if (num === 0) return "Không đồng";

    let temp = num;
    let str = "";
    let i = 0;

    while (temp > 0) {
        const part = temp % 1000;
        const partText = docSo3ChuSo(part, i > 0 && temp > 999); 
        
        if (partText.length > 0) {
            str = partText + " " + TEN_LOP[i] + " " + str;
        }
        
        temp = Math.floor(temp / 1000);
        i++;
    }

    str = str.trim();
    // Capitalize first letter
    return str.charAt(0).toUpperCase() + str.slice(1) + " đồng";
}

export function formatCurrency(value: string): string {
  // Simple formatter to add dots for thousands
  const number = value.replace(/\D/g, '');
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}