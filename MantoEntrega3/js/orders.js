"use strict";
function initOrders() {

    const BASE_URL = "https://60cbd3ec21337e0017e45771.mockapi.io/orders";
    const RETIRO_EN_TIENDA = "Retiro en tienda";
    const INVALID_CAPTCHA = "Captcha inválido";
    const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    const CAPTCHA_LENGTH = 5;

    // Creamos el carrito con su contenido inicial.
    let cart = [];

    let captcha = getRandomString();
    document.querySelector("#captcha-txt").innerHTML = captcha;
    
    let form = document.querySelector("#form");
    form.addEventListener("submit", validate);
    
    getOrders(false);

    /*
        Borra una orden cuyo ID es pasado cómo parámetro.
     */
    async function deleteOrder(id) {
        console.log(`Deleteing order #${id}`)
        try {
            const response = await fetch(`${BASE_URL}/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                console.log(`Order #${id} deleted.`)
                let json = await response.json();
                console.log(json);
                getOrders(false);
            } else {
                console.log("Status de respuesta inválido");    
            }
        } catch(e) {
            console.log(e);
        }    
    }

    /*
        Edita una orden cuyo ID es pasado cómo parámetro.
     */
    async function editOrder(id) {
        console.log(`Editing order #${id}`)
        try {
            const response = await fetch(`${BASE_URL}/${id}`, { 
                method: 'GET'
            });
            if (response.ok) {
                console.log(`Order #${id} loaded.`)
                let json = await response.json();
                
                console.log(json);
                fillForm(json);
            } else {
                console.log("Status de respuesta inválido");
            }
        } catch(e) {
            console.log(e);
        }    
    }


    /**
     * Borra el formulario de pedidos.
     */
     function deleteForm() {
        document.querySelector("#topHeader").innerHTML = "Hacer un pedido nuevo";
        document.querySelector("#id").value = "";
        document.querySelector("#fname").value = "";
        document.querySelector("#lname").value = "";
        document.querySelector("#email").value = "";
        document.querySelector("#phone").value = "";
        document.querySelector("#retiroTienda").checked = true;    
        document.querySelector("#address").value = "";
        cart = [];
        
        showCart();

        document.querySelector("#fname").focus();
    }

    /**
     * Llena el formulario de pedidos con los datos de un pedido existente pasado como parámetro.
     */
    function fillForm(order) {
        document.querySelector("#topHeader").innerHTML = `Editando el pedido #${order.id}`;
        document.querySelector("#id").value = order.id;
        document.querySelector("#fname").value = order.fname;
        document.querySelector("#lname").value = order.lname;
        document.querySelector("#email").value = order.email;
        document.querySelector("#phone").value = order.phone;
        if (order.type == RETIRO_EN_TIENDA) {
            document.querySelector("#retiroTienda").checked = true;    
        } else {
            document.querySelector("#entregaDomicilio").checked = true;    
        }
        document.querySelector("#address").value = order.address;

        cart = order.cart;
        
        showCart();

        document.querySelector("#fname").focus();
    }

    /**
     * Valida el captcha, si no es válido muestra un mensaje en el formulario.
     * Si es válido hace submit al formulario. 
     */
     function validate(e) {
        console.log(`Validating order.`);
        e.preventDefault();
        let formData = new FormData(this);
        if (captcha != formData.get("captcha")) {
            document.querySelector("#captcha-msg").innerHTML = INVALID_CAPTCHA;
            document.querySelector("#captcha-inp").focus();
            return;
        }
        //document.querySelector("#form").submit();
        let formJson = Object.fromEntries(formData.entries());
        formJson.cart = cart;
        postOrder(formJson);
    }

    /**
     * Retorna un String aleatorio.
     */
    function getRandomString() {
        let randomString = '';
        for (let i = 0; i < CAPTCHA_LENGTH; i++) {
            let randomNumber = Math.floor(Math.random() * CHARS.length);
            randomString += CHARS.substring(randomNumber, randomNumber + 1);
        }
        return randomString;
    }

    /**
     * Postea una nueva orden o edita una orden si hubiera sido seleccionada.
     */
    async function postOrder(formData) {
        console.log(`Posting order.`);
        console.log(JSON.stringify(formData));
        let method = formData.id == '' ? 'POST' : 'PUT';
        let url = formData.id == '' ? BASE_URL : `${BASE_URL}/${formData.id}`
        try {
            const response = await fetch(url, { 
                method: method,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                let json = await response.json();
                deleteForm();
                getOrders(true);
            } else {
                console.log("Status de respuesta inválido");
            }
        } catch(e) {
            console.log(e);
        }    
    }

    /**
     * Busca los pedidos y los muestra en la tabla de pedidos.
     */
    async function getOrders(scroll) {
        console.log(`Loading orders for scroll=${scroll}.`);
        fetchOrders(null, null, null, null, scroll);
    }

    /**
     * Clickear Buscar pedidos, los busca y muestra el resultado en la table de pedidos.
     */
    document.querySelector("#search").addEventListener("click", async function () {
        let searchBy = document.querySelector("#searchBy").value;
        let searchValue = document.querySelector("#searchValue").value;
        console.log(`Searching orders searchBy=${searchBy}, searchValue=${searchValue}.`);
        fetchOrders(searchBy, searchValue, null, null, false);
    });

    /**
     * Clickear Buscar pedidos, los busca y muestra el resultado en la table de pedidos.
     */
    document.querySelector("#paginate").addEventListener("click", async function () {
        let page = document.querySelector("#pageNumber").value;
        let limit = document.querySelector("#pageLimit").value;
        if (limit !== "ALL") {
            console.log(`Paginating orders page=${page}, limit=${limit}.`);
            fetchOrders(null, null, page, limit, false);
        } else {
            console.log(`Loading all orders.`);
            fetchOrders(null, null, null, null, false);
        }
        
    });

    /**
     * Returno la url para hacer un get
     */
    async function fetchOrders(searchBy, searchValue, page, limit, scroll) {
        console.log(`Fetching orders searchBy=${searchBy},searchValue=${searchValue},page=${page},limit=${limit},scroll=${scroll}.`);
        try {
            let ordersView = document.querySelector("#orders");
            ordersView.innerHTML = `<tr>
                                        <td colspan="4">Loading orders...</td>
                                    </tr>`;
            const response = await fetch(getUrl(searchBy, searchValue, page, limit));
            if (response.ok) {
                let orders = await response.json();
                showOrders(orders);
                if (scroll) {
                    document.querySelector("#anchor").scrollIntoView();
                }
            } else {
                console.log("Status de respuesta inválido");
            }
        } catch(e) {
            console.log(e);
        }    
    }

    /**
     * Returno la url para hacer un get
     */
    function getUrl(searchBy, searchValue, page, limit) {
        let url = BASE_URL;
        if (searchBy && searchValue || page && limit) {
            url += `?`;
            if (searchBy && searchValue) {
                url += `${searchBy}=${searchValue}&`
            }
            if (page && limit) {
                url+=`page=${page}&limit=${limit}`;
            }
        }
        return url;
    }

    /**
     * Muestra los pedidos.
     */
    function showOrders(orders) {
        let ordersView = document.querySelector("#orders");
        ordersView.innerHTML = "";
        for (let index = 0; index < orders.length; index++) {
            const order = orders[index];
            let html = `
                <tr>
                    <td>${order.id}</td>
                    <td>
                        <p>${order.fname} ${order.lname}</p>
                        <p>${order.type}</p>
                        <p>Dirección: ${order.address}</p>
                        <p>Teléfono: ${order.phone}</p>
                    </td>
                    <td>`;
            for (const item of order.cart) {
                html += 
                        `<p>${item.amount} ${item.name} $${item.price}</p>`;  
            }
            html += `
                    </td>
                    <td>
                        <p><i id="deleteOrder${order.id}" class="fa fa-times" aria-hidden="true"></i></p> 
                        <p><i id="editOrder${order.id}" class="fa fa-edit" aria-hidden="true"></i></p> 
                    </td>
                </tr>`;
            ordersView.innerHTML += html;   
        }

        // Agregamos eventos en cada X
        for (let index = 0; index < orders.length; index++) {
            let id = orders[index].id;
            document.querySelector("#deleteOrder" + id).addEventListener("click", function() {
                deleteOrder(id);
            });
            document.querySelector("#editOrder" + id).addEventListener("click", function() {
                editOrder(id);
            });
        }
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

    // Actualizamos la vista.
    showCart();
    // Obtenemos el select de típo de producto.
    let productType = document.querySelector("#productType");
    // Lo llenamos con las opciones de los productos disponibles.
    for (let index = 0; index < products.length; index++) {
        const product = products[index];
        productType.innerHTML += `<option value="${index}">${product.name}</option>`;    
    }

    /*
        Elegir un producto actualiza los precios mostrados en los botones para cada presentación (1, 3, 6 o 12).
    */
    productType.addEventListener("change", function(){
        let index = productType.value;
        let product = products[index];
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

}