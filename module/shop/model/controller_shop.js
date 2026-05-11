function escapeShopHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function appBasePathShop() {
    var path = window.location.pathname || "/";
    var indexPath = path.indexOf("/index.php");
    if (indexPath !== -1) {
        return path.slice(0, indexPath + 1);
    }
    var lastSlash = path.lastIndexOf("/");
    if (lastSlash === -1) {
        return "/";
    }
    return path.slice(0, lastSlash + 1);
}

function normalizeShopImageUrl(url) {
    var value = String(url || "").trim();
    if (value === "") {
        return "";
    }
    if (/^(https?:)?\/\//i.test(value) || value.indexOf("data:") === 0) {
        return value;
    }
    if (value.charAt(0) === "/") {
        return value;
    }
    return appBasePathShop() + value.replace(/^\.?\//, "");
}

function cacheBustedShopUrl(url) {
    return `${url}${url.indexOf("?") === -1 ? "?" : "&"}_ts=${Date.now()}`;
}

function formatShopDate(value) {
    if (!value) {
        return "";
    }
    var parsed = new Date(String(value).replace(" ", "T"));
    if (Number.isNaN(parsed.getTime())) {
        return "";
    }
    return parsed.toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function parseShopDateTimestamp(value) {
    if (!value) {
        return 0;
    }
    var parsed = new Date(String(value).replace(" ", "T"));
    return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

function normalizeShopTextForSort(value) {
    return String(value || "").trim().toLocaleLowerCase("es");
}

function getStoredShopOrderBy() {
    var value = String(localStorage.getItem(SHOP_ORDER_STORAGE_KEY) || "").trim();
    if (value === "") {
        return SHOP_DEFAULT_ORDER;
    }
    return value;
}

function setStoredShopOrderBy(value) {
    var normalized = String(value || "").trim();
    if (normalized === "") {
        localStorage.removeItem(SHOP_ORDER_STORAGE_KEY);
        shopCurrentOrderBy = SHOP_DEFAULT_ORDER;
        return;
    }
    shopCurrentOrderBy = normalized;
    localStorage.setItem(SHOP_ORDER_STORAGE_KEY, normalized);
}

function sortShopEventsByCurrentOrder(events) {
    var rows = Array.isArray(events) ? events.slice() : [];
    var orderBy = String(shopCurrentOrderBy || SHOP_DEFAULT_ORDER);

    rows.sort(function(a, b) {
        if (orderBy === "price_asc" || orderBy === "price_desc") {
            var diffPrice = Number(a.ticket_price || 0) - Number(b.ticket_price || 0);
            if (diffPrice !== 0) {
                return orderBy === "price_asc" ? diffPrice : -diffPrice;
            }
        } else if (orderBy === "name_asc" || orderBy === "name_desc") {
            var diffName = normalizeShopTextForSort(a.event_name).localeCompare(normalizeShopTextForSort(b.event_name), "es");
            if (diffName !== 0) {
                return orderBy === "name_asc" ? diffName : -diffName;
            }
        } else if (orderBy === "city_asc" || orderBy === "city_desc") {
            var diffCity = normalizeShopTextForSort(a.city_name).localeCompare(normalizeShopTextForSort(b.city_name), "es");
            if (diffCity !== 0) {
                return orderBy === "city_asc" ? diffCity : -diffCity;
            }
        } else {
            var diffDate = parseShopDateTimestamp(a.event_date) - parseShopDateTimestamp(b.event_date);
            if (diffDate !== 0) {
                return diffDate;
            }
        }

        var fallbackDate = parseShopDateTimestamp(a.event_date) - parseShopDateTimestamp(b.event_date);
        if (fallbackDate !== 0) {
            return fallbackDate;
        }
        return Number(a.id_event || 0) - Number(b.id_event || 0);
    });

    return rows;
}

var SHOP_PRICE_MIN = 1;
var SHOP_PRICE_MAX = 20000;
var SHOP_ITEMS_PER_PAGE = 6;
var SHOP_DEFAULT_EVENT_IMAGE = "https://cdn.pixabay.com/photo/2016/11/19/20/17/catwalk-1840941_1280.jpg";
var shopAutoApplyTimeout = null;
var SHOP_MAP_DEFAULT = { lat: 40.416705, lon: -3.7035825 };
var shopListLeafletMap = null;
var shopDetailLeafletMap = null;
var shopLeafletAssetsPromise = null;
var shopMapPopupCarousels = {};
var shopDetailImageUrlsForMap = [];
var shopCurrentPage = 1;
var shopFilteredEventsCache = [];
var SHOP_ORDER_STORAGE_KEY = "shop_order_by"; 
var SHOP_DEFAULT_ORDER = "date_asc";
var shopCurrentOrderBy = SHOP_DEFAULT_ORDER;
var SHOP_RELATED_PAGE_SIZE = 3; 
var shopRelatedEventsCache = [];
var shopRelatedVisibleCount = 0;
var shopCurrentDetailEventData = null;

function ensureLeafletAssetsShop() {
    if (window.L) {
        return Promise.resolve();
    }
    if (shopLeafletAssetsPromise) {
        return shopLeafletAssetsPromise;
    }

    shopLeafletAssetsPromise = new Promise(function(resolve, reject) {
        if (!document.querySelector('link[data-shop-leaflet-css="1"]')) {
            var css = document.createElement("link");
            css.setAttribute("data-shop-leaflet-css", "1");
            css.rel = "stylesheet";
            css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
            document.head.appendChild(css);
        }

        var script = document.querySelector('script[data-shop-leaflet-js="1"]');
        if (script) {
            if (window.L) {
                resolve();
                return;
            }
            script.addEventListener("load", function() { resolve(); });
            script.addEventListener("error", function() { reject(); });
            return;
        }

        script = document.createElement("script");
        script.setAttribute("data-shop-leaflet-js", "1");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = function() { resolve(); };
        script.onerror = function() { reject(); };
        document.body.appendChild(script);
    });

    return shopLeafletAssetsPromise;
}

function getShopEventCoordinates(item) {
    var latRaw = item ? item.lat : null;
    var lonRaw = item ? item.lon : null;
    var lat = Number(latRaw);
    var lon = Number(lonRaw);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        return null;
    }
    return { lat: lat, lon: lon };
}

function getShopMapImages(item) {
    var images = [];
    function pushImage(url) {
        var normalized = normalizeShopImageUrl(url);
        if (normalized !== "" && images.indexOf(normalized) === -1) {
            images.push(normalized);
        }
    }

    if (item && Array.isArray(item.img_event)) {
        for (var i = 0; i < item.img_event.length; i++) {
            pushImage(item.img_event[i]);
        }
    }

    if (item && item.card_image) {
        pushImage(item.card_image);
    }

    if (images.length === 0) {
        pushImage(SHOP_DEFAULT_EVENT_IMAGE);
    }
    return images;
}

function getShopPopupCarouselKey(eventId) {
    var raw = String(eventId || "");
    if (raw === "") {
        raw = String(Date.now());
    }
    return raw.replace(/[^a-zA-Z0-9_-]/g, "");
}

function updateShopPopupCarouselUi(key) {
    var state = shopMapPopupCarousels[key];
    if (!state || !state.images.length) {
        return;
    }
    var imageElement = document.getElementById("shop-map-popup-image-" + key);
    var counterElement = document.getElementById("shop-map-popup-counter-" + key);
    if (imageElement) {
        imageElement.src = state.images[state.index];
    }
    if (counterElement) {
        counterElement.textContent = (state.index + 1) + "/" + state.images.length;
    }
}

window.shopMapPopupPrev = function(key) {
    var state = shopMapPopupCarousels[key];
    if (!state || state.images.length < 2) {
        return;
    }
    state.index = (state.index - 1 + state.images.length) % state.images.length;
    updateShopPopupCarouselUi(key);
};

window.shopMapPopupNext = function(key) {
    var state = shopMapPopupCarousels[key];
    if (!state || state.images.length < 2) {
        return;
    }
    state.index = (state.index + 1) % state.images.length;
    updateShopPopupCarouselUi(key);
};

function buildShopMapPopupHtml(eventData, key) {
    var state = shopMapPopupCarousels[key] || { images: getShopMapImages(eventData), index: 0 };
    var imageUrl = state.images[state.index] || "";
    var controls = "";

    if (state.images.length > 1) {
        controls = `
            <div class='mt-2 flex items-center justify-center gap-2 text-xs'>
                <button class='px-2 py-1 rounded border border-slate-300 bg-white' type='button' onclick="shopMapPopupPrev('${escapeShopHtml(key)}')">‹</button>
                <span id='shop-map-popup-counter-${escapeShopHtml(key)}'>${state.index + 1}/${state.images.length}</span>
                <button class='px-2 py-1 rounded border border-slate-300 bg-white' type='button' onclick="shopMapPopupNext('${escapeShopHtml(key)}')">›</button>
            </div>
        `;
    }

    return `
        <div class='text-center min-w-[220px]'>
            <h4 class='text-sm font-black text-slate-900 mb-1'>${escapeShopHtml(eventData.event_name || eventData.type_name || "Evento")}</h4>
            <p class='text-xs text-slate-700 mb-1'>${escapeShopHtml(eventData.city_name || "")} · ${escapeShopHtml(eventData.venue_name || "")}</p>
            <p class='text-xs font-bold text-primary mb-2'>${escapeShopHtml(formatShopPrice(eventData.ticket_price || SHOP_PRICE_MIN))}</p>
            <img id='shop-map-popup-image-${escapeShopHtml(key)}' src='${escapeShopHtml(imageUrl)}' class='w-[220px] h-[130px] object-cover rounded-lg border border-slate-200 mx-auto' alt='imagen evento'>
            ${controls}
            <button class='shop-map-popup-detail mt-3 bg-primary text-background-dark px-3 py-1 rounded-md text-xs font-black' data-id='${escapeShopHtml(eventData.id_event || "")}' type='button'>Ver detalle</button>
        </div>
    `;
}

function mapBox_all(eventsData) {
    var mapContainer = document.getElementById("shop-map-list");
    if (!mapContainer) {
        return;
    }

    ensureLeafletAssetsShop().then(function() {
        if (shopListLeafletMap) {
            shopListLeafletMap.remove();
            shopListLeafletMap = null;
        }

        shopListLeafletMap = L.map("shop-map-list").setView([SHOP_MAP_DEFAULT.lat, SHOP_MAP_DEFAULT.lon], 6);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "© OpenStreetMap contributors"
        }).addTo(shopListLeafletMap);

        var hasUserLocation = false;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                hasUserLocation = true;
                var currentLat = Number(position.coords.latitude);
                var currentLon = Number(position.coords.longitude);
                if (Number.isFinite(currentLat) && Number.isFinite(currentLon)) {
                    shopListLeafletMap.setView([currentLat, currentLon], 7);
                    L.circleMarker([currentLat, currentLon], {
                        radius: 7,
                        color: "#1d4ed8",
                        fillColor: "#3b82f6",
                        fillOpacity: 0.8
                    }).addTo(shopListLeafletMap).bindPopup("Tu ubicación actual");
                }
            }, function() {
                if (!hasUserLocation) {
                    shopListLeafletMap.setView([SHOP_MAP_DEFAULT.lat, SHOP_MAP_DEFAULT.lon], 6);
                }
            }, {
                enableHighAccuracy: true,
                timeout: 6000,
                maximumAge: 60000
            });
        }

        var list = Array.isArray(eventsData) ? eventsData : [];
        for (var i = 0; i < list.length; i++) {
            var eventData = list[i];
            var coords = getShopEventCoordinates(eventData);
            if (!coords) {
                continue;
            }

            var marker = L.marker([coords.lat, coords.lon]).addTo(shopListLeafletMap);
            var key = getShopPopupCarouselKey(eventData.id_event || i);
            shopMapPopupCarousels[key] = {
                images: getShopMapImages(eventData),
                index: 0
            };
            marker.bindPopup(buildShopMapPopupHtml(eventData, key));
        }
    }).catch(function() {});
}

