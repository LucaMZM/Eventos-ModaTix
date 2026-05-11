function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function appBasePath() {
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

function normalizeImageUrl(url) {
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
    return appBasePath() + value.replace(/^\.?\//, "");
}

function cacheBustedUrl(url) {
    return `${url}${url.indexOf("?") === -1 ? "?" : "&"}_ts=${Date.now()}`;
}

var HOME_DEFAULT_EVENT_IMAGE = "https://cdn.pixabay.com/photo/2016/11/19/20/17/catwalk-1840941_1280.jpg";

function navigateToShopWithFilters(filters) {
    var list = Array.isArray(filters) ? filters : [];
    if (list.length > 0) {
        localStorage.setItem("filtros", JSON.stringify(list));
    } else {
        localStorage.removeItem("filtros");
    }
    window.location.href = "index.php?page=shop";
}

var homeHeroSwiper = null;
var homeHeroTransitioning = false;
var homeHeroNavigating = false;

function bindHomeShopJumps() {
    $(document).off("click.homeToShopHero", ".home-to-shop-hero");
    $(document).on("click.homeToShopHero", ".home-to-shop-hero", function(event) {
        event.preventDefault();

        if (homeHeroTransitioning || homeHeroNavigating) {
            return;
        }

        var idEvent = String(this.getAttribute("data-event-id") || "").trim();
        if (idEvent === "") {
            return;
        }

        homeHeroNavigating = true;
        localStorage.setItem("shop_direct_event_id", idEvent);
        window.location.href = "index.php?page=shop";
        setTimeout(function() {
            homeHeroNavigating = false;
        }, 1000);
    });

    $(document).off("click.homeToShopModel", ".home-to-shop-model");
    $(document).on("click.homeToShopModel", ".home-to-shop-model", function() {
        var modelName = String(this.getAttribute("data-model-name") || "").trim();
        if (modelName === "") {
            return;
        }
        navigateToShopWithFilters([["model_name", modelName]]);
    });

    $(document).off("click.homeToShopCity", ".home-to-shop-city");
    $(document).on("click.homeToShopCity", ".home-to-shop-city", function() {
        var cityName = String(this.getAttribute("data-city-name") || "").trim();
        if (cityName === "") {
            return;
        }
        navigateToShopWithFilters([["city_name", cityName]]);
    });

    $(document).off("click.homeToShopBrand", ".home-to-shop-brand");
    $(document).on("click.homeToShopBrand", ".home-to-shop-brand", function() {
        var brandName = String(this.getAttribute("data-brand-name") || "").trim();
        if (brandName === "") {
            return;
        }
        navigateToShopWithFilters([["brand_name", brandName]]);
    });
}

function normalizeRows(data) {
    if (Array.isArray(data)) {
        return data;
    }
    if (typeof data === "string") {
        try {
            var parsed = JSON.parse(data);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }
    return [];
}

function parseDate(value) {
    if (!value) {
        return null;
    }
    var parsed = new Date(String(value).replace(" ", "T"));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDate(value) {
    var parsed = parseDate(value);
    if (!parsed) {
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

function statusClass(status) {
    var value = String(status || "").toLowerCase();
    if (value === "activo") return "bg-emerald-300 text-emerald-950";
    if (value === "proximamente") return "bg-amber-300 text-amber-950";
    if (value === "cancelado") return "bg-red-300 text-red-950";
    if (value === "finalizado") return "bg-slate-300 text-slate-900";
    return "bg-slate-300 text-slate-900";
}

function imageOrPlaceholder(url, classes) {
    var imageUrl = normalizeImageUrl(url);
    var fallbackUrl = normalizeImageUrl(HOME_DEFAULT_EVENT_IMAGE);
    if (imageUrl !== "") {
        return `<img class='${classes}' src='${escapeHtml(imageUrl)}' alt='imagen' onerror="this.onerror=null;this.src='${escapeHtml(fallbackUrl)}';">`;
    }
    return `<div class='${classes} bg-gradient-to-br from-slate-700 to-slate-900'></div>`;
}

function buildSwiper(selector, options) {
    if (typeof Swiper === "undefined") {
        return null;
    }
    return new Swiper(selector, options);
}

function loadHero() {
    ajaxPromise(cacheBustedUrl("module/home/controller/controller_home.php?op=homePageHero"), "GET", "JSON")
        .then(function(data) {
            var rows = normalizeRows(data);
            var container = $("#containerHero");
            if (!container.length) return;
            container.empty();

            if (rows.length === 0) {
                container.append(`
                    <div class='swiper-slide'>
                        <div class='h-full w-full bg-gradient-to-br from-slate-900 to-slate-700 flex items-end p-8'>
                            <div>
                                <span class='inline-block px-3 py-1 bg-primary text-background-dark text-xs font-bold uppercase tracking-widest mb-4'>ModaTix</span>
                                <h2 class='text-4xl md:text-6xl font-black text-white leading-tight'>Sin eventos cargados</h2>
                            </div>
                        </div>
                    </div>
                `);
            } else {
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    container.append(`
                        <div class='swiper-slide'>
                            <article class='home-to-shop-hero cursor-pointer relative h-full w-full overflow-hidden' data-event-id='${escapeHtml(row.id_event || "")}'>
                                ${imageOrPlaceholder(row.image_url, "absolute inset-0 h-full w-full object-cover")}
                                <div class='absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/50'></div>
                                <div class='absolute bottom-0 left-0 right-0 p-6 md:p-10'>
                                    <span class='inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${statusClass(row.status)}'>${escapeHtml(row.status || "sin estado")}</span>
                                    <h2 class='mt-4 text-4xl md:text-6xl font-black text-white leading-[0.95]'>${escapeHtml(row.event_name || "Evento")}</h2>
                                    <p class='mt-4 text-base md:text-lg text-slate-200 max-w-3xl'>${escapeHtml(row.short_description || row.description || "")}</p>
                                    <p class='mt-4 text-sm md:text-base text-slate-100'>${escapeHtml(row.city_name || "")} · ${escapeHtml(row.venue_name || "")} · ${escapeHtml(formatDate(row.event_date))}</p>
                                </div>
                            </article>
                        </div>
                    `);
                }
            }

            homeHeroSwiper = buildSwiper(".swiper-home-hero", {
                loop: rows.length > 1,
                autoplay: { delay: 4600, disableOnInteraction: false },
                pagination: { el: ".swiper-home-hero .swiper-pagination", clickable: true },
                navigation: {
                    nextEl: ".swiper-home-hero .swiper-button-next",
                    prevEl: ".swiper-home-hero .swiper-button-prev"
                }
            });

            if (homeHeroSwiper && typeof homeHeroSwiper.on === "function") {
                homeHeroSwiper.on("slideChangeTransitionStart", function() {
                    homeHeroTransitioning = true;
                });
                homeHeroSwiper.on("slideChangeTransitionEnd", function() {
                    homeHeroTransitioning = false;
                });
            }
        })
        .catch(function() {});
}

function loadEvents() {
    ajaxPromise(cacheBustedUrl("module/home/controller/controller_home.php?op=homePageEvents"), "GET", "JSON")
        .then(function(data) {
            var rows = normalizeRows(data);
            var container = $("#containerEvents");
            if (!container.length) return;
            container.empty();

            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                container.append(`
                    <div class='swiper-slide'>
                        <article class='group bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/10 rounded-xl overflow-hidden shadow-xl h-[360px] flex flex-col'>
                            <div class='relative h-52 overflow-hidden'>
                                ${imageOrPlaceholder(row.card_image, "h-full w-full object-cover transition-transform duration-500 group-hover:scale-110")}
                                <span class='absolute top-3 right-3 bg-primary text-background-dark px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider'>${escapeHtml(row.type_name || "evento")}</span>
                            </div>
                            <div class='p-4 flex flex-col gap-2 flex-1'>
                                <h4 class='text-lg font-black text-slate-900 dark:text-white'>${escapeHtml(row.event_name || "")}</h4>
                                <p class='text-sm text-slate-600 dark:text-slate-300'>${escapeHtml(row.city_name || "")} · ${escapeHtml(row.venue_name || "")}</p>
                                <p class='text-xs text-slate-500 dark:text-slate-400'>${escapeHtml(formatDate(row.event_date))}</p>
                                <span class='inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider w-fit ${statusClass(row.status)}'>${escapeHtml(row.status || "")}</span>
                            </div>
                        </article>
                    </div>
                `);
            }

            buildSwiper(".swiper-events", {
                loop: rows.length > 3,
                autoplay: { delay: 5000, disableOnInteraction: false },
                slidesPerView: 3,
                spaceBetween: 28,
                navigation: {
                    nextEl: ".swiper-events .swiper-button-next",
                    prevEl: ".swiper-events .swiper-button-prev"
                },
                breakpoints: {
                    0: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1200: { slidesPerView: 3 }
                }
            });
        })
        .catch(function() {});
}

function loadPopular() {
    ajaxPromise(cacheBustedUrl("module/home/controller/controller_home.php?op=homePagePopular"), "GET", "JSON")
        .then(function(data) {
            var rows = normalizeRows(data);
            var container = $("#containerPopular");
            if (!container.length) return;
            container.empty();

            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                container.append(`
                    <div class='swiper-slide'>
                        <article class='group bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/10 rounded-xl overflow-hidden shadow-xl h-[360px] flex flex-col'>
                            <div class='relative h-52 overflow-hidden'>
                                ${imageOrPlaceholder(row.card_image, "h-full w-full object-cover transition-transform duration-500 group-hover:scale-110")}
                                <span class='absolute top-3 right-3 bg-primary text-background-dark px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider'>TOP</span>
                            </div>
                            <div class='p-4 flex flex-col gap-2 flex-1'>
                                <h4 class='text-lg font-black text-slate-900 dark:text-white'>${escapeHtml(row.event_name || "")}</h4>
                                <p class='text-sm text-slate-600 dark:text-slate-300'>${escapeHtml(row.city_name || "")} · ${escapeHtml(row.venue_name || "")}</p>
                                <p class='text-xs text-slate-500 dark:text-slate-400'>${escapeHtml(formatDate(row.event_date))}</p>
                                <span class='inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider w-fit ${statusClass(row.status)}'>${escapeHtml(row.status || "")}</span>
                            </div>
                        </article>
                    </div>
                `);
            }

            buildSwiper(".swiper-popular", {
                loop: rows.length > 3,
                autoplay: { delay: 4300, disableOnInteraction: false },
                slidesPerView: 3,
                spaceBetween: 28,
                navigation: {
                    nextEl: ".swiper-popular .swiper-button-next",
                    prevEl: ".swiper-popular .swiper-button-prev"
                },
                breakpoints: {
                    0: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1200: { slidesPerView: 3 }
                }
            });
        })
        .catch(function() {});
}

function loadModels() {
    ajaxPromise(cacheBustedUrl("module/home/controller/controller_home.php?op=homePageModels"), "GET", "JSON")
        .then(function(data) {
            var rows = normalizeRows(data);
            var container = $("#containerModels");
            if (!container.length) return;
            container.empty();

            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var displayName = row.stage_name || row.model_name || "";
                container.append(`
                    <div class='swiper-slide'>
                        <article class='group home-to-shop-model cursor-pointer bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/10 rounded-xl overflow-hidden shadow-xl h-[340px] flex flex-col' data-model-name='${escapeHtml(row.model_name || "")}'>
                            <div class='h-52 overflow-hidden'>
                                ${imageOrPlaceholder(row.main_image, "h-full w-full object-cover transition-transform duration-500 group-hover:scale-110")}
                            </div>
                            <div class='p-4 flex flex-col gap-2'>
                                <h4 class='text-lg font-black text-slate-900 dark:text-white'>${escapeHtml(displayName)}</h4>
                                <p class='text-xs uppercase tracking-widest text-primary font-bold'>${escapeHtml(row.brand_name || "Sin marca")}</p>
                                <p class='text-sm text-slate-600 dark:text-slate-300'>${escapeHtml(row.nationality || "")}</p>
                            </div>
                        </article>
                    </div>
                `);
            }

            buildSwiper(".swiper-models", {
                loop: rows.length > 4,
                autoplay: { delay: 5000, disableOnInteraction: false },
                slidesPerView: 4,
                spaceBetween: 24,
                navigation: {
                    nextEl: ".swiper-models .swiper-button-next",
                    prevEl: ".swiper-models .swiper-button-prev"
                },
                breakpoints: {
                    0: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1200: { slidesPerView: 4 }
                }
            });
        })
        .catch(function() {});
}

function loadCategories() {
    ajaxPromise(cacheBustedUrl("module/home/controller/controller_home.php?op=homePageCategories"), "GET", "JSON")
        .then(function(data) {
            var rows = normalizeRows(data);
            var container = $("#containerCategories");
            if (!container.length) return;
            container.empty();

            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                container.append(`
                    <div class='swiper-slide'>
                        <article class='group relative rounded-xl overflow-hidden shadow-xl h-[220px]'>
                            ${imageOrPlaceholder(row.category_image, "absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110")}
                            <div class='absolute inset-0 bg-gradient-to-t from-black/85 to-transparent'></div>
                            <div class='absolute inset-0 flex items-center justify-center p-4'>
                                <h4 class='text-2xl font-black text-white uppercase tracking-widest text-center'>${escapeHtml(row.category_name || "")}</h4>
                            </div>
                        </article>
                    </div>
                `);
            }

            buildSwiper(".swiper-categories", {
                loop: rows.length > 4,
                autoplay: { delay: 4200, disableOnInteraction: false },
                slidesPerView: 4,
                spaceBetween: 24,
                navigation: {
                    nextEl: ".swiper-categories .swiper-button-next",
                    prevEl: ".swiper-categories .swiper-button-prev"
                },
                breakpoints: {
                    0: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1200: { slidesPerView: 4 }
                }
            });
        })
        .catch(function() {});
}

function loadCities() {
    ajaxPromise(cacheBustedUrl("module/home/controller/controller_home.php?op=homePageCities"), "GET", "JSON")
        .then(function(data) {
            var rows = normalizeRows(data);
            var container = $("#containerCities");
            if (!container.length) return;
            container.empty();

            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                container.append(`
                    <div class='swiper-slide'>
                        <article class='group home-to-shop-city cursor-pointer bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/10 rounded-xl overflow-hidden shadow-xl flex h-[170px]' data-city-name='${escapeHtml(row.city_name || "")}'>
                            <div class='relative w-2/5 overflow-hidden'>
                                ${imageOrPlaceholder(row.city_image, "h-full w-full object-cover transition-transform duration-500 group-hover:scale-110")}
                            </div>
                            <div class='p-5 flex flex-col justify-center w-3/5'>
                                <h4 class='text-xl font-black text-slate-900 dark:text-white'>${escapeHtml(row.city_name || "")}</h4>
                                <p class='text-primary text-xs font-bold uppercase tracking-widest mt-1'>${escapeHtml(row.total_events || 0)} eventos</p>
                            </div>
                        </article>
                    </div>
                `);
            }

            // Seguridad visual: si algún render/caché antiguo deja "location_on", lo eliminamos.
            container.find("*").filter(function() {
                return String($(this).text() || "").trim().toLowerCase() === "location_on";
            }).remove();

            buildSwiper(".swiper-cities", {
                loop: rows.length > 3,
                autoplay: { delay: 5200, disableOnInteraction: false },
                slidesPerView: 3,
                spaceBetween: 28,
                navigation: {
                    nextEl: ".swiper-cities .swiper-button-next",
                    prevEl: ".swiper-cities .swiper-button-prev"
                },
                breakpoints: {
                    0: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1200: { slidesPerView: 3 }
                }
            });
        })
        .catch(function() {});
}

