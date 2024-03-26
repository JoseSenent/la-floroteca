// Importamos los productos que serán despelgados en la página web
import dataProducts from "./data.js";
import { typeProduct } from "./data";

/* DECLARACIÓN DE VARIABLES */
// Selecciona el menú hamburguesa
const $bgMenu = document.getElementById("bg-menu") as HTMLDivElement;

// Selecciona el icono del menú hamburguesa
const $bgMenuIcon = document.getElementById("bg-menu-icon") as HTMLSpanElement;

// Selecciona la ventana del menú de navegación
const $navMenu = document.getElementById("nav-menu") as HTMLDivElement;

// Selecciona los iconos del carrito de la compra, tanto de móvil como desktop
const $cartBtn = document.querySelectorAll(
  ".js-cart-btn"
) as NodeListOf<HTMLButtonElement>;

// Selecciona la ventana del menú del carrito de la compra
const $cartMenu = document.getElementById("cart-menu") as HTMLDivElement;

// Selecciona los botones que cierran la ventana del menú del carrito de la compra
const $closeCartBtn = document.querySelectorAll(
  ".js-close-cart-btn"
) as NodeListOf<HTMLButtonElement>;

// Selecciona el «main» de la página web
const $main = document.getElementById("main") as HTMLDivElement;

// Selecciona la parte del menú del carrito de la compra donde se mostrarán los productos
const $renderCartMenu = document.getElementById(
  "render-cart-menu"
) as HTMLDivElement;

// Selecciona los lugares en donde se mostrará el número de productos adquiridos
const $purchaseCount = document.querySelectorAll(
  ".js-purchase-count"
) as NodeListOf<HTMLSpanElement>;

// Array que contiene los productos añadidos al carrito de la compra
const cart: typeProduct[] = [];

/* EVENT LISTENERS */
// Abre y cierra el menú hamburguesa al hacer clic en el icono
$bgMenu.addEventListener("click", () => {
  $bgMenuIcon.classList.toggle("is-open");
  $navMenu.classList.toggle("is-open");
});

// Abre el menú del carrito al hacer clic en el propio icono
$cartBtn.forEach((cartBtnEl) =>
  cartBtnEl.addEventListener("click", () => {
    $cartMenu.classList.add("is-open");
    $main.classList.add("is-open");

    $bgMenuIcon.classList.remove("is-open");
    $navMenu.classList.remove("is-open");
  })
);

// Cierra el menú de carrito al hacer clic en la «X» o en el botón de «Seguir comprando»
$closeCartBtn.forEach((closeCartBtnEl) =>
  closeCartBtnEl.addEventListener("click", () => {
    $cartMenu.classList.remove("is-open");
    $main.classList.remove("is-open");
  })
);

// Crea un arreglo con los productos pertenecientes a la categoría establecida en los parámetros de la función
function getCategoryProducts(products: typeProduct[], category: string): void {
  const featuredProducts: typeProduct[] = [];

  products.forEach((productItem) => {
    if (productItem.category === category) featuredProducts.push(productItem);
  });

  createProductCard(featuredProducts, category);
}