function mapBox(eventData) {
    var mapContainer = document.getElementById("shop-map-detail");
    if (!mapContainer) {
        return;
    }

    var coords = getShopEventCoordinates(eventData);
    if (!coords) {
        $("#shop-detail-map-panel").addClass("hidden");
        return;
    }
    $("#shop-detail-map-panel").removeClass("hidden");

    ensureLeafletAssetsShop().then(function() {
        if (shopDetailLeafletMap) {
            shopDetailLeafletMap.remove();
            shopDetailLeafletMap = null;
        }

        shopDetailLeafletMap = L.map("shop-map-detail").setView([coords.lat, coords.lon], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "© OpenStreetMap contributors"
        }).addTo(shopDetailLeafletMap);

        var detailMapEvent = $.extend({}, eventData, {
            img_event: Array.isArray(shopDetailImageUrlsForMap) ? shopDetailImageUrlsForMap : []
        });
        var key = getShopPopupCarouselKey("detail-" + String(eventData.id_event || ""));
        shopMapPopupCarousels[key] = {
            images: getShopMapImages(detailMapEvent),
            index: 0
        };

        var popupHtml = buildShopMapPopupHtml(detailMapEvent, key);
        L.marker([coords.lat, coords.lon]).addTo(shopDetailLeafletMap).bindPopup(popupHtml).openPopup();

        setTimeout(function() {
            if (shopDetailLeafletMap) {
                shopDetailLeafletMap.invalidateSize();
            }
        }, 160);
        setTimeout(function() {
            if (shopDetailLeafletMap) {
                shopDetailLeafletMap.invalidateSize();
            }
        }, 520);
    }).catch(function() {});
}

function scheduleAutoApplyFilters() {
    if (shopAutoApplyTimeout) {
        clearTimeout(shopAutoApplyTimeout);
    }
    shopAutoApplyTimeout = setTimeout(function() {
        applyFiltersFromUi();
    }, 180);
}

function parseShopPrice(value, fallback) {
    var parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        return fallback;
    }
    parsed = Math.round(parsed);
    if (parsed < SHOP_PRICE_MIN) {
        return SHOP_PRICE_MIN;
    }
    if (parsed > SHOP_PRICE_MAX) {
        return SHOP_PRICE_MAX;
    }
    return parsed;
}

function formatShopPrice(value) {
    var price = parseShopPrice(value, SHOP_PRICE_MIN);
    return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0
    }).format(price);
}