function loadVenues() {
    ajaxPromise(cacheBustedUrl("module/home/controller/controller_home.php?op=homePageVenues"), "GET", "JSON")
        .then(function(data) {
            var rows = normalizeRows(data);
            var container = $("#containerVenues");
            if (!container.length) return;
            container.empty();

            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                container.append(`
                    <div class='swiper-slide'>
                        <article class='group relative rounded-xl overflow-hidden shadow-xl h-[240px]'>
                            ${imageOrPlaceholder(row.venue_image, "absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110")}
                            <div class='absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent'></div>
                            <div class='absolute bottom-0 left-0 p-4'>
                                <span class='text-primary text-xs font-bold uppercase tracking-widest'>${escapeHtml(row.city_name || "")}</span>
                                <h4 class='text-lg font-black text-white'>${escapeHtml(row.venue_name || "")}</h4>
                                <span class='text-slate-300 text-xs'>${escapeHtml(row.address || "")}</span>
                            </div>
                        </article>
                    </div>
                `);
            }

            buildSwiper(".swiper-venues", {
                loop: rows.length > 3,
                autoplay: { delay: 5200, disableOnInteraction: false },
                slidesPerView: 3,
                spaceBetween: 28,
                navigation: {
                    nextEl: ".swiper-venues .swiper-button-next",
                    prevEl: ".swiper-venues .swiper-button-prev"
                },
                breakpoints: {
                    0: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1200: { slidesPerView: 3 }
                }
            });
        })
        .catch(function() {});
}

