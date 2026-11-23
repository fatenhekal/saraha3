export const validation = (schema) => {
    return (req, res, next) => {
        const lang = req.headers["accept-language"] || 1;
        let { success, error, data } = schema(lang).safeParse({
            params: req.params,
            body: req.body,
            query: req.query,
            headers: req.headers
        });
        if (!success) {
            throw error;
        }

        req.validate = data;
        next();
    };
};