function updatePriceFilterUi(changedHandle) {
    var minInput = $(".filtro_precio_min");
    var maxInput = $(".filtro_precio_max");
    if (!minInput.length || !maxInput.length) {
        return;
    }

    var minValue = parseShopPrice(minInput.val(), SHOP_PRICE_MIN);
    var maxValue = parseShopPrice(maxInput.val(), SHOP_PRICE_MAX);

    if (minValue > maxValue) {
        if (changedHandle === "max") {
            minValue = maxValue;
        } else {
            maxValue = minValue;
        }
    }

    minInput.val(minValue);
    maxInput.val(maxValue);

    var totalRange = SHOP_PRICE_MAX - SHOP_PRICE_MIN;
    var leftPercent = ((minValue - SHOP_PRICE_MIN) / totalRange) * 100;
    var rightPercent = 100 - ((maxValue - SHOP_PRICE_MIN) / totalRange) * 100;

    $(".shop-price-track-active").css({
        left: `${leftPercent}%`,
        right: `${rightPercent}%`
    });

    $("#shop-price-min-label").text(formatShopPrice(minValue));
    $("#shop-price-max-label").text(formatShopPrice(maxValue));
}

function bindPriceFilterInteractions() {
    $(document).off("input.shopPriceFilter change.shopPriceFilter", ".filtro_precio_min, .filtro_precio_max");
    $(document).on("input.shopPriceFilter change.shopPriceFilter", ".filtro_precio_min, .filtro_precio_max", function() {
        var changedHandle = $(this).hasClass("filtro_precio_max") ? "max" : "min";
        updatePriceFilterUi(changedHandle);
        refreshShopDependentSelectOptions();
        scheduleAutoApplyFilters();
    });
}

function statusClassShop(status) {
    var value = String(status || "").toLowerCase();
    if (value === "activo") return "bg-emerald-300 text-emerald-950";
    if (value === "proximamente") return "bg-amber-300 text-amber-950";
    if (value === "cancelado") return "bg-red-300 text-red-950";
    if (value === "finalizado") return "bg-slate-300 text-slate-900";
    return "bg-slate-300 text-slate-900";
}

function sanitizeIconClass(iconClass) {
    var safe = String(iconClass || "").toLowerCase().replace(/[^a-z0-9 -]/g, " ").trim();
    if (safe === "") {
        return "fa-solid fa-circle-check";
    }
    return safe.replace(/\s+/g, " ");
}

function renderExtrasHtml(extras) {
    if (!Array.isArray(extras) || extras.length === 0) {
        return "<p class='text-sm text-slate-600 dark:text-slate-300'>Sin extras asociados</p>";
    }

    var html = "<div class='grid grid-cols-1 sm:grid-cols-2 gap-3'>";
    for (var i = 0; i < extras.length; i++) {
        var extra = extras[i] || {};
        var iconClass = sanitizeIconClass(extra.icon_class);
        html += `
            <div class='rounded-lg border border-slate-200 dark:border-primary/10 bg-slate-50 dark:bg-slate-900/40 px-4 py-3 flex items-center gap-3'>
                <span class='w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm'>
                    <i class='${escapeShopHtml(iconClass)}'></i>
                </span>
                <span class='text-sm font-semibold text-slate-800 dark:text-slate-200'>${escapeShopHtml(extra.extra_name || "Extra")}</span>
            </div>
        `;
    }
    html += "</div>";
    return html;
}

function imageShop(url, classes, alt) {
    var imageUrl = normalizeShopImageUrl(url);
    var fallbackUrl = normalizeShopImageUrl(SHOP_DEFAULT_EVENT_IMAGE);
    if (imageUrl === "") {
        imageUrl = fallbackUrl;
    }
    return `<img class='${classes}' src='${escapeShopHtml(imageUrl)}' alt='${escapeShopHtml(alt || "imagen")}' onerror="this.onerror=null;this.src='${escapeShopHtml(fallbackUrl)}';">`;
}

function normalizeEventListImages(row) {
    var images = [];

    if (Array.isArray(row.img_event)) {
        for (var i = 0; i < row.img_event.length; i++) {
            var img = String(row.img_event[i] || "").trim();
            if (img !== "" && images.indexOf(img) === -1) {
                images.push(img);
            }
        }
    }

    var cardImage = String(row.card_image || "").trim();
    if (cardImage !== "" && images.indexOf(cardImage) === -1) {
        images.unshift(cardImage);
    }

    if (images.length === 0) {
        images.push(SHOP_DEFAULT_EVENT_IMAGE);
    }

    return images;
}

function readStoredFilters() {
    var raw = localStorage.getItem("filtros");
    if (!raw) {
        return [];
    }
    try {
        var parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        return [];
    }
}

function updateFiltersCountUi(count) {
    var value = Number.isFinite(count) ? Math.max(0, count) : 0;
    $("#shop-filters-count").text(String(value));
}

function updateEventsCountUi(count) {
    var value = Number.isFinite(count) ? Math.max(0, count) : 0;
    $("#shop-events-count").text(String(value));
}

function getShopTotalPages(totalEvents) {
    var total = Number(totalEvents) || 0;
    return Math.max(1, Math.ceil(total / SHOP_ITEMS_PER_PAGE));
}

function normalizeShopPage(page, totalPages) {
    var parsed = Number(page);
    if (!Number.isFinite(parsed)) {
        parsed = 1;
    }
    parsed = Math.floor(parsed);
    if (parsed < 1) {
        parsed = 1;
    }
    if (parsed > totalPages) {
        parsed = totalPages;
    }
    return parsed;
}

function renderShopPagination(totalEvents) {
    var container = $("#shop-pagination");
    if (!container.length) {
        return;
    }

    var totalPages = getShopTotalPages(totalEvents);
    shopCurrentPage = normalizeShopPage(shopCurrentPage, totalPages);

    if (totalPages <= 1) {
        container.empty();
        return;
    }

    var html = "<div class='inline-flex items-center gap-1 flex-wrap justify-center'>";
    var prevDisabled = shopCurrentPage <= 1;
    html += `<button class='shop-page-btn px-3 py-2 rounded-lg border border-slate-300 dark:border-primary/20 text-sm font-bold ${prevDisabled ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-100 dark:hover:bg-slate-900/60"}' data-page='prev' type='button' ${prevDisabled ? "disabled" : ""}>Anterior</button>`;

    for (var page = 1; page <= totalPages; page++) {
        var activeClass = page === shopCurrentPage
            ? "bg-primary text-background-dark border-primary"
            : "bg-white dark:bg-background-dark text-slate-700 dark:text-slate-200 border-slate-300 dark:border-primary/20 hover:bg-slate-100 dark:hover:bg-slate-900/60";
        html += `<button class='shop-page-btn min-w-[2.3rem] px-3 py-2 rounded-lg border text-sm font-bold ${activeClass}' data-page='${page}' type='button'>${page}</button>`;
    }

    var nextDisabled = shopCurrentPage >= totalPages;
    html += `<button class='shop-page-btn px-3 py-2 rounded-lg border border-slate-300 dark:border-primary/20 text-sm font-bold ${nextDisabled ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-100 dark:hover:bg-slate-900/60"}' data-page='next' type='button' ${nextDisabled ? "disabled" : ""}>Siguiente</button>`;
    html += "</div>";
    container.html(html);
}

