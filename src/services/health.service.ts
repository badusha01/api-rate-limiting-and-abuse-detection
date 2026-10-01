export const getHealthStatus = () => {
    return {
        status: "ok",
        service: "abuse-detection-platform",
        timeStamp: new Date().toISOString()
    };
};