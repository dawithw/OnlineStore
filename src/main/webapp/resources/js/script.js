var id;
/*
* event handler after Add to cart btn click
*
* */
function editQuantity(input_id) {
    var item = {id:input_id.split("-")[1],
                quantity:$('#'+input_id).val()};
    alert(item.quantity);
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        'type': 'POST',
        'url':'/products/updateCart',
        'data': JSON.stringify(item),
        'dataType': 'json'

    }).done(updateCart).fail(fail);
    
}
function updateCart(data) {
    var id = data.id;
    var price = data.price;
    var quantity = data.quantity;
    $('#subtotal-'+id).text(price*quantity);
}
function addToCart(clicked_id) {
    id =clicked_id;
    var siblings = $('#'+id).siblings().not('img');
    var orderline = {
        id:id,
        product:{
            id:id,
            name:siblings[0].innerText,
            desciption: siblings[1].innerText,
            quantity:siblings[2].innerText,
            price:siblings[3].innerText
        },
        quantity:siblings[4].value
    }

    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        'type': 'POST',
        'url':'/products/addtocart',
        'data': JSON.stringify(orderline),
        'dataType': 'json'

    }).done(saveToCart).fail(fail);


}
// event handler after remove btn click
function removeItemFromCart(clicked_id) {
    id = clicked_id;
    console.log("siblings")
    for(var i=0;i<$('#'+id).siblings(); i++){
        console.log($('#'+id).siblings()[i]);
    }
    var q = $('#'+id).parent().siblings()[3].innerText;
    id = clicked_id.split("-")[1];
    var removeItem ={id:id,quantity:q,totalPrice:0};
    console.log("quantity="+q);
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        'type': 'POST',
        'url':'/products/removeItem',
        'data': JSON.stringify(removeItem),
        'dataType': 'json'

    }).done(removed).fail(fail);



}
// removes item from cart
function removed(data) {
    var td = $('#item-'+data.id).parent();
    console.log("removed s");
    console.log(td.siblings()[2].innerText);

    var price = td.siblings()[2].innerText.split("$")[1].trim();
    var quantity = td.siblings()[3].innerText;
    var tr = td.parent();
    tr.remove();
    //calculateTotal(-(parseFloat(price) * parseInt(quantity)));
    $('#total-price').text("Total: $" + (parseFloat(data.totalPrice)));
}
//save item details to cart
function saveToCart(data) {
    console.log(parseInt(data.price));
    console.log(parseInt(data.quantity));

    var td1 =  $('<td>').append($('<button>').addClass("btn btn-danger")
        .attr("id","item-"+data.product.id)
        .attr("onclick","removeItemFromCart(this.id)")
        .text("Remove"));
    var td2 =  $('<td>').text(data.product.id);
    var td3 =  $('<td>').text(data.product.name);
    var td4 =  $('<td>').text("$" + data.product.price);
    var td5 =  $('<td>').text(data.quantity);
    var td6 =  $('<td>').addClass("subtotal").text("$" + parseFloat(data.product.price) * parseInt(data.quantity));
    var tr = $('<tr>').append(td1).append(td2).append(td3).append(td4).append(td5).append(td6);
    $('#order-table').append(tr);
    calculateTotal(parseFloat(data.product.price) * parseInt(data.quantity));
}

//calculate total price
function calculateTotal(data) {
    console.log("data: "+data);
     console.log($('#total-price').text());
     var subtotal = $('#total-price').text().split("$")[1].trim();
     console.log("subtotal:" + subtotal);
    $('#total-price').text("Total: $" + (parseFloat(subtotal) + (data)));
}
function fail(data) {
     alert("fail");
    console.log(data);
}
$(function () {

    'use strict';
    //display add product form
    $('#btn_add').click(displayPage);
    //add product to store
    $('#btn_add_product').click(sendProductDetails);
    //load login page
    $('#login').click(loadLoginPage);

    
    function sendProductDetails() {
        var productName = $('#product-name').val();
        var productDescription = $('#product-description').val();
        var productQuantity = $('#product-quantity').val();
        var productPrice = $('#product-price').val();

        //var product = {name:productName, price:productPrice};
        var product = new Product(productName,productDescription,productQuantity,productPrice);
        $.post('products',{product: JSON.stringify(product)}, addProduct, "json");
}
// adds a product to page
    function addProduct(data) {
        console.log("add called");

        var prodiv = $("<div>").addClass("products");
        var img = $("<img>")
            .attr("src","resources/images/mobile.png")
            .attr("alt","iPhone")
            .addClass("img-responsive"); // continue woriking

        var prod_name = $("<h4>").text(data.name).addClass("text-info");
        var prod_info = $("<h4>").text("Description: "+data.description);
        var prod_quantity = $("<h4>").text("Quantity: "+data.quantity);
        var prod_price = $("<h4>").text("Price: "+data.price);
        var quantity = $("<input>")
            .attr("type","text")
            .attr("name","quantity")
            .attr("value","1")
            .addClass("form-control");
        var addtocart = $("<button>")
            .addClass("btn btn-info")
            .attr("id",data.id)
            .attr("onclick", "addToCart(this.id)")
            .text("Add To Cart ");
        prodiv.append(img).append(prod_name)
            .append(prod_info).append(prod_quantity)
            .append(prod_price).append(quantity)
            .append().append(addtocart);
        $("#container").prepend($("<div>")
            .addClass("col-sm-4 col-md-3 products")
            .append(prodiv));
        $('#add-prouduct').addClass("hide");
    }

    // display add product form
    function displayPage() {
        $('#add-prouduct').removeClass("hide");
    }

    /*
    * Constructor function
    * */
    function Product(name,description,quantity,price) {
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.price = price;
    }

    function processData(data) {
        alert(data.id);
    }

    function loadLoginPage(){
        window.location.href = "login.jsp";
    }

});