var SHOP_SELECT_FILTERS = [
    { key: "city_name", selector: ".filtro_ciudad", optionsKey: "cities", placeholder: "Ciudad (todas)" },
    { key: "model_name", selector: ".filtro_modelo", optionsKey: "models", placeholder: "Modelo/Artista (todos)" },
    { key: "type_name", selector: ".filtro_tipo", optionsKey: "types", placeholder: "Tipo evento (todos)" },
    { key: "brand_name", selector: ".filtro_empresa", optionsKey: "brands", placeholder: "Empresa/Marca (todas)" }
];
var shopCascadeEventsUniverse = [];
var shopCascadeSyncLock = false;

function getDefaultShopFilterOptions() {
    return {
        cities: ["Valencia", "Madrid", "Barcelona"],
        models: ["Luca M.", "Sofía R.", "Adrián V."],
        types: ["Desfile", "Presentación", "Gala"],
        brands: ["ModaTix Studio", "Atelier Nova", "Urban Pulse"]
    };
}

function countVisibleFilters(filters) {
    if (!Array.isArray(filters)) {
        return 0;
    }

    var visibleKeys = {};
    for (var i = 0; i < SHOP_SELECT_FILTERS.length; i++) {
        visibleKeys[SHOP_SELECT_FILTERS[i].key] = true;
    }
    visibleKeys.ticket_price_min = true;
    visibleKeys.ticket_price_max = true;

    var count = 0;
    for (var j = 0; j < filters.length; j++) {
        var item = filters[j];
        if (!Array.isArray(item) || item.length < 2) {
            continue;
        }
        if (visibleKeys[item[0]]) {
            count++;
        }
    }
    return count;
}

function normalizeShopFilterOptions(payload) {
    var base = getDefaultShopFilterOptions();
    if (!payload || typeof payload !== "object") {
        return base;
    }

    var normalized = {};
    for (var i = 0; i < SHOP_SELECT_FILTERS.length; i++) {
        var config = SHOP_SELECT_FILTERS[i];
        var source = payload[config.optionsKey];
        if (!Array.isArray(source) || source.length === 0) {
            normalized[config.optionsKey] = base[config.optionsKey].slice();
            continue;
        }

        var values = [];
        for (var j = 0; j < source.length; j++) {
            var value = String(source[j] || "").trim();
            if (value !== "" && values.indexOf(value) === -1) {
                values.push(value);
            }
        }
        normalized[config.optionsKey] = values.length ? values : base[config.optionsKey].slice();
    }
    return normalized;
}

function loadShopFilterOptions() {
    return ajaxPromise(
        cacheBustedShopUrl("module/shop/controller/controller_shop.php?op=print_filters"),
        "GET",
        "JSON"
    ).then(function(data) {
        return normalizeShopFilterOptions(data);
    }).catch(function() {
        return getDefaultShopFilterOptions();
    });
}

function renderShopSelectFilter(config, filterOptions) {
    var values = Array.isArray(filterOptions[config.optionsKey]) ? filterOptions[config.optionsKey] : [];
    var html = `<select class='${config.selector.replace(".", "")} w-full rounded-lg border border-slate-300 dark:border-primary/20 bg-white dark:bg-slate-900 px-3 py-2 text-sm'>`;
    html += `<option value=''>${escapeShopHtml(config.placeholder)}</option>`;

    for (var i = 0; i < values.length; i++) {
        var value = String(values[i] || "").trim();
        if (value === "") {
            continue;
        }
        html += `<option value='${escapeShopHtml(value)}'>${escapeShopHtml(value)}</option>`;
    }

    html += "</select>";
    return html;
}

function ensureSelectOptionValue(selector, value) {
    var select = $(selector);
    if (!select.length) {
        return;
    }
    var currentValue = String(value || "").trim();
    if (currentValue === "") {
        return;
    }
    var exists = select.find("option").filter(function() {
        return String($(this).val()) === currentValue;
    }).length > 0;
    if (!exists) {
        select.append(`<option value='${escapeShopHtml(currentValue)}'>${escapeShopHtml(currentValue)}</option>`);
    }
}

function getShopEventModelValues(eventItem) {
    var values = [];
    if (eventItem && Array.isArray(eventItem.models_event)) {
        for (var i = 0; i < eventItem.models_event.length; i++) {
            var model = String(eventItem.models_event[i] || "").trim();
            if (model !== "" && values.indexOf(model) === -1) {
                values.push(model);
            }
        }
    }
    return values;
}

function getShopEventValueList(eventItem, key) {
    if (key === "model_name") {
        return getShopEventModelValues(eventItem);
    }
    var value = String((eventItem && eventItem[key]) || "").trim();
    return value === "" ? [] : [value];
}

function shopEventMatchesKey(eventItem, key, value) {
    if (value === "") {
        return true;
    }
    if (key === "model_name") {
        return getShopEventModelValues(eventItem).indexOf(value) !== -1;
    }
    var fieldValue = String((eventItem && eventItem[key]) || "").trim();
    return fieldValue === value;
}

function readShopCurrentSelections() {
    var selections = {};
    for (var i = 0; i < SHOP_SELECT_FILTERS.length; i++) {
        var config = SHOP_SELECT_FILTERS[i];
        selections[config.key] = String($(config.selector).val() || "").trim();
    }
    return selections;
}

function shopEventMatchesSelectionsForCascade(eventItem, selections, excludeKey, priceMin, priceMax) {
    for (var i = 0; i < SHOP_SELECT_FILTERS.length; i++) {
        var key = SHOP_SELECT_FILTERS[i].key;
        if (excludeKey === key) {
            continue;
        }
        if (!shopEventMatchesKey(eventItem, key, String(selections[key] || "").trim())) {
            return false;
        }
    }

    var eventPrice = Number(eventItem && eventItem.ticket_price);
    if (Number.isFinite(eventPrice)) {
        if (eventPrice < priceMin || eventPrice > priceMax) {
            return false;
        }
    }

    return true;
}

function computeShopCascadeOptionsForKey(key, selections, priceMin, priceMax) {
    var options = [];
    for (var i = 0; i < shopCascadeEventsUniverse.length; i++) {
        var eventItem = shopCascadeEventsUniverse[i];
        if (!shopEventMatchesSelectionsForCascade(eventItem, selections, key, priceMin, priceMax)) {
            continue;
        }
        var values = getShopEventValueList(eventItem, key);
        for (var j = 0; j < values.length; j++) {
            var value = values[j];
            if (value !== "" && options.indexOf(value) === -1) {
                options.push(value);
            }
        }
    }
    options.sort(function(a, b) {
        return a.localeCompare(b, "es", { sensitivity: "base" });
    });
    return options;
}

function renderShopCascadeSelect(config, values, selectedValue) {
    var html = `<option value=''>${escapeShopHtml(config.placeholder)}</option>`;
    for (var i = 0; i < values.length; i++) {
        var value = values[i];
        html += `<option value='${escapeShopHtml(value)}'>${escapeShopHtml(value)}</option>`;
    }

    var select = $(config.selector);
    select.html(html);
    if (selectedValue !== "" && values.indexOf(selectedValue) !== -1) {
        select.val(selectedValue);
    } else {
        select.val("");
    }
}

