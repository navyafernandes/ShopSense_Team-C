import api from "./api";

export const getRecommendations = async () => {
    const response = await api.get("/customers/recommendations");
    return response.data;
};

