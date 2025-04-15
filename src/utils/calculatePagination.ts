const calculatePagination = (filters: Record<string, any>) => {
  const page = filters?.page ? +filters.page : 1;
  const limit = filters?.limit ? +filters.limit : 10;
  const skip = (page - 1) * limit;
  const sortBy = filters?.sortBy || "createdAt";
  const sortOrder = filters?.sortOrder || "desc";

  return { page, limit, skip, sortBy, sortOrder };
};

export default calculatePagination;
