/**
 * Created by chaika on 09.02.16.
 */
exports.mainPage = function(req, res) {
    res.render('mainPage', {
        pageTitle: 'KMA Pizza',
        ShowOrderButton:false
    });
};

exports.orderPage = function(req, res) {
    //TODO: implement
    res.render('orderPage', {
        pageTitle: 'Order',
        ShowOrderButton:true
    });
};