function refreshShopDependentSelectOptions() {
    if (!Array.isArray(shopCascadeEventsUniverse) || shopCascadeEventsUniverse.length === 0) {
        return;
    }

    var selections = readShopCurrentSelections();
    var priceMin = parseShopPrice($(".filtro_precio_min").val(), SHOP_PRICE_MIN);
    var priceMax = parseShopPrice($(".filtro_precio_max").val(), SHOP_PRICE_MAX);
    if (priceMin > priceMax) {
        var temp = priceMin;
        priceMin = priceMax;
        priceMax = temp;
    }

    shopCascadeSyncLock = true;
    for (var i = 0; i < SHOP_SELECT_FILTERS.length; i++) {
        var config = SHOP_SELECT_FILTERS[i];
        var options = computeShopCascadeOptionsForKey(config.key, selections, priceMin, priceMax);
        var selectedValue = String(selections[config.key] || "").trim();
        if (selectedValue !== "" && options.indexOf(selectedValue) === -1) {
            selections[config.key] = "";
        }
        renderShopCascadeSelect(config, options, selections[config.key]);
    }
    shopCascadeSyncLock = false;
}

function loadShopCascadeUniverse() {
    return ajaxPromise(
        cacheBustedShopUrl("module/shop/controller/controller_shop.php?op=all_events"),
        "POST",
        "JSON"
    ).then(function(data) {
        shopCascadeEventsUniverse = Array.isArray(data) ? data : [];
    }).catch(function() {
        shopCascadeEventsUniverse = [];
    });
}

function print_filtros(filterOptions) {
    var options = normalizeShopFilterOptions(filterOptions);
    var selectsHtml = "";
    for (var i = 0; i < SHOP_SELECT_FILTERS.length; i++) {
        selectsHtml += renderShopSelectFilter(SHOP_SELECT_FILTERS[i], options);
    }

    $("#shop-filters").empty();
    $("<div class='filtros'></div>").appendTo("#shop-filters")
        .html(`
            <div class='flex flex-wrap items-center justify-between gap-3 mb-4'>
                <h3 class='text-lg font-black text-slate-900 dark:text-white'>Filtros del shop</h3>
                <p class='text-xs md:text-sm font-semibold text-slate-600 dark:text-slate-300'>
                    Activos:
                    <span class='inline-flex items-center justify-center min-w-[1.8rem] px-2 py-1 rounded-full bg-primary text-background-dark font-black' id='shop-filters-count'>0</span>
                </p>
            </div>
            <div class='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3'>
                ${selectsHtml}
                <div>
                    <select class='filtro_order_by w-full rounded-lg border border-slate-300 dark:border-primary/20 bg-white dark:bg-slate-900 px-3 py-2 text-sm'>
                        <option value='date_asc'>Fecha (próximos primero)</option>
                        <option value='price_asc'>Precio (menor a mayor)</option>
                        <option value='price_desc'>Precio (mayor a menor)</option>
                        <option value='name_asc'>Nombre (A-Z)</option>
                        <option value='name_desc'>Nombre (Z-A)</option>
                        <option value='city_asc'>Ciudad (A-Z)</option>
                        <option value='city_desc'>Ciudad (Z-A)</option>
                    </select>
                </div>
                <div class='md:col-span-2 xl:col-span-4 mt-1'>
                    <div class='rounded-xl border border-slate-200 dark:border-primary/10 bg-slate-50 dark:bg-slate-900/40 p-4'>
                        <div class='flex flex-wrap items-center justify-between gap-2 mb-3'>
                            <p class='text-sm font-bold text-slate-800 dark:text-slate-200'>Rango de precio</p>
                            <div class='flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300'>
                                <span class='px-2 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-primary/15' id='shop-price-min-label'>1 €</span>
                                <span class='text-slate-400'>-</span>
                                <span class='px-2 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-primary/15' id='shop-price-max-label'>20.000 €</span>
                            </div>
                        </div>
                        <div class='shop-price-slider-wrap'>
                            <div class='shop-price-track'></div>
                            <div class='shop-price-track-active'></div>
                            <input class='filtro_precio_min shop-price-range' type='range' min='1' max='20000' step='1' value='1' aria-label='Precio mínimo'>
                            <input class='filtro_precio_max shop-price-range' type='range' min='1' max='20000' step='1' value='20000' aria-label='Precio máximo'>
                        </div>
                    </div>
                </div>
            </div>
            <div class='flex flex-wrap gap-3 mt-4'>
                <button class='filter_remove border border-slate-300 dark:border-primary/20 px-4 py-2 rounded-lg font-bold hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors' type='button'>Quitar filtros</button>
            </div>
        `);

    bindPriceFilterInteractions();
    updatePriceFilterUi("min");
    $(".filtro_order_by").val(getStoredShopOrderBy());
}

function highlightFilters() {
    var all_filters = readStoredFilters();
    var priceMin = SHOP_PRICE_MIN;
    var priceMax = SHOP_PRICE_MAX;

    var selectorByFilter = {};
    for (var i = 0; i < SHOP_SELECT_FILTERS.length; i++) {
        selectorByFilter[SHOP_SELECT_FILTERS[i].key] = SHOP_SELECT_FILTERS[i].selector;
    }

    for (var i = 0; i < all_filters.length; i++) {
        var key = all_filters[i][0];
        var value = all_filters[i][1];
        if (selectorByFilter[key]) {
            ensureSelectOptionValue(selectorByFilter[key], value);
            $(selectorByFilter[key]).val(value);
        }
        if (key === "ticket_price_min") {
            priceMin = parseShopPrice(value, SHOP_PRICE_MIN);
        }
        if (key === "ticket_price_max") {
            priceMax = parseShopPrice(value, SHOP_PRICE_MAX);
        }
    }

    $(".filtro_precio_min").val(priceMin);
    $(".filtro_precio_max").val(priceMax);
    updatePriceFilterUi("min");
    refreshShopDependentSelectOptions();
}

function collectFilters() {
    var all_filters = [];
    var precioMin = parseShopPrice($(".filtro_precio_min").val(), SHOP_PRICE_MIN);
    var precioMax = parseShopPrice($(".filtro_precio_max").val(), SHOP_PRICE_MAX);

    if (precioMin > precioMax) {
        var tempPrice = precioMin;
        precioMin = precioMax;
        precioMax = tempPrice;
    }

    for (var i = 0; i < SHOP_SELECT_FILTERS.length; i++) {
        var config = SHOP_SELECT_FILTERS[i];
        var value = String($(config.selector).val() || "").trim();
        if (value !== "") {
            all_filters.push([config.key, value]);
        }
    }

    if (precioMin > SHOP_PRICE_MIN) {
        all_filters.push(["ticket_price_min", precioMin]);
    }
    if (precioMax < SHOP_PRICE_MAX) {
        all_filters.push(["ticket_price_max", precioMax]);
    }

    return all_filters;
}

function saveAndSearchFilters(filters) {
    var validFilters = Array.isArray(filters) ? filters : [];
    updateFiltersCountUi(countVisibleFilters(validFilters));
    if (validFilters.length > 0) {
        localStorage.setItem("filtros", JSON.stringify(validFilters));
        ajaxForSearch("module/shop/controller/controller_shop.php?op=filter", validFilters);
    } else {
        localStorage.removeItem("filtros");
        ajaxForSearch("module/shop/controller/controller_shop.php?op=all_events");
    }
}

