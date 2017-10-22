jQuery(document).ready(function($){
    var cartWrapper = $('.cd-cart-container');
	var cartBody = cartWrapper.find('.body');
	        var cartList = cartBody.find('ul').eq(0);
        var cartList1 = cartBody.find('ul');
        
        var cartTotal = cartWrapper.find('.checkout').find('span');
        var cartTrigger = cartWrapper.children('.cd-cart-trigger');
        var cartCount = cartTrigger.children('.count');
        var addToCartBtn = $('.cd-add-to-cart');
        var undo = cartWrapper.find('.undo');
        var undoTimeoutId;
        var refCartButton=$('.tour-cart-button');
	
	
	
	
	
	
    var refMansory=$('.references-masonry');
    if(localStorage.getItem("pagex")===null||localStorage.getItem("pagex")==="empty"){
		localStorage.setItem("pagex","empty");
	}else{
		getPreviousCart();
	}
	//product id - you don't need a counter in your real project but you can use your real product id
    var productId = 0;
    console.log("hellooooo123");
   function getPreviousCart(){
	    var cartListFirst = cartBody.find('ul');
        $(cartListFirst).html("");
	    var cartHistory=localStorage.getItem("pagex");
	    $(cartListFirst).html(cartHistory);
	   
	   updateCartCount(false,$(cartListFirst).children().length);
	   cartWrapper.removeClass('empty');
   }

    if( cartWrapper.length > 0 ) {
        //store jQuery object

        //add product to cart
        addToCartBtn.on('click', function(event){
            console.log("hellooooo111111");
            event.preventDefault();
            addToCart($(this));
        });

                refCartButton.on('click', function(event){
            console.log("new buttonsdgfhgsa");
            event.preventDefault();
            addToCart($(this));
        });
        //open/close cart
        cartTrigger.on('click', function(event){
            event.preventDefault();
            toggleCart();
        });

        //close cart when clicking on the .cd-cart-container::before (bg layer)
        cartWrapper.on('click', function(event){
            if( $(event.target).is($(this)) ) toggleCart(true);
        });

        //delete an item from the cart
        cartList.on('click', '.delete-item', function(event){
            event.preventDefault();
            removeProduct($(event.target).parents('.product'));
        });

        //update item quantity
        cartList.on('change', 'select', function(event){
            quickUpdateCart();
        });

        //reinsert item deleted from the cart
        undo.on('click', 'a', function(event){
            clearInterval(undoTimeoutId);
            event.preventDefault();
            cartList.find('.deleted').addClass('undo-deleted').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
                $(this).off('webkitAnimationEnd oanimationend msAnimationEnd animationend').removeClass('deleted undo-deleted').removeAttr('style');
                quickUpdateCart();
            });
            undo.removeClass('visible');
        });
    }

    function toggleCart(bool) {
        var cartIsOpen = ( typeof bool === 'undefined' ) ? cartWrapper.hasClass('cart-open') : bool;
        
        if( cartIsOpen ) {
            cartWrapper.removeClass('cart-open');
            //reset undo
            clearInterval(undoTimeoutId);
            undo.removeClass('visible');
            cartList.find('.deleted').remove();

            setTimeout(function(){
                cartBody.scrollTop(0);
                //check if cart empty to hide it
                if( Number(cartCount.find('li').eq(0).text()) == 0) cartWrapper.addClass('empty');
            }, 500);
        } else {
            cartWrapper.addClass('cart-open');
        }
    }

    function addToCart(trigger) {
        var cartIsEmpty = cartWrapper.hasClass('empty');
        //update cart product list
        addProduct();
        //update number of items 
        updateCartCount(cartIsEmpty);
        //update total price
        updateCartTotal(trigger.data('price'), true);
        //show cart
        cartWrapper.removeClass('empty');
    }

    function addProduct() {
        //this is just a product placeholder
        //you should insert an item with the selected product info
        //replace productId, productName, price and url with your real product info
        productId = productId + 1;
        var name=$("#detail-title").html();
        //r name=$("#detail-title").innerHTML(); 

        var img_location="Image "+"img/Locations/"+name+"/"+name+".jpg";
    
        var productAdd='<li class="product"><div class="product-image"><a href="#0"><img src="img/Locations/'+name+'/'+name+'.jpg" alt="placeholder"></a></div><div class="product-details"><div>'+name+'</div><div class="actions"><a href="#0" class="delete-item">Delete</a><div class="quantity"></div></div></div></li>';
        cartList.prepend($(productAdd));
        localStorage.clear();
        localStorage.setItem("pagex",cartList1.html());
		
    }

    function removeProduct(product) {
        //clearInterval(undoTimeoutId);
        cartList.find('.deleted').remove();
        
        var topPosition = product.offset().top - cartBody.children('ul').offset().top ,
            productQuantity = Number(product.find('.quantity').find('select').val()),
            productTotPrice = Number(product.find('.price').text().replace('$', '')) * productQuantity;
        
        product.css('top', topPosition+'px').addClass('deleted');

        //update items count + total price
        updateCartTotal(productTotPrice, false);
        updateCartCount(true, -1);
        undo.addClass('visible');
        //wait 8sec before completely remove the item
        /*undoTimeoutId = setTimeout(function(){
            undo.removeClass('visible');
            cartList.find('.deleted').remove();
        },100);*/
        cartList.find('.deleted').remove();
        refreshCart();
    }
    
    function refreshCart(){
        localStorage.clear();
        localStorage.setItem("pagex",cartList1.html());
    }

    function quickUpdateCart() {
        var quantity = 0;
        var price = 0;
        
        cartList.children('li:not(.deleted)').each(function(){
            var singleQuantity = Number($(this).find('select').val());
            quantity = quantity + singleQuantity;
            price = price + singleQuantity*Number($(this).find('.price').text().replace('$', ''));
        });

        cartTotal.text(price.toFixed(2));
        cartCount.find('li').eq(0).text(quantity);
        cartCount.find('li').eq(1).text(quantity+1);
    }

    function updateCartCount(emptyCart, quantity) {
        if( typeof quantity === 'undefined' ) {
            var actual = Number(cartCount.find('li').eq(0).text()) + 1;
            var next = actual + 1;
            
            if( emptyCart ) {
                cartCount.find('li').eq(0).text(actual);
                cartCount.find('li').eq(1).text(next);
            } else {
                cartCount.addClass('update-count');

                setTimeout(function() {
                    cartCount.find('li').eq(0).text(actual);
                }, 150);

                setTimeout(function() {
                    cartCount.removeClass('update-count');
                }, 200);

                setTimeout(function() {
                    cartCount.find('li').eq(1).text(next);
                }, 230);
            }
        } else {
            var actual = Number(cartCount.find('li').eq(0).text()) + quantity;
            var next = actual + 1;
            
            cartCount.find('li').eq(0).text(actual);
            cartCount.find('li').eq(1).text(next);
        }
    }

    function updateCartTotal(price, bool) {
        bool ? cartTotal.text( (Number(cartTotal.text()) + Number(price)).toFixed(2) )  : cartTotal.text( (Number(cartTotal.text()) - Number(price)).toFixed(2) );
    }
	
	
	
		$(document).on("scroll",function(e){
		
		//$(".navbar").css('opacity',($(document).scrollTop()/500));
		var alphavalue=$(document).scrollTop()/500;
		$(".navbar").css('background-color','rgba(255,255,255,'+alphavalue+')');
	});
});
