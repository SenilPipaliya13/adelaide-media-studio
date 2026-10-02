// Public studio contact details shown on the homepage Contact tab.
// PLACEHOLDER: STUDIO_PHONE is not a real number yet. Replace it before launch.
export const STUDIO_PHONE = "0400 000 000";
export const STUDIO_EMAIL = "spmediaco7@gmail.com";

// E.164 digits without the plus, as used by tel: and wa.me links.
const phoneDigits = `61${STUDIO_PHONE.replace(/\D/g, "").replace(/^0/, "")}`;

export const STUDIO_TEL_HREF = `tel:+${phoneDigits}`;
export const STUDIO_WHATSAPP_HREF = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(
  "Hi SP Media Co., I'd like to chat about a shoot.",
)}`;