// función para crear cada una de las cartas de productos
function createProductCard(product: typeProduct[], category: string) {
  // Declara una variable que renderizará el conjunto de cartas en función de la categoría
  const $renderProducts = document.getElementById(
    `render-${category}`
  ) as HTMLDivElement;

  // Crea el «div» que contendrá todas las cartas de una categoría
  const productContainer = document.createElement("div");
  productContainer.classList.add("card-container");
  let html = "";

  // Se hace un bucle del array que se ha pasado como parámetro de la función
  for (let i = 0; i < product.length; i++) {
    html += `
    <article class="card ${
      product[i].category === "bouquets" ? "card--3-col" : ""
    }">
    <div class="card__header">
    <a href="#" class="card__image-container">
    <img src="${product[i].image}" alt="${
      product[i].name
    }" class="card__image" loading="lazy" />
    </a>

    ${
      // Si el producto tiene descuento (es mayor que 0) se crea una etiqueta que indique que está de oferta
      product[i].discount
        ? `<div class="tag-sale u-disable-select">¡Oferta!</div>`
        : ""
    }

    ${
      // Si el producto es nuevo (indicado en las propiedades) se crea una etiqueta que lo indique
      product[i].is_new
        ? `<div class="tag-new u-disable-select">¡Novedad!</div>`
        : ""
    }
    <button data-product-index="${
      // Aquí guardamos los datos de la id del producto, que nos servirá para tener su información una vez le demos clic y queramos llevar este producto al menú del carrito de la compra
      product[i].id
    }" class="js-add-to-cart add-to-cart-btn">Añadir al carrito</button>
    </div>

    <div class="card__body">
    <h3 class="heading-3 u-margin-top-xs"><a href="#" class="card__heading">${
      product[i].name
    }</a></h3>
    <h4 class="heading-4 u-margin-top-xs">
    ${
      // Si el producto tiene descuento, el precio original se muestra tachado
      product[i].discount
        ? `<span class="card__original-price">${product[i].price.toFixed(
            2
          )}€</span>`
        : ""
    }

    ${
      // Si el producto tiene descuento se realiza la operación y se muestra el precio final de color magenta
      product[i].discount
        ? `<span class="card__actual-price">${(
            product[i].price -
            (product[i].price * product[i].discount) / 100
          ).toFixed(2)}€</span>`
        : ""
    }

    ${
      // Si el producto carece de descuento, se muestra el precio del producto de manera ordinaria
      product[i].discount === 0
        ? `<span class="card__price">${product[i].price.toFixed(2)}€</span>`
        : ""
    }
    </h4>
    </div>
    </article>
    `;

    // Añadimos todo el código de html al «div» que creamos más arriba
    productContainer.innerHTML = html;

    // Adjuntamos todo el contenido en la variable que renderizará todas las cartas
    $renderProducts.appendChild(productContainer);
  }
}

// Inicializamos la renderización en cada una de las tres categorías
getCategoryProducts(dataProducts, "bouquets");
getCategoryProducts(dataProducts, "centerpieces");
getCategoryProducts(dataProducts, "flowerbaskests");

// Seleccionamos todos los botones de «añadir al carrito». Se crea aquí, posterior a la función que renderiza dichos botones
const $addToCartBtn = document.querySelectorAll(
  ".js-add-to-cart"
) as NodeListOf<HTMLButtonElement>;

function createCartMenu() {
  let html = "";

  // Si el carrito de la compra está vacío, se renderizará este código html
  if (!cart.length) {
    $renderCartMenu.classList.remove("is-added");
    html = `
    <div class="cart-menu__body__img-container">
    <img
      src="images/cart-menu/jarron-trazado.png"
      alt="jarrón de girasoles"
      class="cart-menu__body__img"
    />
  </div>
  <span class="cart-menu__body__text u-bold u-margin-top-s">
    ¡Tu carrito está vacío!
  </span>
  <span class="cart-menu__body__text">
    Llénalo con flores de verdad.
  </span>

  <button class="js-close-cart-btn btn u-margin-top-l">
    Seguir comprando
  </button>
</div>
    `;
    $renderCartMenu.innerHTML = html;
  } else {
    // Se declara la variable que tendrá el total a pagar
    let total = 0;

    // Se realiza un bucle en la array de la carta para calcular el precio de los productos contenidos
    for (let i = 0; i < cart.length; i++) {
      // Si el producto tiene descuento, debe descontarse del precio del producto
      if (cart[i].discount) {
        total += +(
          (cart[i].price - (cart[i].price * cart[i].discount) / 100) *
          cart[i].quantity
        ).toFixed(2);
      } else {
        // Si el producto carece de descuento, se aplica el precio ordinario
        total += +(cart[i].price * cart[i].quantity).toFixed(2);
      }

      // ! Se aplica el «.toFixed(2)» para que siempre se muestran dos decimales al resultado final
    }

    // Se aplica un segundo bucle al array de «cart», esta vez para crear el código html que se verá en el menú

    for (let i = 0; i < cart.length; i++) {
      html += `
<div class="cart-menu__product__container">
  <div class="cart-menu__product__header">
    <div class="cart-menu__product__img-container">
    <img 
    src=${cart[i].image} 
    alt=${cart[i].name} 
    class="cart-menu__product__image" 
    />
    </div>
    <span class="cart-menu__product__quantity">${cart[i].quantity}</span>
  </div>

  <div class="cart-menu__product__body">
    <h3 class="heading-3">${cart[i].name}</h3>
    <h4 class="heading-4">${
      cart[i].discount
        ? (
            (cart[i].price - (cart[i].price * cart[i].discount) / 100) *
            cart[i].quantity
          ).toFixed(2)
        : (cart[i].price * cart[i].quantity).toFixed(2)
    }€</h4>
  </div>

  <button data-cart-index="${
    // Guardamos el índice del producto en la array de «cart». Esto nos servirá para que al utilizar este botón podamos borrar el producto especificado de la array y por tanto del menú del carrito de la compra
    cart.indexOf(cart[i])
  }" class="js-delete-cart-product delete-btn">
      <i class="fa-solid fa-trash-can delete-btn__icon"></i>
  </button>
</div>
      `;
    }

    html += `
    <div class="cart-menu__product__footer">
    <h3 class="heading-3--sans">Total: <span class="total-cost">${total.toFixed(
      2
    )}</span>€</h3>
    <button class="btn u-margin-top-s">
      <a href="#" class="btn__link">Realizar pedido »</a>
    </button>
    </div>
    `;
  }
  $renderCartMenu.innerHTML = html;

  // Guardamos todos los botones en un array, ya que así podemos modificarlo. Declaramos la variable aquí, después de que los botones hayan sido renderizados y éstos deben ir actualizándose en función de los cambios en el menú del carrito de la compra.

  const deleteProductBtn = [
    ...document.querySelectorAll(".js-delete-cart-product"),
  ];

  deleteProductPurchased(deleteProductBtn);
}