function applyFiltersFromUi() {
    var filtros = collectFilters();
    saveAndSearchFilters(filtros);
}

function renderShopEventCards(data) {
    var container = $("#content_shop_events");
    container.empty();

    for (var row = 0; row < data.length; row++) {
        var event = data[row];
        var images = normalizeEventListImages(event);
        var swiperId = `shop-list-swiper-${String(event.id_event || row)}`;
        var slides = "";

        for (var i = 0; i < images.length; i++) {
            slides += `
                <div class='swiper-slide'>
                    ${imageShop(images[i], "h-full w-full object-cover transition-transform duration-500 group-hover:scale-110", event.event_name || "evento")}
                </div>
            `;
        }

        container.append(
            `<article class='group bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/10 rounded-xl overflow-hidden shadow-xl flex flex-col'>
                <div class='h-56 overflow-hidden relative'>
                    <div class='swiper ${swiperId} h-full w-full'>
                        <div class='swiper-wrapper'>
                            ${slides}
                        </div>
                        <div class='swiper-button-next'></div>
                        <div class='swiper-button-prev'></div>
                        <div class='swiper-pagination'></div>
                    </div>
                    <span class='absolute top-3 right-3 z-10 bg-primary text-background-dark px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider'>${escapeShopHtml(event.type_name || "evento")}</span>
                </div>
                <div class='p-5 flex flex-col gap-3 flex-1'>
                    <h3 class='text-xl font-black text-slate-900 dark:text-white leading-tight'>${escapeShopHtml(event.event_name || "")}</h3>
                    <p class='text-sm text-slate-600 dark:text-slate-300'>${escapeShopHtml(event.short_description || "")}</p>
                    <p class='text-sm text-slate-600 dark:text-slate-300'>${escapeShopHtml(event.city_name || "")} · ${escapeShopHtml(event.venue_name || "")}</p>
                    <p class='text-xs text-slate-500 dark:text-slate-400'>${escapeShopHtml(formatShopDate(event.event_date))}</p>
                    <p class='text-sm font-black text-primary'>${escapeShopHtml(formatShopPrice(event.ticket_price || SHOP_PRICE_MIN))}</p>
                    <div class='mt-auto flex items-center justify-between gap-3'>
                        <span class='inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${statusClassShop(event.status)}'>${escapeShopHtml(event.status || "")}</span>
                        <button class='more_info_shop bg-primary text-background-dark px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors' data-id='${escapeShopHtml(event.id_event)}' type='button'>Ver detalle</button>
                    </div>
                </div>
            </article>`
        );
    }

    if (typeof Swiper !== "undefined") {
        for (var k = 0; k < data.length; k++) {
            var current = data[k];
            var currentImages = normalizeEventListImages(current);
            var currentSwiperId = `.shop-list-swiper-${String(current.id_event || k)}`;
            new Swiper(currentSwiperId, {
                loop: currentImages.length > 1,
                pagination: {
                    el: `${currentSwiperId} .swiper-pagination`,
                    clickable: true
                },
                navigation: {
                    nextEl: `${currentSwiperId} .swiper-button-next`,
                    prevEl: `${currentSwiperId} .swiper-button-prev`
                }
            });
        }
    }
}

function renderShopCurrentPage() {
    var container = $("#content_shop_events");
    var totalEvents = Array.isArray(shopFilteredEventsCache) ? shopFilteredEventsCache.length : 0;

    if (totalEvents === 0) {
        updateEventsCountUi(0);
        mapBox_all([]);
        renderShopPagination(0);
        container.empty().append(
            `<article class='col-span-full bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/10 rounded-xl p-6 text-center shadow-xl'>
                <h3 class='text-2xl font-black text-slate-900 dark:text-white'>No hay eventos para esos filtros</h3>
            </article>`
        );
        return;
    }

    var totalPages = getShopTotalPages(totalEvents);
    shopCurrentPage = normalizeShopPage(shopCurrentPage, totalPages);
    var start = (shopCurrentPage - 1) * SHOP_ITEMS_PER_PAGE;
    var end = start + SHOP_ITEMS_PER_PAGE;
    var pageData = shopFilteredEventsCache.slice(start, end);

    updateEventsCountUi(totalEvents);
    mapBox_all(pageData);
    renderShopEventCards(pageData);
    renderShopPagination(totalEvents);
}

function renderShopEvents(data) {
    if (data === "error" || !Array.isArray(data)) {
        shopFilteredEventsCache = [];
        renderShopCurrentPage();
        return;
    }

    shopFilteredEventsCache = sortShopEventsByCurrentOrder(data);
    renderShopCurrentPage();
}

function ajaxForSearch(url, filter) {
    var payload = undefined;
    if (Array.isArray(filter) && filter.length > 0) {
        payload = { filter: JSON.stringify(filter) };
    }

    ajaxPromise(cacheBustedShopUrl(url), "POST", "JSON", payload)
        .then(function(data) {
            shopCurrentPage = 1;
            renderShopEvents(data);
            $("#shop-details-section").addClass("hidden");
            $("#shop-filters-panel").removeClass("hidden");
            $("#shop-list-section").removeClass("hidden");
        })
        .catch(function() {
            shopFilteredEventsCache = [];
            renderShopCurrentPage();
        });
}

function shopAll() {
    var filtros = readStoredFilters();
    updateFiltersCountUi(countVisibleFilters(filtros));
    if (filtros.length > 0) {
        highlightFilters();
        ajaxForSearch("module/shop/controller/controller_shop.php?op=filter", filtros);
    } else {
        ajaxForSearch("module/shop/controller/controller_shop.php?op=all_events");
    }
}

function boton_filtro() {
    var selectTargets = SHOP_SELECT_FILTERS.map(function(item) { return item.selector; }).join(", ");
    $(document).off("change.shopSelectFilters", selectTargets);
    $(document).on("change.shopSelectFilters", selectTargets, function() {
        if (shopCascadeSyncLock) {
            return;
        }
        refreshShopDependentSelectOptions();
        applyFiltersFromUi();
    });

    $(document).off("click.shopRemoveFilters", ".filter_remove");
    $(document).on("click.shopRemoveFilters", ".filter_remove", function() {
        localStorage.removeItem("filtros");
        localStorage.removeItem(SHOP_ORDER_STORAGE_KEY);
        shopCurrentOrderBy = SHOP_DEFAULT_ORDER;
        for (var i = 0; i < SHOP_SELECT_FILTERS.length; i++) {
            $(SHOP_SELECT_FILTERS[i].selector).val("");
        }
        $(".filtro_order_by").val(SHOP_DEFAULT_ORDER);
        $(".filtro_precio_min").val(SHOP_PRICE_MIN);
        $(".filtro_precio_max").val(SHOP_PRICE_MAX);
        updatePriceFilterUi("min");
        refreshShopDependentSelectOptions();
        updateFiltersCountUi(0);
        ajaxForSearch("module/shop/controller/controller_shop.php?op=all_events");
    });

    $(document).off("change.shopOrderBy", ".filtro_order_by");
    $(document).on("change.shopOrderBy", ".filtro_order_by", function() {
        setStoredShopOrderBy(this.value);
        renderShopEvents(shopFilteredEventsCache);
    });
}

