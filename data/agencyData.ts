import { data as anGiang } from './provinces/anGiang';
import { data as bacNinh } from './provinces/bacNinh';
import { data as caMau } from './provinces/caMau';
import { data as caoBang } from './provinces/caoBang';
import { data as canTho } from './provinces/canTho';
import { data as daNang } from './provinces/daNang';
import { data as dakLak } from './provinces/dakLak';
import { data as dienBien } from './provinces/dienBien';
import { data as dongNai } from './provinces/dongNai';
import { data as dongThap } from './provinces/dongThap';
import { data as giaLai } from './provinces/giaLai';
import { data as haNoi } from './provinces/haNoi';
import { data as haTinh } from './provinces/haTinh';
import { data as haiPhong } from './provinces/haiPhong';
import { data as hoChiMinh } from './provinces/hoChiMinh';
import { data as hue } from './provinces/hue';
import { data as hungYen } from './provinces/hungYen';
import { data as khanhHoa } from './provinces/khanhHoa';
import { data as laiChau } from './provinces/laiChau';
import { data as lamDong } from './provinces/lamDong';
import { data as langSon } from './provinces/langSon';
import { data as laoCai } from './provinces/laoCai';
import { data as ngheAn } from './provinces/ngheAn';
import { data as ninhBinh } from './provinces/ninhBinh';
import { data as phuTho } from './provinces/phuTho';
import { data as quangNgai } from './provinces/quangNgai';
import { data as quangNinh } from './provinces/quangNinh';
import { data as quangTri } from './provinces/quangTri';
import { data as sonLa } from './provinces/sonLa';
import { data as tayNinh } from './provinces/tayNinh';
import { data as thaiNguyen } from './provinces/thaiNguyen';
import { data as thanhHoa } from './provinces/thanhHoa';
import { data as tuyenQuang } from './provinces/tuyenQuang';
import { data as vinhLong } from './provinces/vinhLong';

const PROVINCE_MAP: Record<string, string> = {
  'an giang': anGiang,
  'bắc ninh': bacNinh,
  'cà mau': caMau,
  'cao bằng': caoBang,
  'cần thơ': canTho,
  'đà nẵng': daNang,
  'đắk lắk': dakLak,
  'điện biên': dienBien,
  'đồng nai': dongNai,
  'đồng tháp': dongThap,
  'gia lai': giaLai,
  'hà nội': haNoi,
  'hà tĩnh': haTinh,
  'hải phòng': haiPhong,
  'hồ chí minh': hoChiMinh,
  'huế': hue,
  'thừa thiên huế': hue,
  'hưng yên': hungYen,
  'khánh hòa': khanhHoa,
  'lai châu': laiChau,
  'lâm đồng': lamDong,
  'lạng sơn': langSon,
  'lào cai': laoCai,
  'nghệ an': ngheAn,
  'ninh bình': ninhBinh,
  'phú thọ': phuTho,
  'quảng ngãi': quangNgai,
  'quảng ninh': quangNinh,
  'quảng trị': quangTri,
  'sơn la': sonLa,
  'tây ninh': tayNinh,
  'thái nguyên': thaiNguyen,
  'thanh hóa': thanhHoa,
  'tuyên quang': tuyenQuang,
  'vĩnh long': vinhLong,
};

const HEADER = "Mã cơ quan thu ,Tên cơ quan thu";

export const getAgencyData = (address: string): string => {
  if (!address) return HEADER;
  
  const normalize = (str: string) => str.toLowerCase();
  const lowerAddress = normalize(address);

  // Find the specific province data
  for (const [key, data] of Object.entries(PROVINCE_MAP)) {
    if (lowerAddress.includes(key)) {
      return `${HEADER}\n${data}`;
    }
  }

  // Fallback: If province not clearly identified, return a mix of major cities or just header
  // To avoid token limits, we just return Hanoi and HCM as default fallback
  return `${HEADER}\n${haNoi}\n${hoChiMinh}`;
};