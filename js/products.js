/* ==========================================================
   products.js — single source of truth for products, prices,
   images and business settings. Edit here, not in the HTML.
   ========================================================== */

/* BUSINESS SETTINGS — fill these in when the details are confirmed. */
const MAUZ_CONFIG = {
  // TODO: replace with the official WhatsApp number, international format without "+" or spaces (e.g. "628xxxxxxxxxx").
  // While empty, WhatsApp opens with the message ready and lets the sender pick the contact.
  whatsappNumber: "",
  // TODO: add the official Instagram URL when available; the footer link only appears if this is set.
  instagramUrl: "",
  pricePerFlavor: 25000,
  brand: "Mauz Lagi",
  tagline: "Sekali Coba, Mauz Lagi!",
  deliveryArea: "Sekitar Kabupaten Bogor"
};

/* IMAGES — temporary Stitch URLs. Replace each value with a local file,
   e.g. "assets/images/matcha.jpg", once original photos are ready. */
const IMAGES = {
  matcha: "https://lh3.googleusercontent.com/aida-public/AB6AXuAayV1eHXFYh4pC8TouZ7JQ8zyYXt1C2RbBFouRF5rsXiXSCz2D1MlGBgeQxLYyPfXGGu67FUV-yY78Afougq2MKQcf6zlk3g3_FeRKrQZBWx3C-yiVotKqh2UT2Adfkyl-E4TeBeGkIjOfnA5Beywin2powZmbeRckcW8M_Q-tiKFWewmuvNWeTIymGTrPup00QXH8Ux2J6eBx_kKU4jryt6JZwID3dVDThsLrJw",
  tiramisu: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9nArco8IkXwPUImXD-MS_DHeSWoO70RxRki8T_2Lo8uW0YNInqEGB91ttSXSAcLRAiJQK1o4xq3J-Q7lIdRaxDiRyl9mA9vUdv2Seqt9DKP0jzReku-AuSlDsRTOeRs1MOcTvDVP6enghx4w1aSoeiVDjZCGyc0uFRQFJ1WvnT1B7HeYon49ZUglJQtiE2NrTGYhGdJoaeRxoCPCbzVhbHG2UooDocnD6aUjb5Q",
  chocolate: "https://lh3.googleusercontent.com/aida-public/AB6AXuAj5r9SvQbWj_N6EHxyis8X_kjYA3ghEjsEVwVYEEvq6kd2mjAhmhBzol0yeL2FI4lHa-8uvcBYebZyoTVgKnB3sujlzP6uatClEyaLAs2gP7cHZYwE7UELDyyu3Z4d1w2d5sPTUFnBQ8vZ3AVOzF9OlSJOBfgtOTKv6xaWtmREC637jwLQu2O_wum8HsZgVAneWE2eOjLa1xDSc0eibTr75lTfqywtTKARcF5QEQ",
  strawberry: "https://lh3.googleusercontent.com/aida-public/AB6AXuC363FLfpjURx4BLJJL5_9blFTJE4Ra_i9SOZadDHWsQ5PSTUVKP7Xb3B_M0a_byh8MR1W8PhIgsqrH2ZhbOpw_5YonL6uxrznnVkqnzte_LRCx46LiNxDnVFQelzC52bcawKMIT3dfhFXZH04pbATh5NL3Fs1a6xMUARr73zrDs5ikt1GGQ0aYCT-1r7MQU4-jhgsK4kn-bjESIzbh-mpJv7IIYuxn57zxaN-PiA",
  hero: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3l4rWCjug-t7r0hiMZKbHd31NLtqdvMvVbdksHwlrfMQrlYJg6dMDHrebXV1KqOhyTL7feWWV965-1KQSFxSDsby4Z5UlmnLNBxLexJ23SATfsR8tzuTo53PzSn-fix5neIdsejq35IEvANCNUayy1JiGiGEwbiK0dJlv1HfgH_l_D5px20AwsBU6MZ9cB30CYoKEwvHpCd8ye_xusedc6dNQ0B5i8FDku7m-og",
  crunch: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWYghhnlIT5H5com2y6-86u7xDtKSi7cDBkahblHR2wwyH5QVnssr0JAWKzX2Re0lJte7_dFK5JtKSBfr-qzLGyfUdCSEaLz6cZ22xCLVzZcrCY8AKShRJn-UzT02V7eFKIP4B_I8MDnk4NL6U1IP1TpIcbPP5smBuvg_xTlOzOHmT3BajAK7x3iHyUsBiyEKwf5HELLEIamYiTh1A6XsflHyR2lI86sJ-j1Wy_g",
  melt: "https://lh3.googleusercontent.com/aida-public/AB6AXuDr0Fyz8nwsZKMsxUUkKdoduGhteyPvTAbsptbIr7wC8yZcdPyylt53R-fKNLwz9u9139Y9jBP5w46g8G-hKllK7TFkvUN0lwfC8yWjYg6bMZBWqvKFhzjDfVOamHL-rjd1tUZQ5ubzPaFTk9CxuK1_wjr6CQVda8lEr_CulKjrgu-7xQ1tNSr3k2ekVJOh5G5kMby1Wpa149-vCvcsJVWGLASPHfstyKSsSqMEgQ",
  share: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2t3ek1YgvlDj9fGs4bai3EIalV14p2i6GTdCy-xSUyeYNjluyTPDOKEG0FH-BvdeG_RDNEDDPFXD5wbY0HCR8RbvLz7kywrIGLYtk-2ocPLA1DU2ThbGysCUpQq4YtZra5BvtG4jAmDlXWczvF2nDFAqQgfMo72BOAi-hCWfbZj5_3347fscD3YccHb_NDQMC8k760O_34zZccomArRoQRYOSBBKsK4wTpvpVYw",
  box: "https://lh3.googleusercontent.com/aida-public/AB6AXuCf36CT9Dv20G0nSqlEnL0xoaen7f9D9KNUqWn12Ku8_83THj0Z4sVPQAHZr1rmi9vJEpHYK_LCfQU3ow69UpGXuO4QkGLsROSKQbGOpfJLVV1M_ofVD7losUKawGd3WOzPcmeeLmLkrO46EydyoWllrzJs3gAPXvOwYaFm2h7G7SNPGY_LfuGAvTefAn5qnPX7PnHPtq6dtrILG9qpOS3cQyN6Mr3KAXflvkIsLw",
  about1: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhU7COAbJ7ATmBW8Wi3Usmc5EWKqnRxRMCza_wKvsqJF7Y_4SP1WtNQScM-UAc6Rv0LGF54IWK7VyfDnTO8eYAw2B5l9lPJD4OSwF4aanJ1k8i7DoXh8h69pcpQ3nEnGPdeCKqRgW8IasTi8lSHx-16L8cYxuS-vzeVwCc8rRl17-vx5BqjT-MUcCuhTJ5ZumlnYmYbBY2cKtFJmGGlMqFpFfA_eMRXKnPPIKuCA",
  about2: "https://lh3.googleusercontent.com/aida-public/AB6AXuAf0J8CbqyvcETe5sr1-2Mvi2-q-aJ2D044TmlJTsXHabjAd5EMGcjoNFLVINz5SkY_DU7plrkzag_RY3J96An-RKA7Cs_aE8b_2TM5MuZBq9NeVR-mJWtqI3nar22T30HTxQ0849BsyB40MS-O84dBqGbiuWFMnl82zBc_Mle0Y1f9unK9E85IynMy9JV4SkGsQYHA1FGrVVAca1mKzRTmEinaoGv0YI7Yil3WuQ",
};

