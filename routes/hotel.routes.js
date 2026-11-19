import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { upload } from "../utils/uploader.js";
import * as authController from "../controllers/auth.controller.js";
import * as blogController from "../controllers/blog.controller.js";
import * as hotelContactController from "../controllers/hotelContact.controller.js";
import * as faqController from "../controllers/faq.controller.js";
import * as galleryController from "../controllers/gallery.controller.js";
import * as roomController from "../controllers/room.controller.js";

const router = Router();

// Authentication
router.post("/login", asyncHandler(authController.login));
router.get("/admin/me", requireAdmin, asyncHandler(authController.getCurrentAdmin));

// Gallery
router.post("/addGalleryImage", requireAdmin, upload.single("image"), asyncHandler(galleryController.addGalleryImage));
router.post("/getGalleryList", requireAdmin, asyncHandler(galleryController.getGalleryList));
router.get("/getGalleryDetails/:id", requireAdmin, asyncHandler(galleryController.getGalleryDetails));
router.post("/updateGalleryImage/:id", requireAdmin, upload.single("image"), asyncHandler(galleryController.updateGalleryImage));
router.delete("/deleteGalleryImage/:id", requireAdmin, asyncHandler(galleryController.deleteGalleryImage));

// Blog posts
router.post("/createEditPost", requireAdmin, upload.array("images", 10), asyncHandler(blogController.createEditPost));
router.post("/getPostList", requireAdmin, asyncHandler(blogController.getPostList));
router.post("/getPostDetail", requireAdmin, asyncHandler(blogController.getPostDetail));
router.delete("/deletePost/:id", requireAdmin, asyncHandler(blogController.deletePost));
router.get("/public/posts", asyncHandler(blogController.getPublicPosts));
router.get("/public/posts/:id", asyncHandler(blogController.getPublicPostByIdentifier));

// Hotel FAQs
router.get("/faqs", requireAdmin, asyncHandler(faqController.getFaqList));
router.get("/faqs/:id", requireAdmin, asyncHandler(faqController.getFaqById));
router.post("/faqs", requireAdmin, asyncHandler(faqController.createFaq));
router.put("/faqs/:id", requireAdmin, asyncHandler(faqController.updateFaq));
router.delete("/faqs/:id", requireAdmin, asyncHandler(faqController.deleteFaq));
router.get("/public/faqs", asyncHandler(faqController.getPublicFaqs));

// Hotel contact details
router.get("/contact-details", requireAdmin, asyncHandler(hotelContactController.getHotelContactDetails));
router.put("/contact-details", requireAdmin, asyncHandler(hotelContactController.updateHotelContactDetails));
router.get("/public/contact-details", asyncHandler(hotelContactController.getHotelContactDetails));

// Room inventory
router.get("/rooms", requireAdmin, asyncHandler(roomController.getRooms));
router.get("/rooms/:id", requireAdmin, asyncHandler(roomController.getRoomById));
router.post("/rooms", requireAdmin, upload.array("imageFiles", 10), asyncHandler(roomController.createRoom));
router.put("/rooms/:id", requireAdmin, upload.array("imageFiles", 10), asyncHandler(roomController.updateRoom));
router.delete("/rooms/:id", requireAdmin, asyncHandler(roomController.deleteRoom));
router.get("/public/rooms", asyncHandler(roomController.getPublicRooms));

// Public hotel gallery
router.get("/public/gallery", asyncHandler(galleryController.getPublicGallery));

export default router;
