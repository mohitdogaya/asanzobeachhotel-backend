import { models } from "../models/index.js";

const starterFaqs = [
  {
    question: "Where is ASANZO Beach Hotel located in Pattaya?",
    answer: "ASANZO Beach Hotel is located at 279/121 Soi Somprasong, Pattaya, Bang Lamung, Chon Buri Province, Thailand, near Jomtien Beach. Open the Contact page for directions and the latest contact details.",
    sort_order: 1,
    is_published: true,
  },
  {
    question: "What room types can I book at ASANZO Beach Hotel?",
    answer: "The hotel offers Standard, Deluxe, and Family room options. Room features and availability can vary, so please contact the hotel with your travel dates to confirm the best option for your stay in Pattaya.",
    sort_order: 2,
    is_published: true,
  },
  {
    question: "How can I check room rates and make a reservation?",
    answer: "For current rates and availability, contact the ASANZO Beach Hotel team directly at +66-889804406 or info@asanzobeachhotel.com. Share your preferred dates and room type so the team can help plan your stay near Jomtien Beach.",
    sort_order: 3,
    is_published: true,
  },
];

const starterPosts = [
  {
    post_headline: "Choosing the Right Hotel Room in Pattaya: Standard, Deluxe or Family",
    post_text: "Planning a stay in Pattaya starts with finding a room that suits the way you travel. ASANZO Beach Hotel offers Standard, Deluxe, and Family room options, giving couples, solo guests, and families a choice of comfortable accommodation near Jomtien Beach.\n\nA Standard Room is a relaxed base for a simple, comfortable stay. A Deluxe Room offers a welcoming setting with thoughtful details for unwinding after a day out. Travelling together? The Family Room provides a shared space designed for a family stay.\n\nRoom availability and rates depend on your dates. Before you book, contact the hotel directly with your travel dates and preferred room type. The team can confirm current availability and help you choose the right Pattaya hotel room for your visit.",
    post_type: "public",
    address: "Pattaya, Thailand",
    images: [],
  },
  {
    post_headline: "Planning a Relaxed Stay Near Jomtien Beach in Pattaya",
    post_text: "Jomtien Beach is part of what draws visitors to Pattaya: a coastal setting for slowing down, exploring the area, and enjoying time away. When planning a beach stay, choosing accommodation that feels comfortable and getting the details confirmed ahead of arrival can make the trip easier.\n\nASANZO Beach Hotel is in Pattaya near Jomtien Beach and offers Standard, Deluxe, and Family rooms. Think about who is travelling, the room type you prefer, and the dates you have in mind. Then contact the hotel team to ask about current rates, availability, and directions.\n\nFor a smooth visit, keep your reservation details handy and check your travel plans before you set out. Whether you are planning a short break or a longer Pattaya getaway, the ASANZO team can help with information about your stay.",
    post_type: "public",
    address: "Jomtien Beach, Pattaya, Thailand",
    images: [],
  },
  {
    post_headline: "A Simple Guide to Booking Your Pattaya Beach Hotel Stay",
    post_text: "Booking a hotel in Pattaya is easier when you know what to confirm before you travel. Start with your arrival and departure dates, the number of guests, and the room style that fits your plans. If you are comparing Standard, Deluxe, or Family accommodation, ask the hotel which options are available for your dates.\n\nASANZO Beach Hotel welcomes guests in Pattaya near Jomtien Beach. Contact the team directly to confirm current room rates and availability, ask any questions about your stay, and request directions to the hotel. Keeping these details together helps you plan your journey and arrive with confidence.\n\nFor booking enquiries, call +66-889804406 or email info@asanzobeachhotel.com. The hotel team can provide the latest information for your visit to Pattaya, Thailand.",
    post_type: "public",
    address: "Pattaya, Thailand",
    images: [],
  },
];

export async function seedHotelContent() {
  if (await models.Faq.count() === 0) {
    await models.Faq.bulkCreate(starterFaqs);
    console.log("Starter hotel FAQs created");
  }
  if (await models.BlogPost.count() === 0) {
    await models.BlogPost.bulkCreate(starterPosts);
    console.log("Starter hotel blog posts created");
  }
}
