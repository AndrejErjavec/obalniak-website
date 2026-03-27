import { format, formatDistanceToNow } from "date-fns";
import { sl } from "date-fns/locale";

interface ExperienceLevelStyle {
  value: string;
  name: string;
}

export const experienceLevel: Record<string, ExperienceLevelStyle> = {
  TECAJNIK: {
    value: "TECAJNIK",
    name: "Tečajnik",
  },
  MLAJSI_PRIPRAVNIK: {
    value: "MLAJSI_PRIPRAVNIK",
    name: "Mlajši pripravnik",
  },
  STAREJSI_PRIPRAVNIK: {
    value: "STAREJSI_PRIPRAVNIK",
    name: "Starejši pripravnik",
  },
  ALPINIST: {
    value: "ALPINIST",
    name: "Alpinist",
  },
  ALPINISTICNI_INSTRUKTOR: {
    value: "ALPINISTICNI_INSTRUKTOR",
    name: "Alpinistični inštruktor",
  },
};

export const formatDate = (dateString: string) => {
  return format(dateString, "dd. MM. yyyy");
};

export const relativeTime = (dateTimeString: string) => {
  const date = new Date(dateTimeString);
  return formatDistanceToNow(date, { addSuffix: false, locale: sl });
};
