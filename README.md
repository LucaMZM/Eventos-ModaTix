# ModaTix - Eventos de moda

![PHP](https://img.shields.io/badge/PHP-MVC-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Frontend-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111)
![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![Swiper](https://img.shields.io/badge/Swiper-Carousels-6332F6?style=for-the-badge&logo=swiper&logoColor=white)
[![All Rights Reserved](https://img.shields.io/badge/License-All_Rights_Reserved-344966)](LICENSE)

ModaTix es una aplicacion web para descubrir, filtrar y consultar eventos de moda en distintas ciudades. El proyecto combina una arquitectura PHP MVC con una base de datos MySQL relacional, componentes dinamicos en JavaScript, mapas interactivos con Leaflet y carruseles visuales con Swiper.

La app esta pensada como una experiencia de agenda y shop de eventos: desde el home se pueden explorar eventos destacados, ciudades, marcas, modelos y eventos populares; desde el shop se pueden aplicar filtros dependientes, ordenar resultados, ver eventos en mapa, abrir detalles completos y descubrir eventos relacionados.

## Indice

- [Caracteristicas principales](#caracteristicas-principales)
- [Stack tecnologico](#stack-tecnologico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Modelo de datos](#modelo-de-datos)
- [Instalacion en local](#instalacion-en-local)
- [Rutas principales](#rutas-principales)
- [Flujo funcional](#flujo-funcional)
- [Scripts SQL incluidos](#scripts-sql-incluidos)
- [Archivos clave](#archivos-clave)
- [Proximas mejoras](#proximas-mejoras)
- [Autor](#autor)

## Caracteristicas principales

### Home dinamico

- Hero principal con carrusel de eventos.
- Salto directo desde el carrusel principal al detalle del evento seleccionado.
- Seccion de proximos eventos.
- Carrusel de eventos mas populares usando contador de visitas.
- Carrusel de modelos destacados.
- Seccion de ciudades con acceso directo al shop filtrado por ciudad.
- Seccion de marcas con acceso directo al shop filtrado por marca.

### Shop de eventos

- Listado de eventos con tarjetas visuales.
- Paginacion de 6 eventos por pagina.
- Contador visible de eventos encontrados.
- Contador visible de filtros activos.
- Filtros dependientes por ciudad, modelo, tipo de evento, marca y rango de precio.
- Ordenacion por fecha, precio, nombre y ciudad.
- Mapa Leaflet con marcadores de eventos.
- Popup de mapa con carrusel de imagenes del evento.
- Persistencia temporal de filtros y ordenacion mediante `localStorage`.

### Detalle de evento

- Vista completa de un evento.
- Carrusel de imagenes del evento.
- Datos principales: ciudad, venue, fecha, precio, temporada, marca, dress code y estado destacado.
- Extras asociados al evento.
- Categorias y modelos participantes.
- Mapa Leaflet centrado en la ubicacion exacta del evento.
- Contador oculto de visitas por evento.
- Seccion "Mas eventos en la misma ciudad" con boton "Ver mas" en bloques de 3 eventos.

### Buscador global

- Boton `Search` disponible en el header.
- Popup superior profesional.
- Autocompletado de ciudades.
- Filtros dependientes dentro del popup.
- Redireccion al shop con filtros ya aplicados.

## Stack tecnologico

| Area | Tecnologia |
| --- | --- |
| Backend | PHP |
| Arquitectura | MVC por modulos |
| Base de datos | MySQL |
| Conexion DB | PDO |
| Frontend dinamico | JavaScript y jQuery |
| Estilos | Tailwind CDN y CSS propio |
| Carruseles | Swiper |
| Mapas | Leaflet y OpenStreetMap |
| Iconos | Material Symbols y Font Awesome |
| Entorno local | XAMPP |

## Estructura del proyecto

```text
Eventos ModaTix/
├── DB/
│   ├── DB.sql
│   ├── ADD_EVENT_EXTRAS.sql
│   ├── ADD_EVENT_GEO_FILTER.sql
│   ├── ADD_EVENT_PRICE_FILTER.sql
│   ├── ADD_EVENTS_PAGINATION_SCROLL.sql
│   └── UPDATE_IMAGE_URLS.sql
├── index.php
├── model/
│   └── connect.php
├── module/
│   ├── home/
│   │   ├── controller/controller_home.php
│   │   ├── model/DAOHome.php
│   │   ├── model/controller_home.js
│   │   └── view/home.html
│   ├── search/
│   │   ├── controller/controller_search.php
│   │   ├── model/DAOSearch.php
│   │   └── model/controller_search.js
│   └── shop/
│       ├── controller/controller_shop.php
│       ├── model/DAOShop.php
│       ├── model/controller_shop.js
│       └── view/shop.html
├── view/
│   ├── css/style.css
│   ├── img/
│   ├── inc/
│   │   ├── header.html
│   │   ├── pages.php
│   │   ├── top_page.html
│   │   ├── top_page_home.html
│   │   ├── bottom_page.html
│   │   └── footer.html
│   └── js/promises.js
└── README.md
```

## Modelo de datos

La base de datos se llama `modatix` y esta definida en `DB/DB.sql`.

Tablas principales:

| Tabla | Funcion |
| --- | --- |
| `cities` | Ciudades disponibles para eventos y filtros |
| `venues` | Espacios fisicos donde se celebran eventos |
| `event_types` | Tipos de evento: desfile, gala, presentacion, showroom |
| `categories` | Categorias esteticas o comerciales |
| `brands` | Marcas o empresas organizadoras |
| `models` | Modelos/artistas participantes |
| `model_images` | Imagenes asociadas a modelos |
| `events` | Tabla central de eventos |
| `event_images` | Galeria de imagenes por evento |
| `event_models` | Relacion N:M entre eventos y modelos |
| `event_categories` | Relacion N:M entre eventos y categorias |
| `extras` | Extras disponibles como WiFi, catering o parking |
| `event_extras` | Relacion N:M entre eventos y extras |

Campos importantes de `events`:

| Campo | Uso |
| --- | --- |
| `ticket_price` | Filtrado y ordenacion por precio |
| `lat` | Latitud usada por Leaflet |
| `lon` | Longitud usada por Leaflet |
| `visits` | Contador oculto para calcular eventos populares |
| `featured` | Marca eventos destacados |
| `event_date` | Ordenacion y visualizacion de fechas |

## Instalacion en local

### 1. Clonar el repositorio

```bash
git clone https://github.com/LucaMZM/Eventos-ModaTix.git
```

Si trabajas con XAMPP, coloca el proyecto dentro de `htdocs`.

Ejemplo:

```text
/Applications/XAMPP/xamppfiles/htdocs/Eventos ModaTix
```

Tambien puede ejecutarse dentro de una carpeta superior, como:

```text
/Applications/XAMPP/xamppfiles/htdocs/CRUD_MVC1/Eventos ModaTix
```

### 2. Activar Apache y MySQL

Desde el panel de XAMPP:

- Inicia `Apache`.
- Inicia `MySQL`.

### 3. Crear la base de datos

En phpMyAdmin crea una base de datos llamada:

```text
modatix
```

Despues importa:

```text
DB/DB.sql
```

Si partes de cero, `DB.sql` ya contiene la estructura principal y datos de ejemplo.

### 4. Revisar la conexion

El archivo de conexion esta en:

```text
model/connect.php
```

Configuracion actual:

```php
$host = '127.0.0.1';
$dbLogin = "root";
$pass = "";
$db = "modatix";
```

Si tu MySQL usa otra contrasena, puerto o usuario, actualiza esos valores.

### 5. Abrir la aplicacion

Si el proyecto esta directamente dentro de `htdocs`:

```text
http://localhost/Eventos%20ModaTix/
```

Si esta dentro de `CRUD_MVC1`:

```text
http://localhost/CRUD_MVC1/Eventos%20ModaTix/
```

## Rutas principales

| Ruta | Vista |
| --- | --- |
| `index.php?page=homepage` | Home principal |
| `index.php?page=shop` | Shop/listado de eventos |
| `index.php?page=shop` con estado interno | Detalle de evento gestionado desde JS |

La entrada principal es `index.php`, que decide que cabecera cargar y delega el contenido a `view/inc/pages.php`.

## Flujo funcional

### Home a shop con filtros

1. El usuario pulsa una ciudad, marca o modelo en el home.
2. `controller_home.js` guarda el filtro en `localStorage` con la clave `filtros`.
3. El navegador redirige a `index.php?page=shop`.
4. `controller_shop.js` lee los filtros guardados.
5. El shop pinta el listado ya filtrado.

### Home a detalle de evento

1. El usuario pulsa un evento del hero, proximos eventos o populares.
2. `controller_home.js` guarda el `id_event` en `localStorage` con la clave `shop_direct_event_id`.
3. El navegador entra en el shop.
4. `controller_shop.js` detecta ese id pendiente.
5. Se abre directamente el detalle del evento.

### Buscador global

1. El usuario pulsa `Search` en el header.
2. `controller_search.js` abre el popup.
3. El usuario selecciona ciudad y otros filtros dependientes.
4. Al pulsar `Ver resultados`, los filtros se guardan en `localStorage`.
5. El shop se abre con los resultados filtrados.

### Popularidad de eventos

1. Al entrar al detalle de un evento, el shop llama a la operacion `add_visit`.
2. `DAOShop.php` incrementa el campo `visits`.
3. El home consulta los eventos populares desde `DAOHome.php`.
4. Se muestran los 3 eventos con mas visitas.

### Eventos relacionados

1. En el detalle de un evento se usa la ciudad del evento actual.
2. `controller_shop.js` filtra eventos de esa misma ciudad.
3. Se excluye el evento que se esta viendo.
4. Se muestran 3 eventos relacionados.
5. El boton `Ver mas` carga otros 3 hasta terminar la lista.

## Scripts SQL incluidos

| Archivo | Uso |
| --- | --- |
| `DB/DB.sql` | Script principal para crear la base de datos completa |
| `DB/ADD_EVENT_PRICE_FILTER.sql` | Script incremental para anadir/migrar precio de entrada |
| `DB/ADD_EVENT_GEO_FILTER.sql` | Script incremental para anadir latitud y longitud |
| `DB/ADD_EVENT_EXTRAS.sql` | Script incremental para extras de eventos |
| `DB/ADD_EVENTS_PAGINATION_SCROLL.sql` | Script incremental con eventos extra, imagenes y relaciones |
| `DB/UPDATE_IMAGE_URLS.sql` | Actualizacion de imagenes remotas |

Recomendacion:

Si instalas el proyecto por primera vez, importa `DB/DB.sql`.

Si ya tenias una base antigua, usa los scripts incrementales que correspondan.

## Archivos clave

| Archivo | Responsabilidad |
| --- | --- |
| `index.php` | Punto de entrada de la aplicacion |
| `view/inc/pages.php` | Enrutado basico por parametro `page` |
| `view/inc/header.html` | Header general y popup visual del buscador |
| `view/inc/top_page.html` | Dependencias generales para paginas internas |
| `view/inc/top_page_home.html` | Dependencias especificas del home |
| `module/home/view/home.html` | Maquetacion del home |
| `module/home/model/controller_home.js` | Pintado dinamico del home y saltos al shop |
| `module/home/model/DAOHome.php` | Consultas SQL del home |
| `module/search/model/controller_search.js` | Popup de search, autocompletado y filtros dependientes |
| `module/search/model/DAOSearch.php` | Consultas SQL del search |
| `module/shop/view/shop.html` | Maquetacion base del shop y detalle |
| `module/shop/model/controller_shop.js` | Filtros, cards, mapa, detalle, paginacion y relacionados |
| `module/shop/model/DAOShop.php` | Consultas SQL del shop y contador de visitas |
| `view/css/style.css` | Ajustes visuales propios |
| `model/connect.php` | Conexion PDO a MySQL |

## Proximas mejoras

- Panel de administracion para crear y editar eventos desde la web.
- Login real con roles de usuario.
- Reserva o compra de entradas.
- Subida de imagenes desde formulario.
- Validaciones extra en backend.
- Tests automaticos para filtros, busqueda y detalle.

## Autor

Proyecto desarrollado por Luca Maz para la gestion y visualizacion de eventos de moda.

Repositorio:

```text
https://github.com/LucaMZM/Eventos-ModaTix
```

## Licencia

**All Rights Reserved — código propietario.** El código original de este proyecto es público para revisión de portfolio, pero no se autoriza copiarlo, modificarlo, redistribuirlo ni utilizarlo comercialmente sin permiso previo por escrito. Consulta [LICENSE](LICENSE). Los componentes de terceros conservan sus propias licencias.
