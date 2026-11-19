import defineAdmin from "./Admin.js";
import defineGalleryImage from "./GalleryImage.js";
import defineBlogPost from "./BlogPost.js";
import defineRoom from "./Room.js";
import defineFaq from "./Faq.js";
import defineHotelContact from "./HotelContact.js";

export let models;

export function registerModels(sequelize) {
  models = {
    Admin: defineAdmin(sequelize),
    GalleryImage: defineGalleryImage(sequelize),
    BlogPost: defineBlogPost(sequelize),
    Room: defineRoom(sequelize),
    Faq: defineFaq(sequelize),
    HotelContact: defineHotelContact(sequelize),
  };
  return models;
}
