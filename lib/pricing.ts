export const PLATFORM_MARKUP = 0.20;
export const ANNUAL_ORGANISATION_PRICE = 50000;
export function priceBreakdown(baseRupees:number){
 if(!Number.isFinite(baseRupees)||baseRupees<0)throw new Error('Invalid session price');
 const therapistPaise=Math.round(baseRupees*100);
 const platformPaise=Math.round(therapistPaise*PLATFORM_MARKUP);
 return {therapistFee:therapistPaise/100,platformFee:platformPaise/100,total:(therapistPaise+platformPaise)/100,amountPaise:therapistPaise+platformPaise};
}
export const money=(value:number)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(value);
