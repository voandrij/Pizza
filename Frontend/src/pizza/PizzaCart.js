/**
 * Created by chaika on 02.02.16.
 */

var Templates = require('../Templates');
var Storage=require('../Storage');


//Sizes
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

var Cart = [];
var total=0;
var ordered = 0;

//HTML element where pizzas situated
var $cart = $(".all-orders");

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок
    //Приклад реалізації, можна робити будь-яким іншим способом
    var add_new=true;
    for( var a=0;a<Cart.length;a++){

        if((pizza===Cart[a].pizza)&&(size===Cart[a].size)) {
            Cart[a].quantity += 1;
            add_new=false;
            console.log("add_new=false;");
        }
    }
    if(add_new===true){
        console.log("add_new===true", Cart);
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
        });
    }

    //Оновити вміст кошика на сторінці
    total += pizza[size].price;
    ordered++;
    console.log("Refresh");
    $(".sum-number").text(total+" грн.");
    updateCart();
}


//Після видалення оновити відображення
function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    var html_code = Templates.PizzaCart_OneItem(cart_item);

    var $node = $(html_code);
    $node.find(".count-clear").click(function(){
        $node.remove();
    });
    Cart.splice(Cart.indexOf(cart_item), 1);
    
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    var saved_pizza=Storage.get('cart');
    if(saved_pizza){
        Cart=saved_pizza;
    }

    var saved_sum=Storage.get('resSum');
    if(saved_sum){
        $(".sum-number").text(saved_sum+" грн.");
        total=parseInt($(".sum-number").text());
    }

    updateCart();
}

function getPizzaInCart() {
    return Cart;
}


$('.clear-order').click(function() {
    Cart.forEach(removeFromCart);
    total = 0;
    $(".sum-number").text(total+" грн.");
});

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    //Очищаємо старі піци в кошику
    $cart.html("");

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);
        var pricing=parseInt($node.find(".price").text());
        var counter=parseInt($node.find(".quantity").text());

        $node.find(".plusBtn").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity ++;
            total += pricing;
            $(".sum-number").text(total+" грн.");
            ordered ++;
            //Оновлюємо відображення
            updateCart();
        });


        if(cart_item.quantity != 0){
            $node.find(".minusBtn").click(function(){
                //Збільшуємо кількість замовлених піц
                cart_item.quantity -= 1;
                ordered--;
                total -= pricing;
                $(".sum-number").text(total+" грн.");

                //Оновлюємо відображення
                updateCart();
            });
        }
        else {
            total -= pricing*counter;
            $(".sum-number").text(total+" грн.");
            ordered -= counter;
            removeFromCart(cart_item);
            updateCart();
        }

        $cart.append($node);

        $node.find(".count-clear").click(function () {
            removeFromCart(cart_item);
            total -= pricing*counter;
            $(".sum-number").text(total+" грн.");
            ordered -= counter;
            updateCart();
        });

    }

    Cart.forEach(showOnePizzaInCart);
    Storage.set("resSum",total);
    Storage.set("cart",Cart);
    console.log("cart: ", Cart);
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;



