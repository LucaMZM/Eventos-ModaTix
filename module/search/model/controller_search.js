function cacheBustedSearchUrl(url) {
    return `${url}${url.indexOf("?") === -1 ? "?" : "&"}_ts=${Date.now()}`;
}

function escapeSearchHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

var SEARCH_PRICE_MIN = 1;
var SEARCH_PRICE_MAX = 20000;
var headerPopupEventsUniverse = [];
var headerPopupDataLoaded = false;
var headerPopupSyncLock = false;
var headerPopupCityTimer = null;

var HEADER_POPUP_SELECTS = [
    { key: "model_name", selector: "#header-popup-model", placeholder: "Modelo/Artista (todos)" },
    { key: "type_name", selector: "#header-popup-type", placeholder: "Tipo evento (todos)" },
    { key: "brand_name", selector: "#header-popup-brand", placeholder: "Empresa/Marca (todas)" }
];

var headerPopupState = {
    city_name: "",
    model_name: "",
    type_name: "",
    brand_name: "",
    ticket_price_min: SEARCH_PRICE_MIN,
    ticket_price_max: SEARCH_PRICE_MAX
};

function formatSearchPrice(value) {
    return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0
    }).format(value);
}

function parseSearchPrice(value, fallback) {
    var parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        return fallback;
    }
    parsed = Math.round(parsed);
    if (parsed < SEARCH_PRICE_MIN) {
        return SEARCH_PRICE_MIN;
    }
    if (parsed > SEARCH_PRICE_MAX) {
        return SEARCH_PRICE_MAX;
    }
    return parsed;
}

function normalizeSearchPriceRange() {
    headerPopupState.ticket_price_min = parseSearchPrice(headerPopupState.ticket_price_min, SEARCH_PRICE_MIN);
    headerPopupState.ticket_price_max = parseSearchPrice(headerPopupState.ticket_price_max, SEARCH_PRICE_MAX);
    if (headerPopupState.ticket_price_min > headerPopupState.ticket_price_max) {
        var swap = headerPopupState.ticket_price_min;
        headerPopupState.ticket_price_min = headerPopupState.ticket_price_max;
        headerPopupState.ticket_price_max = swap;
    }
}

function syncHeaderPopupPriceUi() {
    normalizeSearchPriceRange();
    $("#header-popup-price-min").val(headerPopupState.ticket_price_min);
    $("#header-popup-price-max").val(headerPopupState.ticket_price_max);
    $("#header-popup-price-min-label").text(formatSearchPrice(headerPopupState.ticket_price_min));
    $("#header-popup-price-max-label").text(formatSearchPrice(headerPopupState.ticket_price_max));
}

function getHeaderEventModels(item) {
    var values = [];
    if (item && Array.isArray(item.models_event)) {
        for (var i = 0; i < item.models_event.length; i++) {
            var model = String(item.models_event[i] || "").trim();
            if (model !== "" && values.indexOf(model) === -1) {
                values.push(model);
            }
        }
    }
    return values;
}

function getHeaderEventValueList(item, key) {
    if (key === "model_name") {
        return getHeaderEventModels(item);
    }
    var value = String((item && item[key]) || "").trim();
    return value === "" ? [] : [value];
}

function eventMatchesPopupKey(item, key, value) {
    if (value === "") {
        return true;
    }
    if (key === "model_name") {
        return getHeaderEventModels(item).indexOf(value) !== -1;
    }
    var fieldValue = String((item && item[key]) || "").trim();
    return fieldValue === value;
}

function eventMatchesPopupSelections(item, selections, excludeKey) {
    var keys = ["city_name", "model_name", "type_name", "brand_name"];
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (excludeKey === key) {
            continue;
        }
        var value = String(selections[key] || "").trim();
        if (!eventMatchesPopupKey(item, key, value)) {
            return false;
        }
    }

    var price = Number(item && item.ticket_price);
    if (Number.isFinite(price)) {
        if (price < selections.ticket_price_min || price > selections.ticket_price_max) {
            return false;
        }
    }

    return true;
}