function bindShopPagination() {
    $(document).off("click.shopPagination", ".shop-page-btn");
    $(document).on("click.shopPagination", ".shop-page-btn", function() {
        var action = String(this.getAttribute("data-page") || "").trim();
        var totalPages = getShopTotalPages(Array.isArray(shopFilteredEventsCache) ? shopFilteredEventsCache.length : 0);

        if (action === "prev") {
            shopCurrentPage = normalizeShopPage(shopCurrentPage - 1, totalPages);
            renderShopCurrentPage();
            return;
        }
        if (action === "next") {
            shopCurrentPage = normalizeShopPage(shopCurrentPage + 1, totalPages);
            renderShopCurrentPage();
            return;
        }

        var page = Number(action);
        if (!Number.isFinite(page)) {
            return;
        }
        shopCurrentPage = normalizeShopPage(page, totalPages);
        renderShopCurrentPage();
    });
}

var detailShopSwiper = null;

function renderDetailImages(eventData, images) {
    var container = $("#shop-detail-images");
    container.empty();

    var urls = [];
    var poster = String(eventData.poster_image || "").trim();
    if (poster !== "") {
        urls.push(poster);
    }
    if (Array.isArray(images)) {
        for (var i = 0; i < images.length; i++) {
            var img = String(images[i].image_url || "").trim();
            if (img !== "" && urls.indexOf(img) === -1) {
                urls.push(img);
            }
        }
    }
    if (urls.length === 0) {
        urls.push(SHOP_DEFAULT_EVENT_IMAGE);
    }
    shopDetailImageUrlsForMap = urls.slice();

    for (var j = 0; j < urls.length; j++) {
        container.append(
            `<div class='swiper-slide'>
                <div class='h-64 md:h-[440px] bg-slate-200 dark:bg-slate-800'>
                    ${imageShop(urls[j], "w-full h-full object-cover", eventData.event_name || "evento")}
                </div>
            </div>`
        );
    }

    if (typeof Swiper !== "undefined") {
        if (detailShopSwiper) {
            detailShopSwiper.destroy(true, true);
        }
        detailShopSwiper = new Swiper(".shop-detail-swiper", {
            loop: urls.length > 1,
            observer: true,
            observeParents: true,
            resizeObserver: true,
            watchOverflow: true,
            pagination: {
                el: ".shop-detail-swiper .swiper-pagination",
                clickable: true
            },
            navigation: {
                nextEl: ".shop-detail-swiper .swiper-button-next",
                prevEl: ".shop-detail-swiper .swiper-button-prev"
            }
        });
        setTimeout(function() {
            if (detailShopSwiper) {
                detailShopSwiper.update();
                detailShopSwiper.slideTo(0, 0);
            }
        }, 30);
    }
}

function renderDetailMain(payload) {
    var eventData = payload.event || {};
    var categories = Array.isArray(payload.categories) ? payload.categories : [];
    var models = Array.isArray(payload.models) ? payload.models : [];
    var extras = Array.isArray(payload.extras) ? payload.extras : [];

    var categoriesText = categories.length
        ? categories.map(function(item) { return escapeShopHtml(item.category_name || ""); }).join(", ")
        : "Sin categorías";

    var modelsText = models.length
        ? models.map(function(item) {
            var stageName = item.stage_name ? ` (${escapeShopHtml(item.stage_name)})` : "";
            var role = item.role_name ? ` - ${escapeShopHtml(item.role_name)}` : "";
            return `${escapeShopHtml(item.model_name || "")}${stageName}${role}`;
        }).join("<br>")
        : "Sin modelos asociados";

    $("#shop-detail-main").html(`
        <h2 class='text-3xl font-black text-slate-900 dark:text-white'>${escapeShopHtml(eventData.event_name || "")}</h2>
        <p class='mt-2 text-slate-600 dark:text-slate-300'>${escapeShopHtml(eventData.short_description || "")}</p>
        <div class='mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusClassShop(eventData.status)}'>${escapeShopHtml(eventData.status || "")}</div>
        <div class='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
            <div><span class='font-bold text-slate-900 dark:text-white'>Slug:</span> ${escapeShopHtml(eventData.slug || "")}</div>
            <div><span class='font-bold text-slate-900 dark:text-white'>Tipo:</span> ${escapeShopHtml(eventData.type_name || "")}</div>
            <div><span class='font-bold text-slate-900 dark:text-white'>Ciudad:</span> ${escapeShopHtml(eventData.city_name || "")}</div>
            <div><span class='font-bold text-slate-900 dark:text-white'>Venue:</span> ${escapeShopHtml(eventData.venue_name || "")}</div>
            <div><span class='font-bold text-slate-900 dark:text-white'>Fecha inicio:</span> ${escapeShopHtml(formatShopDate(eventData.event_date))}</div>
            <div><span class='font-bold text-slate-900 dark:text-white'>Fecha fin:</span> ${escapeShopHtml(formatShopDate(eventData.end_date))}</div>
            <div><span class='font-bold text-slate-900 dark:text-white'>Precio entrada:</span> ${escapeShopHtml(formatShopPrice(eventData.ticket_price || SHOP_PRICE_MIN))}</div>
            <div><span class='font-bold text-slate-900 dark:text-white'>Dress code:</span> ${escapeShopHtml(eventData.dress_code || "")}</div>
            <div><span class='font-bold text-slate-900 dark:text-white'>Temporada:</span> ${escapeShopHtml(eventData.season_name || "")}</div>
            <div><span class='font-bold text-slate-900 dark:text-white'>Marca:</span> ${escapeShopHtml(eventData.brand_name || "Sin marca")}</div>
            <div><span class='font-bold text-slate-900 dark:text-white'>Destacado:</span> ${String(eventData.featured) === "1" ? "Sí" : "No"}</div>
            <div><span class='font-bold text-slate-900 dark:text-white'>Creado:</span> ${escapeShopHtml(formatShopDate(eventData.created_at))}</div>
        </div>
        <div class='mt-6'>
            <h3 class='text-lg font-black text-slate-900 dark:text-white mb-2'>Descripción</h3>
            <p class='text-sm text-slate-600 dark:text-slate-300'>${escapeShopHtml(eventData.description || "")}</p>
        </div>
        <div class='mt-6'>
            <h3 class='text-lg font-black text-slate-900 dark:text-white mb-3'>Extras</h3>
            ${renderExtrasHtml(extras)}
        </div>
        <div class='mt-6'>
            <h3 class='text-lg font-black text-slate-900 dark:text-white mb-2'>Categorías</h3>
            <p class='text-sm text-slate-600 dark:text-slate-300'>${categoriesText}</p>
        </div>
        <div class='mt-6'>
            <h3 class='text-lg font-black text-slate-900 dark:text-white mb-2'>Modelos</h3>
            <p class='text-sm text-slate-600 dark:text-slate-300'>${modelsText}</p>
        </div>
    `);
}

function getFirstImageForEventCard(eventItem) {
    var images = normalizeEventListImages(eventItem || {});
    return images.length > 0 ? images[0] : SHOP_DEFAULT_EVENT_IMAGE;
}

