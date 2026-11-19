export const sendSuccess = (res, data, message = "Success", status = 200, extra = {}) =>
  res.status(status).json({ status: true, message, data, ...extra });

export const sendError = (res, message, status = 400) =>
  res.status(status).json({ status: false, message });

export const getPagination = (input = {}) => {
  const page = Math.max(1, Number.parseInt(input.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(input.limit, 10) || 10));
  return { page, limit, offset: (page - 1) * limit };
};

export const paginationMeta = (page, limit, total) => ({
  page,
  limit,
  total,
  total_pages: Math.ceil(total / limit),
});

export const toPlain = (record) => record?.get({ plain: true });
