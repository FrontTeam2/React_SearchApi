import { Axios } from ".";

export const SearchApi = {
  getSearch(search) {
    return Axios.get("/search", {
      params: { key: search },
    });
  },
};
