module.exports = fun => {
    return (req, res, next) => {
        fun(req, res, next).catch(e => next(e));
    }
}