function computePopupOptionsForKey(key, selections) {
    var options = [];
    for (var i = 0; i < headerPopupEventsUniverse.length; i++) {
        var eventItem = headerPopupEventsUniverse[i];
        if (!eventMatchesPopupSelections(eventItem, selections, key)) {
            continue;
        }
        var values = getHeaderEventValueList(eventItem, key);
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

function renderPopupSelect(selector, placeholder, options, selectedValue) {
    var html = `<option value=''>${escapeSearchHtml(placeholder)}</option>`;
    for (var i = 0; i < options.length; i++) {
        var value = options[i];
        html += `<option value='${escapeSearchHtml(value)}'>${escapeSearchHtml(value)}</option>`;
    }
    var select = $(selector);
    select.html(html);
    if (selectedValue !== "" && options.indexOf(selectedValue) !== -1) {
        select.val(selectedValue);
    } else {
        select.val("");
    }
}

function filterCitySuggestionsByQuery(options, query) {
    var q = String(query || "").trim().toLowerCase();
    if (q === "") {
        return options.slice(0, 8);
    }
    var result = [];
    for (var i = 0; i < options.length; i++) {
        var city = options[i];
        if (city.toLowerCase().indexOf(q) !== -1) {
            result.push(city);
        }
        if (result.length >= 8) {
            break;
        }
    }
    return result;
}

function clearPopupCitySuggestions() {
    $("#header-popup-city-suggestions").empty().addClass("hidden");
}

function renderPopupCitySuggestions(list) {
    var container = $("#header-popup-city-suggestions");
    container.empty();

    if (!Array.isArray(list) || list.length === 0) {
        container.addClass("hidden");
        return;
    }

    for (var i = 0; i < list.length; i++) {
        var city = String(list[i] || "").trim();
        if (city === "") {
            continue;
        }
        container.append(`<button class='header-popup-city-item w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors' type='button' data-city='${escapeSearchHtml(city)}'>${escapeSearchHtml(city)}</button>`);
    }

    if (container.children().length > 0) {
        container.removeClass("hidden");
    } else {
        container.addClass("hidden");
    }
}

function syncPopupStateFromUi() {
    headerPopupState.model_name = String($("#header-popup-model").val() || "").trim();
    headerPopupState.type_name = String($("#header-popup-type").val() || "").trim();
    headerPopupState.brand_name = String($("#header-popup-brand").val() || "").trim();
    headerPopupState.ticket_price_min = parseSearchPrice($("#header-popup-price-min").val(), SEARCH_PRICE_MIN);
    headerPopupState.ticket_price_max = parseSearchPrice($("#header-popup-price-max").val(), SEARCH_PRICE_MAX);
    normalizeSearchPriceRange();
}

function updatePopupDependentFilters() {
    if (!Array.isArray(headerPopupEventsUniverse) || headerPopupEventsUniverse.length === 0) {
        return;
    }

    headerPopupSyncLock = true;

    var cityOptions = computePopupOptionsForKey("city_name", headerPopupState);
    if (headerPopupState.city_name !== "" && cityOptions.indexOf(headerPopupState.city_name) === -1) {
        headerPopupState.city_name = "";
    }

    for (var i = 0; i < HEADER_POPUP_SELECTS.length; i++) {
        var config = HEADER_POPUP_SELECTS[i];
        var options = computePopupOptionsForKey(config.key, headerPopupState);
        if (headerPopupState[config.key] !== "" && options.indexOf(headerPopupState[config.key]) === -1) {
            headerPopupState[config.key] = "";
        }
        renderPopupSelect(config.selector, config.placeholder, options, headerPopupState[config.key]);
    }

    var cityInput = $("#header-popup-city-input");
    if (headerPopupState.city_name !== "") {
        cityInput.val(headerPopupState.city_name);
    }

    syncHeaderPopupPriceUi();
    headerPopupSyncLock = false;

    var cityQuery = String(cityInput.val() || "").trim();
    if (cityQuery === "" || cityQuery === headerPopupState.city_name) {
        clearPopupCitySuggestions();
    } else {
        renderPopupCitySuggestions(filterCitySuggestionsByQuery(cityOptions, cityQuery));
    }
}

function readStoredFiltersForPopup() {
    var state = {
        city_name: "",
        model_name: "",
        type_name: "",
        brand_name: "",
        ticket_price_min: SEARCH_PRICE_MIN,
        ticket_price_max: SEARCH_PRICE_MAX
    };

    var raw = localStorage.getItem("filtros");
    if (!raw) {
        return state;
    }

    var parsed;
    try {
        parsed = JSON.parse(raw);
    } catch (e) {
        return state;
    }

    if (!Array.isArray(parsed)) {
        return state;
    }

    for (var i = 0; i < parsed.length; i++) {
        var row = parsed[i];
        if (!Array.isArray(row) || row.length < 2) {
            continue;
        }
        var key = row[0];
        var value = row[1];
        if (key === "city_name" || key === "model_name" || key === "type_name" || key === "brand_name") {
            state[key] = String(value || "").trim();
        }
        if (key === "ticket_price_min") {
            state.ticket_price_min = parseSearchPrice(value, SEARCH_PRICE_MIN);
        }
        if (key === "ticket_price_max") {
            state.ticket_price_max = parseSearchPrice(value, SEARCH_PRICE_MAX);
        }
    }

    normalizeSearchPriceRange();
    return state;
}

function applyPopupFiltersAndGoShop() {
    syncPopupStateFromUi();

    var filters = [];
    if (headerPopupState.city_name !== "") {
        filters.push(["city_name", headerPopupState.city_name]);
    }
    if (headerPopupState.model_name !== "") {
        filters.push(["model_name", headerPopupState.model_name]);
    }
    if (headerPopupState.type_name !== "") {
        filters.push(["type_name", headerPopupState.type_name]);
    }
    if (headerPopupState.brand_name !== "") {
        filters.push(["brand_name", headerPopupState.brand_name]);
    }
    if (headerPopupState.ticket_price_min > SEARCH_PRICE_MIN) {
        filters.push(["ticket_price_min", headerPopupState.ticket_price_min]);
    }
    if (headerPopupState.ticket_price_max < SEARCH_PRICE_MAX) {
        filters.push(["ticket_price_max", headerPopupState.ticket_price_max]);
    }

    if (filters.length > 0) {
        localStorage.setItem("filtros", JSON.stringify(filters));
    } else {
        localStorage.removeItem("filtros");
    }

    closeHeaderSearchPopup();
    window.location.href = "index.php?page=shop";
}

function clearHeaderPopupFilters() {
    headerPopupState = {
        city_name: "",
        model_name: "",
        type_name: "",
        brand_name: "",
        ticket_price_min: SEARCH_PRICE_MIN,
        ticket_price_max: SEARCH_PRICE_MAX
    };
    $("#header-popup-city-input").val("");
    updatePopupDependentFilters();
}

function fetchHeaderPopupUniverse() {
    return ajaxPromise(
        cacheBustedSearchUrl("module/shop/controller/controller_shop.php?op=all_events"),
        "POST",
        "JSON"
    ).then(function(data) {
        if (Array.isArray(data)) {
            headerPopupEventsUniverse = data;
        } else {
            headerPopupEventsUniverse = [];
        }
        headerPopupDataLoaded = true;
    }).catch(function() {
        headerPopupEventsUniverse = [];
        headerPopupDataLoaded = true;
    });
}

function openHeaderSearchPopup() {
    $("#header-search-popup").removeClass("hidden");
    $("body").addClass("overflow-hidden");

    var setup = function() {
        headerPopupState = readStoredFiltersForPopup();
        $("#header-popup-city-input").val(headerPopupState.city_name);
        updatePopupDependentFilters();
    };

    if (!headerPopupDataLoaded) {
        fetchHeaderPopupUniverse().then(function() {
            setup();
        });
    } else {
        setup();
    }
}

function closeHeaderSearchPopup() {
    $("#header-search-popup").addClass("hidden");
    $("body").removeClass("overflow-hidden");
    clearPopupCitySuggestions();
}

function bindHeaderSearchPopupEvents() {
    $(document).off("click.headerSearchOpen", "#header-search-open-btn");
    $(document).on("click.headerSearchOpen", "#header-search-open-btn", function() {
        openHeaderSearchPopup();
    });

    $(document).off("click.headerSearchClose", "#header-search-close-btn, #header-search-popup-overlay");
    $(document).on("click.headerSearchClose", "#header-search-close-btn, #header-search-popup-overlay", function() {
        closeHeaderSearchPopup();
    });

    $(document).off("keydown.headerSearchEsc");
    $(document).on("keydown.headerSearchEsc", function(event) {
        if (event.key === "Escape" && !$("#header-search-popup").hasClass("hidden")) {
            closeHeaderSearchPopup();
        }
    });

    $(document).off("change.headerPopupSelect", "#header-popup-model, #header-popup-type, #header-popup-brand");
    $(document).on("change.headerPopupSelect", "#header-popup-model, #header-popup-type, #header-popup-brand", function() {
        if (headerPopupSyncLock) {
            return;
        }
        syncPopupStateFromUi();
        updatePopupDependentFilters();
    });

    $(document).off("input.headerPopupPrice", "#header-popup-price-min, #header-popup-price-max");
    $(document).on("input.headerPopupPrice", "#header-popup-price-min, #header-popup-price-max", function() {
        syncPopupStateFromUi();
        updatePopupDependentFilters();
    });

    $(document).off("input.headerPopupCity", "#header-popup-city-input");
    $(document).on("input.headerPopupCity", "#header-popup-city-input", function() {
        if (headerPopupCityTimer) {
            clearTimeout(headerPopupCityTimer);
        }

        var typed = String($(this).val() || "").trim();
        if (typed !== headerPopupState.city_name) {
            headerPopupState.city_name = "";
            syncPopupStateFromUi();
            updatePopupDependentFilters();
        }

        headerPopupCityTimer = setTimeout(function() {
            var cityOptions = computePopupOptionsForKey("city_name", headerPopupState);
            renderPopupCitySuggestions(filterCitySuggestionsByQuery(cityOptions, typed));
        }, 100);
    });

    $(document).off("keydown.headerPopupCityEnter", "#header-popup-city-input");
    $(document).on("keydown.headerPopupCityEnter", "#header-popup-city-input", function(event) {
        if (event.key !== "Enter") {
            return;
        }
        event.preventDefault();

        var typed = String($(this).val() || "").trim();
        if (typed !== "") {
            var cityOptions = computePopupOptionsForKey("city_name", headerPopupState);
            for (var i = 0; i < cityOptions.length; i++) {
                if (cityOptions[i].toLowerCase() === typed.toLowerCase()) {
                    headerPopupState.city_name = cityOptions[i];
                    $(this).val(cityOptions[i]);
                    updatePopupDependentFilters();
                    clearPopupCitySuggestions();
                    break;
                }
            }
        }
    });

    $(document).off("click.headerPopupCityItem", ".header-popup-city-item");
    $(document).on("click.headerPopupCityItem", ".header-popup-city-item", function() {
        var city = String(this.getAttribute("data-city") || "").trim();
        if (city === "") {
            return;
        }
        headerPopupState.city_name = city;
        $("#header-popup-city-input").val(city);
        clearPopupCitySuggestions();
        updatePopupDependentFilters();
        clearPopupCitySuggestions();
    });

    $(document).off("click.headerPopupCityOutside");
    $(document).on("click.headerPopupCityOutside", function(event) {
        if (!$(event.target).closest("#header-popup-city-input, #header-popup-city-suggestions").length) {
            clearPopupCitySuggestions();
        }
    });

    $(document).off("click.headerPopupClear", "#header-popup-clear-btn");
    $(document).on("click.headerPopupClear", "#header-popup-clear-btn", function() {
        clearHeaderPopupFilters();
    });

    $(document).off("click.headerPopupApply", "#header-popup-apply-btn");
    $(document).on("click.headerPopupApply", "#header-popup-apply-btn", function() {
        applyPopupFiltersAndGoShop();
    });
}

$(document).ready(function() {
    bindHeaderSearchPopupEvents();
});
