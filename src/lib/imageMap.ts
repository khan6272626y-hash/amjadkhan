import shoe1 from "@/assets/shoe-1.jpg";
import shoe2 from "@/assets/shoe-2.jpg";
import shoe3 from "@/assets/shoe-3.jpg";
import shoe4 from "@/assets/shoe-4.jpg";
import shoe5 from "@/assets/shoe-5.jpg";
import shoe6 from "@/assets/shoe-6.jpg";
import shoe7 from "@/assets/shoe-7.jpg";
import shoe8 from "@/assets/shoe-8.jpg";
import shoe9 from "@/assets/shoe-9.jpg";
import shoe10 from "@/assets/shoe-10.jpg";
import shoe11 from "@/assets/shoe-11.jpg";
import shoe12 from "@/assets/shoe-12.jpg";
import shoe13 from "@/assets/shoe-13.jpg";
import shoe14 from "@/assets/shoe-14.jpg";
import shoe15 from "@/assets/shoe-15.jpg";
import shoe16 from "@/assets/shoe-16.jpg";

const imageMap: Record<string, string> = {
  "shoe-1": shoe1,
  "shoe-2": shoe2,
  "shoe-3": shoe3,
  "shoe-4": shoe4,
  "shoe-5": shoe5,
  "shoe-6": shoe6,
  "shoe-7": shoe7,
  "shoe-8": shoe8,
  "shoe-9": shoe9,
  "shoe-10": shoe10,
  "shoe-11": shoe11,
  "shoe-12": shoe12,
  "shoe-13": shoe13,
  "shoe-14": shoe14,
  "shoe-15": shoe15,
  "shoe-16": shoe16,
};

export const getImageUrl = (key: string): string => {
  return imageMap[key] || "/placeholder.svg";
};
