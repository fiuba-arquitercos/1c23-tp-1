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