/* Inline fallback shown when an image fails to load. */
function fallbackImage(color) {
  const c = encodeURIComponent(color || "#BF895D");
  return "data:image/svg+xml;charset=utf-8," +
    "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23EBE4D8'/%3E%3Ccircle cx='200' cy='200' r='90' fill='" + c + "' opacity='.7'/%3E%3C/svg%3E";
}

/* PRODUCTS — descriptions are short brand copy, not product specifications. */
const PRODUCTS = [
  { id: "matcha", name: "Matcha", price: MAUZ_CONFIG.pricePerFlavor, color: "#75815C", img: IMAGES.matcha,
    desc: "Keripik pisang renyah dengan lapisan matcha yang lembut." },
  { id: "tiramisu", name: "Tiramisu", price: MAUZ_CONFIG.pricePerFlavor, color: "#BF895D", img: IMAGES.tiramisu,
    desc: "Lapisan rasa tiramisu yang hangat di atas keripik pisang." },
  { id: "chocolate", name: "Chocolate", price: MAUZ_CONFIG.pricePerFlavor, color: "#5A3A2B", img: IMAGES.chocolate,
    desc: "Keripik pisang berlapis cokelat untuk kamu yang suka klasik." },
  { id: "strawberry", name: "Strawberry", price: MAUZ_CONFIG.pricePerFlavor, color: "#D7A3A0", img: IMAGES.strawberry,
    desc: "Lapisan stroberi manis berwarna pink di atas keripik pisang." }
];

/* Helpers */
function getProduct(id) { return PRODUCTS.find(function (p) { return p.id === id; }); }
function formatRupiah(n) { return "Rp" + Number(n).toLocaleString("id-ID"); }