// Hacemos un bucle a todos los botones de «añadir al carrito» para añadir el evento de llevar dicho producto al menú del carrito de la compra
for (let i = 0; i < $addToCartBtn.length; i++) {
  $addToCartBtn[i].addEventListener("click", (e) => {
    const element = e.target as HTMLButtonElement;
    // Declaramos una variable que guarda la id del producto
    const productIndex = element.getAttribute("data-product-index");

    // Para saber el lugar del arreglo donde está el producto, restamos 1 a la id, ya que los arreglos comienzan en el índice en 0
    const productPurchased = dataProducts[Number(productIndex) - 1];

    // Verificamos si el arreglo «cart» tiene ese producto ya incluido
    if (!cart.includes(productPurchased)) {
      // Si no tiene el producto, lo añadimos al arreglo de «cart»
      cart.push(productPurchased);
      // Creamos una propiedad «quantity» que establece el número de un mismo producto que hemos adquirido
      productPurchased.quantity = 1;
    } else {
      // Si el producto ya estaba en el arreglo «cart», entonces sólo añadimos 1 a la propiedad «quantity»
      productPurchased.quantity += 1;
    }

    $renderCartMenu.classList.add("is-added");

    $cartMenu.classList.add("is-open");
    $main.classList.add("is-open");

    $bgMenuIcon.classList.remove("is-open");
    $navMenu.classList.remove("is-open");

    updatePurchaseCount();

    createCartMenu();
  });
}

// Esta función añade un evento a todos los botones que eliminarán los productos adquiridos del menú de carrito de la compra
function deleteProductPurchased(array: Element[]) {
  for (let i = 0; i < array.length; i++) {
    const buttonItem = array[i] as HTMLButtonElement;
    buttonItem.addEventListener("click", (e) => {
      // Declaramos la variable con la que guardamos el índice del producto al que pertenece cada botón
      const element = e.target as HTMLButtonElement;
      let cartIndex = Number(
        element.parentElement!.getAttribute("data-cart-index")
      );

      // Al hacer click, eliminamos del arreglo «cart» dicho producto
      cart.splice(cartIndex, 1);

      // Eliminamos también el propio botón del arreglo que contiene todos los botones de eliminar
      array.splice(i, 1);

      updatePurchaseCount();
      createCartMenu();
    });
  }
}

// Esta función actualiza el número de productos adquiridos cada vez que se añade o se elimina un producto del menú de carrito de la compra
function updatePurchaseCount() {
  for (let i = 0; i < $purchaseCount.length; i++) {
    $purchaseCount[i].innerText = cart.length.toString();
  }
}
