import { Op } from "sequelize";
import { models } from "../models/index.js";
import { getPublicMediaUrl, parseArray } from "../utils/media.js";
import { getPagination, paginationMeta, sendError, sendSuccess, toPlain } from "../utils/httpResponse.js";

export async function createEditPost(req, res) {
  const body = req.body;
  const id = Number(body.post_id || body.id) || null;
  const existing = id ? await models.BlogPost.findByPk(id) : null;
  if (id && !existing) return sendError(res, "Blog post not found", 404);

  const uploadedImages = (req.files || []).map((file) => getPublicMediaUrl(req, file.filename));
  const values = {
    post_headline: String(body.post_headline || "").trim(),
    post_text: String(body.post_text || "").trim(),
    post_type: String(body.post_type || "public"),
    address: String(body.address || ""),
    images: [...(existing ? parseArray(existing.images) : []), ...uploadedImages],
  };
  if (!values.post_headline || !values.post_text) {
    return sendError(res, "Post headline and text are required");
  }

  if (existing) {
    await existing.update(values);
    return sendSuccess(res, toPlain(existing), "Blog post updated");
  }
  const post = await models.BlogPost.create(values);
  return sendSuccess(res, toPlain(post), "Blog post created", 201);
}

export async function getPostList(req, res) {
  const { page, limit, offset } = getPagination(req.body);
  const search = `%${String(req.body.search || "").trim()}%`;
  const result = await models.BlogPost.findAndCountAll({
    where: { [Op.or]: [
      { post_headline: { [Op.like]: search } },
      { post_text: { [Op.like]: search } },
      { address: { [Op.like]: search } },
    ] },
    order: [["created_at", "DESC"]], limit, offset,
  });
  return sendSuccess(res, result.rows.map(toPlain), "Blog posts loaded", 200, {
    pagination: paginationMeta(page, limit, result.count),
  });
}

export async function getPostDetail(req, res) {
  const post = await models.BlogPost.findByPk(req.body.post_id || req.body.id);
  return post ? sendSuccess(res, toPlain(post)) : sendError(res, "Blog post not found", 404);
}

export async function deletePost(req, res) {
  const deleted = await models.BlogPost.destroy({ where: { id: req.params.id } });
  return deleted ? sendSuccess(res, null, "Blog post deleted") : sendError(res, "Blog post not found", 404);
}

export async function getPublicPosts(req, res) {
  const { page, limit, offset } = getPagination(req.query);
  const result = await models.BlogPost.findAndCountAll({
    where: { post_type: "public" }, order: [["created_at", "DESC"]], limit, offset,
  });
  return sendSuccess(res, result.rows.map(toPlain), "Blog posts loaded", 200, {
    pagination: paginationMeta(page, limit, result.count),
  });
}

export async function getPublicPostByIdentifier(req, res) {
  const identifier = String(req.params.id || "");
  let post = /^\d+$/.test(identifier)
    ? await models.BlogPost.findOne({ where: { id: identifier, post_type: "public" } })
    : null;

  if (!post) {
    const publicPosts = await models.BlogPost.findAll({
      where: { post_type: "public" },
      order: [["created_at", "DESC"]],
    });
    post = publicPosts.find((item) => slugifyPostTitle(item.post_headline) === identifier) || null;
  }
  return post ? sendSuccess(res, toPlain(post)) : sendError(res, "Blog post not found", 404);
}

function slugifyPostTitle(title) {
  return String(title || "story")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