function loadBrands() {
    ajaxPromise(cacheBustedUrl("module/home/controller/controller_home.php?op=homePageBrands"), "GET", "JSON")
        .then(function(data) {
            var rows = normalizeRows(data);
            var container = $("#containerBrands");
            if (!container.length) return;
            container.empty();

            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var logo = normalizeImageUrl(row.brand_logo);
                var fallbackLogo = normalizeImageUrl("view/img/menu.png");
                var media = logo !== ""
                    ? `<img class='h-16 w-auto object-contain mx-auto' src='${escapeHtml(logo)}' alt='logo' onerror="this.onerror=null;this.src='${escapeHtml(fallbackLogo)}';">`
                    : `<h4 class='text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase text-center'>${escapeHtml(row.brand_name || "")}</h4>`;
                container.append(`
                    <div class='swiper-slide'>
                        <article class='home-to-shop-brand cursor-pointer h-[150px] bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/10 rounded-xl shadow-xl flex flex-col items-center justify-center gap-3 p-4' data-brand-name='${escapeHtml(row.brand_name || "")}'>
                            ${media}
                            <p class='text-xs uppercase tracking-widest text-primary font-bold'>${escapeHtml(row.brand_name || "")}</p>
                        </article>
                    </div>
                `);
            }

            buildSwiper(".swiper-brands", {
                loop: rows.length > 5,
                autoplay: { delay: 4000, disableOnInteraction: false },
                slidesPerView: 5,
                spaceBetween: 20,
                navigation: {
                    nextEl: ".swiper-brands .swiper-button-next",
                    prevEl: ".swiper-brands .swiper-button-prev"
                },
                breakpoints: {
                    0: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1200: { slidesPerView: 5 }
                }
            });
        })
        .catch(function() {});
}

$(document).ready(function() {
    if (!$("#modatix-home").length) {
        return;
    }
    loadHero();
    loadEvents();
    loadPopular();
    loadModels();
    loadCities();
    loadBrands();
    bindHomeShopJumps();
});
