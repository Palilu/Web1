"use strict";
document.addEventListener("DOMContentLoaded", function(event) {
    // Creamos el carrito con su contenido inicial.
    let cart = [
        {
            name: "Manto Blanco",
            amount: 1,
            price: 75,
            type: "common" 
        },
        {
            name: "Manto Premium",
            amount: 1,
            price: 90,
            type: "premium"
        },
        {
            name: "Manto Almendras",
            amount: 1,
            price: 90,
            type: "premium"
        },
    ];
    // Actualizamos la vista.
    showCart();
    // Obtenemos el select de típo de producto.
    var productType = document.querySelector("#productType");
    // Lo llenamos con las opciones de los productos disponibles.
    for (let index = 0; index < products.length; index++) {
        const product = products[index];
        productType.innerHTML += `<option value="${index}">${product.name}</option>`;    
    }

    /*
        Elegir un producto actualiza los precios mostrados en los botones para cada presentación (1, 3, 6 o 12).
    */
    productType.addEventListener("change", function(){
        var index = productType.value;
        var product = products[index];
        let prices = pricesByProductType[product.type];
        document.querySelector("#price1").innerHTML = prices.price1;
        document.querySelector("#price3").innerHTML = prices.price1*3;
        document.querySelector("#price6").innerHTML = prices.price6;
        document.querySelector("#price12").innerHTML = prices.price12;
    })

    /*
        Clickear el boton #reset vacia el carrito de compras.
    */
    document.querySelector("#reset").addEventListener("click", function() {
        // Vaciamos el modelo
        cart = [];
        // Actualizamos la vista
        showCart();
    })

    /*
        Clickear el boton #price1Btn agrega un item al carrito de compras.
    */
    document.querySelector("#price1Btn").addEventListener("click", function() {
        addItem(1, "price1");
    })

    /*
        Clickear el boton #price3Btn agrega tres items al carrito de compras.
    */
    document.querySelector("#price3Btn").addEventListener("click", function() {
        addItem(1, "price1");
        addItem(1, "price1");
        addItem(1, "price1");
    })

    /*
        Clickear el boton #price6Btn agrega una caja de 6 al carrito de compras.
    */
    document.querySelector("#price6Btn").addEventListener("click", function() {
        addItem(6, "price6");
    })

    /*
        Clickear el boton #price12Btn agrega una caja de 12 al carrito de compras.
    */
    document.querySelector("#price12Btn").addEventListener("click", function() {
        addItem(12, "price12");
    })

    /*
        Clickear cualquiera de los radio buttons hace que se muestre y sea requerida
        o no la dirección. 
    */
    document.querySelectorAll("#entregaDomicilio, #retiroTienda").forEach(radio => {
        radio.addEventListener("change", function() {
            // Obtenemos el nodo del div que contiene la dirección.
            let addressDivNode = this.parentNode.nextElementSibling;
            // Obtenemos el nodo del input de la dirección.
            let addressInputNode = addressDivNode.lastElementChild;
            // Alternamos la clase hidden en el div, si la clase hidden fue agregada retorna true
            // Si la clase hidden fue borrada retorna falso.
            let isHidden = addressDivNode.classList.toggle("hidden");
            // El input de dirección es visible cuando no está oculto.
            let isVisible = !isHidden;
            // La dirección es requerida cuando es visible.
            addressInputNode.required = isVisible;
        })    
    })
    
    /*
        Agrega al carrito de compras un item de la cantidad y precio pasadas como parámetros.
     */
    function addItem(amount, price) {
        // Obtenemos el índice del select.
        let index = productType.value;
        // Con el índice obtenemos el producto.
        let product = products[index];
        // Buscamos el precio del producto.
        let prices = pricesByProductType[product.type];
        // Creamos el nuevo item.
        let item = {
            name: product.name,
            amount: amount,
            price: prices[price],
            type: product.type
        }
        // Agregamos el item al carrito.
        cart.push(item);    
        // Actualizamos la vista.
        showCart();
    }

    /*
        Actualiza la tabla del carrito de compras con el valor actual del modelo.
        Actualiza el total en el pie de la tabla.
        Actualiza el ícono de oferta cuando existe una disponible.
     */
    function showCart() {
        let cartView = document.querySelector("#cart");
        cartView.innerHTML = "";
        // Mostramos todo el HTML
        for (let index = 0; index < cart.length; index++) {
            const item = cart[index];
            cartView.innerHTML +=
                `<tr>
                    <td>${item.name}</td>
                    <td>${item.amount}</td>
                    <td>$${item.price}</td>
                    <td>
                        <i id="item${index}" class="fa fa-times" aria-hidden="true"></i> 
                    </td>
                </tr>`;
        }
        // Agregamos eventos en cada X
        for (let index = 0; index < cart.length; index++) {
            document.querySelector("#item" + index).addEventListener("click", function() {
                deleteItem(index);
            });
        }
        // Aplicamos ofertas.
        applyOffers();
    }

    /*
        Elimina un item del carrito de compras.
     */
    function deleteItem(index) {
        cart.splice(index, 1);
        showCart();
    }

    /*
        Evalua si hay una oferta disponible.
     */
    function applyOffers() {
        // Creamos un objeto llamado cuentas por tipo de producto.
        let countsByProductType = {}
        // Vamos calculando el precio sin ofertas.
        let regularPrice = 0;
        // Para cada item en el carro
        for (const item of cart) {
            // Si no llevamos la cuenta de este tipo de producto.
            if (countsByProductType[item.type] == undefined) {
                // Lo agregamos a cuentas con el valor de este item 
                countsByProductType[item.type] = item.amount;
            } else {
                // Si ya llevamos la cuenta de este item, sumamos su cantidad
                countsByProductType[item.type] += item.amount;
            }
            regularPrice += item.price;   
        }
        // Ahora tentemos cuantos items de cada producto hay en el carrito
        let offerPrice = 0;
        for (const key in countsByProductType) {
            const count = countsByProductType[key];
            offerPrice += getTypeSubTotal(key, count);
        }
        let giftNode = document.querySelector(".fa.fa-gift");
        let totalNode = document.querySelector("#total");
        if (regularPrice !=  offerPrice) {
            giftNode.classList.add("visible");
            totalNode.innerHTML = `<p class="oldPrice">$${regularPrice}</p><p>$${offerPrice}</p>`;
        } else {
            giftNode.classList.remove("visible");
            totalNode.innerHTML = regularPrice;
        }
    }
    
    function getTypeSubTotal(type, amount) {
        let mod12 = Math.floor(amount / 12);
        let rest12 = amount % 12;
        let mod6 = Math.floor(rest12 / 6);
        let rest6 = rest12 % 6;
        let prices = pricesByProductType[type];
        return prices.price12 * mod12 + prices.price6 * mod6 + prices.price1 * rest6;
    }
});