function getSimilarEventsByCity(eventData) {
    if (!eventData || !Array.isArray(shopCascadeEventsUniverse)) {
        return [];
    }
    var currentCity = String(eventData.city_name || "").trim();
    var currentId = Number(eventData.id_event || 0);
    if (currentCity === "") {
        return [];
    }

    var similar = [];
    for (var i = 0; i < shopCascadeEventsUniverse.length; i++) {
        var item = shopCascadeEventsUniverse[i];
        if (!item) {
            continue;
        }
        var sameCity = String(item.city_name || "").trim() === currentCity;
        var otherEvent = Number(item.id_event || 0) !== currentId;
        if (sameCity && otherEvent) {
            similar.push(item);
        }
    }

    similar.sort(function(a, b) {
        var diff = parseShopDateTimestamp(a.event_date) - parseShopDateTimestamp(b.event_date);
        if (diff !== 0) {
            return diff;
        }
        return Number(a.id_event || 0) - Number(b.id_event || 0);
    });

    return similar;
}

function renderSimilarEventsByCity(eventData) {
    var panel = $("#shop-detail-similar-panel");
    var container = $("#shop-similar-events");
    if (!panel.length || !container.length) {
        return;
    }

    shopCurrentDetailEventData = eventData || null;
    shopRelatedEventsCache = getSimilarEventsByCity(eventData);
    shopRelatedVisibleCount = SHOP_RELATED_PAGE_SIZE;
    renderSimilarEventsChunk();
}

function renderSimilarEventsChunk() {
    var panel = $("#shop-detail-similar-panel");
    var container = $("#shop-similar-events");
    if (!panel.length || !container.length) {
        return;
    }

    var similarEvents = Array.isArray(shopRelatedEventsCache) ? shopRelatedEventsCache : [];
    container.empty();

    if (similarEvents.length === 0) {
        container.html("<p class='text-sm text-slate-600 dark:text-slate-300'>No hay más eventos en esta ciudad.</p>");
        panel.removeClass("hidden");
        return;
    }

    var visibleEvents = similarEvents.slice(0, shopRelatedVisibleCount);
    var html = "<div class='flex flex-col gap-4'>";
    for (var i = 0; i < visibleEvents.length; i++) {
        var item = visibleEvents[i];
        html += `
            <article class='bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-primary/10 rounded-xl overflow-hidden'>
                <div class='grid grid-cols-1 md:grid-cols-12'>
                    <div class='md:col-span-4 h-44 md:h-auto overflow-hidden'>
                        ${imageShop(getFirstImageForEventCard(item), "w-full h-full object-cover", item.event_name || "evento")}
                    </div>
                    <div class='md:col-span-8 p-4 flex flex-col gap-2'>
                        <h4 class='text-lg font-black text-slate-900 dark:text-white leading-tight'>${escapeShopHtml(item.event_name || "")}</h4>
                        <p class='text-sm text-slate-600 dark:text-slate-300'>${escapeShopHtml(item.city_name || "")} · ${escapeShopHtml(item.venue_name || "")}</p>
                        <p class='text-sm text-slate-500 dark:text-slate-400'>${escapeShopHtml(formatShopDate(item.event_date))}</p>
                        <p class='text-base font-black text-primary'>${escapeShopHtml(formatShopPrice(item.ticket_price || SHOP_PRICE_MIN))}</p>
                        <div class='mt-1'>
                            <button class='more_info_shop_similar bg-primary text-background-dark px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors' data-id='${escapeShopHtml(item.id_event)}' type='button'>Ver detalle</button>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }
    html += "</div>";
    if (shopRelatedVisibleCount < similarEvents.length) {
        html += `
            <div class='mt-4'>
                <button class='shop-related-load-more bg-primary text-background-dark px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors' type='button'>
                    Ver más
                </button>
            </div>
        `;
    }
    container.html(html);
    panel.removeClass("hidden");
}

function incrementShopEventVisit(idEvent) {
    var id = Number(idEvent || 0);
    if (!Number.isFinite(id) || id <= 0) {
        return;
    }
    ajaxPromise(
        cacheBustedShopUrl("module/shop/controller/controller_shop.php?op=add_visit"),
        "POST",
        "JSON",
        { id: id }
    ).catch(function() {});
}

function details_event(idEvent) {
    ajaxPromise(cacheBustedShopUrl(`module/shop/controller/controller_shop.php?op=details_event&id=${encodeURIComponent(idEvent)}`), "GET", "JSON")
        .then(function(data) {
            if (!data || data === "error" || !data.event) {
                return;
            }
            $("#shop-list-section").addClass("hidden");
            $("#shop-filters-panel").addClass("hidden");
            $("#shop-details-section").removeClass("hidden");

            renderDetailImages(data.event, data.images);
            renderDetailMain(data);
            mapBox(data.event);
            renderSimilarEventsByCity(data.event);
            incrementShopEventVisit(data.event.id_event);

            setTimeout(function() {
                if (detailShopSwiper) {
                    detailShopSwiper.update();
                }
                if (shopDetailLeafletMap) {
                    shopDetailLeafletMap.invalidateSize();
                }
            }, 80);
            window.scrollTo({ top: 0, behavior: "smooth" });
        })
        .catch(function() {});
}

function openPendingEventFromHomeHero() {
    var pendingEventId = String(localStorage.getItem("shop_direct_event_id") || "").trim();
    if (!/^\d+$/.test(pendingEventId)) {
        localStorage.removeItem("shop_direct_event_id");
        return false;
    }
    localStorage.removeItem("shop_direct_event_id");
    details_event(pendingEventId);
    return true;
}

function load_details() {
    $(document).on("click", ".more_info_shop", function() {
        var idEvent = this.getAttribute("data-id");
        details_event(idEvent);
    });

    $(document).on("click", ".more_info_shop_similar", function() {
        var idEvent = this.getAttribute("data-id");
        if (idEvent) {
            details_event(idEvent);
        }
    });

    $(document).off("click.shopRelatedLoadMore", ".shop-related-load-more");
    $(document).on("click.shopRelatedLoadMore", ".shop-related-load-more", function() {
        shopRelatedVisibleCount += SHOP_RELATED_PAGE_SIZE;
        renderSimilarEventsChunk();
    });

    $(document).on("click", ".shop-map-popup-detail", function() {
        var idEvent = this.getAttribute("data-id");
        if (idEvent) {
            details_event(idEvent);
        }
    });

    $(document).on("click", "#back_to_shop", function() {
        $("#shop-details-section").addClass("hidden");
        $("#shop-filters-panel").removeClass("hidden");
        $("#shop-list-section").removeClass("hidden");
        if (!Array.isArray(shopFilteredEventsCache) || shopFilteredEventsCache.length === 0) {
            shopAll();
        }
        setTimeout(function() {
            if (shopListLeafletMap) {
                shopListLeafletMap.invalidateSize();
            }
        }, 120);
    });
}

$(document).ready(function() {
    if (!$("#modatix-shop").length) {
        return;
    }
    Promise.all([loadShopFilterOptions(), loadShopCascadeUniverse()]).then(function(results) {
        shopCurrentOrderBy = getStoredShopOrderBy();
        var filterOptions = results[0];
        print_filtros(filterOptions);
        refreshShopDependentSelectOptions();
        boton_filtro();
        bindShopPagination();
        load_details();
        var openedDirectDetail = openPendingEventFromHomeHero();
        if (!openedDirectDetail) {
            shopAll();
        }
    });
});
