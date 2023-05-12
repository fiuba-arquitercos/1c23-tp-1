# Informe TP 1

## Integrantes
| Nombre | Padrón |
| ------ | ------ |
| María Sol Fontenla | 103870 |
| Agustina Segura | 104222 |
| Martín Nicolas Pérez | 97378 |
| Maximiliano Nahuel Romero Vázquez | 99118 |

## Objetivo
El presente trabajo consiste en la implmentación de un servicio HTPP en Node.js-Express que represente una API para poder 
evaluar el impacto en los atributos de calidad mediante la comparaciónde diversas tecnologías. Estas tecnologías a utilizar son muy populares y de uso común en la industria, como lo son Node.js, Docker, Docker Compose, Nginx, Graphite, Grafana, Artillery, entre otras.
Lo que permite un primer pantallazo en el uso de estas herramientas y el aprendizaje de las mejores prácticas para la medición y visualización de datos.

Dicha API a su vez consume las siguientes APIs externas para dar información a los usuarios:
- [METAR API](https://www.aviationweather.gov/dataserver) 
- [Spaceflight News API](https://spaceflightnewsapi.net/)
- [Useless Facts](https://uselessfacts.jsph.pl/)

## Servicios 
En primer lugar se configuraron tanto docker-componse como Nginx para poder tener la aplicación corriendo en `localhost:5555/api` con los siguientes servicios:
-  `/ping`: Healthcheck que devuelve siempre un valor constante, sin procesamiento alguno
-  `/metar?station=<code>`: invoca al reporte del estado meteorológico que se registra en el aeródromo `station` (código OACI) proviente de [METAR](http://www.bom.gov.au/aviation/data/education/metar-speci.pdf), retornarnolo en formato JSON.
-  `/space_news`: se devuelven los títulos de las últimas 5 noticias sobre actividad espacial de la API externa [Spaceflight News API](https://spaceflightnewsapi.net/).
-  `/fact`: consume la API externa de [Useless Facts](https://uselessfacts.jsph.pl/) devolviendo así 1 (un) hecho sin utilidad

## Vista Components & Connectors
A continuación se muestra el diagrama de Vista de Componentes y Conectores para el caso base, es decir, de un solo nodo, y para el caso en donde se tienen 3 (tres) _Réplicas_ de la API.

### Caso Base
Se puede observar que la consulta, ya sea mediante Artillery o desde un cliente, pasa primero por el proxy de Nginx quien le envía al servidor de origen la correspondiente petición.
Por otro lado, se tiene el servicio de Node.js quien le realiza a su vez peticiones a las APIs externas ya mencionadas anterioremente. 

![](/assets/VCC_Base.png)

### Caso con Replicación
La principal diferencia con el caso anterior es que se puede ver a Nginx funcionando como un Load Balancer distribuyendo la carga a cada una de las instancias de nuestro servicio.

![](/assets/VCC_Replicacion.png)

## Escenarios
Un escenario define los flujos de trabajo de prueba que se deben ejecutar en cada caso para poder así verificar la arquitectura de la aplicación y como impactan en los atributos de calidad en cada caso. 
Decidimos realizar dos grandes grupos de cargas de trabajo, los denominados _Loading Test_ y los llamados _Stress Test_, que describiremos a continuación.

### Loading Test

#### Ping

#### Fact

#### Metar

#### Space News

### Stress Test

#### Ping

#### Fact

#### Metar

#### Space News

## Tácticas

### Caso base

### Caché

### Replicación
A continuación se realizan las mediciones de las métricas para el caso en el que se tienen 3 (tres) réplicas de nuestra aplicación. Para ello se explicitó en la configuración de Docker-Compose la creación de dichas instancias, y también se configuró Nginx para que distribuya la carga entre ellas aplicando la ténica de Round Robin.

### Rate Limiting
Esta táctica es utilizada para limitar la cantidad de solicitudes que un usuario puede realizar en cierto período determinado. Para lograr dicho propósito se utilizó Nginx, cambiando las configuraciones para observar variaciones en las métricas.

En la siguiente línea podemos observar que se crea una zona en donde se almacenarán los contadores para el rate limit, con un tamaño de 10MB y una tasa de 10 solicitudes por segundo.

```Nginx
limit_req_zone $binary_remote_addr zone=api_rate_limit:10m rate=10r/s;
```

Por otro lado, se define que en caso de que se haya superado la tasa de solicitudes, el código de respuesta de Nginx sea _429 Too Many Requests_.

Si obtenemos las salidas al correr el escenario de Loading Test Ping, podemos observar como las requests son resueltas correctamente hasta casi llegando a la mitad de nuestra rampa ascendente, en donde la cantidad de solicitudes aceptadas corresponde a 100, lo cual se verifica con la configuración propuesta.

![](/assets/Ping-RateLimit-Nodelay.png)

## Cache

Endpoints cacheados:
* /space_news
  
En el caso del endpoint /metar, esta información no se cachea ya que es información de tiempo real y puede ser importante mostrar la infomacion actualizada momento a momento. Y en el caso de /fact, no se cachea porque siempre debe devolverse un fact distinto salvo que lo repita la api. 

La cantidad de items que se guardan en el cache son 5 ya que son los titulos de las últimas 5 noticias que devuelve la api. 

En cuanto al llenado, se optó por la táctica de lazy population. Cada vez que un cliente llama a un endpoint y su información no se encuentra en el cache, la api cachea la misma para devolverla en los proximos segundos.

La información de /space_news se guarda por 10 segundos.

Si se toma un item del cache se conserva hasta que expire. Redis elimina el valor automáticamente cuando este expira.