import { Op } from "sequelize";
import { models } from "../models/index.js";
import { getPagination, paginationMeta, sendError, sendSuccess, toPlain } from "../utils/httpResponse.js";

export async function getFaqList(req, res) {
  const { page, limit, offset } = getPagination(req.query);
  const searchText = String(req.query.search || "").trim();
  const where = searchText ? {
    [Op.or]: [
      { question: { [Op.like]: `%${searchText}%` } },
      { answer: { [Op.like]: `%${searchText}%` } },
    ],
  } : {};
  const result = await models.Faq.findAndCountAll({
    where,
    order: [["sort_order", "ASC"], ["created_at", "DESC"]],
    limit,
    offset,
  });
  return sendSuccess(res, result.rows.map(toPlain), "FAQs loaded", 200, {
    pagination: paginationMeta(page, limit, result.count),
  });
}

export async function getFaqById(req, res) {
  const faq = await models.Faq.findByPk(req.params.id);
  return faq ? sendSuccess(res, toPlain(faq)) : sendError(res, "FAQ not found", 404);
}

export async function createFaq(req, res) {
  const question = String(req.body.question || "").trim();
  const answer = String(req.body.answer || "").trim();
  if (!question || !answer) return sendError(res, "Question and answer are required");
  const faq = await models.Faq.create({
    question,
    answer,
    sort_order: Number(req.body.sort_order) || 0,
    is_published: req.body.is_published !== false && req.body.is_published !== "false",
  });
  return sendSuccess(res, toPlain(faq), "FAQ created", 201);
}

export async function updateFaq(req, res) {
  const faq = await models.Faq.findByPk(req.params.id);
  if (!faq) return sendError(res, "FAQ not found", 404);
  const values = {};
  if (req.body.question !== undefined) values.question = String(req.body.question).trim();
  if (req.body.answer !== undefined) values.answer = String(req.body.answer).trim();
  if (req.body.sort_order !== undefined) values.sort_order = Number(req.body.sort_order) || 0;
  if (req.body.is_published !== undefined) values.is_published = req.body.is_published === true || req.body.is_published === "true";
  if (!values.question && !values.answer && !("sort_order" in values) && !("is_published" in values)) {
    return sendError(res, "No FAQ fields provided");
  }
  await faq.update(values);
  return sendSuccess(res, toPlain(faq), "FAQ updated");
}

export async function deleteFaq(req, res) {
  const deleted = await models.Faq.destroy({ where: { id: req.params.id } });
  return deleted ? sendSuccess(res, null, "FAQ deleted") : sendError(res, "FAQ not found", 404);
}

export async function getPublicFaqs(_req, res) {
  const faqs = await models.Faq.findAll({
    where: { is_published: true },
    order: [["sort_order", "ASC"], ["created_at", "DESC"]],
  });
  return sendSuccess(res, faqs.map(toPlain));
}
