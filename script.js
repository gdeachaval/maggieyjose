/*************************
 * MODAL
 *************************/
const modal = document.getElementById("bankModal");
const motivoText = document.getElementById("motivo-text");
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

function openModal(motivo) {
  motivoText.textContent = motivo ? `Motivo sugerido: ${motivo}` : '';
  modal.style.display = 'flex';
  switchTab(currentCurrency);
}

function closeModal() {
  modal.style.display = "none";
}

function switchTab(currency) {
  tabButtons.forEach(btn =>
    btn.classList.toggle("active", btn.dataset.tab === currency)
  );
  tabContents.forEach(tab =>
    tab.classList.toggle("active", tab.id === `tab-${currency}`)
  );
}

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

window.onclick = function (event) {
  if (event.target === modal) closeModal();
};

function copyCBU(spanId) {
  const cbuText = document.getElementById(spanId).textContent.replace("CBU: ", "");
  navigator.clipboard.writeText(cbuText).then(() => {
    const status = document.getElementById("copy-status");
    status.textContent = "¡CBU copiado ✅!";
    setTimeout(() => status.textContent = "", 2000);
  });
}


/*************************
 * STATE
 *************************/
let currentCurrency = 'ars';
let currentSort = 'default';

const giftList = document.querySelector(".gift-list");
const sortSelect = document.getElementById("sort");
const currencyButtons = document.querySelectorAll('.currency-btn');

/* cache maestro */
const allGiftItems = Array.from(document.querySelectorAll('.gift-item'));


/*************************
 * SORTING LOGIC
 *************************/
function applySort(items) {
  if (currentSort === "asc") {
    return items.sort((a, b) => a.dataset.price - b.dataset.price);
  }
  if (currentSort === "desc") {
    return items.sort((a, b) => b.dataset.price - a.dataset.price);
  }
  return items;
}


/*************************
 * RENDER
 *************************/
function renderGifts(animate = false) {
  giftList.innerHTML = "";

  let visibleItems = allGiftItems;
    // .filter(i => i.dataset.currency === currentCurrency);

  visibleItems = applySort(visibleItems);

  if (animate) {
    visibleItems.forEach(item => item.classList.add("fade-out"));
  }

  setTimeout(() => {
    giftList.innerHTML = "";

    visibleItems.forEach(item => {
      item.style.display = 'block';
      giftList.appendChild(item);
    });

    if (animate) {
      visibleItems.forEach(item => {
        item.classList.remove("fade-out");
        item.classList.add("fade-in");
      });

      setTimeout(() => {
        visibleItems.forEach(i => i.classList.remove("fade-in"));
      }, 300);
    }
  }, animate ? 300 : 0);
}


/*************************
 * CURRENCY SWITCH
 *************************/
function filterByCurrency(currency) {
  currentCurrency = currency;
  renderGifts(true);
}

currencyButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currencyButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterByCurrency(btn.dataset.currency);
  });
});


/*************************
 * SORT SELECT
 *************************/
sortSelect.addEventListener("change", function () {
  currentSort = this.value;
  renderGifts(true);
});


/*************************
 * INITIAL LOAD
 *************************/
sortSelect.value = currentSort;
filterByCurrency(currentCurrency);
