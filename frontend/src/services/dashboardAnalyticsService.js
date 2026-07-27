import api from "./api";

export const getVendorDashboardAnalytics = async () => {
    const response = await api.get("/vendor/dashboard/analytics");
    return response.data;
};